import { socketEmitter } from '@/server/utils/socketEmitter'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
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
    res.end()
    return
  }

  const io = new SocketIOServer(res.socket.server, {
    path: ApiEndpointEnum.PrivateSocket,
    addTrailingSlash: false,
  })
  res.socket.server.io = io

  // Set socket instance to our emitter
  socketEmitter.setSocketIO(io)

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {})
  })

  res.end()
}

export default SocketHandler
