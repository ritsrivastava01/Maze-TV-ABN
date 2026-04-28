import { fetchTvMazeSearchShows } from '../../tvmaze/api/tvmaze.api';
import { mapSearchResultsApiToViewModel } from '../mappers/search.mapper';
import type { SearchViewModel } from '../viewModel/searchViewModel.type';

export const searchPresenter = () => {
  /**
   * Searches TVMaze for shows matching the given query string and returns
   * a mapped SearchViewModel with results ranked by relevance score.
   */
  const getSearchResults = async (query: string): Promise<SearchViewModel> => {
    const trimmed = query.trim();

    if (!trimmed) {
      return { query: trimmed, totalResults: 0, results: [] };
    }

    const results = await fetchTvMazeSearchShows(trimmed);
    return mapSearchResultsApiToViewModel(results, trimmed);
  };

  return { getSearchResults };
};
