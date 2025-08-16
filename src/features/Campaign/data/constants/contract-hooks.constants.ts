import { parseEther } from 'viem'

// Contract function types
export type ContractFunctionType =
  | 'createCampaign'
  | 'donate'
  | 'withdraw'
  | 'closeCampaign'
  | 'nextCampaignId'
  | 'campaigns'
  | 'getBalance'
  | 'getGoal'

// Contract function arguments
export interface ContractArgs {
  createCampaign: { goal: string }
  donate: { campaignId: bigint; amount: string }
  withdraw: { campaignId: bigint; amount: string }
  closeCampaign: { campaignId: bigint }
  nextCampaignId: {}
  campaigns: { campaignId: bigint }
  getBalance: { campaignId: bigint }
  getGoal: { campaignId: bigint }
}

// Contract function configurations
export const CONTRACT_FUNCTIONS = {
  createCampaign: {
    type: 'write' as const,
    args: (params: ContractArgs['createCampaign']) => [parseEther(params.goal)],
    hasValue: false,
  },
  donate: {
    type: 'write' as const,
    args: (params: ContractArgs['donate']) => [params.campaignId],
    value: (params: ContractArgs['donate']) => parseEther(params.amount),
    hasValue: true,
  },
  withdraw: {
    type: 'write' as const,
    args: (params: ContractArgs['withdraw']) => [params.campaignId, parseEther(params.amount)],
    hasValue: false,
  },
  closeCampaign: {
    type: 'write' as const,
    args: (params: ContractArgs['closeCampaign']) => [params.campaignId],
    hasValue: false,
  },
  nextCampaignId: {
    type: 'read' as const,
    args: () => [],
  },
  campaigns: {
    type: 'read' as const,
    args: (params: ContractArgs['campaigns']) => [params.campaignId],
  },
  getBalance: {
    type: 'read' as const,
    args: (params: ContractArgs['getBalance']) => [params.campaignId],
  },
  getGoal: {
    type: 'read' as const,
    args: (params: ContractArgs['getGoal']) => [params.campaignId],
  },
} as const
