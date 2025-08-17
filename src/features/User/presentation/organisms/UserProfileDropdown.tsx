'use client'

import ConnectWallet from '@/components/common/organisms/Wallet/ConnectWallet'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RouteEnum } from '@/shared/constants'
import { useTranslations } from '@/shared/hooks'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useUser } from '../../data/hooks'
import { getShortAddress } from '../../data/utils'
import { UserAvatar } from '../atoms/UserAvatar'

export const UserProfileDropdown: React.FC = () => {
  const t = useTranslations()

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user, isLoading } = useUser()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(RouteEnum.Profile)
  }

  const handleDisconnect = () => {
    disconnect()
    router.push(RouteEnum.Home)
  }

  if (!isConnected || !address) {
    return <ConnectWallet />
  }

  if (!user || isLoading) {
    return (
      <Button variant="ghost" size="sm">
        <Icons.user className="h-4 w-4 mr-2" />
        {t('Guest')}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-accent">
          <UserAvatar address={user.address} size="sm" />
          <span className="hidden sm:inline-block text-sm font-medium">
            {user.name || getShortAddress(user.address)}
          </span>
          <Icons.chevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || t('Anonymous User')}</p>
            <p className="text-xs leading-none text-muted-foreground">{getShortAddress(user.address)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <Icons.user className="mr-2 h-4 w-4" />
          <span>{t('Profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.settings className="mr-2 h-4 w-4" />
          <span>{t('Settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>
          <Icons.login className="mr-2 h-4 w-4" />
          <span>{t('Disconnect')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
