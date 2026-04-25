import {$fetch} from 'ofetch';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

/**
 * API model for the TVMaze shows response.
 */
export interface ShowApiModel {
  id: number;
  name: string;
  summary: string | null;
  genres: string[];
  rating: {
    average: number | null;
  };
  image?: {
    medium: string;
    original: string;
  } | null;
}

export const fetchTvMazeShows = async (): Promise<ShowApiModel[]> => {
  return await $fetch<ShowApiModel[]>(`${TVMAZE_BASE_URL}/shows`);
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

export const fetchTvMazeLayoutNavItems = async (): Promise<
  LayoutNavApiModel[]
> => {
  return NAV_ITEMS;
};
