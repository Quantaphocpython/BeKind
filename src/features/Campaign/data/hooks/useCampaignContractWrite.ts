import { abi } from '@/configs/abis'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { CONTRACT_CONSTANTS } from '../constants'
import { CONTRACT_FUNCTIONS, ContractArgs } from '../constants/contract-hooks.constants'

// Hook for write operations
export const useCampaignContractWrite = <
  T extends keyof Pick<ContractArgs, 'createCampaign' | 'donate' | 'withdraw' | 'closeCampaign'>,
>(
  functionName: T,
) => {
  const { address } = useAccount()
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const execute = (args: ContractArgs[T]) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const config = CONTRACT_FUNCTIONS[functionName]
    if (config.type !== 'write') {
      throw new Error(`Function ${functionName} is not a write operation`)
    }

    const contractArgs: any = {
      address: CONTRACT_CONSTANTS.ADDRESS as `0x${string}`,
      abi,
      functionName,
      args: config.args(args as any),
    }

    // Add value if the function requires it
    if ('hasValue' in config && config.hasValue && 'value' in config) {
      contractArgs.value = config.value(args as any)
    }

    writeContract(contractArgs)
  }

  return {
    execute,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
