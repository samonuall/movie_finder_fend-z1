import { NextResponse } from "next/server";
import { fetchRandomMovies } from "@/lib/movies";
import type { Interaction } from "@/lib/types";

const EXPECTED_INTERACTION_COUNT = 5;
const MOVIE_RESPONSE_COUNT = 5;

export async function POST(request: Request) {
  try {
    const body = await safeParseJson(request);
    const interactions = extractInteractions(body);

    if (interactions.length !== EXPECTED_INTERACTION_COUNT) {
      return NextResponse.json(
        {
          error: `Expected exactly ${EXPECTED_INTERACTION_COUNT} interactions`,
        },
        { status: 400 },
      );
    }

    const movies = await fetchRandomMovies(MOVIE_RESPONSE_COUNT);

    if (!movies.length) {
      return NextResponse.json(
        { error: "No movies available" },
        { status: 503 },
      );
    }

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Error fetching next movies:", error);
    const detail =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : undefined;
    return NextResponse.json(
      {
        error: "Failed to fetch movie recommendations",
        ...(detail ? { detail } : {}),
      },
      { status: 500 },
    );
  }
}

async function safeParseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function extractInteractions(payload: unknown): Interaction[] {
  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray((payload as { interactions?: unknown }).interactions)
  ) {
    return [];
  }

  return (payload as { interactions: Interaction[] }).interactions.filter(
    (interaction): interaction is Interaction =>
      interaction !== null &&
      typeof interaction === "object" &&
      typeof interaction.input === "number",
  );
}
