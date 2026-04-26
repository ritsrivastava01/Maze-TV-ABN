export interface SearchResultViewModel {
  id: number;
  title: string;
  /** Medium poster image (210×295). */
  image: string;
  rating: number;
  ratingStarFills: number[];
  genres: string[];
  summary: string;
  /** Relevance score from TVMaze (higher = better match). */
  score: number;
}

export interface SearchViewModel {
  query: string;
  totalResults: number;
  results: SearchResultViewModel[];
}
