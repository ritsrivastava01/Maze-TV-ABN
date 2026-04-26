<script setup lang="ts">
import {PhCaretLeft} from '@phosphor-icons/vue';
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useFetch} from 'nuxt/app';
import {useRoute} from 'vue-router';
import Card from '../../components/Card.vue';
import CastPanel from '../../components/CastPanel.vue';
import EpisodePanel from '../../components/EpisodePanel.vue';
import RatingStars from '../../components/RatingStars.vue';
import type {ShowDetailsPageViewModel} from '../../../domains/showDetails/viewModel/showDetailsViewModel.type';

const {t} = useI18n();
const route = useRoute();
const showId = computed(() => Number(route.params.id));

const {data, error} = useFetch<ShowDetailsPageViewModel>(
  () => `/api/${showId.value}`,
  {
    key: () => `show-detail-${showId.value}`,
    /** Only refetch when navigating to a different show — season is client-only filtering on cached payload. */
    watch: [showId]
  }
);

const show = computed(() => data.value?.show ?? null);
const selectedSeason = ref<number | null>(null);
const seasons = computed(() => data.value?.seasons ?? []);
const castPreview = computed(() => data.value?.cast ?? []);
/** Detail grid: network & runtime stay under the title only. */
const detailItems = computed(() => {
  if (!show.value) {
    return [];
  }

  const seasonCount = data.value?.seasons.length ?? 0;

  return [
    {label: 'Status', value: show.value.status},
    {label: 'Premiered', value: show.value.premiereDate},
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

/** New show: clear season so `EpisodePanel` picks a valid default from fresh `seasons`. */
watch(showId, () => {
  selectedSeason.value = null;
});
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
          <Card
            :preview="show"
            image-loading="eager"
            class="aspect-[2/3] max-w-sm mx-auto md:max-w-none md:mx-0 shadow-xl shadow-black/40"
          />
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

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                v-if="show.officialSite"
                :href="show.officialSite"
                target="_blank"
                rel="noreferrer"
                class="rounded-full bg-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
              >
                Official site
              </a>
              <a
                v-if="show.imdbUrl"
                :href="show.imdbUrl"
                target="_blank"
                rel="noreferrer"
                class="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
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
      <EpisodePanel v-model:selected-season="selectedSeason" :seasons="seasons" />

      <CastPanel :cast="castPreview" />
    </div>
  </div>
</template>
