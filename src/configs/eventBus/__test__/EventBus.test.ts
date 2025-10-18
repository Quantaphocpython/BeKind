import { EventBus, eventBus } from '../index'

describe('EventBus', () => {
  let testEventBus: EventBus

  beforeEach(() => {
    testEventBus = new EventBus()
  })

  afterEach(() => {
    testEventBus.clear()
  })

  describe('on()', () => {
    it('should register an event listener and return unsubscribe function', () => {
      const handler = jest.fn()
      const unsubscribe = testEventBus.on('test-event', handler)

      expect(typeof unsubscribe).toBe('function')
      expect(testEventBus.listenerCount('test-event')).toBe(1)
    })

    it('should call the handler when event is emitted', () => {
      const handler = jest.fn()
      const testData = { message: 'test data' }

      testEventBus.on('test-event', handler)
      testEventBus.emit('test-event', testData)

      expect(handler).toHaveBeenCalledWith(testData)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should support multiple handlers for the same event', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()
      const testData = { message: 'test data' }

      testEventBus.on('test-event', handler1)
      testEventBus.on('test-event', handler2)
      testEventBus.emit('test-event', testData)

      expect(handler1).toHaveBeenCalledWith(testData)
      expect(handler2).toHaveBeenCalledWith(testData)
    })

    it('should support multiple events', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      testEventBus.on('event1', handler1)
      testEventBus.on('event2', handler2)
      testEventBus.emit('event1', 'data1')
      testEventBus.emit('event2', 'data2')

      expect(handler1).toHaveBeenCalledWith('data1')
      expect(handler2).toHaveBeenCalledWith('data2')
    })

    it('should not call handler after unsubscribe', () => {
      const handler = jest.fn()

      const unsubscribe = testEventBus.on('test-event', handler)
      unsubscribe()
      testEventBus.emit('test-event', 'test data')

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('once()', () => {
    it('should call handler only once', () => {
      const handler = jest.fn()
      const testData = { message: 'test data' }

      testEventBus.once('test-event', handler)
      testEventBus.emit('test-event', testData)
      testEventBus.emit('test-event', testData)

      expect(handler).toHaveBeenCalledWith(testData)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should return unsubscribe function', () => {
      const handler = jest.fn()
      const unsubscribe = testEventBus.once('test-event', handler)

      expect(typeof unsubscribe).toBe('function')
    })

    it('should not call handler if unsubscribed before emission', () => {
      const handler = jest.fn()

      const unsubscribe = testEventBus.once('test-event', handler)
      unsubscribe()
      testEventBus.emit('test-event', 'test data')

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('off()', () => {
    it('should remove specific handler', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      testEventBus.on('test-event', handler1)
      testEventBus.on('test-event', handler2)
      testEventBus.off('test-event', handler1)
      testEventBus.emit('test-event', 'test data')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledWith('test data')
    })

    it('should remove all handlers when no specific handler provided', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      testEventBus.on('test-event', handler1)
      testEventBus.on('test-event', handler2)
      testEventBus.off('test-event')
      testEventBus.emit('test-event', 'test data')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
      expect(testEventBus.listenerCount('test-event')).toBe(0)
    })

    it('should do nothing when removing non-existent handler', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      testEventBus.on('test-event', handler1)
      testEventBus.off('test-event', handler2)
      testEventBus.emit('test-event', 'test data')

      expect(handler1).toHaveBeenCalled()
    })

    it('should do nothing when removing from non-existent event', () => {
      const handler = jest.fn()

      expect(() => {
        testEventBus.off('non-existent-event', handler)
      }).not.toThrow()
    })
  })

  describe('emit()', () => {
    it('should emit event without data', () => {
      const handler = jest.fn()

      testEventBus.on('test-event', handler)
      testEventBus.emit('test-event')

      expect(handler).toHaveBeenCalledWith(undefined)
    })

    it('should emit event with data', () => {
      const handler = jest.fn()
      const testData = { message: 'test data' }

      testEventBus.on('test-event', handler)
      testEventBus.emit('test-event', testData)

      expect(handler).toHaveBeenCalledWith(testData)
    })

    it('should not call handlers when emitting to non-existent event', () => {
      const handler = jest.fn()

      testEventBus.on('other-event', handler)
      testEventBus.emit('non-existent-event', 'test data')

      expect(handler).not.toHaveBeenCalled()
    })

    it('should handle errors in event handlers gracefully', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      const errorHandler = jest.fn(() => {
        throw new Error('Test error')
      })
      const normalHandler = jest.fn()

      testEventBus.on('test-event', errorHandler)
      testEventBus.on('test-event', normalHandler)
      testEventBus.emit('test-event', 'test data')

      expect(errorHandler).toHaveBeenCalled()
      expect(normalHandler).toHaveBeenCalled()
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('should not be affected by handlers being added/removed during emission', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn(() => {
        testEventBus.off('test-event', handler3)
      })
      const handler3 = jest.fn()

      testEventBus.on('test-event', handler1)
      testEventBus.on('test-event', handler2)
      testEventBus.on('test-event', handler3)
      testEventBus.emit('test-event', 'test data')

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
      expect(handler3).toHaveBeenCalled() // Should still be called due to handler array copy
    })
  })

  describe('clear()', () => {
    it('should remove all event listeners', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      testEventBus.on('event1', handler1)
      testEventBus.on('event2', handler2)
      testEventBus.clear()
      testEventBus.emit('event1', 'data1')
      testEventBus.emit('event2', 'data2')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
      expect(testEventBus.eventNames()).toEqual([])
    })
  })

  describe('listenerCount()', () => {
    it('should return correct listener count', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      expect(testEventBus.listenerCount('test-event')).toBe(0)

      testEventBus.on('test-event', handler1)
      expect(testEventBus.listenerCount('test-event')).toBe(1)

      testEventBus.on('test-event', handler2)
      expect(testEventBus.listenerCount('test-event')).toBe(2)

      testEventBus.off('test-event', handler1)
      expect(testEventBus.listenerCount('test-event')).toBe(1)
    })

    it('should return 0 for non-existent events', () => {
      expect(testEventBus.listenerCount('non-existent-event')).toBe(0)
    })
  })

  describe('eventNames()', () => {
    it('should return array of event names with listeners', () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      expect(testEventBus.eventNames()).toEqual([])

      testEventBus.on('event1', handler1)
      expect(testEventBus.eventNames()).toEqual(['event1'])

      testEventBus.on('event2', handler2)
      expect(testEventBus.eventNames()).toEqual(['event1', 'event2'])

      testEventBus.off('event1', handler1)
      expect(testEventBus.eventNames()).toEqual(['event2'])
    })

    it('should return empty array when no listeners exist', () => {
      expect(testEventBus.eventNames()).toEqual([])
    })
  })

  describe('hasListeners()', () => {
    it('should return true when event has listeners', () => {
      const handler = jest.fn()

      expect(testEventBus.hasListeners('test-event')).toBe(false)

      testEventBus.on('test-event', handler)
      expect(testEventBus.hasListeners('test-event')).toBe(true)
    })

    it('should return false when event has no listeners', () => {
      expect(testEventBus.hasListeners('non-existent-event')).toBe(false)
    })
  })

  describe('TypeScript generics', () => {
    it('should support typed event data', () => {
      interface TestData {
        id: number
        name: string
      }

      const handler = jest.fn((data: TestData) => {
        expect(data.id).toBe(1)
        expect(data.name).toBe('test')
      })

      const testData: TestData = { id: 1, name: 'test' }

      testEventBus.on<TestData>('typed-event', handler)
      testEventBus.emit('typed-event', testData)

      expect(handler).toHaveBeenCalledWith(testData)
    })

    it('should work with any type', () => {
      const handler = jest.fn()

      testEventBus.on('any-event', handler)
      testEventBus.emit('any-event', 123)
      testEventBus.emit('any-event', 'string')
      testEventBus.emit('any-event', { object: true })

      expect(handler).toHaveBeenCalledTimes(3)
    })
  })
})

describe('Singleton eventBus', () => {
  beforeEach(() => {
    eventBus.clear()
  })

  it('should maintain state across imports', () => {
    const handler = jest.fn()

    eventBus.on('singleton-test', handler)
    eventBus.emit('singleton-test', 'test data')

    expect(handler).toHaveBeenCalledWith('test data')
  })

  it('should be the same instance across the application', () => {
    const handler1 = jest.fn()
    const handler2 = jest.fn()

    eventBus.on('singleton-test', handler1)
    eventBus.emit('singleton-test', 'test data')
    eventBus.on('singleton-test', handler2)
    eventBus.emit('singleton-test', 'test data 2')

    expect(handler1).toHaveBeenCalledTimes(2)
    expect(handler2).toHaveBeenCalledTimes(1)
  })
})
