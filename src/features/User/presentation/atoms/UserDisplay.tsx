import React from 'react'
import { getShortAddress } from '../../data/utils'
import { UserAvatar } from './UserAvatar'

interface UserDisplayProps {
  address?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showAddress?: boolean
  className?: string
  avatarClassName?: string
  nameClassName?: string
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

export const UserDisplay: React.FC<UserDisplayProps> = ({
  address,
  name,
  size = 'md',
  showAddress = false,
  className = '',
  avatarClassName = '',
  nameClassName = '',
}) => {
  const displayName = (name && name.trim()) || getShortAddress(address || '')

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <UserAvatar address={address} name={name} size={size} className={avatarClassName} />
      <div className="flex flex-col min-w-0">
        <span className={`font-medium truncate ${sizeClasses[size]} ${nameClassName}`}>{displayName}</span>
        {showAddress && address && name && (
          <span className="text-xs text-muted-foreground truncate">{getShortAddress(address)}</span>
        )}
      </div>
    </div>
  )
}
