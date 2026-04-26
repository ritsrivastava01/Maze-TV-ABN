<script setup lang="ts">
import {computed, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import type {
  EpisodeViewModel,
  SeasonViewModel
} from '../../domains/showDetails/viewModel/showDetailsViewModel.type';
import Card from './Card.vue';
import Rail from './Rail.vue';

const props = defineProps<{
  seasons: SeasonViewModel[];
}>();

const selectedSeason = defineModel<number | null>('selectedSeason');

const {t} = useI18n();

/** Coerce season id: `<option>` / JSON can use string; avoids empty list + endless skeleton. */
const episodes = computed(() => {
  const current = selectedSeason.value;
  if (current == null) {
    return [];
  }

  return (
    props.seasons.find(
      (season) => Number(season.season) === Number(current)
    )?.episodes ?? []
  );
});

watch(
  () => props.seasons,
  (next) => {
    if (next.length === 0) {
      return;
    }

    const current = selectedSeason.value;
    if (current == null) {
      selectedSeason.value = Number(next[0]!.season);
      return;
    }

    const exists = next.some(
      (s) => Number(s.season) === Number(current)
    );
    if (!exists) {
      selectedSeason.value = Number(next[0]!.season);
    }
  },
  {immediate: true, flush: 'sync'}
);

const EPISODE_CARD_CLASS =
  'aspect-video w-80 min-w-80 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10';

const toPreview = (e: EpisodeViewModel) => ({
  id: e.id,
  title: e.title,
  image: e.image
});
</script>

<template>
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
                n: episodes.length
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

      <template v-if="episodes.length > 0">
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
      <template v-else-if="selectedSeason == null && seasons.length > 0">
        <Card
          v-for="n in 6"
          :key="`episode-skeleton-${n}`"
          :preview="null"
          :class="EPISODE_CARD_CLASS"
        />
      </template>
      <p v-else class="pl-2 text-sm text-slate-400">
        {{ t('showDetail.noEpisodesInSeason') }}
      </p>
    </Rail>
  </section>
</template>
