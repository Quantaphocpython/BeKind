'use client'

import { Icons } from '@/components/icons'

interface CampaignSupporterCountProps {
  count: number
  className?: string
}

export const CampaignSupporterCount = ({ count, className }: CampaignSupporterCountProps) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Icons.users className="h-4 w-4 text-primary" />
      <span className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{count}</span> supporters
      </span>
    </div>
  )
}
