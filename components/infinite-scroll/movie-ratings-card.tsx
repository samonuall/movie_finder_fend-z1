"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Movie } from "@/lib/types";

function formatVoteCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

interface MovieRatingsCardProps {
  rating: Movie["rating"];
}

export function MovieRatingsCard({ rating }: MovieRatingsCardProps) {
  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader className="border-b border-black/10">
        <CardTitle className="text-base font-semibold tracking-tight uppercase text-muted-foreground">
          Ratings
        </CardTitle>
        <CardDescription className="text-sm font-medium text-black/80">
          {rating.source}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col">
          <span className="text-5xl font-bold text-black">
            {rating.score.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            out of {rating.maxScore}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on {formatVoteCount(rating.voteCount)} verified ratings
        </p>
      </CardContent>
    </Card>
  );
}

export default MovieRatingsCard;
