"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pill } from "@/components/ui/pill";
import { MovieRoomCard } from "./movie-room-card";
import { MovieRatingsCard } from "./movie-ratings-card";
import { VideoCard } from "./video-card";
import type { Interaction, Movie, MovieID } from "@/lib/types";

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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoNodeRegistry = useRef<Map<MovieID, HTMLDivElement>>(new Map());
  const [activeMovieId, setActiveMovieId] = useState<MovieID | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [MOVIE_FEED_KEY],
    queryFn: fetchNextMovies,
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const allMovies = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.movies);
  }, [data]);

  useEffect(() => {
    if (allMovies.length === 0) {
      setActiveMovieId(null);
      return;
    }

    setActiveMovieId((current) => {
      if (current && allMovies.some((movie) => movie.id === current)) {
        return current;
      }
      return allMovies[0].id;
    });
  }, [allMovies]);

  const registerVideoNode = useCallback(
    (movieId: MovieID) => (node: HTMLDivElement | null) => {
      const registry = videoNodeRegistry.current;
      if (node) {
        registry.set(movieId, node);
        observerRef.current?.observe(node);
      } else {
        const existing = registry.get(movieId);
        if (existing) {
          observerRef.current?.unobserve(existing);
          registry.delete(movieId);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const [mostVisible] = visibleEntries;
        if (!mostVisible) return;

        const idAttr = mostVisible.target.getAttribute("data-movie-id");
        if (!idAttr) return;

        const movieId = Number(idAttr) as MovieID;
        setActiveMovieId((current) =>
          current === movieId ? current : movieId,
        );
      },
      { root, threshold: [0.55, 0.75, 0.9] },
    );

    videoNodeRegistry.current.forEach((node) => observer.observe(node));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [allMovies.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, allMovies.length]);

  const activeMovie = useMemo(() => {
    if (!allMovies.length) return null;
    if (activeMovieId === null) return allMovies[0];
    return (
      allMovies.find((movie) => movie.id === activeMovieId) ?? allMovies[0]
    );
  }, [activeMovieId, allMovies]);

  if (status === "pending") {
    return (
      <div className="flex h-full items-center justify-center">
        <Pill isLoading loadingText="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Pill variant="dark">
          <p className="text-sm text-red-400">
            Error loading movies: {error.message}
          </p>
        </Pill>
      </div>
    );
  }

  if (!activeMovie) {
    return (
      <div className="flex h-full items-center justify-center">
        <Pill variant="light">
          <p className="text-sm text-gray-500">No movies to display</p>
        </Pill>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-4 py-6 lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,300px)] lg:items-center lg:gap-6">
        <MovieRoomCard movie={activeMovie} />

        <div
          ref={scrollContainerRef}
          className="flex h-full min-h-0 flex-1 snap-y snap-mandatory flex-col gap-12 overflow-y-scroll scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {allMovies.map((movie) => (
            <div
              key={movie.id}
              data-movie-id={movie.id}
              ref={registerVideoNode(movie.id)}
              className="min-h-full snap-start snap-always"
            >
              <VideoCard movie={movie} />
            </div>
          ))}
          <div ref={sentinelRef} className="h-1 w-full" />
          {!hasNextPage && allMovies.length > 0 && (
            <div className="flex h-full min-h-[30vh] items-center justify-center">
              <Pill variant="light">
                <p className="text-sm text-gray-500">No more movies to load</p>
              </Pill>
            </div>
          )}
        </div>

        <MovieRatingsCard rating={activeMovie.rating} />
      </div>

      {isFetchingNextPage && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform">
          <Pill isLoading loadingText="Loading more movies..." />
        </div>
      )}
    </div>
  );
}
