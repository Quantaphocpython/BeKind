'use client'

import { config } from '@/configs'
import React from 'react'
import { WagmiProvider as WagmiProviderRender } from 'wagmi'

interface WagmiProviderProps {
  children: React.ReactNode
}

const WagmiProvider = ({ children }: WagmiProviderProps) => {
  return <WagmiProviderRender config={config}>{children}</WagmiProviderRender>
}

export default WagmiProvider
