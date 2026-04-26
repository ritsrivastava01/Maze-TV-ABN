<script setup lang="ts">
import type {ShowDetailEpisodeViewModel} from '../../domains/show/viewModel/showDetailViewModel.type';
import CardSkeleton from './CardSkeleton.vue';

defineProps<{
  /** Omit or `null` to show a skeleton tile (same idea as `Card` without `show`). */
  episode?: ShowDetailEpisodeViewModel | null;
}>();
</script>

<template>
  <article
    class="w-80 shrink-0 first:ml-0 last:mr-14 overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/10"
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
    <div
      v-else
      class="relative overflow-hidden"
    >
      <img
        :src="episode.image"
        :alt="episode.title"
        class="relative z-0 block h-auto w-full"
        loading="lazy"
      />
      <div
        class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent"
        aria-hidden="true"
      />
      <div
        v-if="episode.rating"
        class="absolute right-3 top-3 z-20 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur"
      >
        {{ episode.rating }}/10
      </div>
      <div class="absolute bottom-3 left-3 right-3 z-20 text-left">
        <p
          class="text-base font-black uppercase leading-none tracking-[0.04em] text-white drop-shadow-md"
        >
          S{{ episode.season }}E{{ episode.number }}
        </p>
        <h3
          class="mt-2 line-clamp-2 text-xl font-black leading-tight text-white drop-shadow-md"
        >
          {{ episode.title }}
        </h3>
      </div>
    </div>
  </article>
</template>
