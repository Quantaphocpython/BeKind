# BeKind - Code Development Guide

## Overview

This guide provides coding guidelines and best practices for the BeKind blockchain charity platform, focusing on the core code structure and patterns.

## Code Organization

### Feature-Based Architecture

```
src/
├── features/           # Business logic modules
│   ├── Campaign/      # Campaign management
│   ├── User/          # User management
│   ├── About/         # About page
│   └── Contact/       # Contact page
├── shared/            # Shared utilities
│   ├── hooks/         # Custom React hooks
│   ├── constants/     # App constants
│   └── utils/         # Utility functions
└── configs/           # Configuration files
    ├── i18n/          # Internationalization
    ├── wagmi/         # Web3 configuration
    └── firebase/      # Firebase setup
```

## Custom Hooks (@shared/hooks/)

### useTranslations Hook

Custom hook that handles dot (`.`) characters in translation keys by replacing them with underscores (`_`).

```typescript
import { useTranslations } from '@/shared/hooks'

const t = useTranslations()

// Use full English sentences as keys
t('We are revolutionizing charitable giving through blockchain technology')
```

**How it works:**

- Automatically transforms dots to underscores in translation keys
- Compatible with all next-intl features
- Applied in `src/configs/i18n/request.ts`

### API Hooks

Generic hooks for API operations:

```typescript
// Query hook for GET requests
const { data, isLoading, error } = useApiQuery(['campaigns'], () => campaignService.getCampaigns(), {
  enabled: Boolean(campaignId),
})

// Mutation hook for POST/PUT/DELETE
const { mutateAsync, isPending } = useApiMutation((data) => campaignService.createCampaign(data), {
  invalidateQueries: [['campaigns']],
  onSuccess: () => toast.success('Success!'),
})
```

### Utility Hooks

```typescript
// Local storage management
const [value, setValue, removeValue] = useLocalStorage('key', initialValue)

// Window size tracking
const { width, height } = useWindowSize()

// Intersection observer
const [ref, isIntersecting] = useIntersectionObserver({
  threshold: 0.5,
  freezeOnceVisible: true,
})
```

## Features (@features/)

### Campaign Feature Structure

```
Campaign/
├── data/              # Data layer
│   ├── constants/     # Feature constants
│   ├── dto/          # Data transfer objects
│   ├── hooks/        # Feature-specific hooks
│   ├── services/     # API services
│   ├── types/        # TypeScript types
│   └── utils/        # Feature utilities
└── presentation/      # UI components
    ├── atoms/        # Basic components
    ├── molecules/    # Compound components
    ├── organisms/    # Complex components
    └── pages/        # Page components
```

### Contract Integration Pattern

```typescript
// Contract read operations
const { data, isLoading, error } = useCampaignContractRead('campaigns', { campaignId: BigInt(id) })

// Contract write operations
const { execute, isLoading, isSuccess } = useCampaignContractWrite('donate')

const handleDonate = () => {
  execute({
    campaignId: BigInt(campaignId),
    amount: '0.1',
  })
}
```

### Form Handling Pattern

```typescript
// Schema with translation support
const schema = createEnhancedCampaignSchema(t)

// Form with validation
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onChange',
})

// Submit handler
const onSubmit = async (data: FormData) => {
  try {
    // Upload files first
    const uploaded = await firebaseStorage.uploadFileWithDetails({
      file: coverFile,
      path: 'images/campaigns',
    })

    // Create campaign
    await createCampaignAPI({
      ...data,
      coverImage: uploaded.downloadURL,
    })
  } catch (error) {
    toast.error('Failed to create campaign')
  }
}
```

## Configuration (@configs/)

### Internationalization (i18n)

```typescript
// src/configs/i18n/request.ts
const adjustKeys = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replaceAll('.', '_'),
      typeof value === 'object' ? adjustKeys(value) : value,
    ]),
  )

export const getRequestConfig = async (locale: string) => ({
  messages: adjustKeys(await import(`../../resources/locales/${locale}.json`)),
})
```

### Web3 Configuration

```typescript
// src/configs/wagmi/index.ts
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  connectors: [walletConnect({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID! })],
})
```

### Firebase Configuration

```typescript
// src/configs/firebase/index.ts
class FirebaseStorageService {
  async uploadFileWithDetails({ file, path, fileName }: UploadOptions) {
    const storageRef = this.createStorageRef(`${path}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return { downloadURL, storagePath: snapshot.ref.fullPath, fileName }
  }
}
```

## Development Patterns

### Constants Management

```typescript
// Use constants for easy customization
export const CAMPAIGN_CONSTANTS = {
  MIN_GOAL: 0.001, // Minimum goal in ETH
  MAX_GOAL: 100, // Maximum goal in ETH
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const
```

### Type Safety

```typescript
// Strict typing for all data structures
export interface CampaignDto {
  id: string
  campaignId: string
  owner: string
  goal: string
  balance: string
  title: string
  description: string
  // ... other fields
}

// Use branded types for IDs
type CampaignId = string & { readonly __brand: 'CampaignId' }
```

### Error Handling

```typescript
// Consistent error handling pattern
try {
  const result = await apiCall()
  toast.success('Operation successful')
  return result
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  toast.error('Operation failed', { description: message })
  console.error('API Error:', error)
  throw error
}
```

### Performance Optimization

```typescript
// Memoize expensive operations
const campaignService = useMemo(() => container.get(TYPES.CampaignService), [])

// Use React Query for caching
const { data } = useApiQuery(
  ['campaign', id],
  () => campaignService.getCampaignById(id),
  { staleTime: 5 * 60 * 1000 }, // 5 minutes
)
```

## Best Practices

1. **Clean Code**: Use constants for easy customization
2. **Type Safety**: Full TypeScript implementation
3. **Error Handling**: Consistent error handling patterns
4. **Performance**: Memoization and caching strategies
5. **Testing**: Maintain high test coverage
6. **Documentation**: Clear code comments and examples

## Common Patterns

### Container Pattern

```typescript
// Dependency injection container
const container = new Container()
container.bind(TYPES.CampaignService).to(CampaignService)
container.bind(TYPES.HttpClient).to(HttpClient)

// Usage in components
const campaignService = container.get(TYPES.CampaignService)
```

### Event Handling

```typescript
// WebSocket real-time updates
useEffect(() => {
  publicSocket.on(SocketEventEnum.NEW_DONATION, handleNewDonation)

  return () => {
    publicSocket.off(SocketEventEnum.NEW_DONATION, handleNewDonation)
  }
}, [])
```

### File Upload

```typescript
// Firebase storage integration
const handleFileUpload = async (file: File) => {
  const uploaded = await firebaseStorage.uploadFileWithDetails({
    file,
    path: 'images/campaigns',
    fileName: `cover_${Date.now()}`,
  })

  return uploaded.downloadURL
}
```

---

_This guide focuses on code patterns and development practices. For project overview and setup, refer to README.md._
