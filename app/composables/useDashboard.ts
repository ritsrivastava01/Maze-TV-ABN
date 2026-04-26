import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useFetch } from 'nuxt/app';
import { useRoute } from 'vue-router';
import type { DashboardCategory, DashboardViewModel } from '../../domains/dashboard/viewModel/dashboardViewModel.type';
import type { ShowViewModel } from '../../domains/dashboard/viewModel/show.type';

const RAIL_CARD_BATCH_SIZE = 8;
const RAIL_COUNT = 3;
const PAGE_BOTTOM_LOAD_THRESHOLD_PX = 220;

/** Validates and narrows a raw query-string value to a DashboardCategory. */
const toDashboardCategory = (value: unknown): DashboardCategory => {
  if (value === 'movies' || value === 'documentaries' || value === 'tv-shows') {
    return value;
  }
  return 'tv-shows';
};

/**
 * Encapsulates all data-fetching and pagination logic for the dashboard page.
 * The component only needs to handle rendering.
 */
export const useDashboard = () => {
  const route = useRoute();

  const selectedCategory = computed<DashboardCategory>(() => toDashboardCategory(route.query.type));

  const searchQuery = computed<string>(() => (typeof route.query.search === 'string' ? route.query.search.trim() : ''));

  const { data, status, error } = useFetch<DashboardViewModel>('/api/dashboard', {
    query: computed(() => ({ type: selectedCategory.value })),
    watch: [() => route.query.type],
  });

  // ── Infinite-scroll: rail rows ──────────────────────────────────────────
  const visibleRailCount = ref(RAIL_COUNT);

  watch(
    () => data.value?.genreRows,
    (rows = []) => {
      visibleRailCount.value = rows.length === 0 ? 0 : Math.min(RAIL_COUNT, rows.length);
    },
    { immediate: true },
  );

  // ── Infinite-scroll: cards inside a rail ───────────────────────────────
  const visibleCountByGenre = ref<Record<string, number>>({});

  const getVisibleShows = (genre: string, shows: ShowViewModel[]): ShowViewModel[] => {
    if (!visibleCountByGenre.value[genre]) {
      visibleCountByGenre.value[genre] = RAIL_CARD_BATCH_SIZE;
    }
    return shows.slice(0, visibleCountByGenre.value[genre]);
  };

  const onRailScroll = (event: Event, genre: string): void => {
    const rail = event.currentTarget as HTMLElement | null;
    if (!rail) return;

    const isNearEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 40;
    if (!isNearEnd) return;

    const current = visibleCountByGenre.value[genre] ?? 0;
    visibleCountByGenre.value[genre] = current + RAIL_CARD_BATCH_SIZE;
  };

  // ── Page-scroll: load more rows ─────────────────────────────────────────
  const loadMoreRails = (): void => {
    const rowCount = data.value?.genreRows.length ?? 0;
    if (visibleRailCount.value >= rowCount) return;
    visibleRailCount.value = Math.min(visibleRailCount.value + RAIL_COUNT, rowCount);
  };

  const onWindowScroll = (): void => {
    const viewportBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight;
    if (viewportBottom >= pageBottom - PAGE_BOTTOM_LOAD_THRESHOLD_PX) {
      loadMoreRails();
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    onWindowScroll();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onWindowScroll);
  });

  // ── Derived: rows filtered by search query ──────────────────────────────
  const visibleGenreRows = computed(() => {
    const allRows = data.value?.genreRows.slice(0, visibleRailCount.value) ?? [];
    const q = searchQuery.value.toLowerCase();
    if (!q) return allRows;

    return allRows
      .map((row) => ({
        ...row,
        shows: row.shows.filter((s) => s.title.toLowerCase().includes(q)),
      }))
      .filter((row) => row.shows.length > 0);
  });

  const featuredShow = computed(() => {
    const q = searchQuery.value.toLowerCase();
    const featured = status.value === 'pending' ? null : (data.value?.featuredShow ?? null);
    // Hide the hero when user is actively searching
    return q ? null : featured;
  });

  return {
    data,
    status,
    error,
    featuredShow,
    visibleGenreRows,
    searchQuery,
    getVisibleShows,
    onRailScroll,
    RAIL_CARD_BATCH_SIZE,
    RAIL_COUNT,
  };
};
