# EventBus Usage Guide

The EventBus is a powerful pub/sub system that allows different parts of your application to communicate without direct coupling.

## Basic Usage

### Importing

```typescript
import { eventBus, useEventBus, useEventBusEmit, USER_EVENTS } from '@/configs/eventBus'
```

### Direct Usage (outside React components)

```typescript
// Emit an event
eventBus.emit(USER_EVENTS.LOGIN, { userId: '123', email: 'user@example.com' })

// Listen to an event
const unsubscribe = eventBus.on(USER_EVENTS.LOGIN, (data) => {
  console.log('User logged in:', data)
})

// Stop listening
unsubscribe()

// Listen once
eventBus.once(USER_EVENTS.LOGIN, (data) => {
  console.log('This will only run once')
})
```

### React Hook Usage

#### useEventBus Hook

```typescript
import { useEventBus, USER_EVENTS } from '@/configs/eventBus'

function UserProfile() {
  const [user, setUser] = useState(null)

  // Listen for user login events
  useEventBus(USER_EVENTS.LOGIN, (userData) => {
    setUser(userData)
  })

  // Listen for user logout events
  useEventBus(USER_EVENTS.LOGOUT, () => {
    setUser(null)
  })

  return <div>{user ? `Welcome ${user.name}` : 'Please login'}</div>
}
```

#### useEventBusEmit Hook

```typescript
import { useEventBusEmit, USER_EVENTS } from '@/configs/eventBus'

function LoginForm() {
  const emit = useEventBusEmit()

  const handleLogin = (credentials) => {
    // Login logic...

    // Emit login event
    emit(USER_EVENTS.LOGIN, { userId: '123', email: 'user@example.com' })
  }

  return <button onClick={handleLogin}>Login</button>
}
```

#### useEventBusOnce Hook

```typescript
import { useEventBusOnce, CAMPAIGN_EVENTS } from '@/configs/eventBus'

function CampaignNotification() {
  const [showNotification, setShowNotification] = useState(false)

  // Show notification only once when campaign is created
  useEventBusOnce(CAMPAIGN_EVENTS.CREATED, (campaign) => {
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  })

  return showNotification ? <div>Campaign created successfully!</div> : null
}
```

## Predefined Events

The EventBus comes with predefined event constants to ensure consistency:

```typescript
import {
  USER_EVENTS,
  CAMPAIGN_EVENTS,
  WALLET_EVENTS,
  NOTIFICATION_EVENTS,
  THEME_EVENTS,
  LOADING_EVENTS,
} from '@/configs/eventBus'

// User events
eventBus.emit(USER_EVENTS.LOGIN, userData)
eventBus.emit(USER_EVENTS.LOGOUT)
eventBus.emit(USER_EVENTS.PROFILE_UPDATED, profileData)

// Campaign events
eventBus.emit(CAMPAIGN_EVENTS.CREATED, campaignData)
eventBus.emit(CAMPAIGN_EVENTS.DONATION_RECEIVED, donationData)

// Wallet events
eventBus.emit(WALLET_EVENTS.CONNECTED, walletData)
eventBus.emit(WALLET_EVENTS.ACCOUNT_CHANGED, newAccount)

// Notification events
eventBus.emit(NOTIFICATION_EVENTS.SUCCESS, { message: 'Operation successful!' })
eventBus.emit(NOTIFICATION_EVENTS.ERROR, { message: 'Something went wrong' })

// Theme events
eventBus.emit(THEME_EVENTS.TOGGLE)
eventBus.emit(THEME_EVENTS.SET_DARK)

// Loading events
eventBus.emit(LOADING_EVENTS.START, { context: 'form-submission' })
eventBus.emit(LOADING_EVENTS.STOP, { context: 'form-submission' })
```

## Advanced Usage

### Custom Event Data Types

```typescript
interface LoginEventData {
  userId: string
  email: string
  timestamp: Date
}

useEventBus<LoginEventData>(USER_EVENTS.LOGIN, (data) => {
  console.log(`User ${data.email} logged in at ${data.timestamp}`)
})
```

### Event Namespaces

```typescript
// Namespaced events for better organization
const MODAL_EVENTS = {
  OPEN: 'modal:open',
  CLOSE: 'modal:close',
  OPEN_CAMPAIGN: 'modal:open:campaign',
  OPEN_DONATE: 'modal:open:donate',
}

// Listen to all modal events
eventBus.on('modal:*', (event, data) => {
  console.log(`Modal event: ${event}`, data)
})
```

### Error Handling

The EventBus automatically catches and logs errors in event handlers, but you can also handle them:

```typescript
eventBus.on('user:login', async (userData) => {
  try {
    await processLogin(userData)
  } catch (error) {
    // Handle the error
    eventBus.emit(NOTIFICATION_EVENTS.ERROR, {
      message: 'Login failed',
      error,
    })
  }
})
```

### Cleanup in React Components

The hooks automatically handle cleanup, but if you're using the EventBus directly:

```typescript
function MyComponent() {
  useEffect(() => {
    const unsubscribe = eventBus.on('some:event', handler)

    return () => {
      unsubscribe() // Clean up on unmount
    }
  }, [])
}
```

## Best Practices

1. **Use predefined constants** - Import from `EVENT_NAMES` to avoid typos
2. **Type safety** - Use TypeScript generics for event data
3. **Cleanup** - Always unsubscribe when components unmount
4. **Error handling** - Wrap async operations in try-catch blocks
5. **Event naming** - Use consistent naming conventions (e.g., `entity:action`)
6. **Data structure** - Keep event data simple and serializable

## Real-world Examples

### Global Loading State

```typescript
// LoadingProvider.tsx
export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  useEventBus(LOADING_EVENTS.START, ({ context }) => {
    setLoading(prev => ({ ...prev, [context]: true }))
  })

  useEventBus(LOADING_EVENTS.STOP, ({ context }) => {
    setLoading(prev => ({ ...prev, [context]: false }))
  })

  const isLoading = Object.values(loading).some(Boolean)

  return (
    <>
      {children}
      {isLoading && <GlobalLoadingSpinner />}
    </>
  )
}

// Usage in any component
const emit = useEventBusEmit()

const handleSubmit = async () => {
  emit(LOADING_EVENTS.START, { context: 'form-submission' })

  try {
    await submitForm()
  } finally {
    emit(LOADING_EVENTS.STOP, { context: 'form-submission' })
  }
}
```

### Toast Notifications

```typescript
// NotificationSystem.tsx
export function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  useEventBus(NOTIFICATION_EVENTS.SHOW, (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }])
  })

  useEventBus(NOTIFICATION_EVENTS.HIDE, (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  })

  return (
    <div>
      {notifications.map(notification => (
        <Toast key={notification.id} {...notification} />
      ))}
    </div>
  )
}

// Usage
const emit = useEventBusEmit()

emit(NOTIFICATION_EVENTS.SHOW, {
  type: 'success',
  message: 'Campaign created successfully!',
  duration: 3000
})
```
