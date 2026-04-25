import type {ShowViewModel} from './show.type';

export type DashboardCategory = 'movies' | 'tv-shows' | 'documentaries';

export interface DashboardGenreRow {
  genre: string;
  shows: ShowViewModel[];
}

export interface DashboardViewModel {
  shows: ShowViewModel[];
  featuredShow: ShowViewModel | null;
  genreRows: DashboardGenreRow[];
  genres: string[];
}
