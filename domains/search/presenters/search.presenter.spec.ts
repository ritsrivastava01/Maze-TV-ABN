import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeSearchResult } from '../../../tests/mocks/tvmaze-api.factory';
import { tvmazeApiPresenterStub } from '../../../tests/mocks/tvmaze-api.presenter.stub';
import { fetchTvMazeSearchShows } from '../../tvmaze/api/tvmaze.api';
import { searchPresenter } from './search.presenter';

vi.mock('../../tvmaze/api/tvmaze.api', () => tvmazeApiPresenterStub);

describe('searchPresenter — getSearchResults()', () => {
  beforeEach(() => {
    vi.mocked(fetchTvMazeSearchShows).mockReset();
  });

  it('should return a SearchViewModel with results for a valid query', async () => {
    // Arrange
    const mockResults = [
      makeSearchResult({ id: 1, name: 'Breaking Bad', rating: { average: 9.5 } }),
      makeSearchResult({ id: 2, name: 'Better Call Saul', rating: { average: 8.8 } }),
    ];
    vi.mocked(fetchTvMazeSearchShows).mockResolvedValue(mockResults);

    // Act
    const { getSearchResults } = searchPresenter();
    const result = await getSearchResults('breaking');

    // Assert
    expect(result.query).toBe('breaking');
    expect(result.totalResults).toBe(2);
    expect(result.results[0].title).toBe('Breaking Bad');
  });

  it('should return empty results without calling the API for a blank query', async () => {
    // Act
    const { getSearchResults } = searchPresenter();
    const result = await getSearchResults('   ');

    // Assert
    expect(fetchTvMazeSearchShows).not.toHaveBeenCalled();
    expect(result.results).toEqual([]);
    expect(result.totalResults).toBe(0);
  });

  it('should propagate API errors to the caller', async () => {
    // Arrange
    vi.mocked(fetchTvMazeSearchShows).mockRejectedValue(new Error('Network error'));

    // Act
    const { getSearchResults } = searchPresenter();

    // Assert
    await expect(getSearchResults('breaking')).rejects.toThrow('Network error');
  });
});
