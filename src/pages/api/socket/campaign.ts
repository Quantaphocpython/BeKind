import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
    res.end()
    return
  }

  console.log('Setting up socket')
  const io = new SocketIOServer(res.socket.server, {
    path: '/api/v1/socket.io/',
    addTrailingSlash: false,
  })
  res.socket.server.io = io

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Handle joining campaign room
    socket.on('join-campaign', (data: { campaignId: string }) => {
      const { campaignId } = data
      socket.join(`campaign-${campaignId}`)
      console.log(`Client ${socket.id} joined campaign ${campaignId}`)
    })

    // Handle leaving campaign room
    socket.on('leave-campaign', (data: { campaignId: string }) => {
      const { campaignId } = data
      socket.leave(`campaign-${campaignId}`)
      console.log(`Client ${socket.id} left campaign ${campaignId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  res.end()
}

export default SocketHandler
