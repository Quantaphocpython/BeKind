type EventHandler<T = any> = (data: T) => void
type EventMap = Record<string, EventHandler[]>

class EventBus {
  private events: EventMap = {}

  /**
   * Subscribe to an event
   * @param event - The event name to listen for
   * @param handler - The callback function to execute when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(handler)

    // Return unsubscribe function
    return () => {
      this.off(event, handler)
    }
  }

  /**
   * Subscribe to an event only once
   * @param event - The event name to listen for
   * @param handler - The callback function to execute when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    const onceHandler: EventHandler<T> = (data) => {
      handler(data)
      this.off(event, onceHandler)
    }

    return this.on(event, onceHandler)
  }

  /**
   * Unsubscribe from an event
   * @param event - The event name to unsubscribe from
   * @param handler - The specific handler to remove (optional, removes all if not provided)
   */
  off<T = any>(event: string, handler?: EventHandler<T>): void {
    if (!this.events[event]) {
      return
    }

    if (!handler) {
      // Remove all handlers for this event
      delete this.events[event]
      return
    }

    // Remove specific handler
    const index = this.events[event].indexOf(handler)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }

    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event]
    }
  }

  /**
   * Emit an event to all subscribers
   * @param event - The event name to emit
   * @param data - The data to pass to the event handlers
   */
  emit<T = any>(event: string, data?: T): void {
    if (!this.events[event]) {
      return
    }

    // Create a copy of the handlers array to avoid issues with handlers being added/removed during iteration
    const handlers = [...this.events[event]]

    handlers.forEach((handler) => {
      try {
        handler(data)
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error)
      }
    })
  }

  /**
   * Remove all event listeners
   */
  clear(): void {
    this.events = {}
  }

  /**
   * Get the number of listeners for a specific event
   * @param event - The event name to check
   * @returns The number of listeners for the event
   */
  listenerCount(event: string): number {
    return this.events[event]?.length || 0
  }

  /**
   * Get all event names that have listeners
   * @returns An array of event names
   */
  eventNames(): string[] {
    return Object.keys(this.events)
  }

  /**
   * Check if there are any listeners for a specific event
   * @param event - The event name to check
   * @returns True if there are listeners, false otherwise
   */
  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0
  }
}

// Create a singleton instance
export const eventBus = new EventBus()

export { EventBus }

export type { EventHandler, EventMap }
