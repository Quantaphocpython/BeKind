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
  const [withdrawnMilestones, setWithdrawnMilestones] = useState<Set<number>>(new Set())
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
  const { data: milestones = [], refetch: refetchMilestones } = useApiQuery<MilestoneDto[]>(
    ['campaign-milestones', campaign.campaignId],
    () => campaignService.getCampaignMilestones(campaign.campaignId),
    {
      enabled: Boolean(campaign.campaignId) && campaign.isCompleted,
      select: (res) => res.data,
    },
  )

  // Sync withdrawnMilestones state with server data
  useEffect(() => {
    if (milestones.length > 0) {
      const releasedMilestones = new Set<number>()
      milestones.forEach((milestone) => {
        if (milestone.isReleased) {
          releasedMilestones.add(milestone.index)
        }
      })
      setWithdrawnMilestones(releasedMilestones)
    }
  }, [milestones])

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

          // Mark milestone as withdrawn to prevent multiple withdrawals
          if (variables.milestoneIdx) {
            setWithdrawnMilestones((prev) => new Set([...prev, variables.milestoneIdx!]))
          }

          // Invalidate queries to refresh UI immediately
          queryClient.invalidateQueries({ queryKey: ['campaign', campaign.campaignId] })
          queryClient.invalidateQueries({ queryKey: ['campaign-withdrawals', campaign.campaignId] })

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
        className={`border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm  ${className}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
              <Icons.wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold  text-base">{t('Fund Withdrawal')}</h3>
              <p className="text-xs ">{t('Structured withdrawal system')}</p>
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
                <span className="text-sm font-semibold ">{t('Phase 1')}</span>
              </div>
              <span className="text-sm font-bold bg-slate-800/80 text-white px-2 py-1 rounded-lg">
                {phase1Amount} ETH
              </span>
            </div>
            <div className="flex items-center gap-2">
              {phase1Completed ||
              withdrawnMilestones.has(1) ||
              (milestones && milestones.find((m) => m.index === 1)?.isReleased) ? (
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
                  disabled={
                    isWithdrawing ||
                    pendingMilestoneIdx === 1 ||
                    withdrawnMilestones.has(1) ||
                    (milestones && milestones.find((m) => m.index === 1)?.isReleased)
                  }
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
                <span className="text-sm font-semibold ">{t('Phase 2')}</span>
              </div>
              <span className="text-sm font-bold bg-slate-800/80 text-white px-2 py-1 rounded-lg">
                {phase2Amount} ETH
              </span>
            </div>
            <div className="flex items-center gap-2">
              {withdrawnMilestones.has(2) || (milestones && milestones.find((m) => m.index === 2)?.isReleased) ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Icons.checkCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('Released')}</span>
                </div>
              ) : !phase1Completed ? (
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
                  disabled={
                    isWithdrawing ||
                    pendingMilestoneIdx === 2 ||
                    withdrawnMilestones.has(2) ||
                    (milestones && milestones.find((m) => m.index === 2)?.isReleased)
                  }
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
        <DialogContent
          className="max-w-md overflow-hidden border border-primary/20 shadow-2xl backdrop-blur-md
          bg-gradient-to-b from-background/95 to-background/80 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="absolute -inset-0.5 rounded-2xl opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-primary/10 to-transparent pointer-events-none" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Icons.banknote className="h-4 w-4" />
              </span>
              {t('Withdraw Funds')}
            </DialogTitle>
            <DialogDescription>{t('Confirm the withdrawal of funds from this campaign')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 relative">
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">{t('Withdrawal Amount (ETH)')}</Label>
              <Input
                id="withdrawAmount"
                disabled
                type="number"
                value={withdrawAmount}
                readOnly
                className="bg-background/60"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-muted-foreground/20 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-200"
              >
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing || withdrawMutation.isPending || !withdrawAmount}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl hover:shadow-emerald/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 font-medium">
                  {isWithdrawing || withdrawMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('Withdrawing...')}
                    </div>
                  ) : (
                    t('Withdraw')
                  )}
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
