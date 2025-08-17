'use client'

import { Button } from '@/components/ui/button'
import { CreateUserRequestDto, CreateUserResponseDto, userService } from '@/features/User'
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
  >(userService.createUserIfNotExists, {
    invalidateQueries: [['users']],
  })

  // Auto-create user when wallet is connected
  useEffect(() => {
    console.log('ConnectWallet useEffect triggered:', { isConnected, address })

    if (isConnected && address) {
      console.log('Creating user with address:', address)
      createUser({
        address,
      })
        .then((response) => {
          console.log('User created successfully:', response)
        })
        .catch((error) => {
          console.error('Failed to create user:', error)
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
                  <Button onClick={openConnectModal} type="button">
                    {t('Connect Wallet')}
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    {t('Wrong network')}
                  </Button>
                )
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button onClick={openAccountModal} type="button" disabled={isCreatingUser}>
                    {isCreatingUser ? 'Creating Account...' : account.displayName}
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
