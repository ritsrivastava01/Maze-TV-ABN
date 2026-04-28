/**
 * Presenter + mapper flow with the TVMaze API mocked (no network).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tvmazeApiPresenterStub } from '../../../tests/mocks/tvmaze-api.presenter.stub';
import type { ShowApiModel } from '../../tvmaze/api/tvmaze.api';
import { fetchTvMazeShows } from '../../tvmaze/api/tvmaze.api';
import { useDashboardPresenter } from './dashboard.presenter';

vi.mock('../../tvmaze/api/tvmaze.api', () => tvmazeApiPresenterStub);

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

describe('useDashboardPresenter — getDashboard()', () => {
  beforeEach(() => {
    vi.mocked(fetchTvMazeShows).mockReset();
  });

  it('should return a valid DashboardViewModel for a populated show list', async () => {
    // Arrange
    const mockShows = [
      makeApiShow({ id: 1, name: 'Show A', rating: { average: 9 }, genres: ['Drama'] }),
      makeApiShow({ id: 2, name: 'Show B', rating: { average: 7 }, genres: ['Comedy'] }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    // Act
    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('tv-shows');

    // Assert
    expect(result.featuredShow?.title).toBe('Show A');
    expect(result.featuredShow?.rating).toBe(9);
    const genres = result.genreRows.map((r) => r.genre);
    expect(genres).toContain('Drama');
    expect(genres).toContain('Comedy');
  });

  it('should return null featuredShow and empty genreRows when the API returns no shows', async () => {
    // Arrange
    vi.mocked(fetchTvMazeShows).mockResolvedValue([]);

    // Act
    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('tv-shows');

    // Assert
    expect(result.featuredShow).toBeNull();
    expect(result.genreRows).toHaveLength(0);
  });

  it('should apply the "movies" category filter correctly end-to-end', async () => {
    // Arrange
    const mockShows = [
      makeApiShow({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeApiShow({ id: 2, name: 'Nature Doc', genres: ['Nature'], rating: { average: 7 } }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    // Act
    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('movies');

    // Assert
    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('Action Hero');
    expect(allTitles).not.toContain('Nature Doc');
  });

  it('should apply the "documentaries" category filter correctly end-to-end', async () => {
    // Arrange
    const mockShows = [
      makeApiShow({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeApiShow({ id: 2, name: 'Nature Doc', genres: ['Documentary'], rating: { average: 7 } }),
    ];
    vi.mocked(fetchTvMazeShows).mockResolvedValue(mockShows);

    // Act
    const { getDashboard } = useDashboardPresenter();
    const result = await getDashboard('documentaries');

    // Assert
    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('Nature Doc');
    expect(allTitles).not.toContain('Action Hero');
  });

  it('should re-query the API on each invocation (no stale cache)', async () => {
    // Arrange
    vi.mocked(fetchTvMazeShows).mockResolvedValue([makeApiShow()]);

    // Act
    const { getDashboard } = useDashboardPresenter();
    await getDashboard('tv-shows');
    await getDashboard('movies');

    // Assert
    expect(fetchTvMazeShows).toHaveBeenCalledTimes(2);
  });

  it('should propagate API errors to the caller', async () => {
    // Arrange
    vi.mocked(fetchTvMazeShows).mockRejectedValue(new Error('Network error'));

    // Act
    const { getDashboard } = useDashboardPresenter();

    // Assert
    await expect(getDashboard('tv-shows')).rejects.toThrow('Network error');
  });
});
