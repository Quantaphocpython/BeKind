'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation, useTranslations } from '@/shared/hooks'
import { cn } from '@/shared/utils'
import { formatEther } from 'ethers'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useCampaignContractWrite } from '../../data/hooks'

interface CampaignDonateProps {
  campaignId: string
  campaignOwner: string
  campaignGoal: string
  campaignBalance: string
  isCompleted?: boolean
  className?: string
}

export const CampaignDonate = ({
  campaignId,
  campaignOwner,
  campaignGoal,
  campaignBalance,
  isCompleted,
  className,
}: CampaignDonateProps) => {
  const t = useTranslations()
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState<string>('0.001')

  const { execute, isLoading, isSuccess, error, hash } = useCampaignContractWrite('donate')
  const {
    execute: withdrawContract,
    isLoading: isWithdrawing,
    isSuccess: isWithdrawSuccess,
    hash: withdrawHash,
  } = useCampaignContractWrite('withdraw')

  // Check if user is owner and campaign has reached goal
  const isOwner = address?.toLowerCase() === campaignOwner.toLowerCase()
  const goalInEth = Number.parseFloat(formatEther(BigInt(campaignGoal)))
  const balanceInEth = Number.parseFloat(formatEther(BigInt(campaignBalance)))
  // If campaign completed, treat as 100% regardless of balance
  const progress = isCompleted ? 100 : Math.min((balanceInEth / goalInEth) * 100, 100)
  const hasReachedGoal = Boolean(isCompleted) || progress >= 100
  const canWithdraw = isOwner && hasReachedGoal
  // Once completed, no more donations allowed
  const canDonate = !isCompleted && !hasReachedGoal
  const halfGoalEth = goalInEth / 2
  const withdrawCapEth = Math.min(halfGoalEth, balanceInEth)

  // Debug logs
  console.log('CampaignDonate Debug:', {
    address: address?.toLowerCase(),
    campaignOwner: campaignOwner.toLowerCase(),
    isOwner,
    goalInEth,
    balanceInEth,
    progress,
    canWithdraw,
    hasReachedGoal,
    isCompleted,
  })

  const { mutateAsync: notifyDonation, isPending: isNotifyPending } = useApiMutation<
    null,
    { userAddress: string; amount: string; transactionHash?: string; blockNumber?: number }
  >(
    (payload) => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.notifyDonation(String(campaignId), payload)
    },
    {
      invalidateQueries: [
        ['campaign-supporters', String(campaignId)],
        ['campaign', String(campaignId)],
      ],
      onSuccess: () => {
        toast.success(t('Thank you for your donation!'))
      },
      onError: (err) => {
        console.error('notifyDonation error', err)
        toast.error(t('Donation recorded but post-processing failed'))
      },
    },
  )

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(t('Donation failed'), { description: message })
    }
  }, [error, t])

  useEffect(() => {
    // When eligible to withdraw, preset amount to half of goal and lock input
    if (canWithdraw) {
      setAmount(withdrawCapEth.toFixed(4))
    }
  }, [canWithdraw, withdrawCapEth])

  useEffect(() => {
    const notifyBackend = async () => {
      if (!isSuccess || !address) return
      try {
        await notifyDonation({
          userAddress: address,
          amount,
          transactionHash: hash,
          blockNumber: undefined, // We don't have block number from wagmi, but can get it later
        })
      } catch {
        console.error('notifyBackend error', error)
      }
    }
    notifyBackend()
  }, [isSuccess, address, campaignId, amount, hash, notifyDonation])

  const onDonate = () => {
    try {
      if (!isConnected || !address) {
        toast.error(t('Please connect your wallet to donate'))
        return
      }
      if (!amount || Number(amount) <= 0) {
        toast.error(t('Please enter a valid amount'))
        return
      }
      if (isCompleted) {
        toast.error(t('Campaign is already completed, no more donations allowed'))
        return
      }
      toast.info(t('Confirm the donation in your wallet...'))
      execute({ campaignId: BigInt(campaignId), amount })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      toast.error(t('Donation failed'), { description: message })
    }
  }

  const onWithdraw = () => {
    try {
      if (!isConnected || !address) {
        toast.error(t('Please connect your wallet to withdraw'))
        return
      }
      if (!amount || Number(amount) <= 0) {
        toast.error(t('Please enter a valid amount'))
        return
      }
      if (Number(amount) > withdrawCapEth) {
        toast.error(t('Withdrawal amount cannot exceed milestone limit'))
        return
      }
      toast.info(t('Confirm the withdrawal in your wallet...'))
      withdrawContract({ campaignId: BigInt(campaignId), amount })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      toast.error(t('Withdrawal failed'), { description: message })
    }
  }

  // Notify success on withdrawal confirmation and refetch data
  useEffect(() => {
    if (!isWithdrawSuccess) return
    toast.success(t('Withdrawal successful'))
    // Suggest refetch via socket/queries if available
    try {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      // Fire-and-forget to record withdrawal in backend if needed
      void campaignService.getCampaignById(String(campaignId))
    } catch {}
  }, [isWithdrawSuccess, t, campaignId])

  return (
    <Card
      className={cn(
        'border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm overflow-hidden relative group',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

      <CardContent className="px-6 text-center space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
            {canWithdraw ? (
              <Icons.wallet className="h-8 w-8 text-primary" />
            ) : (
              <Icons.heart className="h-8 w-8 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif">
            {canWithdraw ? t('Withdraw Funds') : canDonate ? t('Support This Campaign') : t('Campaign Completed')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {canWithdraw
              ? t('Available Balance')
              : canDonate
                ? t('Your donation makes a difference')
                : t('No more donations accepted')}
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            step="0.0001"
            min={0.01}
            max={canWithdraw ? withdrawCapEth : undefined}
            className="w-full h-12 px-4 rounded-lg border bg-background"
            placeholder={canWithdraw ? withdrawCapEth.toFixed(4) : canDonate ? '0.01' : '0.0000'}
            value={amount}
            onChange={(e) => {
              if (canDonate) setAmount(e.target.value)
            }}
            disabled={canWithdraw || !canDonate || isLoading || isNotifyPending || isWithdrawing}
            readOnly={canWithdraw || !canDonate}
          />
          <Button
            size="lg"
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base rounded-xl border-0 relative overflow-hidden group cursor-pointer"
            onClick={canWithdraw ? onWithdraw : canDonate ? onDonate : undefined}
            disabled={isLoading || isNotifyPending || isWithdrawing}
          >
            {(isLoading || isNotifyPending || isWithdrawing) && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {canWithdraw ? (
              <Icons.wallet className="h-5 w-5 mr-3" />
            ) : canDonate ? (
              <Heart className="h-5 w-5 mr-3" />
            ) : (
              <Icons.checkCircle className="h-5 w-5 mr-3" />
            )}
            {isLoading || isNotifyPending || isWithdrawing
              ? canWithdraw
                ? t('Withdrawing...')
                : t('Donating...')
              : canWithdraw
                ? t('Withdraw')
                : canDonate
                  ? t('Donate Now')
                  : t('Completed')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
