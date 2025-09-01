'use client'

import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useApiMutation, useApiQuery, useTranslations } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useCampaignContractRead, useCampaignRealtime } from '../../data/hooks'
import { CampaignDonate } from '../atoms/CampaignDonate'
import { CampaignBanner } from '../molecules/CampaignBanner'
import { CampaignDetailSkeleton } from '../molecules/CampaignDetailSkeleton'
import { CampaignInfo } from '../molecules/CampaignInfo'
import { CampaignStats } from '../molecules/CampaignStats'
import { CommentSection } from '../molecules/CommentSection'
import { MilestoneWithdrawalCardCompact } from '../molecules/MilestoneWithdrawalCardCompact'
import { RelatedCampaigns } from '../molecules/RelatedCampaigns'
import { WithdrawalHistoryCard } from '../molecules/WithdrawalHistoryCard'
import { CampaignContentTabs } from '../organisms/CampaignContentTabs'

export const CampaignDetailPage = () => {
  const t = useTranslations()
  const { address } = useAccount()
  const params = useParams<{ id?: string }>()
  const id = params?.id ?? ''

  // Get campaign service once and reuse with useMemo
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const {
    data: campaign,
    isLoading,
    error,
  } = useApiQuery<CampaignDto>(['campaign', id], () => campaignService.getCampaignById(String(id)), {
    enabled: Boolean(id),
    select: (res) => res.data,
  })

  const { data: supporters = [] } = useApiQuery<VoteDto[]>(
    ['campaign-supporters', id],
    () => campaignService.getSupporters(String(id)),
    {
      enabled: Boolean(id),
      select: (res) => res.data,
    },
  )

  // Read on-chain balance using the smart contract getBalance
  const { data: onchainBalance } = useCampaignContractRead('getBalance', {
    campaignId: campaign ? BigInt(String(campaign.campaignId)) : BigInt(0),
  })

  const queryClient = useQueryClient()

  // Enable real-time updates for this campaign
  const { isActive: isRealtimeActive } = useCampaignRealtime({
    campaignId: id,
    enabled: Boolean(campaign),
  })

  // Sync campaign balance
  const { mutateAsync: syncCampaign, isPending: isSyncing } = useApiMutation<CampaignDto, void>(
    () => campaignService.syncCampaign(String(id)),
    {
      onSuccess: () => {
        toast.success(t('Campaign synced successfully'))
        // Refetch campaign data
        queryClient.invalidateQueries({ queryKey: ['campaign', id] })
      },
      onError: (err: any) => {
        console.error('syncCampaign error', err)
        toast.error(t('Failed to sync campaign'))
      },
    },
  )

  // Precompute values safely before any early return so hooks order stays stable
  const goalInEth = campaign ? Number.parseFloat(formatEther(BigInt(campaign.goal))) : 0
  const balanceWei = (() => {
    try {
      if (typeof onchainBalance === 'bigint') return onchainBalance
      if (onchainBalance != null) return BigInt(onchainBalance as any)
      return BigInt(0)
    } catch {
      return BigInt(0)
    }
  })()
  const balanceInEth = Number.parseFloat(formatEther(balanceWei))

  // If campaign is completed, use the goal as the final balance (raised = goal)
  const effectiveBalanceInEth = campaign?.isCompleted ? goalInEth : balanceInEth
  // Lock progress to 100% once completed
  const progress = campaign?.isCompleted ? 100 : goalInEth > 0 ? Math.min((balanceInEth / goalInEth) * 100, 100) : 0

  // Check if current user is the campaign owner
  const isOwner = address?.toLowerCase() === (campaign?.ownerUser?.address || campaign?.owner || '').toLowerCase()

  // Auto-sync: when on-chain balance >= goal and DB not completed yet
  const didAutoSyncRef = useRef(false)
  useEffect(() => {
    if (!campaign) return
    if (didAutoSyncRef.current) return
    const meetsGoal = balanceInEth >= goalInEth && goalInEth > 0
    if (meetsGoal && !campaign.isCompleted) {
      didAutoSyncRef.current = true
      // Use setTimeout to prevent immediate re-render
      setTimeout(() => {
        syncCampaign()
      }, 1000)
    }
  }, [campaign, balanceInEth, goalInEth]) // Remove syncCampaign from dependencies to prevent infinite loop

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(t('Error loading campaign'), { description: message })
    }
  }, [error, t])

  if (isLoading || !campaign) {
    return <CampaignDetailSkeleton />
  }

  // Debug logs
  console.log('CampaignDetailPage Debug:', {
    campaignId: campaign.campaignId,
    ownerUser: campaign.ownerUser,
    owner: campaign.owner,
    goal: campaign.goal,
    balance: campaign.balance,
    balanceWei: String(balanceWei),
    goalInEth,
    balanceInEth,
    progress,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <CampaignBanner
            title={campaign.title}
            coverImage={campaign.coverImage}
            campaignId={campaign.campaignId}
            statusBadge={{
              label: !campaign.isExist
                ? t('Closed')
                : campaign.isCompleted || progress >= 100
                  ? t('Completed')
                  : t('Active'),
              className: !campaign.isExist
                ? 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
                : campaign.isCompleted || progress >= 100
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
            }}
            variant="compact"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start py-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              <CampaignInfo campaign={campaign} supporters={supporters} />
              <CampaignStats
                goalEth={goalInEth}
                raisedEth={effectiveBalanceInEth}
                votes={supporters.length}
                size="default"
              />
              <CampaignContentTabs campaign={campaign} supporters={supporters} />
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="flex flex-col gap-6">
              <CampaignDonate campaign={campaign} onchainBalance={String(balanceWei)} />
              {isOwner && (
                <>
                  <MilestoneWithdrawalCardCompact campaign={campaign} onchainBalance={String(balanceWei)} />
                  <WithdrawalHistoryCard campaign={campaign} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <RelatedCampaigns currentCampaignId={campaign.campaignId} />
          <CommentSection campaignId={campaign.campaignId} />
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailPage
