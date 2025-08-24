'use client'

import { CampaignDto } from '../../data/dto'
import { RelatedCampaigns } from '../molecules/RelatedCampaigns'

interface CampaignSidebarProps {
  campaign: CampaignDto
}

export const CampaignSidebar = ({ campaign }: CampaignSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Related Campaigns */}
      <RelatedCampaigns currentCampaignId={campaign.campaignId} />
    </div>
  )
}
