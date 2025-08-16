'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import React from 'react'
import { AutoScrollTopProvider } from './AutoScrollTopProvider'
import QueryClientProvider from './QueryClientProvider'
import { ThemeProvider } from './ThemeProvider'
import ToasterProvider from './ToasterProvider'
import WagmiProvider from './WagmiProvider'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <React.Fragment>
      <ThemeProvider>
        <WagmiProvider>
          <QueryClientProvider>
            <RainbowKitProvider id="rainbowkit">
              <TooltipProvider>
                <AutoScrollTopProvider />
                <ToasterProvider />

                {children}
              </TooltipProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default Providers
