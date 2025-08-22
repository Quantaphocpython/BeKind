'use client'

import { Icons } from '@/components/icons'

interface CampaignShareButtonProps {
  onClick?: () => void
  className?: string
}

export const CampaignShareButton = ({ onClick, className }: CampaignShareButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-full border bg-background hover:bg-muted transition-colors ${className || ''}`}
      aria-label="Share campaign"
    >
      <Icons.externalLink className="h-4 w-4" />
    </button>
  )
}
