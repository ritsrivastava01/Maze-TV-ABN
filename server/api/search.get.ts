import { useSearchPresenter } from '../../domains/search/presenters/search.presenter';

/**
 * Returns search results for the given query string.
 * Short cache (30 s) per unique query — search results are query-specific
 * but still benefit from deduplication of rapid re-fetches.
 */
export default defineCachedEventHandler(
  async (event) => {
    const { q = '' } = getQuery(event);
    const query = String(q).trim();

    if (!query) {
      return { query: '', totalResults: 0, results: [] };
    }

    const { getSearchResults } = useSearchPresenter();
    return await getSearchResults(query);
  },
  {
    maxAge: 30, // 30 seconds — search results can change more often than browse lists
    name: 'search',
    getKey: (event) => {
      const { q = '' } = getQuery(event);
      return String(q).trim().toLowerCase();
    },
  },
);
