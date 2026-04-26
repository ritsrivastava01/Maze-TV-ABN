<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useFetch} from 'nuxt/app';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import type {
  DashboardCategory,
  DashboardViewModel
} from '../../domains/dashboard/viewModel/dashboardViewModel.type';
import Card from '../components/Card.vue';
import Rail from '../components/Rail.vue';
import type {ShowViewModel} from '~~/domains/dashboard/viewModel/show.type';

const RAIL_CARD_BATCH_SIZE = 8;
const RAIL_COUNT = 3;
const PAGE_BOTTOM_LOAD_THRESHOLD_PX = 220;
const heroHeightClass = 'h-[75vh]';
const visibleRailCount = ref(RAIL_COUNT);

const visibleCountByGenre = ref<Record<string, number>>({});
const route = useRoute();
const {t} = useI18n();

// used to validate the category from the query string
const getDashboardCategory = (value: unknown): DashboardCategory => {
  if (value === 'movies' || value === 'documentaries' || value === 'tv-shows') {
    return value;
  }
  return 'tv-shows';
};

// used to get the selected category from the query string
const selectedCategory = computed<DashboardCategory>(() => {
  return getDashboardCategory(route.query.type);
});

const {data, status, error} = useFetch<DashboardViewModel>('/api/dashboard', {
  query: computed(() => {
    return {
      type: selectedCategory.value
    };
  }),
  watch: [() => route.query.type]
});

const visibleGenreRows = computed(() => {
  return data.value?.genreRows.slice(0, visibleRailCount.value) ?? [];
});

/**
 *   used to get the visible shows for the given genre
 */
const getVisibleShows = (
  genre: string,
  shows: ShowViewModel[]
): ShowViewModel[] => {
  const existingCount = visibleCountByGenre.value[genre];
  if (!existingCount) {
    visibleCountByGenre.value[genre] = RAIL_CARD_BATCH_SIZE;
  }
  return shows.slice(0, visibleCountByGenre.value[genre]);
};

/**
 * Get the actual show card or skeleton cards for the genre rows
 * . */
const dashboardRails = computed(() => {
  if (status.value === 'pending' || visibleGenreRows.value.length === 0) {
    return Array.from({length: RAIL_COUNT}, (_, i) => {
      return {
        key: `placeholder-${i}`,
        genre: null,
        shows: [],
        cards: Array.from({length: RAIL_CARD_BATCH_SIZE}, () => null)
      };
    });
  }
  return visibleGenreRows.value.map((r) => {
    return {
      key: r.genre,
      genre: r.genre,
      shows: r.shows,
      cards: getVisibleShows(r.genre, r.shows)
    };
  });
});

/**
 *   used to handle the scroll event for the rail
 *   used to load more cards when the user scrolls to the end of the rail
 */
const onRailScroll = (event: Event, genre: string): void => {
  const rail = event.currentTarget as HTMLElement | null;
  if (!rail) {
    return;
  }

  const isNearEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 40;
  if (!isNearEnd) {
    return;
  }

  const currentCount = visibleCountByGenre.value[genre] ?? 0;
  const nextCount = currentCount + RAIL_CARD_BATCH_SIZE;
  visibleCountByGenre.value[genre] = nextCount;

  // Future improvement: replace this scroll-threshold trigger with an
  // IntersectionObserver sentinel for more efficient row-end detection.
};

/**
 *   used to load more rails when the user scrolls to the end of the rail
 */
const loadMoreRails = (): void => {
  const rowCount = data.value?.genreRows.length ?? 0;
  if (visibleRailCount.value >= rowCount) {
    return;
  }

  visibleRailCount.value = Math.min(
    visibleRailCount.value + RAIL_COUNT,
    rowCount
  );
};

/**
 *  track user scroll event to load more rails when the user scrolls to the end of the page
 */
const onWindowScroll = (): void => {
  const viewportBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;
  const isNearBottom =
    viewportBottom >= pageBottom - PAGE_BOTTOM_LOAD_THRESHOLD_PX;

  if (isNearBottom) {
    loadMoreRails();
  }
};

/**
 *   load the more rails when the user scrolls to the end of the page
 */
watch(
  () => data.value?.genreRows,
  (rows = []) => {
    if (rows.length === 0) {
      visibleRailCount.value = 0;
      return;
    }

    if (rows.length < RAIL_COUNT) {
      visibleRailCount.value = rows.length;
      return;
    }

    visibleRailCount.value = RAIL_COUNT;
  },
  {immediate: true}
);

/**
 *   used to add the scroll event listener to the window
 *   used to load the more rails when the user scrolls to the end of the page
 */
onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, {passive: true});
  onWindowScroll();
});

/**
 *   used to remove the scroll event listener from the window
 */
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll);
});
</script>

<template>
  <Hero
    :show="status === 'pending' ? null : (data?.featuredShow ?? null)"
    :class="heroHeightClass"
  />

  <div
    v-if="error"
    class="mx-auto container rounded-2xl bg-red-900/40 px-4 py-10 text-red-100 sm:px-6 lg:px-10"
  >
    <div class="rounded-2xl bg-black/20 p-6">
      Failed to load shows: {{ error.message }}
    </div>
  </div>

  <section
    v-else
    class="relative z-20 -mt-20 mx-auto container px-4 pb-10 sm:px-6 lg:px-10"
  >
    <Rail
      v-for="row in dashboardRails"
      :key="row.key"
      :header-title="row.genre"
      :header-subtitle="
        row.genre
          ? t('labels.showsCount', {count: row.shows.length})
          : undefined
      "
      @rail-scroll="
        (event) => {
          if (row.genre) {
            onRailScroll(event, row.genre);
          }
        }
      "
    >
      <Card
        v-for="(card, index) in row.cards"
        :key="card?.id ?? `${row.key}-${index}`"
        class="h-72 w-52 min-w-52"
        :show="card"
      />
    </Rail>
  </section>
</template>
