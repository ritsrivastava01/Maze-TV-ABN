<script setup lang="ts">
import {PhCaretLeft} from '@phosphor-icons/vue';
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useFetch} from 'nuxt/app';
import {useRoute} from 'vue-router';
import CastCard from '../../components/CastCard.vue';
import EpisodeCard from '../../components/EpisodeCard.vue';
import RatingStars from '../../components/RatingStars.vue';
import Rail from '../../components/Rail.vue';
import type {ShowDetailViewModel} from '../../../domains/show/viewModel/showDetailViewModel.type';

const {t} = useI18n();
const route = useRoute();
const showId = computed(() => Number(route.params.id));

const {data, error} = useFetch<ShowDetailViewModel>(
  () => `/api/show/${showId.value}`,
  {
    key: () => `show-detail-${showId.value}`,
    /** Only refetch when navigating to a different show — season is client-only filtering on cached payload. */
    watch: [showId]
  }
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
    {label: 'Status', value: show.value.status},
    {label: 'Premiered', value: show.value.premiered},
    {label: 'Ended', value: show.value.ended},
    {label: 'Country', value: show.value.country},
    {label: 'Days', value: show.value.scheduleDays},
    {label: 'Time', value: show.value.scheduleTime},
    {label: 'Seasons', value: String(seasonCount)},
    {label: 'Type', value: show.value.type},
    {label: 'Language', value: show.value.language}
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
  {immediate: true}
);
</script>

<template>
  <!-- Header in layout is position:absolute, so we need top padding to clear it + breathing room like the design -->
  <div class="pb-16 pt-20 sm:pt-24 lg:pt-28">
    <!-- Row 1: md+ two columns — poster | overview & metadata -->
    <section class="px-4 sm:px-6 lg:px-10">
      <div
        v-if="error"
        class="rounded-3xl bg-red-900/40 p-6 text-red-100 ring-1 ring-red-300/20"
      >
        Failed to load show: {{ error.message }}
      </div>

      <template v-else>
        <div class="mb-6 flex justify-start sm:mb-8">
          <NuxtLink
            :to="backPath"
            class="inline-flex h-10 items-center rounded-full border border-white/40 bg-black/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
              <PhCaretLeft
                class="shrink-0 text-current"
                :size="18"
                weight="bold"
                aria-hidden="true"
              />
              <span>{{ t('actions.backToShows') }}</span>
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
          <div v-if="!data && !error" class="space-y-4">
            <div class="h-3 w-2/3 max-w-xs animate-pulse rounded bg-slate-700/80" />
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
              <div
                v-for="n in 9"
                :key="`sk-${n}`"
                class="space-y-2"
              >
                <div class="h-2 w-20 animate-pulse rounded bg-slate-700/60" />
                <div class="h-4 w-28 max-w-full animate-pulse rounded bg-slate-700/80" />
              </div>
            </div>
          </div>

          <div v-else-if="show">
            <div
              v-if="show.genres.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="rounded-full border border-violet-500/30 bg-violet-950/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-200"
              >
                {{ genre }}
              </span>
            </div>

            <h1
              class="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
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
                class="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Official site
              </a>
              <a
                v-if="show.imdbUrl"
                :href="show.imdbUrl"
                target="_blank"
                rel="noreferrer"
                class="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                IMDb
              </a>
            </div>

            <dl
              class="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-white/10 pt-8 text-sm sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-3"
            >
              <template v-for="item in detailItems" :key="item.label">
                <div class="min-w-0">
                  <dt
                    class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-500"
                  >
                    {{ item.label }}
                  </dt>
                  <dd class="mt-1.5 break-words text-base font-semibold text-slate-100">
                    {{ item.value }}
                  </dd>
                </div>
              </template>
            </dl>
          </div>
        </div>
        </div>
      </template>
    </section>

    <!-- Row 2: episodes rail + cast rail, full width, shared top rule -->
    <div
      v-if="
        !error &&
        data &&
        (seasons.length > 0 || castPreview.length > 0)
      "
      class="mt-16 space-y-10 border-t border-white/[0.08] pt-16 px-4 sm:px-6 lg:px-10 md:mt-20 md:space-y-12 md:pt-20"
    >
      <section v-if="seasons.length > 0">
        <Rail>
          <template #header>
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">
                {{ t('showDetail.episodes') }}
              </p>
              <h2 class="mt-2 min-h-[2rem] text-2xl font-black text-white">
                <template v-if="selectedSeason != null">
                  {{ t('showDetail.seasonWithNumber', {n: selectedSeason}) }}
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
                class="h-10 min-w-[9.5rem] cursor-pointer appearance-none rounded-full border border-white/40 bg-black/20 py-0 pl-4 pr-12 text-sm font-semibold text-white outline-none transition hover:bg-white/10 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 [background-size:1.15rem_1.15rem] [background-position:right_0.75rem_center] [background-repeat:no-repeat] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20fill=%22%23e2e8f0%22%20viewBox=%220%200%20256%20256%22%3E%3Cpath%20d=%22M213.66%20101.66l-80%2080a8%208%200%200%201-11.32%200l-80-80A8%208%200%200%201%2043.31%2088L128%20172.69%20212.69%2088a8%208%200%200%201%2011.32%2011.32Z%22/%3E%3C/svg%3E')]"
              >
                <option
                  v-for="season in seasons"
                  :key="season.season"
                  :value="season.season"
                >
                  {{ t('showDetail.seasonWithNumber', {n: season.season}) }}
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
          <p
            v-else
            class="pl-2 text-sm text-slate-400"
          >
            {{ t('showDetail.noEpisodesInSeason') }}
          </p>
        </Rail>
      </section>

      <section v-if="castPreview.length > 0">
        <p
          class="text-xs uppercase tracking-[0.24em] text-slate-500"
        >
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
