import { $fetch } from 'ofetch';

import { SEARCH_PARAM } from '../../constants/appConstant';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

/**
 * API model for the TVMaze shows response (for individual and list views).
 */
export interface ShowApiModel {
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
 * API model for the TVMaze shows response (for list views).
 */
export const fetchTvMazeShows = async (): Promise<ShowApiModel[]> => {
  return await $fetch<ShowApiModel[]>(`${TVMAZE_BASE_URL}/shows`);
};

/**
 * API model for the TVMaze show by ID response.
 */
export const fetchTvMazeShowById = async (id: number): Promise<ShowApiModel> => {
  return await $fetch<ShowApiModel>(`${TVMAZE_BASE_URL}/shows/${id}`);
};
/**
 * API model for the TVMaze episodes response.
 */
export interface EpisodeApiModel {
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

export const fetchTvMazeShowEpisodes = async (id: number): Promise<EpisodeApiModel[]> => {
  return await $fetch<EpisodeApiModel[]>(`${TVMAZE_BASE_URL}/shows/${id}/episodes`);
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
export const fetchTvMazeShowSeasons = async (showId: number): Promise<SeasonApi[]> => {
  return await $fetch<SeasonApi[]>(`${TVMAZE_BASE_URL}/shows/${showId}/seasons`);
};

/**
 * Get the episodes for a given season
 * @param seasonId - The ID of the season
 * @returns The episodes for the given season
 */
export const fetchTvMazeSeasonEpisodes = async (seasonId: number): Promise<EpisodeApiModel[]> => {
  return await $fetch<EpisodeApiModel[]>(`${TVMAZE_BASE_URL}/seasons/${seasonId}/episodes`);
};

// Type aliases for the showDetails domain (consistent naming with main branch)
export type ShowApi = ShowApiModel;
export type EpisodeApi = EpisodeApiModel;
export type CastApi = CastApiModel;

/**
 * API model for the TVMaze cast response.
 */
export interface CastApiModel {
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

export const fetchTvMazeShowCast = async (id: number): Promise<CastApiModel[]> => {
  return await $fetch<CastApiModel[]>(`${TVMAZE_BASE_URL}/shows/${id}/cast`);
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
  { value: 'movies', labelKey: 'nav.movies', enabled: true, order: 2 },
  { value: 'tv-shows', labelKey: 'nav.tvShows', enabled: true, order: 1 },
  {
    value: 'documentaries',
    labelKey: 'nav.documentaries',
    enabled: true,
    order: 3,
  },
];

export const fetchTvMazeLayoutNavItems = async (): Promise<LayoutNavApiModel[]> => {
  return NAV_ITEMS;
};

/**
 * API model for the TVMaze search result (each hit wraps a show).
 */
export interface SearchResultApiModel {
  score: number;
  show: ShowApiModel;
}

/**
 * Search shows by query string using the TVMaze search endpoint.
 * Returns up to 10 results ranked by relevance score.
 */
export const fetchTvMazeSearchShows = async (query: string): Promise<SearchResultApiModel[]> => {
  return await $fetch<SearchResultApiModel[]>(`${TVMAZE_BASE_URL}/search/shows`, {
    query: { [SEARCH_PARAM]: query },
  });
};
