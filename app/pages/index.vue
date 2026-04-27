<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useFetch, showError, createError } from 'nuxt/app';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type {
  DashboardCategory,
  DashboardViewModel
} from '../../domains/dashboard/viewModel/dashboardViewModel.type';
import { useAppNavigation } from '#imports';
import Card from '../components/Card.vue';
import Rail from '../components/Rail.vue';
import type { ShowViewModel } from '~~/domains/dashboard/viewModel/show.type';

const RAIL_CARD_BATCH_SIZE = 8;
const RAIL_COUNT = 3;
const PAGE_BOTTOM_LOAD_THRESHOLD_PX = 220;
const heroHeightClass = 'h-[75vh]';
const visibleRailCount = ref(RAIL_COUNT);

const visibleCountByGenre = ref<Record<string, number>>({});
const route = useRoute();
const { t } = useI18n();
const { getShowPath } = useAppNavigation();

const railShowClass = 'block h-72 w-52 min-w-52 shrink-0';

const selectedCategory = computed<DashboardCategory>(() => {
  const v = route.query.type;
  return v === 'movies' || v === 'documentaries' || v === 'tv-shows'
    ? v
    : 'tv-shows';
});

const { data, status, error } = await useFetch<DashboardViewModel>(
  '/api/dashboard',
  {
    query: computed(() => ({ type: selectedCategory.value }))
  }
);

// SSR: throw immediately so error.vue is rendered instead of the page
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage:
      (error.value.data as any)?.statusMessage ?? error.value.message,
    fatal: true
  });
}

// CSR: watch for errors on reactive re-fetches (category switch)
watch(error, (err) => {
  if (err)
    showError({
      statusCode: err.statusCode ?? 500,
      statusMessage: (err.data as any)?.statusMessage ?? err.message,
      fatal: true
    });
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
 */
const dashboardRails = computed(() => {
  if (status.value === 'pending' || status.value === 'idle') {
    return Array.from({ length: RAIL_COUNT }, (_, i) => {
      return {
        key: `placeholder-${i}`,
        genre: null,
        shows: [],
        cards: Array.from({ length: RAIL_CARD_BATCH_SIZE }, () => null),
        isEmpty: false
      };
    });
  }
  return (data.value?.genreRows.slice(0, visibleRailCount.value) ?? []).map(
    (r) => {
      return {
        key: r.genre,
        genre: r.genre,
        shows: r.shows,
        cards: getVisibleShows(r.genre, r.shows),
        isEmpty: r.shows.length === 0
      };
    }
  );
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
 *   used to add the scroll event listener to the window
 *   used to load the more rails when the user scrolls to the end of the page
 */
onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, { passive: true });
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
    :show="
      status === 'pending' || status === 'idle'
        ? null
        : (data?.featuredShow ?? null)
    "
    :class="heroHeightClass"
  />

  <section
    class="relative z-20 -mt-20 mx-auto container px-4 pb-10 sm:px-6 lg:px-10"
  >
    <Rail
      v-for="row in dashboardRails"
      :key="row.key"
      :header-title="row.genre"
      :header-subtitle="
        row.genre
          ? t('labels.showsCount', { count: row.shows.length })
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
      <p v-if="row.isEmpty" class="px-1 py-8 text-sm text-slate-400">
        {{ t('labels.noShowsInGenre') }}
      </p>
      <template v-else>
        <div
          v-for="(card, index) in row.cards"
          :key="card?.id ?? `${row.key}-${index}`"
          :class="railShowClass"
        >
          <NuxtLink
            v-if="card"
            :to="getShowPath(card.id)"
            class="block h-full w-full"
          >
            <Card
              :preview="card"
              class="h-full w-full"
              :shell-class="'ds-card-rail-shell'"
            />
          </NuxtLink>
          <Card v-else :preview="null" class="h-full w-full" />
        </div>
      </template>
    </Rail>
  </section>
</template>
