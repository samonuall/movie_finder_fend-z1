// Import mocks (this automatically sets up jest.mock for navigation and Supabase)
import "../../__mocks__";

// Import testing utilities
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the component to test
import ScrollPage from "@/app/scroll/page";
import type { Movie } from "@/lib/types";

const originalFetch = global.fetch;
const originalIntersectionObserver = global.IntersectionObserver;

class IntersectionObserverMock {
  constructor() {}

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeAll(() => {
  // @ts-expect-error jsdom test environment does not implement IntersectionObserver
  global.IntersectionObserver = IntersectionObserverMock;
});

const mockMovie: Movie = {
  id: 1,
  title: "Mock Movie",
  description: "A mock movie used for testing the scroll page layout.",
  releaseDate: "2024-05-01",
  genre: "Adventure",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  rating: {
    source: "IMDb",
    score: 8.5,
    maxScore: 10,
    voteCount: 669000,
  },
  streamingProviders: [
    { id: "netflix", name: "Netflix", access: "subscription", price: "$15.49" },
    { id: "max", name: "Max", access: "subscription", price: "$15.99" },
    { id: "prime", name: "Prime Video", access: "rent", price: "$3.99" },
  ],
};

const setupFetchMock = () => {
  const response = {
    ok: true,
    json: async () => ({ movies: [mockMovie] }),
  } as unknown as Response;

  const fetchMock = jest.fn().mockResolvedValue(response);
  global.fetch = fetchMock;
  return fetchMock;
};

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
  afterAll(() => {
    global.fetch = originalFetch;
    // @ts-expect-error restoring mocked IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("renders the navbar component", async () => {
    setupFetchMock();
    // Render the page component (it's async)
    const PageComponent = await ScrollPage();
    renderWithQueryClient(PageComponent);

    // Check if navbar is present by looking for a nav element
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("renders without crashing when user is authenticated", async () => {
    setupFetchMock();
    const PageComponent = await ScrollPage();
    const { container } = renderWithQueryClient(PageComponent);

    // Check that the page rendered
    expect(container).toBeInTheDocument();
  });

  it("displays stationary detail and rating cards", async () => {
    const fetchMock = setupFetchMock();
    const PageComponent = await ScrollPage();
    renderWithQueryClient(PageComponent);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(await screen.findByText(mockMovie.title)).toBeInTheDocument();
    const roomCardTitle = await screen.findByText(mockMovie.title);
    const roomCard = roomCardTitle.closest(
      '[data-slot="card-header"]',
    )?.parentElement;
    expect(roomCard).toBeInTheDocument();

    const roomDescription = roomCard?.querySelector(
      '[data-slot="card-description"]',
    );
    expect(roomDescription).not.toBeNull();
    expect(roomDescription?.textContent).toContain("Adventure");

    expect(
      await screen.findByText(/Synopsis/i, { selector: "p" }),
    ).toBeInTheDocument();
    expect(await screen.findByText(mockMovie.description)).toBeInTheDocument();
    expect(await screen.findByText(/Streaming On/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/Ratings/i, {
        selector: '[data-slot="card-title"]',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Based on 669K verified ratings/i),
    ).toBeInTheDocument();
  });
});
