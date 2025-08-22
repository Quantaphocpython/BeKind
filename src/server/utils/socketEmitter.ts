import { Server as SocketIOServer } from 'socket.io'

// Global socket instance
let io: SocketIOServer | null = null

export const setSocketIO = (socketIO: SocketIOServer) => {
  io = socketIO
}

export const getSocketIO = () => {
  return io
}

// Emit new donation event to campaign room
export const emitNewDonation = (
  campaignId: string,
  data: {
    donor: string
    amount: string
    transactionHash: string
    blockNumber: number
    timestamp: string
  },
) => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  io.to(`campaign-${campaignId}`).emit('new-donation', {
    campaignId,
    ...data,
  })
}

// Emit balance update event to campaign room
export const emitBalanceUpdate = (campaignId: string, newBalance: string) => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  io.to(`campaign-${campaignId}`).emit('balance-update', {
    campaignId,
    newBalance,
  })
}

// Emit new comment event to campaign room
export const emitNewComment = (
  campaignId: string,
  comment: {
    id: string
    userId: string
    content: string
    parentId?: string
    createdAt: string
    user?: {
      id: string
      address: string
      name?: string
    }
  },
) => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  io.to(`campaign-${campaignId}`).emit('new-comment', {
    campaignId,
    comment,
  })
}

// Emit campaign status change event to campaign room
export const emitCampaignStatusChange = (campaignId: string, status: 'active' | 'completed' | 'closed') => {
  if (!io) {
    console.warn('Socket.IO not initialized')
    return
  }

  io.to(`campaign-${campaignId}`).emit('campaign-status-change', {
    campaignId,
    status,
  })
}
