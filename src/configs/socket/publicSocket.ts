/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApiEndpointEnum, BASE_API } from '@/shared/constants'
import { ManagerOptions, SocketOptions } from 'socket.io-client'
import { BaseSocket } from './baseSocket'

export class PublicSocket extends BaseSocket {
  constructor() {
    super(`${BASE_API}public`)
  }

  protected buildConfig(): Partial<ManagerOptions & SocketOptions> {
    return {
      path: ApiEndpointEnum.PublicSocket,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    }
  }
}

const publicSocket = new PublicSocket()
export default publicSocket
