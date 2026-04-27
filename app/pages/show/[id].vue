<script setup lang="ts">
import { PhCaretLeft } from '@phosphor-icons/vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetch, showError, createError } from 'nuxt/app';
import { useRoute } from 'vue-router';
import CastCard from '../../components/CastCard.vue';
import EpisodeCard from '../../components/EpisodeCard.vue';
import RatingStars from '../../components/RatingStars.vue';
import Rail from '../../components/Rail.vue';
import type { ShowDetailViewModel } from '../../../domains/show/viewModel/showDetailViewModel.type';

const { t } = useI18n();
const route = useRoute();
const showId = computed(() => Number(route.params.id));

const { data, status, error } = await useFetch<ShowDetailViewModel>(
  () => `/api/show/${showId.value}`,
  {
    key: () => `show-detail-${showId.value}`,
    /** Only refetch when navigating to a different show — season is client-only filtering on cached payload. */
    watch: [showId]
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

// CSR: watch for errors on reactive re-fetches (show navigation)
watch(error, (err) => {
  if (err)
    showError({
      statusCode: err.statusCode ?? 500,
      statusMessage: (err.data as any)?.statusMessage ?? err.message,
      fatal: true
    });
});

const isNotFound = computed(
  () => status.value !== 'pending' && status.value !== 'idle' && !data.value
);

const show = computed(() => data.value?.show ?? null);
const selectedSeason = ref<number | null>(null);
const seasons = computed(() => data.value?.seasons ?? []);
const selectedSeasonEpisodes = computed(() => {
  return (
    seasons.value.find((season) => season.season === selectedSeason.value)
      ?.episodes ?? []
  );
});
const castPreview = computed(() => data.value?.cast ?? []);
/** Detail grid: network & runtime stay under the title only. */
const detailItems = computed(() => {
  if (!show.value) {
    return [];
  }

  const seasonCount = data.value?.seasons.length ?? 0;

  return [
    { label: 'Status', value: show.value.status },
    { label: 'Premiered', value: show.value.premiered },
    { label: 'Ended', value: show.value.ended },
    { label: 'Country', value: show.value.country },
    { label: 'Days', value: show.value.scheduleDays },
    { label: 'Time', value: show.value.scheduleTime },
    { label: 'Seasons', value: String(seasonCount) },
    { label: 'Type', value: show.value.type },
    { label: 'Language', value: show.value.language }
  ];
});

const backPath = computed(() => {
  return {
    path: '/',
    query: {
      type: route.query.type ?? 'tv-shows'
    }
  };
});

watch(
  seasons,
  (availableSeasons) => {
    if (selectedSeason.value || availableSeasons.length === 0) {
      return;
    }

    selectedSeason.value = availableSeasons[0].season;
  },
  { immediate: true }
);
</script>

<template>
  <!-- Header in layout is position:absolute, so we need top padding to clear it + breathing room like the design -->
  <div class="pb-16 pt-20 sm:pt-24 lg:pt-28">
    <section class="px-4 sm:px-6 lg:px-10">
      <div class="mb-6 flex justify-start sm:mb-8">
        <NuxtLink
          :to="backPath"
          class="ds-btn-glass inline-flex h-10 items-center"
        >
          <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
            <PhCaretLeft
              class="shrink-0 text-current"
              :size="18"
              weight="bold"
              aria-hidden="true"
            />
            <span>{{ t('actions.goHome') }}</span>
          </span>
        </NuxtLink>
      </div>

      <div
        class="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-10 lg:gap-12"
      >
        <div class="md:col-span-5 lg:col-span-4">
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl shadow-black/40 aspect-[2/3] max-w-sm mx-auto md:max-w-none md:mx-0"
          >
            <img
              v-if="show"
              :src="show.image"
              :alt="show.title"
              class="h-full w-full object-cover"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div
              v-else
              class="absolute inset-0 animate-pulse bg-slate-800/80"
            />
          </div>
        </div>

        <div class="min-w-0 md:col-span-7 lg:col-span-8">
          <!-- Not found -->
          <div
            v-if="isNotFound"
            class="flex h-full flex-col justify-center py-4"
          >
            <p
              class="text-xs font-semibold uppercase tracking-widest text-pink-400"
            >
              {{ t('showDetail.notFoundLabel') }}
            </p>
            <h2 class="mt-3 text-2xl font-black text-white">
              {{ t('showDetail.notFoundTitle') }}
            </h2>
            <p class="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {{ t('showDetail.notFoundMessage') }}
            </p>
          </div>

          <!-- Loading skeleton -->
          <div
            v-else-if="status === 'pending' || status === 'idle'"
            class="space-y-4"
          >
            <div
              class="h-3 w-2/3 max-w-xs animate-pulse rounded bg-slate-700/80"
            />
            <div
              class="h-10 w-4/5 max-w-md animate-pulse rounded bg-slate-700/80"
            />
            <div class="h-5 w-32 animate-pulse rounded bg-slate-700/70" />
            <div class="space-y-2 pt-2">
              <div class="h-3 w-full animate-pulse rounded bg-slate-700/70" />
              <div class="h-3 w-5/6 animate-pulse rounded bg-slate-700/70" />
              <div class="h-3 w-2/3 animate-pulse rounded bg-slate-700/70" />
            </div>
            <div
              class="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6 lg:grid-cols-3"
            >
              <div v-for="n in 9" :key="`sk-${n}`" class="space-y-2">
                <div class="h-2 w-20 animate-pulse rounded bg-slate-700/60" />
                <div
                  class="h-4 w-28 max-w-full animate-pulse rounded bg-slate-700/80"
                />
              </div>
            </div>
          </div>

          <!-- Loaded content -->
          <div v-else-if="show">
            <div v-if="show.genres.length" class="flex flex-wrap gap-2">
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="ds-badge-genre"
              >
                {{ genre }}
              </span>
            </div>

            <h1 class="mt-4 ds-heading-page text-white">
              {{ show.title }}
            </h1>

            <div
              class="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <p class="text-sm text-slate-300">
                {{ show.network }} ·
                <span v-if="show.premieredYear != null">{{
                  show.premieredYear
                }}</span>
                · {{ show.status }} · {{ show.runtime }}
              </p>
              <RatingStars
                :rating="show.rating"
                :rating-star-fills="show.ratingStarFills"
              />
            </div>

            <div
              class="mt-6 line-clamp-none max-w-3xl overflow-hidden text-sm leading-7 text-slate-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] sm:[-webkit-line-clamp:8] md:[-webkit-line-clamp:none] [&_p]:m-0"
              v-html="show.summary"
            />

            <div class="mt-6 flex flex-wrap gap-2">
              <a
                v-if="show.officialSite"
                :href="show.officialSite"
                target="_blank"
                rel="noreferrer"
                class="ds-btn-light"
              >
                Official site
              </a>
              <a
                v-if="show.imdbUrl"
                :href="show.imdbUrl"
                target="_blank"
                rel="noreferrer"
                class="ds-btn-subtle"
              >
                IMDb
              </a>
            </div>

            <dl
              class="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-white/10 pt-8 text-sm sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-3"
            >
              <template v-for="item in detailItems" :key="item.label">
                <div class="min-w-0">
                  <dt class="ds-label-meta">
                    {{ item.label }}
                  </dt>
                  <dd
                    class="mt-1.5 break-words text-base font-semibold text-slate-100"
                  >
                    {{ item.value }}
                  </dd>
                </div>
              </template>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 2: episodes rail + cast rail -->
    <div
      v-if="data && (seasons.length > 0 || castPreview.length > 0)"
      class="mt-16 space-y-10 border-t border-white/[0.08] pt-16 px-4 sm:px-6 lg:px-10 md:mt-20 md:space-y-12 md:pt-20"
    >
      <section v-if="seasons.length > 0">
        <Rail>
          <template #header>
            <div>
              <p class="ds-label-section tracking-[0.24em]">
                {{ t('showDetail.episodes') }}
              </p>
              <h2 class="mt-2 min-h-[2rem] text-2xl font-black text-white">
                <template v-if="selectedSeason != null">
                  {{ t('showDetail.seasonWithNumber', { n: selectedSeason }) }}
                </template>
                <span
                  v-else
                  class="inline-block h-8 w-48 max-w-full animate-pulse rounded bg-slate-700/60"
                />
              </h2>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <span class="text-sm text-slate-400">
                {{
                  t('showDetail.episodeCount', {
                    n: selectedSeasonEpisodes.length
                  })
                }}
              </span>
              <select
                v-model.number="selectedSeason"
                :aria-label="t('showDetail.selectSeason')"
                class="ds-select"
              >
                <option
                  v-for="season in seasons"
                  :key="season.season"
                  :value="season.season"
                >
                  {{ t('showDetail.seasonWithNumber', { n: season.season }) }}
                </option>
              </select>
            </div>
          </template>

          <template v-if="selectedSeasonEpisodes.length > 0">
            <EpisodeCard
              v-for="episode in selectedSeasonEpisodes"
              :key="episode.id"
              :episode="episode"
            />
          </template>
          <template v-else-if="!selectedSeason && seasons.length > 0">
            <EpisodeCard
              v-for="n in 6"
              :key="`episode-skeleton-${n}`"
              :episode="null"
            />
          </template>
          <p v-else class="pl-2 text-sm text-slate-400">
            {{ t('showDetail.noEpisodesInSeason') }}
          </p>
        </Rail>
      </section>

      <section v-if="castPreview.length > 0">
        <p class="ds-label-section tracking-[0.24em]">
          {{ t('showDetail.cast') }}
        </p>
        <Rail class="!mb-0 mt-3">
          <CastCard
            v-for="castMember in castPreview"
            :key="castMember.id"
            :cast="castMember"
          />
        </Rail>
      </section>
    </div>
  </div>
</template>
