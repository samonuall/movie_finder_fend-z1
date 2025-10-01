# Shared Test Mocks

This directory contains reusable mock setups for testing. Just import the file and the mocks are automatically set up!

## Quick Start

```typescript
// Import at the top of your test file (this sets up ALL mocks automatically)
import '../../__mocks__'

// Optionally import helpers for assertions
import { mockRouter, mockSupabaseUser } from '../../__mocks__'

describe('My Component', () => {
  it('does something', () => {
    // All mocks are already set up!
    expect(mockRouter.push).toHaveBeenCalled()
  })
})
```

## Available Files

- **`index.ts`** - Import this to set up ALL mocks (recommended)
- **`navigation.ts`** - Import this to set up only Next.js navigation mocks
- **`supabase.ts`** - Import this to set up only Supabase mocks

## What Gets Mocked

When you `import '../../__mocks__'`, these are automatically mocked:

- ✅ `next/navigation` (useRouter, usePathname, redirect)
- ✅ `@/lib/supabase/server` (server-side Supabase client)
- ✅ `@/lib/supabase/client` (client-side Supabase client)

## Using Mock Helpers

### Navigation

```typescript
import '../../__mocks__'
import { mockRouter, mockUsePathname, setMockPathname, resetNavigationMocks } from '../../__mocks__'

it('navigates correctly', () => {
  // Set a custom pathname if needed
  setMockPathname('/different-route')
  
  // Your test code that triggers navigation
  
  // Check navigation was called
  expect(mockRouter.push).toHaveBeenCalledWith('/home')
})

afterEach(() => {
  // Clean up between tests
  resetNavigationMocks()
})
```

### Supabase

```typescript
import '../../__mocks__'
import { mockSupabaseUser, createMockUser, createMockAuthResponse } from '../../__mocks__'

it('handles authenticated user', () => {
  // Use default mock user
  expect(result.email).toBe(mockSupabaseUser.email)
})

it('handles custom user', () => {
  // Create a custom user for specific test scenarios
  const customUser = createMockUser({ 
    email: 'custom@example.com',
    id: 'custom-id' 
  })
  // Use in your test...
})
```

## Complete Example

```typescript
// Import mocks at the top (sets up all jest.mock calls)
import '../../__mocks__'

// Import helpers for assertions
import { mockRouter, mockSupabaseUser, resetNavigationMocks } from '../../__mocks__'

// Import testing utilities
import { render, screen } from '@testing-library/react'

// Import your component
import MyPage from '@/app/my-page/page'

describe('MyPage', () => {
  afterEach(() => {
    resetNavigationMocks()
  })

  it('renders with user data', async () => {
    const PageComponent = await MyPage()
    render(PageComponent)
    
    expect(screen.getByText(mockSupabaseUser.email)).toBeInTheDocument()
  })

  it('navigates on click', async () => {
    const PageComponent = await MyPage()
    const { getByRole } = render(PageComponent)
    
    const button = getByRole('button')
    button.click()
    
    expect(mockRouter.push).toHaveBeenCalledWith('/next-page')
  })
})
```

## How It Works

Each mock file (e.g., `navigation.ts`, `supabase.ts`) contains:
1. **Mock instances** - The actual mock functions you can assert against
2. **jest.mock() calls** - Automatically set up when you import the file
3. **Helper functions** - Utilities to customize mocks or reset them

When you import a mock file, the `jest.mock()` calls are executed (Jest hoists them automatically), and you get access to the mock instances for assertions.

## Need Only Specific Mocks?

```typescript
// Just navigation
import '../../__mocks__/navigation'

// Just Supabase
import '../../__mocks__/supabase'

// Both (same as importing from index)
import '../../__mocks__'
```
