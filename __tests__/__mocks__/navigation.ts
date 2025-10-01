// Next.js navigation mocks for testing
// Import this file to automatically set up all navigation mocks
// Usage: import '../../__mocks__/navigation'

// Mock instances
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
}

export const mockRedirect = jest.fn()
export const mockUsePathname = jest.fn(() => '/scroll')
export const mockUseRouter = jest.fn(() => mockRouter)

// Set up the mock
jest.mock('next/navigation', () => ({
  redirect: mockRedirect,
  usePathname: mockUsePathname,
  useRouter: mockUseRouter,
}))

// Helper functions
export const setMockPathname = (pathname: string) => {
  mockUsePathname.mockReturnValue(pathname)
}

export const resetNavigationMocks = () => {
  mockRouter.push.mockClear()
  mockRouter.replace.mockClear()
  mockRouter.refresh.mockClear()
  mockRouter.back.mockClear()
  mockRouter.forward.mockClear()
  mockRouter.prefetch.mockClear()
  mockRedirect.mockClear()
  mockUsePathname.mockClear()
  mockUseRouter.mockClear()
}

