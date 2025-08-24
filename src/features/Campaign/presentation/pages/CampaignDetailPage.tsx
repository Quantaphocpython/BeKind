'use client'

import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { useApiQuery, useTranslations } from '@/shared/hooks'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { useCampaignContractRead, useCampaignRealtime } from '../../data/hooks'
import { CampaignDonate } from '../atoms/CampaignDonate'
import { CampaignBanner } from '../molecules/CampaignBanner'
import { CampaignDetailSkeleton } from '../molecules/CampaignDetailSkeleton'
import { CampaignInfo } from '../molecules/CampaignInfo'
import { CampaignStats } from '../molecules/CampaignStats'
import { CommentSection } from '../molecules/CommentSection'
import { RelatedCampaigns } from '../molecules/RelatedCampaigns'
import { CampaignContentTabs } from '../organisms/CampaignContentTabs'

export const CampaignDetailPage = () => {
  const t = useTranslations()
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

  const { data: supporters = [] } = useApiQuery<VoteDto[]>(
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

  // Enable real-time updates for this campaign
  const { isActive: isRealtimeActive } = useCampaignRealtime({
    campaignId: id,
    enabled: Boolean(campaign),
  })

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(t('Error loading campaign'), { description: message })
    }
  }, [error, t])

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
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <CampaignBanner
            title={campaign.title}
            coverImage={campaign.coverImage}
            campaignId={campaign.campaignId}
            statusBadge={{
              label: !campaign.isExist ? t('Closed') : progress >= 100 ? t('Completed') : t('Active'),
              className: !campaign.isExist
                ? 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700'
                : progress >= 100
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
              <CampaignStats goalEth={goalInEth} raisedEth={balanceInEth} votes={supporters.length} size="default" />
              <CampaignContentTabs campaign={campaign} supporters={supporters} />
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="flex flex-col gap-6">
              <CampaignDonate campaignId={campaign.campaignId} />
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
