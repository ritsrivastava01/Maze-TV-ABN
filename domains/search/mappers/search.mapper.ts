import type { SearchResultApiModel } from '../../tvmaze/api/tvmaze.api';
import type { SearchResultViewModel, SearchViewModel } from '../viewModel/searchViewModel.type';

const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';
const STAR_COUNT = 5;

const mapRatingToStarFills = (rating: number): number[] => {
  const ratingOnFiveScale = rating / 2;
  const clamped = Math.max(0, Math.min(5, Math.round(ratingOnFiveScale * 4) / 4));
  return Array.from({ length: STAR_COUNT }, (_, i) => Math.max(0, Math.min(1, clamped - i)) * 100);
};

const mapSearchResultApiToViewModel = (result: SearchResultApiModel): SearchResultViewModel => {
  const { show, score } = result;
  const rating = show.rating.average ?? 0;

  return {
    id: show.id,
    title: show.name,
    image: show.image?.medium ?? show.image?.original ?? FALLBACK_IMAGE,
    rating,
    ratingStarFills: mapRatingToStarFills(rating),
    genres: show.genres ?? [],
    summary: show.summary ?? '',
    score,
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
