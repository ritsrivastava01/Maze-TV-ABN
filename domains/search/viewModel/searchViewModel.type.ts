import type { ShowViewModel } from '../../dashboard/viewModel/show.type';

export type SearchResultViewModel = Omit<ShowViewModel, 'heroImage' | 'genres' | 'summary'>;

export interface SearchViewModel {
  query: string;
  totalResults: number;
  results: SearchResultViewModel[];
}
