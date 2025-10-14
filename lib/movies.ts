import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { Movie, ProviderAccess, StreamingProvider } from "@/lib/types";

type OfferType = "buy" | "rent" | "flatrate" | "free";

const OFFER_ACCESS_LABEL: Record<OfferType, ProviderAccess> = {
  flatrate: "subscription",
  free: "free",
  rent: "rent",
  buy: "buy",
};

const ACCESS_PRIORITY: Record<ProviderAccess, number> = {
  subscription: 0,
  free: 1,
  rent: 2,
  buy: 3,
};

const OFFER_PRIORITY: Record<OfferType, number> = {
  flatrate: 0,
  free: 1,
  rent: 2,
  buy: 3,
};

const MOVIE_SAMPLE_MULTIPLIER = 3;
const MOVIE_SAMPLE_UPPER_BOUND = 50;

type GenreValue = { id?: number; name?: string } | null;

type MovieRow = {
  id: number;
  title: string | null;
  original_title: string | null;
  overview: string | null;
  release_date: string | null;
  trailer_id: string | null;
  genres: GenreValue[] | null;
  movie_metrics: {
    vote_average: number | null;
    vote_count: number | null;
  } | null;
  movie_offers: Array<{
    offer_type: OfferType | null;
    provider: {
      provider_id: number | null;
      provider_name: string | null;
      display_priority: number | null;
    } | null;
  }> | null;
};

const MOVIE_SELECT = `
  id,
  title,
  original_title,
  overview,
  release_date,
  trailer_id,
  genres,
  movie_metrics!inner(
    vote_average,
    vote_count
  ),
  movie_offers(
    offer_type,
    provider:providers(
      provider_id,
      provider_name,
      display_priority
    )
  )
`.replace(/\s+/g, " ");

export async function fetchRandomMovies(limit: number): Promise<Movie[]> {
  if (limit <= 0) {
    return [];
  }

  const supabase = createServiceRoleClient();

  const { count, error: countError } = await supabase
    .from("movies")
    .select("id", { count: "exact", head: true })
    .not("trailer_id", "is", null)
    .neq("trailer_id", "");

  if (countError) {
    throw new Error(`Failed to count movies: ${countError.message}`);
  }

  const availableCount = count ?? 0;
  if (availableCount === 0) {
    return [];
  }

  const sampleSize = Math.min(
    MOVIE_SAMPLE_UPPER_BOUND,
    Math.max(limit * MOVIE_SAMPLE_MULTIPLIER, limit),
    availableCount,
  );
  const maxStartIndex = Math.max(availableCount - sampleSize, 0);
  const rangeStart =
    maxStartIndex === 0 ? 0 : Math.floor(Math.random() * (maxStartIndex + 1));
  const rangeEnd = rangeStart + sampleSize - 1;

  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .not("trailer_id", "is", null)
    .neq("trailer_id", "")
    .order("id", { ascending: true })
    .range(rangeStart, rangeEnd);

  if (error) {
    throw new Error(`Failed to fetch movies: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  const shuffled = shuffle(rows);
  const selected = shuffled.slice(0, limit);

  return selected
    .map(normalizeMovie)
    .filter((movie): movie is Movie => movie !== null);
}

function normalizeMovie(row: MovieRow): Movie | null {
  if (!row.trailer_id || !row.movie_metrics) {
    return null;
  }

  const title = row.title ?? row.original_title ?? "Untitled";
  const description = row.overview ?? "No description available.";
  const releaseDate = row.release_date ?? "";
  const genres = extractGenreNames(row.genres);

  const voteAverage = row.movie_metrics.vote_average ?? 0;
  const voteCount = row.movie_metrics.vote_count ?? 0;
  const roundedScore = Math.round(voteAverage * 10) / 10;

  const streamingProviders = buildStreamingProviders(row.movie_offers);

  return {
    id: row.id,
    title,
    description,
    releaseDate,
    genre: genres.length ? genres.join(", ") : "Unknown",
    videoUrl: buildYouTubeEmbedUrl(row.trailer_id),
    rating: {
      source: "TMDb",
      score: roundedScore,
      maxScore: 10,
      voteCount,
    },
    streamingProviders,
  };
}

function extractGenreNames(genres: MovieRow["genres"]) {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      if (typeof entry.name === "string" && entry.name.trim().length > 0) {
        return entry.name.trim();
      }
      return null;
    })
    .filter((name): name is string => Boolean(name));
}

function buildStreamingProviders(
  offers: MovieRow["movie_offers"],
): StreamingProvider[] {
  if (!Array.isArray(offers)) return [];

  const providers = new Map<string, ProviderCandidate>();

  offers.forEach((offer) => {
    if (!offer?.provider) return;
    if (!isSupportedOfferType(offer.offer_type)) return;

    const { provider_id: providerId, provider_name: providerName } =
      offer.provider;
    if (!providerId || !providerName) return;

    const access = OFFER_ACCESS_LABEL[offer.offer_type];
    const offerPriority = OFFER_PRIORITY[offer.offer_type];
    const displayPriority = extractDisplayPriority(
      offer.provider.display_priority,
    );
    const providerKey = String(providerId);

    const candidate: ProviderCandidate = {
      id: providerKey,
      name: providerName,
      access,
      accessPriority: ACCESS_PRIORITY[access],
      offerPriority,
      displayPriority,
    };

    const existing = providers.get(providerKey);

    if (!existing || isCandidatePreferred(candidate, existing)) {
      providers.set(providerKey, candidate);
    }
  });

  const grouped = new Map<ProviderAccess, ProviderCandidate[]>();

  providers.forEach((provider) => {
    const list = grouped.get(provider.access);
    if (list) {
      list.push(provider);
    } else {
      grouped.set(provider.access, [provider]);
    }
  });

  return Array.from(grouped.entries())
    .sort(
      ([accessA], [accessB]) =>
        ACCESS_PRIORITY[accessA] - ACCESS_PRIORITY[accessB],
    )
    .flatMap(([, entries]) =>
      entries
        .sort(compareCandidates)
        .slice(0, 2)
        .map(({ id, name, access }) => ({
          id,
          name,
          access,
        })),
    );
}

function isSupportedOfferType(value: unknown): value is OfferType {
  return (
    value === "buy" ||
    value === "rent" ||
    value === "flatrate" ||
    value === "free"
  );
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildYouTubeEmbedUrl(trailerId: string) {
  const trimmed = trailerId.trim();
  return `https://www.youtube.com/embed/${trimmed}`;
}

type ProviderCandidate = {
  id: string;
  name: string;
  access: ProviderAccess;
  accessPriority: number;
  offerPriority: number;
  displayPriority: number | null;
};

function extractDisplayPriority(value: unknown) {
  return typeof value === "number" ? value : null;
}

function compareCandidates(a: ProviderCandidate, b: ProviderCandidate) {
  const displayDiff =
    (a.displayPriority ?? Number.POSITIVE_INFINITY) -
    (b.displayPriority ?? Number.POSITIVE_INFINITY);

  if (displayDiff !== 0) {
    return displayDiff;
  }

  if (a.offerPriority !== b.offerPriority) {
    return a.offerPriority - b.offerPriority;
  }

  return a.name.localeCompare(b.name);
}

function isCandidatePreferred(
  candidate: ProviderCandidate,
  existing: ProviderCandidate,
) {
  if (candidate.accessPriority !== existing.accessPriority) {
    return candidate.accessPriority < existing.accessPriority;
  }

  const candidateDisplay =
    candidate.displayPriority ?? Number.POSITIVE_INFINITY;
  const existingDisplay = existing.displayPriority ?? Number.POSITIVE_INFINITY;

  if (candidateDisplay !== existingDisplay) {
    return candidateDisplay < existingDisplay;
  }

  if (candidate.offerPriority !== existing.offerPriority) {
    return candidate.offerPriority < existing.offerPriority;
  }

  return candidate.name.localeCompare(existing.name) < 0;
}
