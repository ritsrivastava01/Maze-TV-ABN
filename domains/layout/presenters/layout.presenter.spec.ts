import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tvmazeApiPresenterStub } from '../../../tests/mocks/tvmaze-api.presenter.stub';
import { DEFAULT_NAV_CATEGORY } from '../../constants/appConstant';
import type { LayoutNavApiModel } from '../../tvmaze/api/tvmaze.api';
import { fetchTvMazeLayoutNavItems } from '../../tvmaze/api/tvmaze.api';
import { layoutPresenter } from './layout.presenter';

vi.mock('../../tvmaze/api/tvmaze.api', () => tvmazeApiPresenterStub);

const nav = (overrides: Partial<LayoutNavApiModel> = {}): LayoutNavApiModel => ({
  value: DEFAULT_NAV_CATEGORY,
  labelKey: 'nav.tvShows',
  enabled: true,
  order: 1,
  ...overrides,
});

describe('layoutPresenter.getHeaderNavItems', () => {
  beforeEach(() => vi.mocked(fetchTvMazeLayoutNavItems).mockReset());

  describe('when the API returns navigation items', () => {
    it('should map and sort items for the header view model', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockResolvedValue([
        nav({ value: 'movies', order: 2, labelKey: 'nav.movies' }),
        nav({ value: DEFAULT_NAV_CATEGORY, order: 1 }),
      ]);

      // Act
      const result = await layoutPresenter().getHeaderNavItems();

      // Assert
      expect(result.headerNavItems.map((i) => i.value)).toEqual([DEFAULT_NAV_CATEGORY, 'movies']);
    });
  });

  describe('when getHeaderNavItems is called more than once', () => {
    it('should fetch from the API each time (no cache)', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockResolvedValue([nav()]);

      // Act
      await layoutPresenter().getHeaderNavItems();
      await layoutPresenter().getHeaderNavItems();

      // Assert
      expect(fetchTvMazeLayoutNavItems).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the API fails', () => {
    it('should propagate the error', async () => {
      // Arrange
      vi.mocked(fetchTvMazeLayoutNavItems).mockRejectedValueOnce(new Error('unavailable'));

      // Act & Assert
      await expect(layoutPresenter().getHeaderNavItems()).rejects.toThrow('unavailable');
    });
  });
});
