import type {LayoutNavCategory} from '../viewModel/layoutViewModel.type';

/**
 * API model for the navigation bar
 */
export interface LayoutNavApiModel {
  value: LayoutNavCategory;
  labelKey: 'nav.movies' | 'nav.tvShows' | 'nav.documentaries';
  enabled: boolean;
  order: number;
}

// TODO: Replace with real API call that give the navigation bar
const NAV_ITEMS: LayoutNavApiModel[] = [
  {value: 'movies', labelKey: 'nav.movies', enabled: true, order: 1},
  {value: 'tv-shows', labelKey: 'nav.tvShows', enabled: true, order: 2},
  {
    value: 'documentaries',
    labelKey: 'nav.documentaries',
    enabled: true,
    order: 3
  }
];

export const fetchLayoutNavItems = async (): Promise<LayoutNavApiModel[]> => {
  return NAV_ITEMS;
};
