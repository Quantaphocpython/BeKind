export enum SocketEventEnum {
  // Campaign events
  NEW_DONATION = 'new-donation',
  BALANCE_UPDATE = 'balance-update',
  WITHDRAWAL_CREATED = 'withdrawal-created',
  MILESTONE_RELEASED = 'milestone-released',
}

// Event payload types
export interface SocketEventPayloads {
  [SocketEventEnum.NEW_DONATION]: {
    campaignId: string
    donor: string
    amount: string
    transactionHash: string
    blockNumber: number
    timestamp: string
  }
  [SocketEventEnum.BALANCE_UPDATE]: {
    campaignId: string
    newBalance: string
  }
  [SocketEventEnum.WITHDRAWAL_CREATED]: {
    campaignId: string
    amount: string
    milestoneIdx?: number
    txHash?: string
    createdAt: string
  }
  [SocketEventEnum.MILESTONE_RELEASED]: {
    campaignId: string
    milestoneIndex: number
    releasedAt: string
  }
}
