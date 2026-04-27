import { describe, expect, it } from 'vitest';

import { mapShowApiToShowDetailViewModel } from '../../domains/show/mappers/show.mapper';
import type { CastApiModel, EpisodeApiModel, ShowApiModel } from '../../domains/tvmaze/api/tvmaze.api';

// ─── Helpers ───────────────────────────────────────────────────────────────

const makeShow = (overrides: Partial<ShowApiModel> = {}): ShowApiModel => ({
  id: 1,
  name: 'Breaking Bad',
  summary: '<p>Chemistry teacher turns to crime.</p>',
  genres: ['Drama', 'Crime'],
  rating: { average: 9.5 },
  type: 'Scripted',
  language: 'English',
  status: 'Ended',
  runtime: 47,
  averageRuntime: 47,
  premiered: '2008-01-20',
  ended: '2013-09-29',
  officialSite: 'https://www.amc.com/shows/breaking-bad',
  schedule: { time: '22:00', days: ['Sunday'] },
  network: { name: 'AMC', country: { name: 'United States' } },
  externals: { imdb: 'tt0903747' },
  image: {
    medium: 'https://example.com/medium.jpg',
    original: 'https://example.com/original.jpg',
  },
  ...overrides,
});

const makeEpisode = (overrides: Partial<EpisodeApiModel> = {}): EpisodeApiModel => ({
  id: 101,
  name: 'Pilot',
  season: 1,
  number: 1,
  summary: '<p>Walter White begins his transformation.</p>',
  rating: { average: 8.2 },
  image: { medium: 'https://example.com/ep1-medium.jpg', original: 'https://example.com/ep1-original.jpg' },
  ...overrides,
});

const makeCast = (overrides: Partial<CastApiModel> = {}): CastApiModel => ({
  person: {
    id: 201,
    name: 'Bryan Cranston',
    image: { medium: 'https://example.com/bryan-medium.jpg', original: 'https://example.com/bryan-original.jpg' },
  },
  character: { id: 301, name: 'Walter White' },
  ...overrides,
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('mapShowApiToShowDetailViewModel', () => {
  describe('show metadata', () => {
    it('maps basic show fields correctly', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [], []);
      expect(vm.show.id).toBe(1);
      expect(vm.show.title).toBe('Breaking Bad');
      expect(vm.show.status).toBe('Ended');
      expect(vm.show.language).toBe('English');
      expect(vm.show.type).toBe('Scripted');
    });

    it('formats the premiered date as "MMM DD, YYYY" in UTC', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ premiered: '2008-01-20' }), [], []);
      expect(vm.show.premiered).toBe('Jan 20, 2008');
    });

    it('returns "Unknown" for a null premiered date', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ premiered: null }), [], []);
      expect(vm.show.premiered).toBe('Unknown');
    });

    it('returns "Unknown" for an empty premiered string', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ premiered: '' }), [], []);
      expect(vm.show.premiered).toBe('Unknown');
    });

    it('extracts the premiere year from the ISO date', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ premiered: '2008-01-20' }), [], []);
      expect(vm.show.premieredYear).toBe(2008);
    });

    it('returns null premieredYear when premiered is null', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ premiered: null }), [], []);
      expect(vm.show.premieredYear).toBeNull();
    });

    it('constructs the runtime label correctly', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ averageRuntime: 47 }), [], []);
      expect(vm.show.runtime).toBe('47 min');
    });

    it('uses runtime fallback when averageRuntime is absent', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ averageRuntime: undefined, runtime: 60 }), [], []);
      expect(vm.show.runtime).toBe('60 min');
    });

    it('constructs the IMDb URL from externals', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ externals: { imdb: 'tt0903747' } }), [], []);
      expect(vm.show.imdbUrl).toBe('https://www.imdb.com/title/tt0903747');
    });

    it('returns null IMDb URL when externals.imdb is absent', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ externals: { imdb: null } }), [], []);
      expect(vm.show.imdbUrl).toBeNull();
    });

    it('falls back to a placeholder image when no image is provided', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ image: null }), [], []);
      expect(vm.show.image).toContain('placeholder');
    });

    it('joins schedule days into a comma-separated string', () => {
      const vm = mapShowApiToShowDetailViewModel(
        makeShow({ schedule: { time: '21:00', days: ['Monday', 'Thursday'] } }),
        [],
        []
      );
      expect(vm.show.scheduleDays).toBe('Monday, Thursday');
    });

    it('returns "Unknown" for schedule days when the array is empty', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow({ schedule: { time: '21:00', days: [] } }), [], []);
      expect(vm.show.scheduleDays).toBe('Unknown');
    });
  });

  describe('episodes', () => {
    it('maps episode list to the correct view model shape', () => {
      const ep = makeEpisode();
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [ep], []);
      expect(vm.episodes).toHaveLength(1);
      expect(vm.episodes[0].title).toBe('Pilot');
      expect(vm.episodes[0].season).toBe(1);
      expect(vm.episodes[0].number).toBe(1);
    });

    it('groups episodes into seasons correctly', () => {
      const episodes = [
        makeEpisode({ id: 1, season: 1, number: 1 }),
        makeEpisode({ id: 2, season: 1, number: 2 }),
        makeEpisode({ id: 3, season: 2, number: 1 }),
      ];
      const vm = mapShowApiToShowDetailViewModel(makeShow(), episodes, []);
      expect(vm.seasons).toHaveLength(2);

      const season1 = vm.seasons.find((s) => s.season === 1);
      const season2 = vm.seasons.find((s) => s.season === 2);
      expect(season1?.episodes).toHaveLength(2);
      expect(season2?.episodes).toHaveLength(1);
    });

    it('returns empty seasons array when there are no episodes', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [], []);
      expect(vm.seasons).toHaveLength(0);
    });
  });

  describe('cast', () => {
    it('maps cast members to the correct view model shape', () => {
      const castMember = makeCast();
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [], [castMember]);
      expect(vm.cast).toHaveLength(1);
      expect(vm.cast[0].name).toBe('Bryan Cranston');
      expect(vm.cast[0].characterName).toBe('Walter White');
    });

    it('falls back to a placeholder image when a cast member has no image', () => {
      const castMember = makeCast({ person: { id: 201, name: 'Unknown Actor', image: null } });
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [], [castMember]);
      expect(vm.cast[0].image).toContain('placeholder');
    });

    it('returns an empty cast array when no cast is provided', () => {
      const vm = mapShowApiToShowDetailViewModel(makeShow(), [], []);
      expect(vm.cast).toHaveLength(0);
    });
  });
});
