// Import mocks (this automatically sets up jest.mock for navigation and Supabase)
import "../../__mocks__";

// Import testing utilities
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the component to test
import ScrollPage from "@/app/scroll/page";

// Helper to wrap component with QueryClientProvider
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("Scroll Page", () => {
  it("renders the navbar component", async () => {
    // Render the page component (it's async)
    const PageComponent = await ScrollPage();
    renderWithQueryClient(PageComponent);

    // Check if navbar is present by looking for a nav element
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("renders without crashing when user is authenticated", async () => {
    const PageComponent = await ScrollPage();
    const { container } = renderWithQueryClient(PageComponent);

    // Check that the page rendered
    expect(container).toBeInTheDocument();
  });
});
