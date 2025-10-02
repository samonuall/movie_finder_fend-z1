"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

export function VideoCard({ videoId }: { videoId: string }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>The Matrix</CardTitle>
          <CardDescription>1999 • Sci-Fi</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon">
              ❤️
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <img src="/matrix.jpg" className="w-full rounded-lg" />
          <p className="mt-4">
            A computer hacker learns about the true nature of reality...
          </p>
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">⭐ 8.7/10</span>
          <Button size="sm">More Info</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
