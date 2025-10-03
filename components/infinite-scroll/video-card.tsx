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
    <div>
      <Card>
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
          <img
            src="/placeholder.jpg"
            alt={movie.title}
            className="w-full rounded-lg"
          />
          <p className="mt-4">{movie.description}</p>
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">⭐ 8.7/10</span>
          <Button size="sm">More Info</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
