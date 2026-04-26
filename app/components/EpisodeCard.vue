<script setup lang="ts">
import type {EpisodeViewModel} from '../../domains/showDetails/viewModel/showDetailsViewModel.type';
import CardSkeleton from './CardSkeleton.vue';

defineProps<{
  /** Omit or `null` to show a skeleton tile (same idea as `Card` without `show`). */
  episode?: EpisodeViewModel | null;
}>();
</script>

<template>
  <article
    class="w-80 overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/10"
    :role="!episode ? 'presentation' : undefined"
    :aria-hidden="!episode ? true : undefined"
  >
    <div
      v-if="!episode"
      class="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30"
    >
      <div class="aspect-video w-full">
        <CardSkeleton class="h-full w-full" />
      </div>
    </div>

    <!--
      Stack (bottom → top): image, gradient, then labels.
      No opacity-0 on the img (avoids “stuck” invisible when load doesn’t fire for cached/broken src).
    -->
    <div v-else class="relative overflow-hidden">
      <img
        :src="episode.image"
        :alt="episode.title"
        class="relative z-0 block h-auto w-full"
        loading="lazy"
      />
      <div
        class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"
        aria-hidden="true"
      />
      <div
        v-if="episode.rating"
        class="absolute right-3 top-3 z-20 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold tabular-nums text-pink-100 shadow-lg shadow-black/40 backdrop-blur-sm"
      >
        {{ episode.rating }}/10
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-10 text-left"
      >
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
      </div>
    </div>
  </article>
</template>
