"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    staleTime: Infinity, // Never refetch - data is immutable within session
    gcTime: Infinity, // Keep in cache during session (lost on page reload)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch when navigating back
    refetchOnReconnect: false,
  });

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // entries is an array, but we only observe one element
        const entry = entries[0];

        // If sentinel is visible and we're not already fetching
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // Trigger when sentinel is 200px away from viewport
        rootMargin: "200px",
        // Trigger as soon as any part is visible
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    // Cleanup: disconnect observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
      {/* Render all movies */}
      {allMovies.map((movie) => (
        <VideoCard key={movie.id} movie={movie} />
      ))}

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="h-10" />

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="mt-2 text-sm text-gray-600">Loading more movies...</p>
        </div>
      )}

      {/* End of feed indicator */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>No more movies to load</p>
        </div>
      )}
    </div>
  );
}
