import { mapRatingToStarFills } from '../../dashboard/mappers/dashboard.mapper';
import type { SearchResultApiModel } from '../../tvmaze/api/tvmaze.api';
import type { SearchResultViewModel, SearchViewModel } from '../viewModel/searchViewModel.type';

const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';

const mapSearchResultApiToViewModel = (result: SearchResultApiModel): SearchResultViewModel => {
  const { show } = result;
  const rating = show.rating.average ?? 0;

  return {
    id: show.id,
    title: show.name,
    image: show.image?.medium ?? show.image?.original ?? FALLBACK_IMAGE,
    rating,
    ratingStarFills: mapRatingToStarFills(rating),
  };
};

export const mapSearchResultsApiToViewModel = (results: SearchResultApiModel[], query: string): SearchViewModel => {
  const mappedResults = results.map(mapSearchResultApiToViewModel);

  return {
    query,
    totalResults: mappedResults.length,
    results: mappedResults,
  };
};
