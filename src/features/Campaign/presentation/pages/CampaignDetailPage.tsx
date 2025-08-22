'use client'

import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useApiQuery } from '@/shared/hooks'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { useCampaignContractRead } from '../../data/hooks'
import { CampaignDonate } from '../atoms/CampaignDonate'
import { CampaignBanner } from '../molecules/CampaignBanner'
import { CampaignDetailSkeleton } from '../molecules/CampaignDetailSkeleton'
import { CampaignInfo } from '../molecules/CampaignInfo'
import { CampaignStats } from '../molecules/CampaignStats'
import { CommentSection } from '../molecules/CommentSection'
import { CampaignContentTabs } from '../organisms/CampaignContentTabs'

export const CampaignDetailPage = () => {
  const params = useParams<{ id?: string }>()
  const id = params?.id ?? ''

  const {
    data: campaign,
    isLoading,
    error,
  } = useApiQuery<CampaignDto>(
    ['campaign', id],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaignById(String(id))
    },
    {
      enabled: Boolean(id),
      select: (res) => res.data,
    },
  )

  const {
    data: supporters = [],
    isLoading: isLoadingSupporters,
    error: supportersError,
  } = useApiQuery<VoteDto[]>(
    ['campaign-supporters', id],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getSupporters(String(id))
    },
    {
      enabled: Boolean(id),
      select: (res) => res.data,
    },
  )

  // Read on-chain balance using the smart contract getBalance
  const { data: onchainBalance } = useCampaignContractRead('getBalance', {
    campaignId: campaign ? BigInt(String(campaign.campaignId)) : BigInt(0),
  })

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error('Error loading campaign', { description: message })
    }
  }, [error])

  if (isLoading || !campaign) return <CampaignDetailSkeleton />

  const goalInEth = Number.parseFloat(formatEther(BigInt(campaign.goal)))
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
  const progress = Math.min((balanceInEth / goalInEth) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-7xl py-6 space-y-10">
        <CampaignBanner
          title={campaign.title}
          coverImage={campaign.coverImage}
          campaignId={campaign.campaignId}
          statusBadge={{
            label: !campaign.isExist ? 'Closed' : progress >= 100 ? 'Completed' : 'Active',
            className: !campaign.isExist
              ? 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
              : progress >= 100
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
          }}
          variant="compact"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between ">
          <div className="flex-1 space-y-6">
            <CampaignInfo campaign={campaign} supporters={supporters} />
            <CampaignStats goalEth={goalInEth} raisedEth={balanceInEth} votes={supporters.length} size="default" />
          </div>

          <div className="lg:w-80 w-full">
            <CampaignDonate campaignId={campaign.campaignId} />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          <CampaignContentTabs campaign={campaign} supporters={supporters} />

          {/* Comments Section - Below Description */}
          <CommentSection campaignId={campaign.campaignId} />
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailPage
