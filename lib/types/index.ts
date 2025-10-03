// Common types for the application

export type MovieID = number;

export interface Interaction {
  input: number;
}

export interface Movie {
  id: MovieID;
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  videoUrl: string;
}
