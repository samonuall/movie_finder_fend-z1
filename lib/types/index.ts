// Common types for the application

export type MovieID = number;

export interface Interaction {
  input: number;
}

export interface MovieRating {
  source: string;
  score: number;
  maxScore: number;
  voteCount: number;
}

export interface StreamingProvider {
  id: string;
  name: string;
  access: string;
  price?: string;
}

export interface Movie {
  id: MovieID;
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  videoUrl: string;
  rating: MovieRating;
  streamingProviders: StreamingProvider[];
}
