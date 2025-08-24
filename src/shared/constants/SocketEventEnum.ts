export enum SocketEventEnum {
  // Campaign events
  NEW_DONATION = 'new-donation',
  BALANCE_UPDATE = 'balance-update',
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
}
