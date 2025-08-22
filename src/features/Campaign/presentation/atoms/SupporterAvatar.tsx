'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { generateUserAvatarSync } from '@/features/User/data/utils/avatar.utils'

interface SupporterAvatarProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const SupporterAvatar = ({ userId, size = 'md', className }: SupporterAvatarProps) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      <AvatarImage src={generateUserAvatarSync(userId)} alt="Supporter" />
      <AvatarFallback>SP</AvatarFallback>
    </Avatar>
  )
}
