export type LayoutNavCategory = 'movies' | 'tv-shows' | 'documentaries';

/**
 * View model for the navigation bar
 */
interface NavViewItem {
  value: LayoutNavCategory;
  labelKey: 'nav.movies' | 'nav.tvShows' | 'nav.documentaries';
  order: number;
}

export interface HeaderViewModel {
  headerNavItems: NavViewItem[];
}
