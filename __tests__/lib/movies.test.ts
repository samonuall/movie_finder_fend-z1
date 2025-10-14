import { fetchRandomMovies } from "@/lib/movies";
import type { Movie } from "@/lib/types";

const mockFrom = jest.fn();

jest.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleClient: jest.fn(() => ({ from: mockFrom })),
}));

type CountQueryResult = {
  count?: number | null;
  error?: { message: string } | null;
};

type CountQueryBuilder = {
  select: jest.Mock<CountQueryBuilder, unknown[]>;
  not: jest.Mock<CountQueryBuilder, unknown[]>;
  neq: jest.Mock<Promise<CountQueryResult>, unknown[]>;
};

function createCountBuilder(result: CountQueryResult): CountQueryBuilder {
  const builder: Partial<CountQueryBuilder> = {};

  builder.select = jest.fn(() => builder as CountQueryBuilder);
  builder.not = jest.fn(() => builder as CountQueryBuilder);
  builder.neq = jest.fn(() => Promise.resolve(result));

  return builder as CountQueryBuilder;
}

type DataQueryResult = { data: unknown; error: { message: string } | null };

type DataQueryBuilder = {
  select: jest.Mock<DataQueryBuilder, unknown[]>;
  not: jest.Mock<DataQueryBuilder, unknown[]>;
  neq: jest.Mock<DataQueryBuilder, unknown[]>;
  order: jest.Mock<DataQueryBuilder, unknown[]>;
  range: jest.Mock<Promise<DataQueryResult>, unknown[]>;
};

function createDataBuilder(result: DataQueryResult): DataQueryBuilder {
  const builder: Partial<DataQueryBuilder> = {};

  builder.select = jest.fn(() => builder as DataQueryBuilder);
  builder.not = jest.fn(() => builder as DataQueryBuilder);
  builder.neq = jest.fn(() => builder as DataQueryBuilder);
  builder.order = jest.fn(() => builder as DataQueryBuilder);
  builder.range = jest.fn(() => Promise.resolve(result));

  return builder as DataQueryBuilder;
}

describe("fetchRandomMovies", () => {
  let mathRandomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
    mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  it("normalizes Supabase movie rows", async () => {
    mockFrom
      .mockImplementationOnce(() =>
        createCountBuilder({ count: 3, error: null }),
      )
      .mockImplementationOnce(() =>
        createDataBuilder({
          data: [
            {
              id: 123,
              title: "Sample Movie",
              original_title: null,
              overview: "A thrilling sample adventure.",
              release_date: "2024-01-15",
              trailer_id: "abcd1234",
              genres: [
                { id: 1, name: "Action" },
                { id: 2, name: "Adventure" },
              ],
              movie_metrics: {
                vote_average: 7.25,
                vote_count: 1520,
              },
              movie_offers: [
                {
                  offer_type: "buy",
                  provider: { provider_id: 99, provider_name: "Apple TV" },
                },
                {
                  offer_type: "rent",
                  provider: { provider_id: 99, provider_name: "Apple TV" },
                },
                {
                  offer_type: "flatrate",
                  provider: { provider_id: 15, provider_name: "Netflix" },
                },
              ],
            },
          ],
          error: null,
        }),
      );

    const movies = await fetchRandomMovies(1);

    expect(movies).toHaveLength(1);
    const movie = movies[0] as Movie;
    expect(movie.id).toBe(123);
    expect(movie.title).toBe("Sample Movie");
    expect(movie.description).toContain("thrilling sample adventure");
    expect(movie.releaseDate).toBe("2024-01-15");
    expect(movie.genre).toBe("Action, Adventure");
    expect(movie.videoUrl).toBe("https://www.youtube.com/embed/abcd1234");

    expect(movie.rating).toEqual({
      source: "TMDb",
      score: 7.3,
      maxScore: 10,
      voteCount: 1520,
    });

    expect(movie.streamingProviders).toEqual([
      { id: "15", name: "Netflix", access: "subscription" },
      { id: "99", name: "Apple TV", access: "rent" },
    ]);

    expect(mockFrom).toHaveBeenNthCalledWith(1, "movies");
    expect(mockFrom).toHaveBeenNthCalledWith(2, "movies");
  });

  it("throws when count query fails", async () => {
    mockFrom.mockImplementationOnce(() =>
      createCountBuilder({ count: null, error: { message: "boom" } }),
    );

    await expect(fetchRandomMovies(1)).rejects.toThrow(
      "Failed to count movies: boom",
    );
  });
});
