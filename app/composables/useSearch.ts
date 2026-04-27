import { computed, ref, watch } from 'vue';
import { useFetch, showError } from 'nuxt/app';
import { useRoute } from 'vue-router';
import type { SearchViewModel } from '../../domains/search/viewModel/searchViewModel.type';

const PAGE_SIZE = 12;

export const useSearch = () => {
  const route = useRoute();

  const searchQuery = computed<string>(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''));

  const { data, status } = useFetch<SearchViewModel>('/api/search', {
    query: computed(() => ({ q: searchQuery.value })),
    watch: [() => route.query.q],
    onResponseError({ response }) {
      showError({ statusCode: response.status, statusMessage: response._data?.statusMessage ?? response.statusText, fatal: true });
    },
  });

  // ── Lazy reveal: show PAGE_SIZE results at a time ───────────────────────
  const visibleCount = ref(PAGE_SIZE);

  // Reset visible count when the query changes so we start from page 1
  watch(searchQuery, () => {
    visibleCount.value = PAGE_SIZE;
  });

  const visibleResults = computed(() => (data.value?.results ?? []).slice(0, visibleCount.value));

  const hasMore = computed(() => visibleCount.value < (data.value?.totalResults ?? 0));

  const loadMore = (): void => {
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, data.value?.totalResults ?? 0);
  };

  return {
    searchQuery,
    data,
    status,
    visibleResults,
    hasMore,
    loadMore,
    PAGE_SIZE,
  };
};
