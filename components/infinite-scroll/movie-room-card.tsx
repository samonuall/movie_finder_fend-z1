"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Movie, ProviderAccess } from "@/lib/types";

const DESCRIPTION_TRUNCATE_LENGTH = 260;

function formatAccessLabel(access: ProviderAccess) {
  const capitalized = access.charAt(0).toUpperCase() + access.slice(1);
  return capitalized;
}

function formatReleaseDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function truncateDescription(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  const trimmed = value.slice(0, limit).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  const safeSlice =
    lastSpace > limit * 0.6 ? trimmed.slice(0, lastSpace) : trimmed;

  return `${safeSlice.replace(/[.,;:!?]$/, "")}...`;
}

interface DescriptionState {
  text: string;
  hasToggle: boolean;
}

interface MovieRoomCardProps {
  movie: Movie;
}

export function MovieRoomCard({ movie }: MovieRoomCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = useMemo<DescriptionState>(() => {
    const normalized = movie.description.trim();

    if (normalized.length <= DESCRIPTION_TRUNCATE_LENGTH) {
      return { text: normalized, hasToggle: false };
    }

    if (isExpanded) {
      return { text: normalized, hasToggle: true };
    }

    return {
      text: truncateDescription(normalized, DESCRIPTION_TRUNCATE_LENGTH),
      hasToggle: true,
    };
  }, [isExpanded, movie.description]);

  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader className="border-b border-black/10">
        <CardTitle className="text-lg font-semibold text-black">
          {movie.title}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-black/70">
          {formatReleaseDate(movie.releaseDate)} • {movie.genre}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Synopsis
          </p>
          <p
            data-testid="movie-synopsis"
            className="text-sm leading-relaxed text-black/80"
          >
            {description.text}
          </p>
          {description.hasToggle ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 text-xs font-medium text-primary"
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "More"}
            </Button>
          ) : null}
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Streaming On
          </p>
          <ul className="space-y-2">
            {movie.streamingProviders.map((provider) => (
              <li
                key={provider.id}
                className="flex items-center justify-between rounded-lg border border-black/10 bg-white/50 px-3 py-2 text-sm shadow-sm"
              >
                <span className="font-medium text-black">{provider.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatAccessLabel(provider.access)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

export default MovieRoomCard;
