import type { EpisodeApi, SearchResultApiModel, SeasonApi, ShowApi } from '../../domains/tvmaze/api/tvmaze.api';

/**
 * Minimal factory for ShowApi (= ShowApiModel). Shared across mapper specs.
 */
export const makeShowApi = (overrides: Partial<ShowApi> = {}): ShowApi => ({
  id: 1,
  name: 'Test Show',
  summary: null,
  genres: [],
  rating: { average: 7.5 },
  image: { medium: 'http://img.test/medium.jpg', original: 'http://img.test/original.jpg' },
  ...overrides,
});

/**
 * Minimal factory for EpisodeApi. Shared across mapper specs.
 */
export const makeEpisodeApi = (overrides: Partial<EpisodeApi> = {}): EpisodeApi => ({
  id: 1,
  name: 'Pilot',
  season: 1,
  number: 1,
  summary: null,
  rating: { average: 8 },
  image: { medium: 'http://img.test/ep-medium.jpg', original: 'http://img.test/ep-original.jpg' },
  ...overrides,
});

/**
 * Minimal factory for SeasonApi. Shared across mapper specs.
 */
export const makeSeasonApi = (overrides: Partial<SeasonApi> = {}): SeasonApi => ({
  id: 1,
  number: 1,
  ...overrides,
});

/**
 * Minimal factory for SearchResultApiModel. Wraps makeShowApi with a relevance score.
 */
export const makeSearchResult = (showOverrides: Partial<ShowApi> = {}): SearchResultApiModel => ({
  score: 1,
  show: makeShowApi(showOverrides),
});
