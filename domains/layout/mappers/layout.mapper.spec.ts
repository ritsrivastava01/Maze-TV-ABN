import { describe, expect, it } from 'vitest';

import type { LayoutNavApiModel } from '../../tvmaze/api/tvmaze.api';
import { mapHeaderNavItemsToViewModel } from './layout.mapper';

const nav = (overrides: Partial<LayoutNavApiModel> = {}): LayoutNavApiModel => ({
  value: 'tv-shows',
  labelKey: 'nav.tvShows',
  enabled: true,
  order: 1,
  ...overrides,
});

describe('mapHeaderNavItemsToViewModel', () => {
  describe('when there are disabled items', () => {
    it('should show only enabled items and sort them by order', () => {
      // Arrange
      const input = [
        nav({ value: 'movies', order: 3, labelKey: 'nav.movies', enabled: false }),
        nav({ value: 'movies', order: 2, labelKey: 'nav.movies' }),
        nav({ value: 'tv-shows', order: 1 }),
      ];

      // Act
      const result = mapHeaderNavItemsToViewModel(input);

      // Assert
      expect(result.headerNavItems).toEqual([
        { value: 'tv-shows', labelKey: 'nav.tvShows', order: 1 },
        { value: 'movies', labelKey: 'nav.movies', order: 2 },
      ]);
    });
  });

  describe('when there are no items', () => {
    it('should return headerNavItems as an empty array', () => {
      // Arrange
      const input: LayoutNavApiModel[] = [];

      // Act
      const result = mapHeaderNavItemsToViewModel(input);

      // Assert
      expect(result.headerNavItems).toEqual([]);
    });
  });
});
