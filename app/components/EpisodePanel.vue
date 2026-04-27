<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import type {
  Episode,
  Season
} from '../../domains/showDetails/viewModel/showDetailsViewModel.type';
import Card from './Card.vue';
import Rail from './Rail.vue';

const props = defineProps<{
  seasonList: Season[];
  episodes: Episode[];
  loading?: boolean;
}>();

/** Season number (1, 2, …) — matches legacy `season.season` binding; avoids `<select>` string/id coercion bugs with TVMaze season ids. */
const selectedSeason = defineModel<number | null>('selectedSeason');

/** Season label when v-model is still null (before parent sync); `seasonList` is ascending from the mapper. */
const displaySeasonNumber = computed(() => {
  if (selectedSeason.value != null) {
    return selectedSeason.value;
  }
  return props.seasonList[0]?.number ?? null;
});

const showEpisodeCountSkeleton = computed(
  () =>
    props.episodes.length === 0 &&
    (props.loading === true || displaySeasonNumber.value == null)
);

const {t} = useI18n();

const EPISODE_CARD_CLASS =
  'aspect-video w-80 min-w-80 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10';

const toPreview = (e: Episode) => ({
  id: e.id,
  title: e.title,
  image: e.image
});
</script>

<template>
  <section v-if="seasonList.length > 0">
    <Rail>
      <template #header>
        <div>
          <p class="text-xs uppercase tracking-[0.24em] text-slate-500">
            {{ t('showDetail.episodes') }}
          </p>
          <h2 class="mt-2 min-h-[2rem] text-2xl font-black text-white">
            <template v-if="displaySeasonNumber != null">
              {{ t('showDetail.seasonWithNumber', {n: displaySeasonNumber}) }}
            </template>
            <span
              v-else
              class="inline-block h-8 w-48 max-w-full animate-pulse rounded bg-slate-700/60"
            />
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span
            class="inline-flex min-h-[2rem] items-center text-sm text-slate-400"
          >
            <span
              v-if="showEpisodeCountSkeleton"
              class="inline-block h-8 w-36 max-w-full animate-pulse rounded bg-slate-700/60"
              aria-hidden="true"
            />
            <template v-else>
              {{ t('showDetail.episodeCount', {n: episodes.length}) }}
            </template>
          </span>
          <select
            v-model.number="selectedSeason"
            :disabled="loading"
            :aria-label="t('showDetail.selectSeason')"
            class="h-10 min-w-[9.5rem] cursor-pointer appearance-none rounded-full border border-white/40 bg-black/20 py-0 pl-4 pr-12 text-sm font-semibold text-white outline-none transition hover:bg-white/10 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 enabled:cursor-pointer disabled:cursor-wait disabled:opacity-60 [background-size:1.15rem_1.15rem] [background-position:right_0.75rem_center] [background-repeat:no-repeat] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20fill=%22%23e2e8f0%22%20viewBox=%220%200%20256%20256%22%3E%3Cpath%20d=%22M213.66%20101.66l-80%2080a8%208%200%200%201-11.32%200l-80-80A8%208%200%200%201%2043.31%2088L128%20172.69%20212.69%2088a8%208%200%200%201%2011.32%2011.32Z%22/%3E%3C/svg%3E')]"
          >
            <option
              v-for="season in seasonList"
              :key="season.id"
              :value="season.number"
            >
              {{ t('showDetail.seasonWithNumber', {n: season.number}) }}
            </option>
          </select>
        </div>
      </template>

      <template v-if="loading && episodes.length === 0">
        <Card
          v-for="n in 4"
          :key="`episode-skeleton-${n}`"
          :preview="null"
          :class="EPISODE_CARD_CLASS"
        />
      </template>
      <template v-else-if="episodes.length > 0">
        <Card
          v-for="(episode, index) in episodes"
          :key="episode.id"
          :preview="toPreview(episode)"
          :image-loading="index < 4 ? 'eager' : 'lazy'"
          :class="EPISODE_CARD_CLASS"
        >
          <template v-if="episode.rating" #header>
            <div
              class="rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold tabular-nums text-pink-100 shadow-lg shadow-black/40 backdrop-blur-sm"
            >
              {{ episode.rating }}/10
            </div>
          </template>
          <template #footer>
            <p
              class="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-pink-300/95 drop-shadow-sm"
            >
              S{{ episode.seasonNumber }}E{{ episode.episodeNumber }}
            </p>
            <p
              class="mt-1 line-clamp-2 text-sm font-semibold text-white drop-shadow-md"
            >
              {{ episode.title }}
            </p>
          </template>
        </Card>
      </template>
      <template v-else-if="displaySeasonNumber == null">
        <Card
          v-for="n in 6"
          :key="`episode-skeleton-${n}`"
          :preview="null"
          :class="EPISODE_CARD_CLASS"
        />
      </template>
      <template v-else>
        <Card
          v-for="n in 4"
          :key="`episode-empty-skeleton-${n}`"
          :preview="null"
          :class="EPISODE_CARD_CLASS"
        />
      </template>
    </Rail>
  </section>
</template>
