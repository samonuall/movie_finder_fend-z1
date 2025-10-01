// Example test showing how to use mock helpers for assertions
import '../../__mocks__'
import { mockRouter, mockSupabaseUser, resetNavigationMocks } from '../../__mocks__'

import { render } from '@testing-library/react'
import ScrollPage from '@/app/scroll/page'

describe('Scroll Page - Mock Examples', () => {
  afterEach(() => {
    // Clean up mocks between tests
    resetNavigationMocks()
  })

  it('example: checking navigation calls', async () => {
    const PageComponent = await ScrollPage()
    render(PageComponent)
    
    // You can now easily check if navigation methods were called
    // Example (this won't actually pass, just showing the pattern):
    // expect(mockRouter.push).toHaveBeenCalledWith('/some-route')
    // expect(mockRouter.refresh).toHaveBeenCalled()
  })

  it('example: using mock user data', async () => {
    const PageComponent = await ScrollPage()
    render(PageComponent)
    
    // You can access the mock user data in assertions
    expect(mockSupabaseUser.email).toBe('test@example.com')
    expect(mockSupabaseUser.id).toBe('123')
  })
})
