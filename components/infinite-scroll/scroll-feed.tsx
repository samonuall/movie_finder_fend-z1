"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { VideoCard } from "./video-card";
import type { Movie, Interaction } from "@/lib/types";

interface FetchMoviesParams {
  pageParam: number;
}

async function fetchNextMovies({
  pageParam,
}: FetchMoviesParams): Promise<{ movies: Movie[] }> {
  // Generate interactions based on page number
  // For now using dummy data - later you'll generate these based on user behavior
  const interactions: Interaction[] = [
    { input: pageParam * 5 + 1 },
    { input: pageParam * 5 + 2 },
    { input: pageParam * 5 + 3 },
    { input: pageParam * 5 + 4 },
    { input: pageParam * 5 + 5 },
  ];

  const response = await fetch("/api/movies/next", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interactions }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return { movies: data.movies };
}

const MOVIE_FEED_KEY = "movieFeed";
const STORAGE_KEY = "react-query-movieFeed";

export function ScrollFeed() {
  const queryClient = useQueryClient();

  // Restore from localStorage on mount, depends on queryClient
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          queryClient.setQueryData([MOVIE_FEED_KEY], parsedData);
        } catch (e) {
          console.error("Failed to restore movie feed from localStorage", e);
        }
      }
    }
  }, [queryClient]);

  // Use useInfiniteQuery to fetch movie pages
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [MOVIE_FEED_KEY],
    queryFn: fetchNextMovies,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Always has next page (infinite recommendations)
      // Return the next page number
      return allPages.length;
    },
    staleTime: Infinity, // Never refetch - data is immutable
    gcTime: Infinity, // Keep in cache forever
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (data && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save movie feed to localStorage", e);
      }
    }
  }, [data]);

  if (status === "pending") {
    return <div className="text-center py-12">Loading movies...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading movies: {error.message}
      </div>
    );
  }

  // Flatten all pages into a single array of movies
  const allMovies = data.pages.flatMap((page) => page.movies);

  return (
    <div className="space-y-6">
      {allMovies.map((movie) => (
        <VideoCard key={movie.id} movie={movie} />
      ))}

      {/* Load More Button - you'll replace this with intersection observer */}
      <div className="text-center py-6">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More Movies"
              : "No more movies"}
        </button>
      </div>

      {isFetching && !isFetchingNextPage && (
        <div className="text-center py-4 text-sm text-gray-500">
          Refreshing...
        </div>
      )}
    </div>
  );
}
