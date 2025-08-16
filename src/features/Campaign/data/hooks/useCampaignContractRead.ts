import { abi } from '@/configs/abis'
import { useContractRead } from 'wagmi'
import { CONTRACT_CONSTANTS } from '../constants'
import { CONTRACT_FUNCTIONS, ContractArgs } from '../constants/contract-hooks.constants'

// Hook for read operations
export const useCampaignContractRead = <
  T extends keyof Pick<ContractArgs, 'nextCampaignId' | 'campaigns' | 'getBalance' | 'getGoal'>,
>(
  functionName: T,
  args: ContractArgs[T],
) => {
  const config = CONTRACT_FUNCTIONS[functionName]
  if (config.type !== 'read') {
    throw new Error(`Function ${functionName} is not a read operation`)
  }

  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_CONSTANTS.ADDRESS as `0x${string}`,
    abi,
    functionName,
    args: config.args(args as any),
  })

  return {
    data,
    isLoading,
    error,
  }
}
