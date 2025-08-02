/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

export abstract class BaseSocket {
  protected abstract buildConfig(): Partial<ManagerOptions & SocketOptions>
  private socket: Socket
  private path: string

  private eventsListening: [string, (data: any) => void][] = []

  public get Socket() {
    if (!this.socket) {
      this.build()
    }

    return this.socket
  }

  constructor(path: string) {
    this.path = path
    this.socket = io(this.path, this.buildConfig())
  }

  protected build() {
    this.socket = io(this.path, this.buildConfig())
    this.eventsListening = []
  }

  public close() {
    this.socket?.close()
    this.socket = null as any
  }

  protected _findExistedEvents(event: string) {
    return this.eventsListening.filter(([eventName]) => eventName === event)
  }

  protected _getRunningEvent(event: string, handler: (data: any) => void) {
    return {
      off: () => {
        if (this.socket) this.off(event, handler)
      },
    }
  }

  public on(event: string, handler: (data: any) => void) {
    const existedEventsListening = this._findExistedEvents(event)
    const isHandlerDeclared = existedEventsListening.find(([_, existHandler]) => existHandler === handler)

    if (isHandlerDeclared) {
      return this._getRunningEvent(event, handler)
    }

    if (existedEventsListening.length > 0) {
      const compiledHandler = (data: any) => {
        existedEventsListening.forEach(([_, existHandler]) => {
          existHandler(data)
        })

        handler(data)
      }

      this.Socket.off(event)
      this.Socket.on(event, compiledHandler)
    } else {
      this.Socket.on(event, handler)
    }

    this.eventsListening.push([event, handler])

    return this._getRunningEvent(event, handler)
  }

  public off(event: string, handler: (data: any) => void) {
    const existedEventsListening = this._findExistedEvents(event)
    const isHandlerDeclared = existedEventsListening.find(([_, existHandler]) => existHandler === handler)
    if (!isHandlerDeclared) {
      throw new Error('This socket event is not openned before close')
    }

    if (existedEventsListening.length > 1) {
      const compiledHandler = (data: any) => {
        existedEventsListening.forEach(([_, existHandler]) => {
          if (existHandler == handler) return
          existHandler(data)
        })
      }

      this.Socket.off(event)
      this.Socket.on(event, compiledHandler)
    } else {
      this.Socket.off(event)
    }

    this.eventsListening = this.eventsListening.filter(([eventName, existHandler]) => {
      return !(eventName === event && existHandler === handler)
    })

    if (this.eventsListening.length <= 0) {
      this.close()
    }

    return true
  }
}
