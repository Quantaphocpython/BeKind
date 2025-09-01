'use client'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation, useApiQuery, useTranslations } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { MilestoneDto, WithdrawalDto } from '../../data/dto'
import { useCampaignContractWrite } from '../../data/hooks'

interface MilestoneWithdrawalCardProps {
  campaign: import('../../data/dto').CampaignDto
  onchainBalance: string
  className?: string
}

export const MilestoneWithdrawalCard = ({ campaign, onchainBalance, className }: MilestoneWithdrawalCardProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneDto | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingMilestoneIdx, setPendingMilestoneIdx] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const hasTriedCreateMilestones = useRef(false)

  const isOwner = address?.toLowerCase() === (campaign.ownerUser?.address || campaign.owner || '').toLowerCase()
  const balanceInEth = Number.parseFloat(formatEther(BigInt(onchainBalance)))

  // Use finalBalance if campaign is completed, otherwise use actual balance
  // This ensures milestones are based on the final amount when campaign was completed
  const finalBalanceInEth = campaign.finalBalance ? Number.parseFloat(formatEther(BigInt(campaign.finalBalance))) : 0
  const effectiveBalanceInEth = campaign.isCompleted && finalBalanceInEth > 0 ? finalBalanceInEth : balanceInEth

  const {
    execute: withdrawContract,
    isLoading: isWithdrawing,
    isSuccess: isWithdrawSuccess,
    error: withdrawError,
  } = useCampaignContractWrite('withdraw')

  // Keep params to notify backend only after on-chain success
  const lastWithdrawParamsRef = useRef<{ amount: string; milestoneIdx: number } | null>(null)

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  // Fetch milestones if completed; otherwise we'll show synthetic milestones (50/50)
  const { data: milestonesFromApi = [], refetch: refetchMilestones } = useApiQuery<MilestoneDto[]>(
    ['campaign-milestones', campaign.campaignId],
    () => campaignService.getCampaignMilestones(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId) && campaign.isCompleted,
      select: (res) => res.data,
    },
  )

  // Force create milestones if campaign is completed but no milestones exist
  const forceCreateMilestonesMutation = useApiMutation(
    () => campaignService.forceCreateMilestones(campaign.campaignId),
    {
      onSuccess: () => {
        refetchMilestones()
        toast.success(t('Milestones created successfully'))
      },
      onError: (error: any) => {
        console.error('Failed to create milestones:', error)
        // Only show error toast if it's not a constraint error (already exists)
        if (!error?.message?.includes('Unique constraint failed')) {
          toast.error(t('Failed to create milestones'), {
            description: error?.message || 'Unknown error occurred',
          })
        }
      },
    },
  )

  // Manually mark milestone as released
  const markMilestoneReleasedMutation = useApiMutation(
    async (milestoneIndex: number) => campaignService.markMilestoneAsReleased(campaign.campaignId, milestoneIndex),
    {
      onSuccess: async (_, milestoneIndex) => {
        // Optimistic cache update
        queryClient.setQueryData(['campaign-milestones', campaign.campaignId], (prev: any) => {
          const data = prev?.data ?? prev
          if (!Array.isArray(data)) return prev
          const updated = data.map((m: MilestoneDto) =>
            m.index === milestoneIndex ? { ...m, isReleased: true, releasedAt: new Date().toISOString() } : m,
          )
          return prev?.data ? { ...prev, data: updated } : updated
        })
        await refetchMilestones()
        toast.success(t('Milestone marked as released'))
      },
    },
  )

  // Build milestones list: use API when completed; otherwise default two phases 50/50
  const milestones: Array<MilestoneDto> = campaign.isCompleted
    ? Array.isArray(milestonesFromApi)
      ? milestonesFromApi
      : []
    : ([
        {
          id: 'phase-1',
          campaignId: String(campaign.campaignId),
          index: 1,
          title: 'Phase 1 - Initial Withdrawal',
          description: 'Withdraw 50% of goal once campaign is completed',
          percentage: 50,
          isReleased: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'phase-2',
          campaignId: String(campaign.campaignId),
          index: 2,
          title: 'Phase 2 - Final Withdrawal',
          description: 'Withdraw remaining 50% after at least one proof is uploaded',
          percentage: 50,
          isReleased: false,
          createdAt: new Date().toISOString(),
        },
      ] as MilestoneDto[])

  // Auto-create milestones if campaign is completed but no milestones exist
  useEffect(() => {
    if (
      campaign.isCompleted &&
      Array.isArray(milestonesFromApi) &&
      milestonesFromApi.length === 0 &&
      !hasTriedCreateMilestones.current &&
      !forceCreateMilestonesMutation.isPending
    ) {
      hasTriedCreateMilestones.current = true
      forceCreateMilestonesMutation.mutate({})
    }
  }, [campaign.isCompleted, milestonesFromApi?.length, forceCreateMilestonesMutation.isPending])

  // Ensure milestones is always an array
  const safeMilestones = Array.isArray(milestones) ? milestones : []

  // Reset ref when campaign changes
  useEffect(() => {
    hasTriedCreateMilestones.current = false
  }, [campaign.campaignId])

  // Fetch proofs for milestone 2 validation
  const { data: proofs = [] } = useApiQuery<any[]>(
    ['campaign-proofs', campaign.campaignId],
    () => campaignService.getCampaignProofs(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId) && campaign.isCompleted,
      select: (res) => res.data,
    },
  )

  // Fetch withdrawals
  const { data: withdrawals = [] } = useApiQuery<WithdrawalDto[]>(
    ['campaign-withdrawals', campaign.campaignId],
    () => campaignService.getCampaignWithdrawals(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId) && campaign.isCompleted,
      select: (res) => res.data,
    },
  )

  const withdrawMutation = useApiMutation(
    (data: { amount: string; milestoneIdx?: number; userAddress: string }) =>
      campaignService.createWithdrawal(campaign.campaignId, data),
    {
      onSuccess: async (_, variables) => {
        try {
          // Optimistically mark as released
          if (variables.milestoneIdx) {
            queryClient.setQueryData(['campaign-milestones', campaign.campaignId], (prev: any) => {
              const data = prev?.data ?? prev
              if (!Array.isArray(data)) return prev
              const updated = data.map((m: MilestoneDto) =>
                m.index === variables.milestoneIdx
                  ? { ...m, isReleased: true, releasedAt: new Date().toISOString() }
                  : m,
              )
              return prev?.data ? { ...prev, data: updated } : updated
            })
          }

          toast.success(t('Withdrawal successful'))
          setIsDialogOpen(false)
          setWithdrawAmount('')
          setSelectedMilestone(null)
          setPendingMilestoneIdx(null)

          // Refetch milestones to update UI
          await refetchMilestones()

          // Keep state clean; no verbose logs
        } catch (error) {
          console.error('Failed to mark milestone as released:', error)
          // Still show success for withdrawal, but log the milestone update error
        }
      },
      onError: (error) => {
        toast.error(t('Withdrawal failed'), { description: error.message })
        setPendingMilestoneIdx(null)
      },
    },
  )

  const handleMilestoneClick = (milestone: MilestoneDto) => {
    if (!campaign.isCompleted) {
      toast.error(t('Withdrawals are available after the campaign is completed'))
      return
    }
    if (!isOwner) {
      toast.error(t('Only campaign owner can withdraw funds'))
      return
    }

    if (milestone.isReleased) {
      toast.error(t('Milestone already released'))
      return
    }

    // Check proof requirement for milestone 2
    if (milestone.index === 2 && proofs.length === 0) {
      toast.error(t('Proof submission required before Phase 2 withdrawal'))
      return
    }

    setSelectedMilestone(milestone)
    const maxAmount = (effectiveBalanceInEth * milestone.percentage) / 100
    setWithdrawAmount(maxAmount.toFixed(4))
    setIsDialogOpen(true)
  }

  const handleWithdraw = async () => {
    if (!address || !selectedMilestone) return

    try {
      setPendingMilestoneIdx(selectedMilestone.index)

      // Execute contract withdrawal
      lastWithdrawParamsRef.current = { amount: withdrawAmount, milestoneIdx: selectedMilestone.index }
      toast.info(t('Confirm the withdrawal in your wallet...'))
      withdrawContract({
        campaignId: BigInt(campaign.campaignId),
        amount: withdrawAmount,
      })
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast.error(t('Withdrawal failed'))
      setPendingMilestoneIdx(null)
    }
  }

  // Surface write errors from wagmi
  useEffect(() => {
    if (withdrawError) {
      const message = withdrawError instanceof Error ? withdrawError.message : String(withdrawError)
      toast.error(t('Withdrawal failed'), { description: message })
      setPendingMilestoneIdx(null)
    }
  }, [withdrawError, t])

  // After tx confirmed, notify backend to record and update phase
  useEffect(() => {
    const notifyBackend = async () => {
      if (!isWithdrawSuccess || !address || !lastWithdrawParamsRef.current) return
      try {
        const { amount, milestoneIdx } = lastWithdrawParamsRef.current
        await withdrawMutation.mutateAsync({ amount, milestoneIdx, userAddress: address })
      } finally {
        lastWithdrawParamsRef.current = null
      }
    }
    void notifyBackend()
  }, [isWithdrawSuccess, address])

  return (
    <>
      <Card
        className={`border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm overflow-hidden relative group ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

        <CardHeader className="px-6 text-center space-y-3 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
              <Icons.wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground font-serif mb-1">{t('Fund Withdrawal')}</h3>
              <p className="text-sm text-muted-foreground">{t('Structured withdrawal system for campaign funds')}</p>
            </div>
            {!campaign.isCompleted && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">{t('Withdrawal Rules')}:</span>{' '}
                  {t(
                    'Two-phase system. Phase 1: Initial withdrawal. Phase 2: Final withdrawal after proof submission.',
                  )}
                </p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-6 space-y-4 relative z-10">
          <div className="space-y-3">
            {safeMilestones.map((milestone) => {
              const hasProofs = proofs.length > 0

              // Use currentWithdrawalPhase to determine if milestone is released
              const isReleasedByPhase =
                campaign?.currentWithdrawalPhase && campaign.currentWithdrawalPhase >= milestone.index
              const isReleased = isReleasedByPhase || milestone.isReleased

              // Check if Phase 1 is completed for Phase 2
              const phase1Completed =
                (campaign?.currentWithdrawalPhase && campaign.currentWithdrawalPhase >= 1) || false

              // Phase 2 can only be withdrawn if Phase 1 is completed AND there are proofs
              const canWithdraw =
                campaign.isCompleted &&
                !isReleased &&
                (milestone.index === 1 || (milestone.index === 2 && hasProofs && phase1Completed))

              const maxAmount = (effectiveBalanceInEth * milestone.percentage) / 100

              return (
                <div
                  key={milestone.id}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isReleased
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 dark:from-green-950 dark:to-emerald-950 dark:border-green-700 shadow-lg'
                      : canWithdraw
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 hover:from-blue-100 hover:to-cyan-100 dark:from-blue-950 dark:to-cyan-950 dark:border-blue-700 dark:hover:from-blue-900 dark:hover:to-cyan-900 shadow-md hover:shadow-lg'
                        : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 dark:from-gray-950 dark:to-slate-950 dark:border-gray-700 opacity-70'
                  }`}
                  onClick={() => canWithdraw && handleMilestoneClick(milestone)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isReleased
                                ? 'bg-green-500 text-white'
                                : canWithdraw
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-400 text-white'
                            }`}
                          >
                            {milestone.index}
                          </div>
                          <div>
                            <h4 className="font-bold text-base">
                              {milestone.index === 1 ? t('Initial Withdrawal') : t('Final Withdrawal')}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {milestone.index === 1 ? t('First phase') : t('Second phase')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isReleased && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              <Icons.checkCircle className="w-3 h-3 mr-1" />
                              {t('Completed')}
                            </Badge>
                          )}
                          {milestone.index === 2 && !isReleased && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                !hasProofs
                                  ? 'border-orange-300 text-orange-600 bg-orange-50 dark:bg-orange-950'
                                  : !phase1Completed
                                    ? 'border-red-300 text-red-600 bg-red-50 dark:bg-red-950'
                                    : 'border-green-300 text-green-600 bg-green-50 dark:bg-green-950'
                              }`}
                            >
                              {!phase1Completed ? t('Phase 1 Required') : !hasProofs ? t('Proof Required') : t('Ready')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {milestone.index === 1
                          ? t('Initial withdrawal of campaign funds')
                          : t('Final withdrawal after proof submission')}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{maxAmount.toFixed(4)} ETH</span>
                          <span className="text-xs text-muted-foreground">({milestone.percentage}% of total)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-muted-foreground">
                            {milestone.index === 1 ? t('Phase 1') : t('Phase 2')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isReleased ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Icons.checkCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{t('Completed')}</span>
                        </div>
                      ) : canWithdraw ? (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMilestone(milestone)
                            const maxAmount = (effectiveBalanceInEth * milestone.percentage) / 100
                            setWithdrawAmount(maxAmount.toFixed(4))
                            setIsDialogOpen(true)
                          }}
                          disabled={
                            pendingMilestoneIdx === milestone.index || isWithdrawing || withdrawMutation.isPending
                          }
                        >
                          <Icons.wallet className="w-4 h-4 mr-2" />
                          {t('Withdraw')}
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Icons.lock className="h-4 w-4" />
                            <span className="text-xs">{t('Locked')}</span>
                          </div>
                          {/* Show manual release button if there are withdrawals but milestone not released */}
                          {milestone.index === 1 && withdrawals.length > 0 && !isReleased && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-300 text-orange-600 hover:bg-orange-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                markMilestoneReleasedMutation.mutate(milestone.index)
                              }}
                              disabled={markMilestoneReleasedMutation.isPending}
                            >
                              {markMilestoneReleasedMutation.isPending ? (
                                <Icons.loader className="w-4 h-4 animate-spin mr-1" />
                              ) : (
                                <Icons.checkCircle className="w-4 h-4 mr-1" />
                              )}
                              {markMilestoneReleasedMutation.isPending ? t('Marking...') : t('Mark Released')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {withdrawals.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border">
              <div className="flex items-center gap-2 mb-3">
                <Icons.clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">{t('Withdrawal History')}</h4>
              </div>
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{withdrawal.milestoneIdx || 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {t('Phase')} {withdrawal.milestoneIdx || 1}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">
                        {Number.parseFloat(formatEther(BigInt(withdrawal.amount))).toFixed(4)} ETH
                      </div>
                      {withdrawal.txHash && (
                        <div className="text-xs text-muted-foreground">
                          {withdrawal.txHash.slice(0, 6)}...{withdrawal.txHash.slice(-4)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Withdraw Funds')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMilestone && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('Milestone')}:</span>
                  <span className="font-semibold">{selectedMilestone.title}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('Percentage')}:</span>
                  <span className="font-semibold">{selectedMilestone.percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('Max Amount')}:</span>
                  <span className="font-semibold">
                    {((effectiveBalanceInEth * selectedMilestone.percentage) / 100).toFixed(4)} ETH
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="withdrawAmount">{t('Withdrawal Amount (ETH)')}</Label>
              <Input
                id="withdrawAmount"
                type="number"
                step="0.001"
                min="0.001"
                max={selectedMilestone ? (effectiveBalanceInEth * selectedMilestone.percentage) / 100 : balanceInEth}
                value={withdrawAmount}
                onChange={(e) => {
                  // Lock amount when completed to enforce fixed milestone amount
                  if (!selectedMilestone || !campaign.isCompleted) setWithdrawAmount(e.target.value)
                }}
                readOnly={Boolean(selectedMilestone) && campaign.isCompleted}
                placeholder="0.1"
              />
              {Boolean(selectedMilestone) && campaign.isCompleted && (
                <p className="text-xs text-muted-foreground mt-1">{t('Amount is fixed to this milestone share')}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing || withdrawMutation.isPending || !withdrawAmount}
              >
                {isWithdrawing || withdrawMutation.isPending ? t('Withdrawing...') : t('Withdraw')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
