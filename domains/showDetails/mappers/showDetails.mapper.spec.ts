import { describe, expect, it } from 'vitest';

import {
  breakingBadShowApiForMapperTest,
  mapperTestBreakingBadPilotOnly,
  mapperTestBreakingBadSeasonsUnsorted,
} from '../../../tests/mocks/show-details.scenario';
import { makeSeasonApi, makeShowApi } from '../../../tests/mocks/tvmaze-api.factory';
import { FALLBACK_IMAGE, IMDB_TITLE_BASE_URL } from '../../constants/appConstant';
import { mapSeasonApiListToSeasons, mapShowApiToShowDetailsViewModel } from './showDetails.mapper';

describe('mapShowApiToShowDetailsViewModel', () => {
  it('should map the main show details view model', () => {
    // Arrange — same Breaking Bad stubs as Playwright mocked API (`tests/mocks/show-details.scenario.ts`).
    const apiShow = breakingBadShowApiForMapperTest();
    const seasons = mapperTestBreakingBadSeasonsUnsorted();
    const episodes = mapperTestBreakingBadPilotOnly();

    // Act
    const result = mapShowApiToShowDetailsViewModel(apiShow, seasons, [], episodes);

    // Assert
    expect(result.show.title).toBe('Breaking Bad');
    expect(result.show.genres).toEqual(['Drama', 'Crime']);
    expect(result.show.rating).toBe(9.5);
    expect(result.show.ratingStarFills).toEqual([100, 100, 100, 100, 75]);
    expect(result.seasonList.map((s) => s.number)).toEqual([1, 2]);
    expect(result.episodes[0].title).toBe('Pilot');
  });

  it('should map view-more metadata fields from API payload', () => {
    // Arrange
    const apiShow = makeShowApi({
      type: 'Scripted',
      language: 'English',
      status: 'Ended',
      averageRuntime: 47,
      premiered: '2008-01-20',
      officialSite: 'https://example.com/show',
      schedule: { days: ['Friday', 'Saturday'], time: '21:00' },
      network: { name: 'AMC', country: { name: 'United States' } },
      externals: { imdb: 'tt0903747' },
    });

    // Act
    const result = mapShowApiToShowDetailsViewModel(apiShow, [], [], []);

    // Assert
    expect(result.show).toMatchObject({
      type: 'Scripted',
      runtime: '47 min',
      scheduleDays: 'Friday, Saturday',
      imdbUrl: `${IMDB_TITLE_BASE_URL}tt0903747`,
    });
  });

  it('should apply fallbacks for null rating, null image, and missing schedule/network', () => {
    // Arrange
    const apiShow = makeShowApi({
      rating: { average: null },
      image: null,
      schedule: undefined,
      network: null,
    });

    // Act
    const result = mapShowApiToShowDetailsViewModel(apiShow, [], [], []);

    // Assert
    expect(result.show.rating).toBe(0);
    expect(result.show.ratingStarFills).toEqual([0, 0, 0, 0, 0]);
    expect(result.show.image).toBe(FALLBACK_IMAGE);
    expect(result.show.scheduleDays).toBe('Unknown');
    expect(result.show.scheduleTime).toBe('Unknown');
    expect(result.show.network).toBe('Unknown');
    expect(result.show.country).toBe('Unknown');
  });
});

describe('mapSeasonApiListToSeasons', () => {
  it('should sort seasons by season number', () => {
    // Arrange
    const input = [makeSeasonApi({ id: 3, number: 3 }), makeSeasonApi({ id: 1, number: 1 })];

    // Act
    const result = mapSeasonApiListToSeasons(input);

    // Assert
    expect(result.map((s) => s.number)).toEqual([1, 3]);
  });
});
