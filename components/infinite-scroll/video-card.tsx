"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/types";

export function VideoCard({ movie }: { movie: Movie }) {
  const releaseYear = new Date(movie.releaseDate).getFullYear();

  return (
    <Card className="max-h-[90vh] overflow-hidden">
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>
          {releaseYear} • {movie.genre}
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            ❤️
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {/* Video embed with percentage-based height */}
        <div className="relative w-full h-[50vh] rounded-lg overflow-hidden bg-gray-900">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={movie.videoUrl}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="mt-4 line-clamp-3">{movie.description}</p>
      </CardContent>

      <CardFooter className="justify-between">
        <span className="text-sm text-muted-foreground">⭐ 8.7/10</span>
        <Button size="sm">More Info</Button>
      </CardFooter>
    </Card>
  );
}
