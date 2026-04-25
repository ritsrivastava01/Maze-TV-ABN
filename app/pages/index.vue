<template>
  <main class="min-h-screen bg-slate-950 text-white">
    <section
      v-if="status === 'pending'"
      class="relative z-20 -mt-20 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10"
    >
      <section
        v-for="row in skeletonRows"
        :key="`pending-row-${row}`"
        class="mb-8"
      >
        <div class="mb-3 flex items-center justify-between px-2">
          <div class="h-6 w-28 animate-pulse rounded bg-slate-700/80" />
          <div class="h-4 w-16 animate-pulse rounded bg-slate-700/60" />
        </div>

        <div class="relative">
          <div
            class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
          />

          <div
            class="relative z-10 flex gap-7 overflow-x-hidden overflow-y-visible py-14 pl-7 pr-28"
          >
            <div
              v-for="card in skeletonCards"
              :key="`pending-card-${row}-${card}`"
              class="block min-w-[140px] max-w-[140px] shrink-0 first:ml-0 last:mr-14"
            >
              <CardSkeleton />
            </div>
          </div>
          <div
            class="pointer-events-none absolute bottom-10 left-0 top-10 z-20 w-8 rounded-l-3xl bg-gradient-to-r from-slate-800/95 to-transparent"
          />
          <div
            class="pointer-events-none absolute bottom-10 right-0 top-10 z-20 w-16 rounded-r-3xl bg-gradient-to-l from-slate-800/95 to-transparent"
          />
        </div>
      </section>
    </section>

    <div
      v-else-if="error"
      class="mx-auto max-w-7xl rounded-2xl bg-red-900/40 px-4 py-10 text-red-100 sm:px-6 lg:px-10"
    >
      <div class="rounded-2xl bg-black/20 p-6">
        Failed to load shows: {{ error.message }}
      </div>
    </div>

    <template v-else-if="featuredShow">
      <Hero :show="featuredShow" />

      <section
        class="relative z-20 -mt-20 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10"
      >
        <section v-if="visibleGenreRows.length === 0">
          <section
            v-for="row in skeletonRows"
            :key="`fallback-row-${row}`"
            class="mb-8"
          >
            <div class="mb-3 flex items-center justify-between px-2">
              <div class="h-6 w-28 animate-pulse rounded bg-slate-700/80" />
              <div class="h-4 w-16 animate-pulse rounded bg-slate-700/60" />
            </div>

            <div class="relative">
              <div
                class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
              />

              <div
                class="relative z-10 flex gap-7 overflow-x-hidden overflow-y-visible py-14 pl-7 pr-28"
              >
                <div
                  v-for="card in skeletonCards"
                  :key="`fallback-card-${row}-${card}`"
                  class="block min-w-[140px] max-w-[140px] shrink-0 first:ml-0 last:mr-14"
                >
                  <CardSkeleton />
                </div>
              </div>
              <div
                class="pointer-events-none absolute bottom-10 left-0 top-10 z-20 w-8 rounded-l-3xl bg-gradient-to-r from-slate-800/95 to-transparent"
              />
              <div
                class="pointer-events-none absolute bottom-10 right-0 top-10 z-20 w-16 rounded-r-3xl bg-gradient-to-l from-slate-800/95 to-transparent"
              />
            </div>
          </section>
        </section>
        <section v-for="row in visibleGenreRows" :key="row.genre" class="mb-8">
          <div class="mb-3 flex items-center justify-between px-2">
            <h3 class="text-xl font-bold">{{ row.genre }}</h3>
            <span class="text-xs text-slate-300">{{
              t('labels.showsCount', {count: row.shows.length})
            }}</span>
          </div>

          <div class="relative">
            <div
              class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
            />

            <div
              data-rail-scroll
              @scroll.passive="onRailScroll($event, row.genre)"
              class="relative z-10 flex gap-7 overflow-x-auto overflow-y-visible py-14 pl-7 pr-28 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-700/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pink-500/80 [&::-webkit-scrollbar-thumb:hover]:bg-pink-400"
            >
              <NuxtLink
                v-for="show in getVisibleShows(row.genre, row.shows)"
                :key="show.id"
                :to="getShowPath(show.id)"
                class="group relative z-0 block min-w-[140px] max-w-[140px] shrink-0 origin-center transform-gpu transition-transform duration-300 ease-out will-change-transform first:ml-0 last:mr-14 hover:z-30 hover:scale-125"
              >
                <div
                  class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60 transition duration-300 group-hover:border-pink-300/80 group-hover:ring-2 group-hover:ring-pink-400/80 group-hover:shadow-[0_0_28px_rgba(236,72,153,0.38)]"
                >
                  <div
                    v-show="!isRailImageLoaded(show.id)"
                    class="absolute inset-0 z-10 animate-pulse bg-slate-700/70"
                  />
                  <img
                    :src="show.image"
                    :alt="show.title"
                    class="h-[195px] w-full object-cover object-center transition-opacity duration-300"
                    :class="
                      isRailImageLoaded(show.id) ? 'opacity-100' : 'opacity-0'
                    "
                    loading="lazy"
                    @load="markRailImageLoaded(show.id)"
                    @error="markRailImageLoaded(show.id)"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                  />
                </div>
              </NuxtLink>
            </div>
            <div
              class="pointer-events-none absolute bottom-10 left-0 top-10 z-20 w-8 rounded-l-3xl bg-gradient-to-r from-slate-800/95 to-transparent"
            />
            <div
              class="pointer-events-none absolute bottom-10 right-0 top-10 z-20 w-16 rounded-r-3xl bg-gradient-to-l from-slate-800/95 to-transparent"
            />
          </div>
        </section>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useAsyncData} from 'nuxt/app';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import type {DashboardViewModel} from '../../domains/shows/viewModel/dashboardViewModel.type';
import type {LayoutNavCategory} from '../../domains/layout/viewModel/layoutViewModel.type';
import {useAppNavigation} from '#imports';
import {useDashboardPresenter} from '../../domains/shows/presenters/dashboard.presenter';

const visibleCountByGenre = ref<Record<string, number>>({});
const visibleRailCount = ref(3);
const railImageLoadedById = ref<Record<number, boolean>>({});
const {t} = useI18n();
const route = useRoute();
const {getShowPath} = useAppNavigation();

const normalizeCategory = (value: unknown): LayoutNavCategory => {
  if (value === 'movies' || value === 'documentaries' || value === 'tv-shows') {
    return value;
  }
  return 'tv-shows';
};

const selectedCategory = computed<LayoutNavCategory>(() => {
  return normalizeCategory(route.query.type);
});

const {getDashboard} = useDashboardPresenter();
const {data, status, error} = useAsyncData(
  'dashboard-view-model',
  async () => {
    return await getDashboard(selectedCategory.value);
  },
  {
    watch: [() => route.query.type]
  }
);

const dashboardViewModel = computed<DashboardViewModel>(() => {
  return (
    data.value ?? {
      shows: [],
      featuredShow: null,
      genreRows: [],
      genres: []
    }
  );
});

const featuredShow = computed(() => {
  return dashboardViewModel.value.featuredShow;
});

const genreRows = computed(() => {
  return dashboardViewModel.value.genreRows;
});
const visibleGenreRows = computed(() => {
  return genreRows.value.slice(0, visibleRailCount.value);
});

const CARD_WIDTH_PX = 140;
const CARD_GAP_PX = 28;
const RAIL_END_THRESHOLD_PX = 40;
const RAIL_BATCH_SIZE = 2;
const PAGE_BOTTOM_THRESHOLD_PX = 220;
const RAIL_IMAGE_REVEAL_DELAY_MS = 1200;
const skeletonRows = [0, 1, 2];
const skeletonCards = [0, 1, 2, 3, 4, 5, 6, 7];

const getBatchSize = (railWidth: number): number => {
  return Math.max(4, Math.ceil(railWidth / (CARD_WIDTH_PX + CARD_GAP_PX)) + 2);
};

const getVisibleShows = <T extends {id: number}>(
  genre: string,
  shows: T[]
): T[] => {
  const existingCount = visibleCountByGenre.value[genre];
  if (!existingCount) {
    const initialRailWidth =
      typeof window === 'undefined'
        ? 1024
        : Math.min(window.innerWidth * 0.8, 1280);
    visibleCountByGenre.value[genre] = getBatchSize(initialRailWidth);
  }

  return shows.slice(0, visibleCountByGenre.value[genre]);
};

const isRailImageLoaded = (showId: number): boolean => {
  return Boolean(railImageLoadedById.value[showId]);
};

const markRailImageLoaded = (showId: number): void => {
  window.setTimeout(() => {
    railImageLoadedById.value[showId] = true;
  }, RAIL_IMAGE_REVEAL_DELAY_MS);
};

const onRailScroll = (event: Event, genre: string): void => {
  const rail = event.currentTarget as HTMLElement | null;
  if (!rail) {
    return;
  }

  const isNearEnd =
    rail.scrollLeft + rail.clientWidth >=
    rail.scrollWidth - RAIL_END_THRESHOLD_PX;
  if (!isNearEnd) {
    return;
  }

  const currentCount = visibleCountByGenre.value[genre] ?? 0;
  const nextCount = currentCount + getBatchSize(rail.clientWidth);
  visibleCountByGenre.value[genre] = nextCount;

  // Future improvement: replace this scroll-threshold trigger with an
  // IntersectionObserver sentinel for more efficient row-end detection.
};

const loadMoreRails = (): void => {
  if (visibleRailCount.value >= genreRows.value.length) {
    return;
  }

  visibleRailCount.value = Math.min(
    visibleRailCount.value + RAIL_BATCH_SIZE,
    genreRows.value.length
  );
};

const onWindowScroll = (): void => {
  const viewportBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;
  const isNearBottom = viewportBottom >= pageBottom - PAGE_BOTTOM_THRESHOLD_PX;

  if (isNearBottom) {
    loadMoreRails();
  }
};

watch(
  genreRows,
  (rows) => {
    if (rows.length === 0) {
      visibleRailCount.value = 0;
      return;
    }

    visibleRailCount.value = Math.min(
      Math.max(visibleRailCount.value || 3, 3),
      rows.length
    );
  },
  {immediate: true}
);

onMounted(() => {
  railImageLoadedById.value = {};
  window.addEventListener('scroll', onWindowScroll, {passive: true});
  onWindowScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll);
});
</script>
