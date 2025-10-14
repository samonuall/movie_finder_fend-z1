import { NextResponse } from "next/server";
import type {
  Interaction,
  MovieID,
  Movie,
  MovieRating,
  StreamingProvider,
} from "@/lib/types";

// Mock function to call AI backend (will be replaced with actual API call)
async function getRecommendedMovieIds(
  interactions: Interaction[],
): Promise<MovieID[]> {
  // Simulate API call to AI backend
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock movie IDs
  return interactions.map((interaction) => interaction.input);
}

// Mock function to fetch movie metadata from Supabase (will be replaced with actual API call)
async function getMovieMetadata(movieId: MovieID) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const releaseYear = 2024 - ((movieId + 3) % 4);
  const genres = ["Action", "Drama", "Sci-Fi", "Comedy", "Adventure"];
  const genre = genres[movieId % genres.length];

  return {
    id: movieId,
    title: `${genre} Highlight ${movieId}`,
    description: `This is a description for movie ${movieId}. A thrilling ${genre.toLowerCase()} story that captivates audiences from start to finish.`,
    releaseDate: `${releaseYear}-03-15`,
    genre,
    videoUrl: "https://www.youtube.com/embed/Way9Dexny3w?si=c9SQJEmARtNg9-ef",
  } satisfies Omit<Movie, "rating" | "streamingProviders">;
}

// Mock function to fetch movie ratings from Supabase (will be replaced with actual API call)
async function getMovieRating(movieId: MovieID): Promise<MovieRating> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const baseScore = 7.5 + (movieId % 25) * 0.05;
  const score = Math.min(9.7, parseFloat(baseScore.toFixed(1)));
  const voteCount = 150_000 + movieId * 4_200;

  return {
    source: "IMDb",
    score,
    maxScore: 10,
    voteCount,
  };
}

// Mock function to fetch streaming providers from Supabase (will be replaced with actual API call)
async function getStreamingProviders(
  movieId: MovieID,
): Promise<StreamingProvider[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const catalog: StreamingProvider[] = [
    { id: "netflix", name: "Netflix", access: "subscription", price: "$15.49" },
    { id: "max", name: "Max", access: "subscription", price: "$15.99" },
    { id: "prime-video", name: "Prime Video", access: "rent", price: "$3.99" },
    { id: "apple-tv", name: "Apple TV", access: "rent", price: "$4.99" },
    { id: "hulu", name: "Hulu", access: "subscription", price: "$14.99" },
    { id: "peacock", name: "Peacock", access: "subscription", price: "$5.99" },
  ];

  const startIndex = movieId % catalog.length;
  const selections: StreamingProvider[] = [];

  for (let i = 0; i < 3; i += 1) {
    const provider = catalog[(startIndex + i) % catalog.length];
    selections.push(provider);
  }

  return selections;
}

// Mock function to combine the data into a single movie payload
async function getMovieDetails(movieId: MovieID): Promise<Movie> {
  const [metadata, rating, streamingProviders] = await Promise.all([
    getMovieMetadata(movieId),
    getMovieRating(movieId),
    getStreamingProviders(movieId),
  ]);

  return {
    ...metadata,
    rating,
    streamingProviders,
  } satisfies Movie;
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
