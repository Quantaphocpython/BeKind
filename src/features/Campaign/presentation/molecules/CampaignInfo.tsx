'use client'

import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { VoteDto } from '@/server/dto/campaign.dto'
import { CampaignCreatedDate } from '../atoms/CampaignCreatedDate'
import { CampaignIdBadge } from '../atoms/CampaignIdBadge'
import { CampaignOwnerInfo } from '../atoms/CampaignOwnerInfo'
import { CampaignShareButton } from '../atoms/CampaignShareButton'
import { CampaignSupporterCount } from '../atoms/CampaignSupporterCount'

interface CampaignInfoProps {
  campaign: CampaignDto
  supporters: VoteDto[]
}

export const CampaignInfo = ({ campaign, supporters }: CampaignInfoProps) => {
  return (
    <div className="space-y-5 rounded-2xl border bg-card p-4 shadow-sm bg-gradient-to-br from-primary/10 via-card to-accent/10 backdrop-blur-sm">
      {/* Created date + Share */}
      <div className="flex items-center justify-between text-muted-foreground">
        <CampaignCreatedDate createdAt={campaign.createdAt} />
        <CampaignShareButton />
      </div>

      {/* Owner + supporters + ID */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <CampaignOwnerInfo owner={campaign.owner} ownerUser={campaign.ownerUser} />
        <CampaignSupporterCount count={campaign.voteCount || 0} />
        <CampaignIdBadge campaignId={campaign.campaignId} />
      </div>
    </div>
  )
}
