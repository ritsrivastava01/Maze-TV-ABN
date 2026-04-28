import { SEARCH_PARAM } from '../../domains/constants/appConstant';
import { searchPresenter } from '../../domains/search/presenters/search.presenter';

/**
 * Returns search results for the given query string.
 * Short cache (30 s) per unique query — search results are query-specific
 * but still benefit from deduplication of rapid re-fetches.
 */
export default defineCachedEventHandler(
  async (event) => {
    const params = getQuery(event);
    const query = String(params[SEARCH_PARAM] ?? '').trim();

    if (!query) {
      return { query: '', totalResults: 0, results: [] };
    }

    const { getSearchResults } = searchPresenter();

    try {
      return await getSearchResults(query);
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'errors.searchLoadFailed',
      });
    }
  },
  {
    maxAge: 30, // 30 seconds — search results can change more often than browse lists
    name: 'search',
    getKey: (event) => {
      const params = getQuery(event);
      return String(params[SEARCH_PARAM] ?? '')
        .trim()
        .toLowerCase();
    },
  }
);
