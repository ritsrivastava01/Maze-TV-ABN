import { describe, expect, it } from 'vitest';

import { makeShowApi } from '../../../tests/mocks/tvmaze-api.factory';
import { DEFAULT_NAV_CATEGORY } from '../../constants/appConstant';
import { mapShowsApiToDashboardViewModel } from './dashboard.mapper';

describe('mapShowsApiToDashboardViewModel', () => {
  it('should select the highest-rated show as featured for tv-shows', () => {
    // Arrange
    const input = [
      makeShowApi({ id: 1, name: 'Low Rated', rating: { average: 5 }, genres: ['Drama'] }),
      makeShowApi({ id: 2, name: 'Top Rated', rating: { average: 9 }, genres: ['Drama'] }),
    ];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.title).toBe('Top Rated');
  });

  it('should keep only movie-like genres when category is movies', () => {
    // Arrange
    const input = [
      makeShowApi({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeShowApi({ id: 2, name: 'Nature Doc', genres: ['Nature'], rating: { average: 7 } }),
    ];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, 'movies');

    // Assert
    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('Action Hero');
    expect(allTitles).not.toContain('Nature Doc');
  });

  it('should keep only documentary-like genres when category is documentaries', () => {
    // Arrange
    const input = [
      makeShowApi({ id: 1, name: 'Action Hero', genres: ['Action'], rating: { average: 8 } }),
      makeShowApi({ id: 2, name: 'History Doc', genres: ['Documentary'], rating: { average: 7 } }),
    ];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, 'documentaries');

    // Assert
    const allTitles = result.genreRows.flatMap((r) => r.shows.map((s) => s.title));
    expect(allTitles).toContain('History Doc');
    expect(allTitles).not.toContain('Action Hero');
  });

  it('should map 5/10 rating to half-filled third star', () => {
    // Arrange
    const input = [makeShowApi({ rating: { average: 5 } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.ratingStarFills).toEqual([100, 100, 50, 0, 0]);
  });

  it('should map 7.3/10 rating to quarter-filled fourth star', () => {
    // Arrange
    const input = [makeShowApi({ rating: { average: 7.3 } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.ratingStarFills).toEqual([100, 100, 100, 75, 0]);
  });

  it('should map 10/10 rating to five fully-filled stars', () => {
    // Arrange
    const input = [makeShowApi({ rating: { average: 10 } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.ratingStarFills).toEqual([100, 100, 100, 100, 100]);
  });

  it('should map 0/10 rating to five empty stars', () => {
    // Arrange
    const input = [makeShowApi({ rating: { average: 0 } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.ratingStarFills).toEqual([0, 0, 0, 0, 0]);
  });

  it('should map null rating to five empty stars', () => {
    // Arrange
    const input = [makeShowApi({ rating: { average: null } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, DEFAULT_NAV_CATEGORY);

    // Assert
    expect(result.featuredShow?.ratingStarFills).toEqual([0, 0, 0, 0, 0]);
  });

  it('should fall back to all shows when movies filter matches nothing', () => {
    // Arrange
    const input = [makeShowApi({ id: 1, name: 'Drama Show', genres: ['Drama'], rating: { average: 8 } })];

    // Act
    const result = mapShowsApiToDashboardViewModel(input, 'movies');

    // Assert
    expect(result.featuredShow?.title).toBe('Drama Show');
  });
});
