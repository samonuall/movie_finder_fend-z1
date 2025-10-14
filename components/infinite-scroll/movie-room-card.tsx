"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Movie } from "@/lib/types";

function formatAccessLabel(access: string, price?: string) {
  const capitalized = access.charAt(0).toUpperCase() + access.slice(1);
  if (!price) {
    return capitalized;
  }
  return `${capitalized} • ${price}`;
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

interface MovieRoomCardProps {
  movie: Movie;
}

export function MovieRoomCard({ movie }: MovieRoomCardProps) {
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
          <p className="text-sm leading-relaxed text-black/80">
            {movie.description}
          </p>
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
                  {formatAccessLabel(provider.access, provider.price)}
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
