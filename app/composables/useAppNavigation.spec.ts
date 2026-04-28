import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_NAV_CATEGORY,
  PATH_HOME,
  PATH_SEARCH,
  PATH_SHOWS,
  SEARCH_PARAM,
  TYPE_PARAM,
} from '../../domains/constants/appConstant';
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
      const { selectedCategory } = useAppNavigation();
      expect(selectedCategory.value).toBe(DEFAULT_NAV_CATEGORY);
    });

    it('should reflect route.query.type when it is set', () => {
      routeState.query = { [TYPE_PARAM]: 'movies' };
      const { selectedCategory } = useAppNavigation();
      expect(selectedCategory.value).toBe('movies');
    });
  });

  describe('when navigating with category or search', () => {
    it('should push the home path with the selected category query', async () => {
      // Arrange
      const { setCategory } = useAppNavigation();

      // Act
      await setCategory('documentaries');

      // Assert
      expect(mockPush).toHaveBeenLastCalledWith(`${PATH_HOME}?${TYPE_PARAM}=documentaries`);
    });

    it('should push search with trimmed q and preserve other query', async () => {
      // Arrange
      routeState.query = { [TYPE_PARAM]: 'movies' };
      const { setSearchQuery } = useAppNavigation();

      // Act
      await setSearchQuery('  breaking  ');

      // Assert
      expect(mockPush).toHaveBeenLastCalledWith(`${PATH_SEARCH}?${TYPE_PARAM}=movies&${SEARCH_PARAM}=breaking`);
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
      routeState.query = { [TYPE_PARAM]: 'documentaries' };
      const { getShowPath } = useAppNavigation();

      // Act & Assert
      expect(getShowPath(42)).toBe(`${PATH_SHOWS}/42?${TYPE_PARAM}=documentaries`);
    });

    it('should push the show path with category on goToShow', async () => {
      // Arrange
      routeState.query = { [TYPE_PARAM]: 'documentaries' };
      const { goToShow } = useAppNavigation();

      // Act
      await goToShow(7);

      // Assert
      expect(mockPush).toHaveBeenCalledWith(`${PATH_SHOWS}/7?${TYPE_PARAM}=documentaries`);
    });
  });
});
