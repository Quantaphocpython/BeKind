'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CampaignDto } from '@/features/Campaign/data/dto'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { RelatedCampaigns } from './RelatedCampaigns'

interface CampaignSidebarProps {
  campaign: CampaignDto
  onSync?: () => void
  isSyncing?: boolean
}

export const CampaignSidebar = ({ campaign }: CampaignSidebarProps) => {
  const t = useTranslations()
  return (
    <div className="lg:block w-full">
      <div className="sticky top-8 space-y-6">
        <RelatedCampaigns currentCampaignId={campaign.campaignId} />

        {/* Debug: Placeholder card to ensure sidebar is visible */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{t('Campaign Info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('Campaign ID')}: #{campaign.campaignId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
