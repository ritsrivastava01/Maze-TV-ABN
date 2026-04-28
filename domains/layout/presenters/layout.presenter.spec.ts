import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tvmazeApiPresenterStub } from '../../../tests/mocks/tvmaze-api.presenter.stub';
import type { LayoutNavApiModel } from '../../tvmaze/api/tvmaze.api';
import { fetchTvMazeLayoutNavItems } from '../../tvmaze/api/tvmaze.api';
import { useLayoutPresenter } from './layout.presenter';

vi.mock('../../tvmaze/api/tvmaze.api', () => tvmazeApiPresenterStub);

const nav = (overrides: Partial<LayoutNavApiModel> = {}): LayoutNavApiModel => ({
  value: 'tv-shows',
  labelKey: 'nav.tvShows',
  enabled: true,
  order: 1,
  ...overrides,
});

describe('useLayoutPresenter.getHeaderNavItems', () => {
  beforeEach(() => vi.mocked(fetchTvMazeLayoutNavItems).mockReset());

  describe('when the API returns navigation items', () => {
    it('should map and sort items for the header view model', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockResolvedValue([
        nav({ value: 'movies', order: 2, labelKey: 'nav.movies' }),
        nav({ value: 'tv-shows', order: 1 }),
      ]);

      // Act
      const result = await useLayoutPresenter().getHeaderNavItems();

      // Assert
      expect(result.headerNavItems.map((i) => i.value)).toEqual(['tv-shows', 'movies']);
    });
  });

  describe('when getHeaderNavItems is called more than once', () => {
    it('should fetch from the API each time (no cache)', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockResolvedValue([nav()]);

      // Act
      await useLayoutPresenter().getHeaderNavItems();
      await useLayoutPresenter().getHeaderNavItems();

      // Assert
      expect(fetchTvMazeLayoutNavItems).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the API fails', () => {
    it('should propagate the error', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockRejectedValueOnce(new Error('unavailable'));

      // Act & Assert
      await expect(useLayoutPresenter().getHeaderNavItems()).rejects.toThrow('unavailable');
    });
  });
});
