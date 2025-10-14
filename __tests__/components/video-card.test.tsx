import { render, screen } from "@testing-library/react";
import { VideoCard } from "@/components/infinite-scroll/video-card";
import type { Movie } from "@/lib/types";

describe("VideoCard", () => {
  it("renders movie trailer iframe", () => {
    const movie: Movie = {
      id: 42,
      title: "Test Trailer",
      description: "A test description",
      releaseDate: "2024-05-01",
      genre: "Action",
      videoUrl: "https://www.youtube.com/embed/test123",
      rating: {
        source: "TMDb",
        score: 8,
        maxScore: 10,
        voteCount: 123,
      },
      streamingProviders: [
        { id: "1", name: "Netflix", access: "subscription" },
      ],
    };

    render(<VideoCard movie={movie} />);

    const iframe = screen.getByTitle(
      "Test Trailer trailer",
    ) as HTMLIFrameElement;

    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toBe(movie.videoUrl);
    expect(iframe).toHaveAttribute("allowFullScreen", "");
  });
});
