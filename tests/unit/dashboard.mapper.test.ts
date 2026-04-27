import { describe, expect, it } from 'vitest';

import { mapShowsApiToDashboardViewModel } from '../../domains/dashboard/mappers/dashboard.mapper';
import type { ShowApiModel } from '../../domains/tvmaze/api/tvmaze.api';

// ─── Helpers ───────────────────────────────────────────────────────────────

const makeShow = (overrides: Partial<ShowApiModel> = {}): ShowApiModel => ({
  id: 1,
  name: 'Test Show',
  summary: null,
  genres: [],
  rating: { average: 7.5 },
  ...overrides,
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('mapShowsApiToDashboardViewModel', () => {
  describe('ratingStarFills', () => {
    it('maps a perfect 10/10 rating to five fully filled stars', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ rating: { average: 10 } })], 'tv-shows');
      expect(result.featuredShow?.ratingStarFills).toEqual([100, 100, 100, 100, 100]);
    });

    it('maps a 0/10 rating to five empty stars', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ rating: { average: 0 } })], 'tv-shows');
      expect(result.featuredShow?.ratingStarFills).toEqual([0, 0, 0, 0, 0]);
    });

    it('maps a 5/10 rating to 2.5 stars (half-filled at index 2)', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ rating: { average: 5 } })], 'tv-shows');
      const fills = result.featuredShow!.ratingStarFills;
      expect(fills[0]).toBe(100);
      expect(fills[1]).toBe(100);
      expect(fills[2]).toBe(50);
      expect(fills[3]).toBe(0);
      expect(fills[4]).toBe(0);
    });

    it('maps a null rating to five empty stars', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ rating: { average: null } })], 'tv-shows');
      expect(result.featuredShow?.ratingStarFills).toEqual([0, 0, 0, 0, 0]);
    });

    it('always returns exactly 5 star values', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ rating: { average: 7.3 } })], 'tv-shows');
      expect(result.featuredShow?.ratingStarFills).toHaveLength(5);
    });
  });

  describe('featuredShow', () => {
    it('selects the highest-rated show as the featured show', () => {
      const shows = [
        makeShow({ id: 1, name: 'Low Rated', rating: { average: 5 } }),
        makeShow({ id: 2, name: 'Top Rated', rating: { average: 9.5 } }),
        makeShow({ id: 3, name: 'Mid Rated', rating: { average: 7 } }),
      ];
      const result = mapShowsApiToDashboardViewModel(shows, 'tv-shows');
      expect(result.featuredShow?.title).toBe('Top Rated');
    });

    it('returns null when the show list is empty', () => {
      const result = mapShowsApiToDashboardViewModel([], 'tv-shows');
      expect(result.featuredShow).toBeNull();
    });

    it('uses a fallback image when no image is provided', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ image: undefined })], 'tv-shows');
      expect(result.featuredShow?.image).toContain('placeholder');
    });
  });

  describe('category filtering', () => {
    const shows = [
      makeShow({ id: 1, name: 'Drama Show', genres: ['Drama'], rating: { average: 8 } }),
      makeShow({ id: 2, name: 'Action Film', genres: ['Action'], rating: { average: 7.5 } }),
      makeShow({ id: 3, name: 'Nature Doc', genres: ['Nature'], rating: { average: 7 } }),
      makeShow({ id: 4, name: 'History Doc', genres: ['Documentary'], rating: { average: 6.5 } }),
    ];

    it('"tv-shows" returns all shows regardless of genre', () => {
      const result = mapShowsApiToDashboardViewModel(shows, 'tv-shows');
      const allShows = result.genreRows.flatMap((r) => r.shows);
      const ids = allShows.map((s) => s.id);
      expect(ids).toContain(1);
      expect(ids).toContain(2);
      expect(ids).toContain(3);
      expect(ids).toContain(4);
    });

    it('"movies" returns only shows with movie-related genres', () => {
      const result = mapShowsApiToDashboardViewModel(shows, 'movies');
      const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
      expect(allTitles).toContain('Action Film');
      expect(allTitles).not.toContain('Nature Doc');
      expect(allTitles).not.toContain('History Doc');
    });

    it('"documentaries" returns only shows with documentary genres', () => {
      const result = mapShowsApiToDashboardViewModel(shows, 'documentaries');
      const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
      expect(allTitles).toContain('Nature Doc');
      expect(allTitles).toContain('History Doc');
      expect(allTitles).not.toContain('Action Film');
    });

    it('falls back to all shows when the filtered result is empty', () => {
      const dramaOnlyShows = [makeShow({ id: 1, genres: ['Drama'] })];
      // 'movies' filter should find no matches → falls back to all
      const result = mapShowsApiToDashboardViewModel(dramaOnlyShows, 'movies');
      expect(result.genreRows.flatMap((r) => r.shows)).toHaveLength(1);
    });
  });

  describe('genreRows', () => {
    it('groups shows by their genre into separate rows', () => {
      const shows = [
        makeShow({ id: 1, genres: ['Drama', 'Thriller'], rating: { average: 8 } }),
        makeShow({ id: 2, genres: ['Drama'], rating: { average: 7 } }),
        makeShow({ id: 3, genres: ['Comedy'], rating: { average: 6 } }),
      ];
      const result = mapShowsApiToDashboardViewModel(shows, 'tv-shows');
      const dramaRow = result.genreRows.find((r) => r.genre === 'Drama');
      const thrillerRow = result.genreRows.find((r) => r.genre === 'Thriller');
      const comedyRow = result.genreRows.find((r) => r.genre === 'Comedy');

      expect(dramaRow?.shows).toHaveLength(2);
      expect(thrillerRow?.shows).toHaveLength(1);
      expect(comedyRow?.shows).toHaveLength(1);
    });

    it('puts shows with no genres into an "Other" row', () => {
      const result = mapShowsApiToDashboardViewModel([makeShow({ id: 1, genres: [] })], 'tv-shows');
      const otherRow = result.genreRows.find((r) => r.genre === 'Other');
      expect(otherRow?.shows).toHaveLength(1);
    });

    it('sorts genre rows by show count (most populated first)', () => {
      const shows = [
        makeShow({ id: 1, genres: ['Drama'], rating: { average: 9 } }),
        makeShow({ id: 2, genres: ['Drama'], rating: { average: 8 } }),
        makeShow({ id: 3, genres: ['Comedy'], rating: { average: 7 } }),
      ];
      const result = mapShowsApiToDashboardViewModel(shows, 'tv-shows');
      expect(result.genreRows[0].genre).toBe('Drama');
    });

    it('returns an empty genreRows array for an empty input', () => {
      const result = mapShowsApiToDashboardViewModel([], 'tv-shows');
      expect(result.genreRows).toHaveLength(0);
    });
  });
});
