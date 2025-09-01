'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { CampaignDto, MilestoneDto } from '../../data/dto'
import { useCampaignContractWrite } from '../../data/hooks'

interface MilestoneWithdrawalCardCompactProps {
  campaign: CampaignDto
  className?: string
}

export const MilestoneWithdrawalCardCompact = ({ campaign, className }: MilestoneWithdrawalCardCompactProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [pendingMilestoneIdx, setPendingMilestoneIdx] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const isOwner = address?.toLowerCase() === (campaign.ownerUser?.address || campaign.owner || '').toLowerCase()
  const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
  const finalBalanceInEth = campaign.finalBalance
    ? Number.parseFloat(formatEther(BigInt(campaign.finalBalance)))
    : goalInEth

  const {
    execute: withdrawContract,
    isLoading: isWithdrawing,
    isSuccess: isWithdrawSuccess,
    error: withdrawError,
  } = useCampaignContractWrite('withdraw')

  const lastWithdrawParamsRef = useRef<{ amount: string; milestoneIdx: number } | null>(null)

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  // Fetch milestones if completed
  const { refetch: refetchMilestones } = useApiQuery<MilestoneDto[]>(
    ['campaign-milestones', campaign.campaignId],
    () => campaignService.getCampaignMilestones(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId) && campaign.isCompleted,
      select: (res) => res.data,
    },
  )

  // Fetch proofs to check if Phase 2 can be enabled
  const { data: proofs = [] } = useApiQuery<any[]>(
    ['campaign-proofs', campaign.campaignId],
    () => campaignService.getCampaignProofs(campaign.campaignId),
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
          if (variables.milestoneIdx) {
            // Optimistically mark as released
            queryClient.setQueryData(['campaign-milestones', campaign.campaignId], (prev: any) => {
              const data = prev?.data ?? prev
              if (!Array.isArray(data)) return prev
              const updated = data.map((m: MilestoneDto) =>
                m.index === variables.milestoneIdx ? { ...m, isReleased: true } : m,
              )
              return prev?.data ? { ...prev, data: updated } : updated
            })
          }

          toast.success(t('Withdrawal successful'))
          setIsDialogOpen(false)
          setWithdrawAmount('')
          setPendingMilestoneIdx(null)

          await refetchMilestones()
        } catch (error) {
          console.error('Failed to mark milestone as released:', error)
        }
      },
      onError: (error: any) => {
        console.error('Withdrawal error:', error)
        toast.error(t('Withdrawal failed'), { description: error?.message })
        setPendingMilestoneIdx(null)
      },
    },
  )

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

  const handleWithdraw = async () => {
    if (!address) {
      toast.error(t('Please connect your wallet to withdraw'))
      return
    }

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error(t('Please enter a valid withdrawal amount'))
      return
    }

    // Determine which phase to withdraw based on current state
    let milestoneIdx: number
    if (!phase1Completed) {
      milestoneIdx = 1 // Phase 1 - no proof required
    } else if (hasProofs) {
      milestoneIdx = 2 // Phase 2 - proof required and available
    } else {
      toast.error(t('Proof Required'), { description: t('Please upload proof to withdraw Phase 2') })
      return
    }

    // Validate withdrawal amount against available balance
    const maxWithdrawAmount = milestoneIdx === 1 ? phase1Amount : phase2Amount
    if (Number(withdrawAmount) > Number(maxWithdrawAmount)) {
      toast.error(t('Invalid Amount'), {
        description: t('Withdrawal amount exceeds available balance for this phase'),
      })
      return
    }

    try {
      setPendingMilestoneIdx(milestoneIdx)
      lastWithdrawParamsRef.current = { amount: withdrawAmount, milestoneIdx }
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

  if (!campaign.isCompleted || !isOwner) {
    return null
  }

  const phase1Completed = campaign.currentWithdrawalPhase && campaign.currentWithdrawalPhase >= 1
  const hasProofs = proofs.length > 0

  const phase1Amount = (finalBalanceInEth * 0.5).toFixed(4)
  const phase2Amount = (finalBalanceInEth * 0.5).toFixed(4)

  return (
    <>
      <Card
        className={`border-0 shadow-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 ${className}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
              <Icons.wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t('Fund Withdrawal')}</h3>
              <p className="text-xs text-slate-400">{t('Structured withdrawal system')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Phase 1 */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              phase1Completed
                ? 'bg-gradient-to-r from-green-500/10 to-green-400/5 border-green-500/30 shadow-lg shadow-green-500/10'
                : 'bg-gradient-to-r from-blue-500/10 to-blue-400/5 border-blue-500/30 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${phase1Completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <span className="text-sm font-semibold text-white">{t('Phase 1')}</span>
              </div>
              <span className="text-sm font-bold text-white bg-slate-800/50 px-2 py-1 rounded-lg">
                {phase1Amount} ETH
              </span>
            </div>
            <div className="flex items-center gap-2">
              {phase1Completed ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Icons.checkCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('Released')}</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="h-8 px-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-300"
                  onClick={() => {
                    setWithdrawAmount(phase1Amount)
                    setIsDialogOpen(true)
                  }}
                  disabled={isWithdrawing || pendingMilestoneIdx === 1}
                >
                  {isWithdrawing && pendingMilestoneIdx === 1 ? t('Withdrawing...') : t('Withdraw')}
                </Button>
              )}
            </div>
          </div>

          {/* Phase 2 */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              phase1Completed && hasProofs
                ? 'bg-gradient-to-r from-green-500/10 to-green-400/5 border-green-500/30 shadow-lg shadow-green-500/10 hover:shadow-green-500/20'
                : phase1Completed
                  ? 'bg-gradient-to-r from-orange-500/10 to-orange-400/5 border-orange-500/30 shadow-lg shadow-orange-500/10'
                  : 'bg-gradient-to-r from-gray-500/10 to-gray-400/5 border-gray-500/30 shadow-lg shadow-gray-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    phase1Completed && hasProofs ? 'bg-green-500' : phase1Completed ? 'bg-orange-500' : 'bg-gray-500'
                  }`}
                ></div>
                <span className="text-sm font-semibold text-white">{t('Phase 2')}</span>
              </div>
              <span className="text-sm font-bold text-white bg-slate-800/50 px-2 py-1 rounded-lg">
                {phase2Amount} ETH
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!phase1Completed ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Icons.lock className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('Phase 1 Required')}</span>
                </div>
              ) : !hasProofs ? (
                <div className="flex items-center gap-2 text-orange-400">
                  <Icons.page className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('Proof Required')}</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="h-8 px-4 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg transition-all duration-300"
                  onClick={() => {
                    setWithdrawAmount(phase2Amount)
                    setIsDialogOpen(true)
                  }}
                  disabled={isWithdrawing || pendingMilestoneIdx === 2}
                >
                  {isWithdrawing && pendingMilestoneIdx === 2 ? t('Withdrawing...') : t('Withdraw')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Withdraw Funds')}</DialogTitle>
            <DialogDescription>{t('Enter the amount you want to withdraw from this campaign')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">{t('Available Balance')}</div>
              <div className="text-lg font-bold">{finalBalanceInEth.toFixed(4)} ETH</div>
            </div>
            <div>
              <Label htmlFor="withdrawAmount">{t('Withdrawal Amount (ETH)')}</Label>
              <Input
                id="withdrawAmount"
                type="number"
                step="0.0001"
                min="0.0001"
                max={finalBalanceInEth}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.1"
              />
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
