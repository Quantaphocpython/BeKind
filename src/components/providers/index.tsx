'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import React from 'react'
import { Toaster } from 'sonner'
import QueryClientProvider from './QueryClientProvider'
import { ThemeProvider } from './ThemeProvider'
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
                {children}
                <Toaster position="top-right" richColors />
              </TooltipProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default Providers
