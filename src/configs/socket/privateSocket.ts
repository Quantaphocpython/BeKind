import { ApiEndpointEnum, BASE_API } from '@/shared/constants'
import { ManagerOptions, SocketOptions } from 'socket.io-client'
import { BaseSocket } from './baseSocket'

export class PrivateSocket extends BaseSocket {
  constructor() {
    super(BASE_API || '')
  }

  protected buildConfig(): Partial<ManagerOptions & SocketOptions> {
    const config: any = {
      path: ApiEndpointEnum.PrivateSocket,
    }

    const appSite = typeof window !== 'undefined' ? window.location.origin : ''

    if (appSite !== BASE_API) {
      config.withCredentials = true
    }
    return config
  }
}

const privateSocket = new PrivateSocket()
export default privateSocket
