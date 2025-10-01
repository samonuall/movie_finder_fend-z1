// Import this file to set up ALL common mocks
// Usage: import '../../__mocks__'
// 
// This will automatically mock:
// - next/navigation (useRouter, usePathname, redirect)
// - @/lib/supabase/server (server-side Supabase)
// - @/lib/supabase/client (client-side Supabase)
//
// You can then import helpers for assertions:
// import { mockRouter, mockSupabaseUser } from '../../__mocks__'

import './navigation'
import './supabase'

// Re-export everything for convenience
export * from './navigation'
export * from './supabase'


