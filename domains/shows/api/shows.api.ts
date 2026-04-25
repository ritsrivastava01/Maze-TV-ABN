import {$fetch} from 'ofetch';

const BASE_URL = 'https://api.tvmaze.com';

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

export interface TvMazeSearchShowItem {
  score: number;
  show: ShowApiModel;
}

export interface NavApiModel {
  value: 'movies' | 'tv-shows' | 'documentaries';
  labelKey: 'nav.movies' | 'nav.tvShows' | 'nav.documentaries';
  order: number;
  enabled: boolean;
}

export const fetchAllShows = async (): Promise<ShowApiModel[]> => {
  return await $fetch<ShowApiModel[]>(`${BASE_URL}/shows`);
};

export const searchShows = async (
  query: string
): Promise<TvMazeSearchShowItem[]> => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return await $fetch<TvMazeSearchShowItem[]>(`${BASE_URL}/search/shows`, {
    query: {
      q: normalizedQuery
    }
  });
};

export const fetchShowById = async (id: number): Promise<ShowApiModel> => {
  return await $fetch<ShowApiModel>(`${BASE_URL}/shows/${id}`);
};

export const fetchDashboardNavItems = async (): Promise<NavApiModel[]> => {
  return [
    {value: 'tv-shows', labelKey: 'nav.tvShows', order: 1, enabled: true},
    {value: 'movies', labelKey: 'nav.movies', order: 2, enabled: true},
    {
      value: 'documentaries',
      labelKey: 'nav.documentaries',
      order: 3,
      enabled: true
    }
  ];
};
