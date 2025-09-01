'use client'

import { Button } from '@/components/ui/button'
import { container, TYPES } from '@/features/Common/container'
import { CreateUserRequestDto, CreateUserResponseDto } from '@/features/User'
import { UserService } from '@/features/User/data/services/user.service'
import { useApiMutation, useTranslations } from '@/shared/hooks'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function ConnectWallet() {
  const t = useTranslations()
  const { address, isConnected } = useAccount()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useApiMutation<
    CreateUserResponseDto,
    CreateUserRequestDto
  >(
    (data) => {
      const userService = container.get(TYPES.UserService) as UserService
      return userService.createUserIfNotExists(data)
    },
    {
      invalidateQueries: [['users']],
    },
  )

  // Auto-create user when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      createUser({
        address,
      })
    }
  }, [isConnected, address, createUser])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
                cursor: 'pointer',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button className="cursor-pointer" onClick={openConnectModal} type="button">
                    {t('Connect Wallet')}
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button className="cursor-pointer" onClick={openChainModal} type="button">
                    {t('Wrong network')}
                  </Button>
                )
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button onClick={openAccountModal} type="button" disabled={isCreatingUser}>
                    {isCreatingUser ? t('Loading...') : account.displayName}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
