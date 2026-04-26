import {$fetch} from 'ofetch';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

/**
 * API model for the TVMaze shows response (for individual and list views).
 */
export interface ShowApi {
  id: number;
  name: string;
  type?: string;
  language?: string;
  summary: string | null;
  genres: string[];
  status?: string;
  runtime?: number | null;
  averageRuntime?: number | null;
  premiered?: string | null;
  ended?: string | null;
  officialSite?: string | null;
  schedule?: {
    time: string;
    days: string[];
  };
  rating: {
    average: number | null;
  };
  network?: {
    name: string;
    country?: {
      name: string;
    } | null;
  } | null;
  externals?: {
    imdb?: string | null;
  };
  image?: {
    medium: string;
    original: string;
  } | null;
}

/**
 * Get the shows from the TVMaze API
 * @returns The shows from the TVMaze API
 */
export const fetchTvMazeShows = async (): Promise<ShowApi[]> => {
  return await $fetch<ShowApi[]>(`${TVMAZE_BASE_URL}/shows`);
};

export const fetchTvMazeShowById = async (id: number): Promise<ShowApi> => {
  return await $fetch<ShowApi>(`${TVMAZE_BASE_URL}/shows/${id}`);
};
/** TVMaze episode JSON. Maps to app `Episode` in show-details. */
export interface EpisodeApi {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string | null;
  rating: {
    average: number | null;
  };
  image?: {
    medium: string;
    original: string;
  } | null;
}

/**
 * Get the episodes for a given show
 * @param id - The ID of the show
 * @returns The episodes for the given show
 */
export const fetchTvMazeShowEpisodes = async (
  id: number
): Promise<EpisodeApi[]> => {
  return await $fetch<EpisodeApi[]>(`${TVMAZE_BASE_URL}/shows/${id}/episodes`);
};

/** TVMaze `GET /shows/{id}/seasons` row. Maps to app `Season` in show-details. */
export interface SeasonApi {
  id: number;
  number: number;
}

/**
 * Get the seasons for a given show
 * @param showId - The ID of the show
 * @returns The seasons for the given show
 */
export const fetchTvMazeShowSeasons = async (
  showId: number
): Promise<SeasonApi[]> => {
  return await $fetch<SeasonApi[]>(
    `${TVMAZE_BASE_URL}/shows/${showId}/seasons`
  );
};

/**
 * Get the episodes for a given season
 * @param seasonId - The ID of the season
 * @returns The episodes for the given season
 */
export const fetchTvMazeSeasonEpisodes = async (
  seasonId: number
): Promise<EpisodeApi[]> => {
  return await $fetch<EpisodeApi[]>(
    `${TVMAZE_BASE_URL}/seasons/${seasonId}/episodes`
  );
};

/** API model for the TVMaze cast response. */
export interface CastApi {
  person: {
    id: number;
    name: string;
    image?: {
      medium: string;
      original: string;
    } | null;
  };
  character: {
    id: number;
    name: string;
  };
}

/**
 * Get the cast for a given show
 * @param id - The ID of the show
 * @returns The cast for the given show
 */
export const fetchTvMazeShowCast = async (id: number): Promise<CastApi[]> => {
  return await $fetch<CastApi[]>(`${TVMAZE_BASE_URL}/shows/${id}/cast`);
};

/**
 * API model for header navigation items.
 * This is hardcoded for now.
 */
export interface LayoutNavApiModel {
  value: 'movies' | 'tv-shows' | 'documentaries';
  labelKey: 'nav.movies' | 'nav.tvShows' | 'nav.documentaries';
  enabled: boolean;
  order: number;
}

/**
 * Hardcoded header navigation items.
 */
const NAV_ITEMS: LayoutNavApiModel[] = [
  {value: 'movies', labelKey: 'nav.movies', enabled: true, order: 2},
  {value: 'tv-shows', labelKey: 'nav.tvShows', enabled: true, order: 1},
  {
    value: 'documentaries',
    labelKey: 'nav.documentaries',
    enabled: true,
    order: 3
  }
];

/**
 * Get the layout navigation items from the TVMaze API
 * @returns The layout navigation items from the TVMaze API
 */
export const fetchTvMazeLayoutNavItems = async (): Promise<
  LayoutNavApiModel[]
> => {
  return NAV_ITEMS;
};
