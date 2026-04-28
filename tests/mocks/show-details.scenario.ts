import {
  mapEpisodeApiListToEpisodes,
  mapShowApiToShowDetailsViewModel,
} from '../../domains/showDetails/mappers/showDetails.mapper';
import type { Episode, ShowDetailsViewModel } from '../../domains/showDetails/viewModel/showDetailsViewModel.type';
import type { CastApi, EpisodeApi, SeasonApi, ShowApi } from '../../domains/tvmaze/api/tvmaze.api';
import { makeEpisodeApi, makeSeasonApi, makeShowApi } from './tvmaze-api.factory';

/**
 * Breaking Bad mock data shared between `showDetails.mapper.spec.ts` (Vitest) and
 * `show-detail.spec.ts` (Playwright). Same factories + mapper as unit tests — one place.
 */

/** Core `ShowApi` fields reused by mapper tests and full detail-page JSON mocks. */
export const breakingBadShowCore = (): Partial<ShowApi> => ({
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  rating: { average: 9.5 },
});

/** Mapper “main VM” test: show row (id 5 matches historical spec name). */
export const breakingBadShowApiForMapperTest = (): ShowApi =>
  makeShowApi({ id: 5, ...breakingBadShowCore() });

/** Mapper “main VM” test: unordered seasons → map sorts by `number`. */
export const mapperTestBreakingBadSeasonsUnsorted = (): SeasonApi[] => [
  makeSeasonApi({ id: 2, number: 2 }),
  makeSeasonApi({ id: 1, number: 1 }),
];

/** Mapper “main VM” test: single first-season episode. */
export const mapperTestBreakingBadPilotOnly = (): EpisodeApi[] => [makeEpisodeApi({ id: 1, name: 'Pilot' })];

/** Season DB id for season 2; must match routed `GET /api/season/:id` mocks. */
export const BREAKING_BAD_SEASON_2_DB_ID = 5002;

const breakingBadSeasonsForDetailPageJson = (): SeasonApi[] => [
  makeSeasonApi({ id: 5001, number: 1 }),
  makeSeasonApi({ id: BREAKING_BAD_SEASON_2_DB_ID, number: 2 }),
];

const breakingBadCastApi = (): CastApi[] => [
  {
    person: {
      id: 1,
      name: 'Bryan Cranston',
      image: {
        medium: '/no-image.svg',
        original: '/no-image.svg',
      },
    },
    character: { id: 1, name: 'Walter White' },
  },
  {
    person: {
      id: 2,
      name: 'Aaron Paul',
      image: {
        medium: '/no-image.svg',
        original: '/no-image.svg',
      },
    },
    character: { id: 2, name: 'Jesse Pinkman' },
  },
];

const breakingBadShowApiFull = (): ShowApi =>
  makeShowApi({
    id: 1,
    ...breakingBadShowCore(),
    summary:
      '<p>A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.</p>',
    image: {
      medium: '/no-image.svg',
      original: '/no-image.svg',
    },
    type: 'Scripted',
    language: 'English',
    status: 'Ended',
    averageRuntime: 47,
    premiered: '2008-01-20',
    ended: '2013-09-29',
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    schedule: { days: ['Sunday'], time: '22:00' },
    network: { name: 'AMC', country: { name: 'United States' } },
    externals: { imdb: 'tt0903747' },
  });

/** First-load JSON for `/api/:showId` matching what Nitro forwards after mapping. */
export function breakingBadShowDetailsViewModel(): ShowDetailsViewModel {
  const firstSeasonEpisodes = [
    makeEpisodeApi({
      id: 101,
      name: 'Pilot',
      season: 1,
      number: 1,
      summary: '<p>Walter White begins his transformation.</p>',
      rating: { average: 8.2 },
      image: {
        medium: '/no-image.svg',
        original: '/no-image.svg',
      },
    }),
    makeEpisodeApi({
      id: 102,
      name: "Cat's in the Bag",
      season: 1,
      number: 2,
      rating: { average: 8.5 },
      image: {
        medium: '/no-image.svg',
        original: '/no-image.svg',
      },
    }),
  ];

  return mapShowApiToShowDetailsViewModel(
    breakingBadShowApiFull(),
    breakingBadSeasonsForDetailPageJson(),
    breakingBadCastApi(),
    firstSeasonEpisodes
  );
}

/** JSON for `GET /api/season/:seasonDbId` when UI loads season 2 episodes. */
export function breakingBadSeasonTwoEpisodesNormalized(): Episode[] {
  return mapEpisodeApiListToEpisodes([
    makeEpisodeApi({
      id: 201,
      name: 'Seven Thirty-Seven',
      season: 2,
      number: 1,
      summary: '<p>The consequences of the past catch up.</p>',
      rating: { average: 8.8 },
      image: {
        medium: '/no-image.svg',
        original: '/no-image.svg',
      },
    }),
  ]);
}
