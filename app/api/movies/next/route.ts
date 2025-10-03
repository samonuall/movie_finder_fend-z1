import { NextResponse } from "next/server";
import type { Interaction, MovieID, Movie } from "@/lib/types";

// Mock function to call AI backend (will be replaced with actual API call)
async function getRecommendedMovieIds(
  interactions: Interaction[],
): Promise<MovieID[]> {
  // Simulate API call to AI backend
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock movie IDs
  return interactions.map((interaction) => interaction.input);
}

// Mock function to fetch movie details from TMDB (will be replaced with actual API call)
async function getMovieDetails(movieId: MovieID): Promise<Movie> {
  // Simulate API call to TMDB/YouTube
  await new Promise((resolve) => setTimeout(resolve, 200));

  const movieDetails = {
    id: movieId,
    title: `Movie ${movieId}`,
    description: `This is a description for movie ${movieId}. A thrilling story that captivates audiences.`,
    releaseDate: "2023-01-15",
    genre: "Action",
    videoUrl: "https://www.youtube.com/embed/Way9Dexny3w?si=c9SQJEmARtNg9-ef",
  };

  // Return mock movie data with embedded YouTube video
  return movieDetails;
}

export async function POST(request: Request) {
  try {
    // Parse the request body to get interactions
    const body = await request.json();
    const interactions: Interaction[] = body.interactions || [];

    // Validate interactions
    if (interactions.length !== 5) {
      return NextResponse.json(
        { error: "Expected exactly 5 interactions" },
        { status: 400 },
      );
    }

    // Step 1: Get recommended movie IDs from AI backend
    const movieIds = await getRecommendedMovieIds(interactions);

    // Step 2: Fetch movie details for each ID from TMDB
    const moviesPromises = movieIds.map((id) => getMovieDetails(id));
    const movies = await Promise.all(moviesPromises);

    // Step 3: Return the complete movie data to client
    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Error fetching next movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie recommendations" },
      { status: 500 },
    );
  }
}
