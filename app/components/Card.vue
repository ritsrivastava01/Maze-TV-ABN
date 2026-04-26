<script setup lang="ts">
import { ref } from 'vue';
import { useAppNavigation } from '#imports';
import type { ShowViewModel } from '../../domains/dashboard/viewModel/show.type';
import CardSkeleton from './CardSkeleton.vue';

const imageLoaded = ref(false);
const { getShowPath } = useAppNavigation();

defineProps<{
  show?: ShowViewModel | null;
}>();

const markImageLoaded = (): void => {
  imageLoaded.value = true;
};
</script>

<template>
  <div
    class="h-72 w-52 min-w-52 shrink-0 first:ml-0 last:mr-14"
    :role="!show ? 'presentation' : undefined"
    :aria-hidden="!show ? true : undefined"
  >
    <div v-if="!show" class="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
      <CardSkeleton />
    </div>

    <NuxtLink
      v-else-if="show"
      :to="getShowPath(show.id)"
      class="group relative z-0 block h-full w-full origin-center transform-gpu transition-transform duration-300 ease-out will-change-transform hover:z-30 hover:scale-125"
    >
      <div
        class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60 ds-card-interactive"
      >
        <div v-show="!imageLoaded" class="absolute inset-0 z-10 animate-pulse bg-slate-700/70" aria-hidden="true" />
        <img
          :src="show.image"
          :alt="show.title"
          class="relative z-20 h-full w-full object-cover transition-opacity duration-300"
          :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
          loading="lazy"
          @load="markImageLoaded"
          @error="markImageLoaded"
        />
        <div
          v-show="imageLoaded"
          class="pointer-events-none absolute inset-0 z-[30] bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80"
        />
      </div>
    </NuxtLink>
  </div>
</template>
