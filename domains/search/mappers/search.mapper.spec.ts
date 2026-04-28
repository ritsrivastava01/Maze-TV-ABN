import { describe, expect, it } from 'vitest';

import { makeSearchResult } from '../../../tests/mocks/tvmaze-api.factory';
import { FALLBACK_IMAGE } from '../../constants/appConstant';
import type { SearchResultApiModel } from '../../tvmaze/api/tvmaze.api';
import { mapSearchResultsApiToViewModel } from './search.mapper';

describe('mapSearchResultsApiToViewModel', () => {
  it('should map a result to the correct view model shape', () => {
    // Arrange
    const input = [makeSearchResult({ id: 42, name: 'Breaking Bad', rating: { average: 9.5 } })];

    // Act
    const result = mapSearchResultsApiToViewModel(input, 'breaking');

    // Assert
    expect(result.results[0]).toMatchObject({
      id: 42,
      title: 'Breaking Bad',
      rating: 9.5,
    });
  });

  it('should set totalResults to the number of results returned', () => {
    // Arrange
    const input = [makeSearchResult({ id: 1, name: 'Show A' }), makeSearchResult({ id: 2, name: 'Show B' })];

    // Act
    const result = mapSearchResultsApiToViewModel(input, 'show');

    // Assert
    expect(result.totalResults).toBe(2);
  });

  it('should include the search query in the view model', () => {
    // Arrange
    const input = [makeSearchResult()];

    // Act
    const result = mapSearchResultsApiToViewModel(input, 'breaking bad');

    // Assert
    expect(result.query).toBe('breaking bad');
  });

  it('should use fallback image when show image is null', () => {
    // Arrange
    const input = [makeSearchResult({ image: null })];

    // Act
    const result = mapSearchResultsApiToViewModel(input, 'query');

    // Assert
    expect(result.results[0].image).toBe(FALLBACK_IMAGE);
  });

  it('should return empty results and totalResults 0 when input is empty', () => {
    // Arrange
    const input: SearchResultApiModel[] = [];

    // Act
    const result = mapSearchResultsApiToViewModel(input, 'nothing');

    // Assert
    expect(result.results).toEqual([]);
    expect(result.totalResults).toBe(0);
  });
});
