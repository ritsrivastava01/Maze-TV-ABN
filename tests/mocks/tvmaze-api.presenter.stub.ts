import { vi } from 'vitest';

/**
 * Shared vi.fn() instances for presenter specs that mock `domains/tvmaze/api/tvmaze.api`.
 * Each spec file still calls `vi.mock('…tvmaze.api', () => tvmazeApiPresenterStub)` at top level (Vitest hoisting).
 */
export const tvmazeApiPresenterStub = {
  fetchTvMazeShows: vi.fn(),
  fetchTvMazeLayoutNavItems: vi.fn(),
  fetchTvMazeSearchShows: vi.fn(),
  fetchTvMazeShowById: vi.fn(),
  fetchTvMazeShowSeasons: vi.fn(),
  fetchTvMazeShowCast: vi.fn(),
  fetchTvMazeSeasonEpisodes: vi.fn(),
};
