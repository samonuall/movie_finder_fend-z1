"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { VideoCard } from "./video-card";
import { Pill } from "@/components/ui/pill";
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

export function ScrollFeed() {
  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    return (
      <div className="flex items-center justify-center h-full">
        <Pill isLoading loadingText="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Pill variant="dark">
          <p className="text-sm text-red-400">
            Error loading movies: {error.message}
          </p>
        </Pill>
      </div>
    );
  }

  // Flatten all pages into a single array of movies
  const allMovies = data.pages.flatMap((page) => page.movies);

  return (
    <div
      className="h-full overflow-y-scroll snap-y snap-mandatory relative"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Render all movies */}
      {allMovies.map((movie, index) => (
        <div
          key={movie.id}
          className="min-h-full snap-start snap-always flex items-center justify-center px-4 py-16"
        >
          <div className="w-full max-w-4xl">
            <VideoCard movie={movie} />
          </div>
        </div>
      ))}

      {/* Sentinel element for intersection observer - hidden, just for triggering */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading indicator - fixed position overlay */}
      {isFetchingNextPage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Pill isLoading loadingText="Loading more movies..." />
        </div>
      )}

      {/* End of feed indicator */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="h-full snap-start flex items-center justify-center">
          <Pill variant="light">
            <p className="text-sm text-gray-500">No more movies to load</p>
          </Pill>
        </div>
      )}
    </div>
  );
}
