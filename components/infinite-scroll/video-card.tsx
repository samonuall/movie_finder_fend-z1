"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Movie } from "@/lib/types";

export function VideoCard({ movie }: { movie: Movie }) {
  return (
    <Card className="max-h-[90vh] overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[60vh] w-full overflow-hidden bg-black">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={movie.videoUrl}
            title={`${movie.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
}
