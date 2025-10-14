// Example test showing how to use mock helpers for assertions
import "../../__mocks__";
import {
  mockRouter,
  mockSupabaseUser,
  resetNavigationMocks,
} from "../../__mocks__";

import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollPage from "@/app/scroll/page";

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ movies: [] }),
  } as unknown as Response);
});

afterAll(() => {
  global.fetch = originalFetch;
});

// Helper to wrap component with QueryClientProvider
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("Scroll Page - Mock Examples", () => {
  afterEach(() => {
    // Clean up mocks between tests
    resetNavigationMocks();
  });

  it("example: checking navigation calls", async () => {
    const PageComponent = await ScrollPage();
    renderWithQueryClient(PageComponent);

    // You can now easily check if navigation methods were called
    // Example (this won't actually pass, just showing the pattern):
    // expect(mockRouter.push).toHaveBeenCalledWith('/some-route')
    // expect(mockRouter.refresh).toHaveBeenCalled()
  });

  it("example: using mock user data", async () => {
    const PageComponent = await ScrollPage();
    renderWithQueryClient(PageComponent);

    // You can access the mock user data in assertions
    expect(mockSupabaseUser.email).toBe("test@example.com");
    expect(mockSupabaseUser.id).toBe("123");
  });
});
