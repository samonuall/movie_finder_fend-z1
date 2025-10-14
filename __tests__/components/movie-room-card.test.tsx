import { fireEvent, render, screen } from "@testing-library/react";
import { MovieRoomCard } from "@/components/infinite-scroll/movie-room-card";
import type { Movie } from "@/lib/types";

function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: "Example Movie",
    description: "A concise description.",
    releaseDate: "2024-01-01",
    genre: "Drama",
    videoUrl: "https://example.com",
    rating: {
      source: "TMDb",
      score: 7.5,
      maxScore: 10,
      voteCount: 1000,
    },
    streamingProviders: [
      { id: "1", name: "Provider A", access: "subscription" },
    ],
    ...overrides,
  };
}

describe("MovieRoomCard", () => {
  it("collapses long synopsis and toggles visibility", () => {
    const longDescription =
      "An epic tale unfolds across galaxies, intertwining the destinies of explorers, dreamers, and unlikely heroes as they confront impossible odds. Their choices ripple through time, testing courage, loyalty, and the enduring power of hope. When ancient secrets surface and alliances fracture, the crew must navigate moral gray areas that determine the fate of countless worlds.";

    render(
      <MovieRoomCard movie={createMovie({ description: longDescription })} />,
    );

    const synopsis = screen.getByTestId("movie-synopsis");
    expect(synopsis).toHaveTextContent(/\.\.\.$/);
    expect(synopsis).not.toHaveTextContent(longDescription);

    const toggle = screen.getByRole("button", { name: /more/i });
    fireEvent.click(toggle);

    expect(screen.getByTestId("movie-synopsis")).toHaveTextContent(
      longDescription,
    );
    expect(
      screen.getByRole("button", { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it("renders short synopsis without toggle", () => {
    render(<MovieRoomCard movie={createMovie()} />);

    expect(screen.getByTestId("movie-synopsis")).toHaveTextContent(
      "A concise description.",
    );
    expect(screen.queryByRole("button", { name: /more/i })).toBeNull();
  });
});
