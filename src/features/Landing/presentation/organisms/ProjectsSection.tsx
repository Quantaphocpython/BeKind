'use client'

import type { CampaignDto } from '@/features/Campaign/data/dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { CampaignCard } from '@/features/Campaign/presentation/molecules/CampaignCard'
import { container, TYPES } from '@/features/Common/container'
import type { CampaignListPaginatedResponseDto } from '@/server/dto/campaign.dto'
import { useApiQuery, useTranslations } from '@/shared/hooks'
import { useMemo } from 'react'

export default function ProjectsSection() {
  const t = useTranslations()
  const campaignService = useMemo(() => container.get(TYPES.CampaignService) as CampaignService, [])

  const { data: campaignsResponse } = useApiQuery<CampaignListPaginatedResponseDto>(['landing-projects'], () =>
    campaignService.getCampaignsPaginated({
      page: 1,
      limit: 3,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  )

  const campaigns: CampaignDto[] = campaignsResponse?.data?.items || []

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,theme(colors.primary/5)_0%,transparent_35%,transparent_65%,theme(colors.primary/5)_100%)]" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('Featured Projects')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('Support meaningful causes and track the impact of your donations in real-time')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  )
}
