'use client'

import { Badge } from '@/components/ui/badge'

interface CampaignIdBadgeProps {
  campaignId: string | number
  className?: string
}

export const CampaignIdBadge = ({ campaignId, className }: CampaignIdBadgeProps) => {
  return (
    <Badge variant="outline" className={`font-mono ${className || ''}`}>
      #{campaignId}
    </Badge>
  )
}
