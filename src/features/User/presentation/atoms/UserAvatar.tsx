import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { generateUserAvatarSync, getShortAddress } from '../../data/utils'

interface UserAvatarProps {
  address?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ address, name, size = 'md', className = '' }) => {
  const avatarUrl = generateUserAvatarSync(address || '')
  const displayName = name || getShortAddress(address || '')
  const fallbackText = displayName.slice(0, 2).toUpperCase()

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl} alt={displayName} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
