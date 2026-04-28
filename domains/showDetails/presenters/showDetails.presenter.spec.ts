import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeEpisodeApi, makeSeasonApi, makeShowApi } from '../../../tests/mocks/tvmaze-api.factory';
import { tvmazeApiPresenterStub } from '../../../tests/mocks/tvmaze-api.presenter.stub';
import {
  fetchTvMazeSeasonEpisodes,
  fetchTvMazeShowById,
  fetchTvMazeShowCast,
  fetchTvMazeShowSeasons,
} from '../../tvmaze/api/tvmaze.api';
import { showDetailsPresenter } from './showDetails.presenter';

vi.mock('../../tvmaze/api/tvmaze.api', () => tvmazeApiPresenterStub);

describe('showDetailsPresenter', () => {
  beforeEach(() => {
    vi.mocked(fetchTvMazeShowById).mockReset();
    vi.mocked(fetchTvMazeShowSeasons).mockReset();
    vi.mocked(fetchTvMazeShowCast).mockReset();
    vi.mocked(fetchTvMazeSeasonEpisodes).mockReset();
  });

  it('should fetch show, seasons, cast and first-season episodes for getShowDetails', async () => {
    // Arrange
    vi.mocked(fetchTvMazeShowById).mockResolvedValue(makeShowApi({ id: 10, name: 'Breaking Bad' }));
    vi.mocked(fetchTvMazeShowSeasons).mockResolvedValue([
      makeSeasonApi({ id: 200, number: 2 }),
      makeSeasonApi({ id: 100, number: 1 }),
    ]);
    vi.mocked(fetchTvMazeShowCast).mockResolvedValue([
      {
        person: { id: 99, name: 'Bryan Cranston', image: null },
        character: { id: 1, name: 'Walter White' },
      },
    ]);
    vi.mocked(fetchTvMazeSeasonEpisodes).mockResolvedValue([makeEpisodeApi({ id: 1, name: 'Pilot' })]);

    // Act
    const { getShowDetails } = showDetailsPresenter();
    await getShowDetails(10);

    // Assert
    expect(fetchTvMazeShowById).toHaveBeenCalledWith(10);
    expect(fetchTvMazeShowSeasons).toHaveBeenCalledWith(10);
    expect(fetchTvMazeShowCast).toHaveBeenCalledWith(10);
    expect(fetchTvMazeSeasonEpisodes).toHaveBeenCalledWith(100);
  });

  it('should call season episodes API for getSeasonEpisodes', async () => {
    // Arrange
    vi.mocked(fetchTvMazeSeasonEpisodes).mockResolvedValue([makeEpisodeApi({ id: 3, name: 'Episode 3' })]);

    // Act
    const { getSeasonEpisodes } = showDetailsPresenter();
    await getSeasonEpisodes(300);

    // Assert
    expect(fetchTvMazeSeasonEpisodes).toHaveBeenCalledWith(300);
    expect(fetchTvMazeSeasonEpisodes).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from getShowDetails API calls', async () => {
    // Arrange
    vi.mocked(fetchTvMazeShowById).mockRejectedValue(new Error('Network error'));

    // Act
    const { getShowDetails } = showDetailsPresenter();

    // Assert
    await expect(getShowDetails(1)).rejects.toThrow('Network error');
  });
});
