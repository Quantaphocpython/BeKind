'use client'

import { Button } from '@/components/ui/button'
import { useCreateUser } from '@/features/User/data/hooks'
import { useTranslations } from '@/shared/hooks'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function ConnectWallet() {
  const t = useTranslations()
  const { address, isConnected } = useAccount()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()

  // Auto-create user when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      createUser({
        address,
        name: undefined, // User can update name later
      }).catch((error) => {
        console.error('Failed to create user:', error)
        // Don't show error to user as this is a background operation
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
