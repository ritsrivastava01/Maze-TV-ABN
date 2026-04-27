import type { ShowViewModel } from './show.type';

export type DashboardCategory = 'movies' | 'tv-shows' | 'documentaries';

export interface DashboardGenreRow {
  genre: string;
  shows: ShowViewModel[];
}

export interface DashboardViewModel {
  featuredShow: ShowViewModel | null;
  genreRows: DashboardGenreRow[];
}
