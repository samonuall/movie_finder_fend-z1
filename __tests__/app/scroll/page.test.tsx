// Import mocks (this automatically sets up jest.mock for navigation and Supabase)
import '../../__mocks__'

// Import testing utilities
import { render, screen } from '@testing-library/react'

// Import the component to test
import ScrollPage from '@/app/scroll/page'

describe('Scroll Page', () => {
  it('renders the navbar component', async () => {
    // Render the page component (it's async)
    const PageComponent = await ScrollPage()
    render(PageComponent)

    // Check if navbar is present by looking for a nav element
    const navbar = screen.getByRole('navigation')
    expect(navbar).toBeInTheDocument()
  })

  it('renders without crashing when user is authenticated', async () => {
    const PageComponent = await ScrollPage()
    const { container } = render(PageComponent)
    
    // Check that the page rendered
    expect(container).toBeInTheDocument()
  })
})
