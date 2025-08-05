'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function ConnectWallet() {
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="icon"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  )
}
