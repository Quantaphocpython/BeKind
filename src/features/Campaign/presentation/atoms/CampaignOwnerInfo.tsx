'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { generateUserAvatarSync, getShortAddress } from '@/features/User/data/utils/avatar.utils'

interface CampaignOwnerInfoProps {
  owner: string
  ownerUser?: { name?: string | null; address: string } | null
  className?: string
}

export const CampaignOwnerInfo = ({ owner, ownerUser, className }: CampaignOwnerInfoProps) => {
  return (
    <div className={`flex items-center gap-2 min-w-0 ${className || ''}`}>
      <Avatar className="size-7 ring-2 ring-offset-1 ring-primary/20">
        <AvatarImage src={generateUserAvatarSync(ownerUser?.address || owner)} alt="Owner" />
        <AvatarFallback>OW</AvatarFallback>
      </Avatar>
      <span className="truncate max-w-[10rem] font-medium text-foreground">
        {ownerUser?.name || getShortAddress(owner)}
      </span>
    </div>
  )
}
