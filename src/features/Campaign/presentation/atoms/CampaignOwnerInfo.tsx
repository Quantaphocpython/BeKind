'use client'

import { UserDisplay } from '@/features/User'

interface CampaignOwnerInfoProps {
  owner: string
  ownerUser?: { name?: string | null; address: string } | null
  className?: string
}

export const CampaignOwnerInfo = ({ owner, ownerUser, className }: CampaignOwnerInfoProps) => {
  return (
    <UserDisplay
      address={ownerUser?.address || owner}
      name={ownerUser?.name || undefined}
      size="sm"
      showAddress={false}
      className={`min-w-0 ${className || ''}`}
      nameClassName="truncate max-w-[10rem]"
    />
  )
}
