// Supabase mocks for testing
// Import this file to automatically set up all Supabase mocks
// Usage: import '../../__mocks__/supabase'

// Mock data
export const mockSupabaseUser = {
  id: '123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2024-01-01T00:00:00.000Z',
}

export const mockSupabaseAuthResponse = {
  data: { user: mockSupabaseUser },
  error: null,
}

export const mockSupabaseErrorResponse = {
  data: { user: null },
  error: { message: 'Not authenticated', status: 401 },
}

// Set up the mocks
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue(mockSupabaseAuthResponse),
    },
  })),
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getUser: jest.fn().mockResolvedValue(mockSupabaseAuthResponse),
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: mockSupabaseUser } },
        error: null,
      }),
    },
  })),
}))

// Helper functions
export const createMockUser = (overrides: Partial<typeof mockSupabaseUser> = {}) => ({
  ...mockSupabaseUser,
  ...overrides,
})

export const createMockAuthResponse = (user: typeof mockSupabaseUser | null = mockSupabaseUser) => ({
  data: { user },
  error: user ? null : { message: 'Not authenticated', status: 401 },
})

