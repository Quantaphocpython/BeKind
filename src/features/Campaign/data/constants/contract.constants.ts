export const CONTRACT_CONSTANTS = {
  ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
} as const
