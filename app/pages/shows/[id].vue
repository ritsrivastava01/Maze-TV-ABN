<script setup lang="ts">
import { PhCaretLeft } from '@phosphor-icons/vue';

import { DEFAULT_NAV_CATEGORY, PATH_HOME, TYPE_PARAM } from '../../../domains/constants/appConstant';
import type {
  Episode,
  Season,
  ShowDetailsViewModel,
} from '../../../domains/showDetails/viewModel/showDetailsViewModel.type';

const { t } = useI18n();
const route = useRoute();
const showId = computed(() => Number(route.params.id));

const { data, error } = useFetch<ShowDetailsViewModel>(() => `/api/${showId.value}`, {
  key: () => `show-detail-${showId.value}`,
  watch: [showId],
});

const show = computed(() => data.value?.show ?? null);
const seasonList = computed(() => data.value?.seasonList ?? []);
const castPreview = computed(() => data.value?.cast ?? []);

const selectedSeason = ref<number | null>(null);

const otherSeasonEpisodes = ref<Episode[]>([]);
const episodesLoading = ref(false);
let loadingSeasonId: number | null = null;

// Reset stale season state when navigating to a different show.
watch(showId, () => {
  loadingSeasonId = null;
  selectedSeason.value = null;
  otherSeasonEpisodes.value = [];
});

async function loadSeasonEpisodes(season: Season) {
  // Clear immediately so panelEpisodes returns [] and skeletons show at once.
  otherSeasonEpisodes.value = [];
  // First season is already embedded in the details response.
  if (season.number === data.value?.seasonList[0]?.number) return;
  loadingSeasonId = season.id;
  episodesLoading.value = true;
  try {
    const eps = await $fetch<Episode[]>(`/api/season/${season.id}`);
    if (loadingSeasonId === season.id) {
      otherSeasonEpisodes.value = eps;
    }
  } catch {
    if (loadingSeasonId === season.id) otherSeasonEpisodes.value = [];
  } finally {
    if (loadingSeasonId === season.id) episodesLoading.value = false;
  }
}

const panelEpisodes = computed((): Episode[] => {
  if (!data.value) return [];
  if (selectedSeason.value === null || selectedSeason.value === data.value.seasonList[0]?.number) {
    return data.value.episodes;
  }
  return otherSeasonEpisodes.value;
});

const backPath = computed(() => ({
  path: PATH_HOME,
  query: { [TYPE_PARAM]: route.query[TYPE_PARAM] ?? DEFAULT_NAV_CATEGORY },
}));
</script>

<template>
  <!-- Header in layout is position:absolute, so we need top padding to clear it + breathing room like the design -->
  <div class="pb-16 pt-20 sm:pt-24 lg:pt-28">
    <!-- Row 1: md+ two columns — poster | overview & metadata -->
    <section class="px-4 sm:px-6 lg:px-10">
      <div v-if="error" class="ds-panel-error">Failed to load show: {{ error.message }}</div>

      <template v-else>
        <div class="mb-6 flex justify-start sm:mb-8">
          <NuxtLink :to="backPath" class="ds-btn-glass inline-flex h-10 items-center">
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
              <PhCaretLeft class="shrink-0 text-current" :size="18" weight="bold" aria-hidden="true" />
              <span>{{ t('actions.backToShows') }}</span>
            </span>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-10 lg:gap-12">
          <div class="md:col-span-5 lg:col-span-4">
            <Card
              :preview="show"
              image-loading="eager"
              class="aspect-[2/3] max-w-sm mx-auto md:max-w-none md:mx-0 shadow-xl shadow-black/40"
            />
          </div>

          <div class="min-w-0 md:col-span-7 lg:col-span-8">
            <ShowDetailOverview :show="show" :season-count="seasonList.length" />
          </div>
        </div>
      </template>
    </section>

    <!-- Row 2: episodes rail + cast rail, full width, shared top rule -->
    <div
      v-if="!error && data && (seasonList.length > 0 || castPreview.length > 0)"
      class="mt-16 space-y-10 border-t border-white/[0.08] pt-16 px-4 sm:px-6 lg:px-10 md:mt-20 md:space-y-12 md:pt-20"
    >
      <EpisodePanel
        v-if="seasonList.length > 0"
        v-model:selected-season="selectedSeason"
        :season-list="seasonList"
        :episodes="panelEpisodes"
        :loading="episodesLoading"
        @season-select="loadSeasonEpisodes"
      />

      <CastPanel :cast="castPreview" />
    </div>
  </div>
</template>
