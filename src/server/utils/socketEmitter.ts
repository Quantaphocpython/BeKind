import { SocketEventEnum, SocketEventPayloads } from '@/shared/constants'
import { Server as SocketIOServer } from 'socket.io'

// Generic Socket Emitter Class
export class SocketEmitter {
  private io: SocketIOServer | null = null

  setSocketIO(socketIO: SocketIOServer) {
    this.io = socketIO
  }

  getSocketIO(): SocketIOServer | null {
    return this.io
  }

  // Generic emit method
  emit<T extends SocketEventEnum>(event: T, payload: SocketEventPayloads[T], room?: string): void {
    if (!this.io) {
      console.warn('Socket.IO not initialized')
      return
    }

    if (room) {
      this.io.to(room).emit(event, payload)
    } else {
      this.io.emit(event, payload)
    }
  }

  // Emit to all connected clients
  emitToAll<T extends SocketEventEnum>(event: T, payload: SocketEventPayloads[T]): void {
    this.emit(event, payload)
  }
}

// Global instance - use this directly
export const socketEmitter = new SocketEmitter()
