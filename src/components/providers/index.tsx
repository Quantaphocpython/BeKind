'use client'

import React from 'react'
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
          <QueryClientProvider>{children}</QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default Providers
