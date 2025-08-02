# We Transcend Frontend Template Guide

## Overview

A modern, scalable frontend template using **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and best practices: **Clean Architecture** for features, **Atomic Design** for UI, and a clear, maintainable folder structure. Suitable for enterprise and production-ready web apps.

---

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Query** (TanStack Query)
- **Atomic Design** for UI
- **Clean Architecture** for features
- **Jest/Testing Library** (unit & integration tests)

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router (layouts, pages, route groups)
│   ├── (auth)/             # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/        # Protected routes
│   └── layout.tsx          # Root layout
│
├── components/             # Shared UI components (Atomic Design)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   └── Form/
│       ├── Input/
│       │   ├── Input.tsx
│       └── Select/
│           ├── Select.tsx
│
├── features/               # Feature modules (Clean Architecture)
│   └── Auth/
│       ├── application/
│       │   ├── services/
│       │   │   ├── IAuthService.ts
│       │   │   └── implements/
│       │   │       └── AuthService.ts
│       │   └── queries/                 # React Query hooks & mutations
│       │       ├── useLogin.ts
│       │       ├── useRegister.ts
│       │       ├── useUser.ts
│       │       └── types/
│       │           ├── LoginParams.ts
│       │           └── RegisterParams.ts
│       │
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── User.ts
│       │   │   └── Token.ts
│       │   ├── constants/
│       │   └── dto/
│       │
│       ├── infrastructure/
│       │   ├── repositories/
│       │   │   ├── IUserRepository.ts
│       │   │   ├── ITokenRepository.ts
│       │   │   └── implements/
│       │   │       ├── UserRepository.ts
│       │   │       └── TokenRepository.ts
│       │   └── services/
│       │       ├── IJWTService.ts
│       │       ├── IPasswordHasher.ts
│       │       ├── IEmailService.ts
│       │       └── implements/
│       │           ├── JWTService.ts
│       │           ├── BCryptPasswordHasher.ts
│       │           └── NodemailerEmailService.ts
│       │
│       └── presentation/        # UI with Atomic Design
│           ├── atoms/           # Smallest UI components
│           │   ├── Button.tsx
│           │   └── Input.tsx
│           ├── molecules/       # Composed from atoms
│           │   ├── FormField.tsx
│           │   └── SearchBar.tsx
│           ├── organisms/       # Composed from molecules
│           │   ├── LoginForm.tsx
│           │   └── RegisterForm.tsx
│           └── pages/           # Complete pages
│               ├── LoginPage.tsx
│               └── RegisterPage.tsx
│
├── pages/                      # Next.js pages & API routes (if needed)
│   ├── api/
│   │   └── auth/
│   │       ├── login.ts
│   │       └── register.ts
│
└── shared/                    # Shared logic, constants, helpers
    ├── constants/
    │   └── api.ts
    ├── helpers/
    │   └── validation.ts
    ├── hooks/
    │   └── useForm.ts
    ├── types/
    │   └── common.ts
    └── utils/
        ├── api.ts
        └── storage.ts
```

### Key Principles

- **Clean Architecture**: Separate domain, application, infrastructure, and presentation for each feature.
- **Atomic Design**: UI is split into atoms, molecules, organisms, and pages.
- **Shared**: Only contains truly shared logic, constants, and helpers.
- \*\*No feature logic in shared/components; all feature logic must be in features/.

---

## Coding Conventions

- **Component**: Functional, TypeScript, PascalCase, one component per file.
- **Constants**: Place in `shared/constants/` or `features/<feature>/domain/constants/`.
- **Hooks**: Place in `shared/hooks/` or `features/<feature>/application/queries/`.
- **Test**: Place next to the code file, e.g., `Button.test.tsx`.
- **Import order**: React → Third-party libraries → Components → Hooks → Utils/Constants → Types → Styles.
- **Always use constants for easy customization.**

---

## Code Conventions

### Naming Conventions

- Use **camelCase** for variable and function names.
- Use **PascalCase** for component and interface names.
- Use **UPPERCASE** for constants.

### Component Structure

- One component per file.
- The file name must match the component name.
- Use Functional Components with TypeScript.

### Hooks Order

- `useState` always comes first. Group related states together.
- `useRef` comes after `useState`.
- Custom hooks and library hooks (e.g., `useQuery`, `useForm`, etc.) come next.
- `useEffect` should be placed last among hooks.
- Functions that are dependencies of `useEffect` must be declared before the `useEffect`.
- Other functions should be placed after all `useEffect` hooks.
- Separate each group of hooks/functions with a blank line.

#### Example:

```tsx
const Component = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { data: queryData } = useQuery(['key'], fetchData);
  const { handleSubmit, register } = useForm<FormData>();

  const handleDataUpdate = useCallback(() => {
    // Function as dependency for useEffect
    setData(queryData);
  }, [queryData]);

  useEffect(() => {
    handleDataUpdate();
  }, [handleDataUpdate]);

  useEffect(() => {
    // other effects
  }, []);

  const handleReset = () => {
    // Function not related to effect
    setData([]);
    setLoading(false);
  };

  return (...);
};
```

### Import Order

1. React imports
2. Third party libraries
3. Components
4. Hooks
5. Utils/Constants
6. Types
7. Styles

### Testing

- Unit tests for utility functions.
- Component testing with React Testing Library.
- Minimum coverage: 80%.

---

## Project Scripts & Workflow

### Project Startup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Before Committing Code

```bash
# Format code
pnpm format

# Lint staged files
pnpm lint-staged
```

### Before Pushing Code

```bash
# Build the project to check for errors
pnpm build
```

### Workflow Rules

- Always run `pnpm dev` during development.
- Format code before committing.
- Build the project before pushing.
- Do not push code with build errors.

---

## How to Add a New Feature

1. Create a new folder in `features/` following the above structure.
2. Separate domain, application, infrastructure, and presentation clearly.
3. UI must follow atomic design.
4. If API is needed, create an endpoint in `pages/api/`.
5. Put shared logic in `shared/`.

---

## How to Add a New UI Component

1. Create a new folder in `components/` following atomic design.
2. Write tests for the component.
3. If the component is feature-specific, place it in `features/<feature>/presentation/`.

---

## Quick Start

```bash
pnpm install
pnpm dev
```

---

## License

MIT (or your license here)
