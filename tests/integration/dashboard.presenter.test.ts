/**
 * Integration test: DashboardPresenter
 *
 * Tests the full flow from presenter → mapper → view model, mocking only the
 * external TVMaze API call. This validates that the two layers work together
 * correctly without hitting the network.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShowApiModel } from '../../domains/tvmaze/api/tvmaze.api';

// Mock the TVMaze API module — keep all other implementations intact
vi.mock('../../domains/tvmaze/api/tvmaze.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../domains/tvmaze/api/tvmaze.api')>();
  return {
    ...actual,
    fetchTvMazeShows: vi.fn(),
  };
});

import { fetchTvMazeShows } from '../../domains/tvmaze/api/tvmaze.api';
import { useDashboardPresenter } from '../../domains/dashboard/presenters/dashboard.presenter';

// ─── Fixtures ─────────────────────────────────────────────────────────────

const makeApiShow = (overrides: Partial<ShowApiModel> = {}): ShowApiModel => ({
  id: 1,
  name: 'Breaking Bad',
  summary: '<p>A teacher cooks meth.</p>',
  genres: ['Drama', 'Crime'],
  rating: { average: 9.5 },
  image: {
    medium: 'https://example.com/medium.jpg',
    original: 'https://example.com/original.jpg',
  },
  ...overrides,
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('useDashboardPresenter — getDashboard()', () => {
  beforeEach(() => {
    vi.mocked(fetchTvMazeShows).mockReset();
  });

  it('returns a valid DashboardViewModel for a populated show list', async () => {
    const mockShows = [
      makeApiShow({ id: 1, name: 'Show A', rating: { average: 9 }, genres: ['Drama'] }),
      makeApiShow({ id: 2, name: 'Show B', rating: { average: 7 }, genres: ['Comedy'] }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('tv-shows');

    // Highest-rated show should be featured
    expect(result.featuredShow?.title).toBe('Show A');
    expect(result.featuredShow?.rating).toBe(9);
    // Both genres should appear as rows
    const genres = result.genreRows.map((r) => r.genre);
    expect(genres).toContain('Drama');
    expect(genres).toContain('Comedy');
  });

  it('returns null featuredShow and empty genreRows when the API returns no shows', async () => {
    vi.mocked(fetchTvMazeShows).mockResolvedValue([]);

    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('tv-shows');

    expect(result.featuredShow).toBeNull();
    expect(result.genreRows).toHaveLength(0);
  });

  it('applies the "movies" category filter correctly end-to-end', async () => {
    const mockShows = [
      makeApiShow({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeApiShow({ id: 2, name: 'Nature Doc', genres: ['Nature'], rating: { average: 7 } }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('movies');

    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('Action Hero');
    expect(allTitles).not.toContain('Nature Doc');
  });

  it('applies the "documentaries" category filter correctly end-to-end', async () => {
    const mockShows = [
      makeApiShow({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeApiShow({ id: 2, name: 'Nature Doc', genres: ['Documentary'], rating: { average: 7 } }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('documentaries');

    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('Nature Doc');
    expect(allTitles).not.toContain('Action Hero');
  });

  it('re-queries the API on each invocation (no stale cache)', async () => {
    vi.mocked(fetchTvMazeShows).mockResolvedValue([makeApiShow()]);

    const { getDashboard } = useDashboardPresenter();
    await getDashboard('tv-shows');
    await getDashboard('movies');

    expect(fetchTvMazeShows).toHaveBeenCalledTimes(2);
  });

  it('propagates API errors to the caller', async () => {
    vi.mocked(fetchTvMazeShows).mockRejectedValue(new Error('Network error'));

    const { getDashboard } = useDashboardPresenter();
    await expect(getDashboard('tv-shows')).rejects.toThrow('Network error');
  });
});
