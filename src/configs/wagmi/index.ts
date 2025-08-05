import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'viem/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'Charity Platform',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})
