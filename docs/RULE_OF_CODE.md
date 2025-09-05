# BeKind - Code Rules & Development Standards

## Introduction

BeKind is a FullStack project built on NextJS 15, applying Feature-Based architecture with Domain-Driven Design principles. The project uses:

- **Frontend**: NextJS 15 App Router with TailwindCSS and Shadcn/ui
- **Backend**: NextJS API Routes with Prisma ORM
- **Database**: MongoDB with Prisma ORM
- **Architecture**: Feature-Based with DDD principles
- **State Management**: React Query + Zustand
- **Dependency Injection**: InversifyJS
- **Type Safety**: TypeScript 5.0
- **Testing**: Jest and React Testing Library

## Branch Naming Rules

Allowed branch types:

- `main` - Main branch for production
- `develop` - Main branch for development
- `staging` - Branch for staging environment
- `release/vX.X` - Branch for version release (e.g., release/v1.0)
- `feature/{initials}_{feature-name}` - Branch for new features (e.g., feature/sh_campaign)
- `hotfix/{hotfix-name}` - Branch for urgent fixes (e.g., hotfix/fix-donation)
- `bugfix/{bug-name}` - Branch for regular bug fixes

## Commit Rules

### Commit Message Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Categories:

- `feat`: Add new features
- `fix`: Fix bugs
- `docs`: Change documentation
- `style`: Changes that don't affect code (formatting, whitespace, etc.)
- `refactor`: Restructure code without adding features or fixing bugs
- `perf`: Performance improvements
- `test`: Add or fix tests
- `build`: Change build system or dependencies
- `ci`: Change CI configuration
- `chore`: Other changes not related to src or tests
- `revert`: Undo previous commit
- `merge`: Merge code

### Example Commit Message:

```bash
feat(campaign): add milestone withdrawal system

- Implement milestone-based fund release
- Add withdrawal validation logic
- Update smart contract integration

Closes #123
```

## Directory Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── [locale]/          # Internationalization routes
│   │   ├── (home)/        # Home page routes
│   │   ├── campaigns/     # Campaign routes
│   │   ├── profile/       # Profile routes
│   │   └── [...rest]/     # Catch-all routes
│   └── globals.css        # Global styles
│
├── components/             # Shared components
│   ├── common/            # Common components
│   │   ├── atoms/         # Basic UI elements
│   │   ├── molecules/     # Compound components
│   │   └── organisms/     # Complex components
│   ├── layout/            # Layout components
│   ├── ui/                # UI components (shadcn/ui)
│   └── providers/         # Context providers
│
├── features/              # Feature-based modules
│   ├── Campaign/          # Campaign management
│   │   ├── data/          # Data layer
│   │   │   ├── constants/ # Feature constants
│   │   │   ├── dto/       # Data transfer objects
│   │   │   ├── hooks/     # Feature-specific hooks
│   │   │   ├── services/  # API services
│   │   │   ├── types/     # TypeScript types
│   │   │   └── utils/     # Feature utilities
│   │   └── presentation/  # UI components
│   │       ├── atoms/     # Basic components
│   │       ├── molecules/ # Compound components
│   │       ├── organisms/ # Complex components
│   │       └── pages/     # Page components
│   ├── User/              # User management
│   ├── About/             # About page
│   └── Contact/           # Contact page
│
├── configs/               # Configuration files
│   ├── i18n/             # Internationalization
│   ├── wagmi/            # Web3 configuration
│   ├── firebase/         # Firebase setup
│   ├── prisma/           # Database configuration
│   └── socket/            # WebSocket configuration
│
├── pages/                 # API routes
│   └── api/              # Backend API endpoints
│       ├── campaigns/     # Campaign API
│       ├── users/         # User API
│       └── socket.io.ts   # WebSocket handler
│
├── server/                # Backend services
│   ├── container/         # Dependency injection
│   ├── dto/              # Data transfer objects
│   ├── mapper/           # Data mappers
│   ├── repository/       # Data access layer
│   ├── service/          # Business logic
│   └── utils/            # Server utilities
│
└── shared/                # Shared utilities
    ├── constants/         # Application constants
    ├── hooks/             # Custom React hooks
    ├── services/          # Shared services
    ├── types/             # TypeScript types
    └── utils/             # Utility functions
```

## Feature Module Organization Rules

### 1. Module Naming

- Use PascalCase for first letter
- Name must clearly describe functionality

### 2. Module Structure Following DDD Layers

```
Feature/
├── data/                  # Data layer
│   ├── constants/         # Feature constants
│   ├── dto/              # Data transfer objects
│   ├── hooks/            # Feature-specific hooks
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── utils/            # Feature utilities
└── presentation/          # UI components
    ├── atoms/            # Basic components
    ├── molecules/        # Compound components
    ├── organisms/        # Complex components
    └── pages/            # Page components
```

### 3. Organization Principles

- Each module is independent
- No direct imports between modules
- Communication through interfaces defined in shared layer
- Shared code placed in `shared` directory
- Each layer has clear responsibilities

## Code Rules

### 1. Naming Conventions

#### Variables & Functions

```typescript
// ✅ Correct
const campaignId = '123'
const handleDonation = () => {}
const isCampaignActive = true

// ❌ Wrong
const CampaignId = '123'
const HandleDonation = () => {}
const IS_CAMPAIGN_ACTIVE = true
```

#### Components & Interfaces

```typescript
// ✅ Correct
interface CampaignDto {
  id: string
  title: string
}

const CampaignCard = () => {}

// ❌ Wrong
interface campaignDto {
  id: string
  title: string
}

const campaignCard = () => {}
```

#### Constants

```typescript
// ✅ Correct
export const CAMPAIGN_CONSTANTS = {
  MIN_GOAL: 0.001,
  MAX_GOAL: 100,
} as const

// ❌ Wrong
export const campaignConstants = {
  minGoal: 0.001,
  maxGoal: 100,
}
```

### 2. Component Structure

#### File Organization

```typescript
// ✅ One component per file
// CampaignCard.tsx
export const CampaignCard = () => {
  // Component logic
}

// ❌ Don't combine multiple components in one file
```

#### Component Naming

```typescript
// ✅ File name must match component name
// CampaignCard.tsx
export const CampaignCard = () => {}

// ❌ File name and component name are different
// CampaignCard.tsx
export const Campaign = () => {}
```

### 3. Hooks Order

#### Hook Arrangement Rules

```typescript
const Component = () => {
  // 1. useState - always place first, group related states
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 2. useRef - place after useState
  const tableRef = useRef<HTMLTableElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // 3. Custom hooks and library hooks
  const { data: queryData } = useApiQuery(['campaigns'], fetchCampaigns)
  const { mutateAsync, isPending } = useApiMutation(createCampaign)
  const { handleSubmit, register } = useForm<CampaignFormData>()

  // 4. Functions that are useEffect dependencies - place before useEffect
  const handleDataUpdate = useCallback(() => {
    setCampaigns(queryData || [])
  }, [queryData])

  const handleError = useCallback((err: Error) => {
    setError(err)
    toast.error('Failed to fetch campaigns')
  }, [])

  // 5. useEffect - place last
  useEffect(() => {
    handleDataUpdate()
  }, [handleDataUpdate])

  useEffect(() => {
    if (error) {
      handleError(error)
    }
  }, [error, handleError])

  // 6. Other functions - place after useEffect
  const handleReset = () => {
    setCampaigns([])
    setLoading(false)
    setError(null)
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await refetch()
    } finally {
      setLoading(false)
    }
  }

  // 7. Separate each group of hooks/functions with one blank line
  return (
    // JSX
  )
}
```

### 4. Import Order

```typescript
// 1. React imports
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third party libraries
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

// 3. Components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CampaignCard } from '@/features/Campaign/presentation/molecules'

// 4. Hooks
import { useApiQuery } from '@/shared/hooks'
import { useTranslations } from '@/shared/hooks'

// 5. Utils/Constants
import { cn } from '@/shared/utils'
import { CAMPAIGN_CONSTANTS } from '@/features/Campaign/data/constants'

// 6. Types
import type { CampaignDto } from '@/features/Campaign/data/dto'
import type { ApiResponse } from '@/shared/types'

// 7. Styles (if any)
import './CampaignList.css'
```

### 5. Type Safety

#### Strict Typing

```typescript
// ✅ Use interfaces for objects
interface CampaignDto {
  id: string
  title: string
  description: string
  goal: string
  balance: string
  owner: string
  createdAt: string
}

// ✅ Use types for unions
type CampaignStatus = 'active' | 'completed' | 'closed'

// ✅ Use branded types for IDs
type CampaignId = string & { readonly __brand: 'CampaignId' }
type UserId = string & { readonly __brand: 'UserId' }
```

#### Generic Types

```typescript
// ✅ Use generics for reusable components
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (item: T) => void
}

// ✅ Use generics for API responses
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
```

### 6. Error Handling

#### Consistent Error Pattern

```typescript
// ✅ Use try-catch with error handling
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true)
    setError(null)

    const result = await apiCall(data)
    toast.success('Operation successful')
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setError(error as Error)
    toast.error('Operation failed', { description: message })
    console.error('API Error:', error)
    throw error
  } finally {
    setLoading(false)
  }
}
```

#### Error Boundaries

```typescript
// ✅ Use error boundaries for React components
class CampaignErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Campaign Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
```

### 7. Performance Optimization

#### Memoization

```typescript
// ✅ Use useMemo for expensive operations
const campaignService = useMemo(() =>
  container.get(TYPES.CampaignService),
  []
)

// ✅ Use useCallback for functions
const handleCampaignUpdate = useCallback((id: string, data: UpdateData) => {
  // Update logic
}, [])

// ✅ Use React.memo for components
const CampaignCard = React.memo(({ campaign }: CampaignCardProps) => {
  return <div>{campaign.title}</div>
})
```

#### React Query Optimization

```typescript
// ✅ Use React Query with proper configuration
const { data, isLoading, error } = useApiQuery(['campaign', id], () => campaignService.getCampaignById(id), {
  enabled: Boolean(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
})
```

### 8. Constants Management

#### Feature Constants

```typescript
// ✅ Use constants for easy customization
export const CAMPAIGN_CONSTANTS = {
  MIN_GOAL: 0.001, // Minimum goal in ETH
  MAX_GOAL: 100, // Maximum goal in ETH
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  DEFAULT_DONATION_ETH: 0.001,
  SUCCESS_MESSAGE_DURATION: 3000, // 3 seconds
} as const

// ✅ Use enums for status
export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}
```

#### API Constants

```typescript
// ✅ Use constants for API endpoints
export const API_ENDPOINTS = {
  CAMPAIGNS: '/api/campaigns',
  USERS: '/api/users',
  DONATIONS: '/api/donations',
} as const

// ✅ Use constants for HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const
```

### 9. Form Handling

#### React Hook Form Pattern

```typescript
// ✅ Use React Hook Form with Zod validation
const schema = createEnhancedCampaignSchema(t)

const form = useForm<CampaignFormData>({
  resolver: zodResolver(schema),
  mode: 'onChange',
  defaultValues: {
    title: '',
    goal: '',
    description: '',
    coverImage: '',
  },
})

// ✅ Submit handler with proper error handling
const onSubmit = async (data: CampaignFormData) => {
  try {
    // Upload files first
    const uploaded = await firebaseStorage.uploadFileWithDetails({
      file: coverFile!,
      path: 'images/campaigns',
      fileName: `cover_${Date.now()}`,
    })

    // Create campaign
    await createCampaignAPI({
      ...data,
      coverImage: uploaded.downloadURL,
    })

    toast.success('Campaign created successfully!')
    form.reset()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    toast.error('Failed to create campaign', { description: message })
  }
}
```

### 10. Testing Standards

#### Component Testing

```typescript
// ✅ Use React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
import { CampaignCard } from './CampaignCard'

describe('CampaignCard', () => {
  const mockCampaign = {
    id: '1',
    title: 'Test Campaign',
    description: 'Test Description',
  }

  it('renders campaign information correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />)

    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('calls onCardClick when clicked', () => {
    const mockOnClick = jest.fn()
    render(<CampaignCard campaign={mockCampaign} onCardClick={mockOnClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(mockOnClick).toHaveBeenCalledWith(mockCampaign.id)
  })
})
```

#### Hook Testing

```typescript
// ✅ Use renderHook for custom hooks
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sets and gets value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    expect(result.current[0]).toBe('new value')
    expect(localStorage.getItem('test')).toBe('"new value"')
  })
})
```

## Project Running Rules

### 1. Starting the Project

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### 2. Before Committing Code

```bash
# Format code
pnpm format

# Check for errors
pnpm lint-staged
```

### 3. Before Pushing Code

```bash
# Build project to check for errors
pnpm build

# Run tests
pnpm test
```

### 4. Workflow

- Always run `pnpm dev` when developing
- Format code before committing
- Build project before pushing
- Don't push code with build errors
- Maintain minimum 80% test coverage

## Available Scripts

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build production
pnpm build

# Run unit tests
pnpm test

# Check linting
pnpm lint-staged

# Format code
pnpm format

# Type checking
pnpm check
```

## Code Review Process

### 1. Creating Pull Request

- Create new branch from `develop`
- Code and commit following rules
- Push and create Pull Request

### 2. Review Process

- Require at least 1 reviewer
- Reviewer checks:
  - Code quality and standards
  - Type safety
  - Error handling
  - Performance considerations
  - Test coverage

### 3. Merge Process

- After approval, merge into `develop`
- Don't merge code with build or test failures

## Contact

If you have questions about code rules, please:

- Create an issue in the repository
- Contact team lead
- Refer to documentation in `docs/` folder

---

_This document is updated according to BeKind project development rules. Please follow these rules to ensure code quality and project consistency._
