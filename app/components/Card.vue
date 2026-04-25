<script setup lang="ts">
import {ref} from 'vue';
import {useAppNavigation} from '#imports';
import type {ShowViewModel} from '../../domains/dashboard/viewModel/show.type';

defineProps<{
  show: ShowViewModel;
}>();

const imageLoaded = ref(false);
const {getShowPath} = useAppNavigation();

const markImageLoaded = (): void => {
  imageLoaded.value = true;
};
</script>

<template>
  <NuxtLink
    :to="getShowPath(show.id)"
    class="group relative z-0 block min-w-[140px] max-w-[140px] shrink-0 origin-center transform-gpu transition-transform duration-300 ease-out will-change-transform first:ml-0 last:mr-14 hover:z-30 hover:scale-125"
  >
    <div
      class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60 transition duration-300 group-hover:border-pink-300/80 group-hover:ring-2 group-hover:ring-pink-400/80 group-hover:shadow-[0_0_28px_rgba(236,72,153,0.38)]"
    >
      <div
        v-show="!imageLoaded"
        class="absolute inset-0 z-10 animate-pulse bg-slate-700/70"
      />
      <img
        :src="show.image"
        :alt="show.title"
        class="h-[195px] w-full object-cover object-center transition-opacity duration-300"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="markImageLoaded"
        @error="markImageLoaded"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80"
      />
    </div>
  </NuxtLink>
</template>
