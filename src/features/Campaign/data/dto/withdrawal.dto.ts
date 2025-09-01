export interface WithdrawalDto {
  id: string
  campaignId: string
  amount: string
  milestoneIdx?: number
  txHash?: string
  createdAt: string
}

export interface CreateWithdrawalRequestDto {
  amount: string
  milestoneIdx?: number
  userAddress: string
}

export interface CreateWithdrawalResponseDto {
  withdrawal: WithdrawalDto
}
