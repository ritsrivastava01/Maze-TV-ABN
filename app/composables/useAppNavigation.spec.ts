import { beforeEach, describe, expect, it, vi } from 'vitest';

import { i18nMockFactory, mockPush, routeState, vueRouterMockFactory } from '../../tests/mocks/app-navigation.stub';
import { useAppNavigation } from './useAppNavigation';

vi.mock('vue-router', () => vueRouterMockFactory());
vi.mock('#i18n', () => i18nMockFactory());

describe('useAppNavigation', () => {
  beforeEach(() => {
    routeState.query = {};
    mockPush.mockReset();
  });

  describe('when reading selectedCategory', () => {
    it('should default to tv-shows when route has no type query', () => {
      // Arrange
      // Act
      const { selectedCategory } = useAppNavigation();

      // Assert
      expect(useAppNavigation().selectedCategory.value).toBe('tv-shows');
    });

    it('should reflect route.query.type when it is set', () => {
      // Arrange
      routeState.query = { type: 'movies' };

      // Act
      const { selectedCategory } = useAppNavigation();

      // Assert
      expect(useAppNavigation().selectedCategory.value).toBe('movies');
    });
  });

  describe('when navigating with category or search', () => {
    it('should push the home path with the selected category query', async () => {
      // Arrange
      const { setCategory } = useAppNavigation();

      // Act
      await setCategory('documentaries');

      // Assert
      expect(mockPush).toHaveBeenLastCalledWith('/?type=documentaries');
    });

    it('should push search with trimmed q and preserve other query', async () => {
      // Arrange
      routeState.query = { type: 'movies' };
      const { setSearchQuery } = useAppNavigation();

      // Act
      await setSearchQuery('  breaking  ');

      // Assert
      expect(mockPush).toHaveBeenLastCalledWith('/search?type=movies&q=breaking');
    });

    it('should not push when the search string is empty or whitespace', async () => {
      // Arrange
      const { setSearchQuery } = useAppNavigation();

      // Act
      await setSearchQuery('   ');

      // Assert
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('when building show URLs', () => {
    it('should include the current category in getShowPath', () => {
      // Arrange
      routeState.query = { type: 'documentaries' };
      const { getShowPath } = useAppNavigation();

      // Act & Assert
      expect(getShowPath(42)).toBe('/shows/42?type=documentaries');
    });

    it('should push the show path with category on goToShow', async () => {
      // Arrange
      routeState.query = { type: 'documentaries' };
      const { goToShow } = useAppNavigation();

      // Act
      await goToShow(7);

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/shows/7?type=documentaries');
    });
  });
});
