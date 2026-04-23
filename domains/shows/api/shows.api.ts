const TVMAZE_BASE_URL = "https://api.tvmaze.com";

export interface TvMazeShow {
  id: number;
  name: string;
  summary: string | null;
  genres: string[];
  rating: {
    average: number | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
}

export interface TvMazeSearchShowItem {
  score: number;
  show: TvMazeShow;
}

export const fetchAllShows = async (): Promise<TvMazeShow[]> => {
  return await $fetch<TvMazeShow[]>(`${TVMAZE_BASE_URL}/shows`);
};

export const searchShows = async (
  query: string,
): Promise<TvMazeSearchShowItem[]> => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return await $fetch<TvMazeSearchShowItem[]>(
    `${TVMAZE_BASE_URL}/search/shows`,
    {
      query: {
        q: normalizedQuery,
      },
    },
  );
};

export const fetchShowById = async (id: number): Promise<TvMazeShow> => {
  return await $fetch<TvMazeShow>(`${TVMAZE_BASE_URL}/shows/${id}`);
};
