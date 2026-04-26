<script setup lang="ts">
import type {CastViewModel} from '../../domains/showDetails/viewModel/showDetailsViewModel.type';

defineProps<{
  cast: CastViewModel;
}>();
</script>

<template>
  <article
    class="relative isolate h-72 w-52 min-w-52 shrink-0 first:ml-0 last:mr-14 overflow-hidden rounded-2xl bg-slate-900/70 ring-1 ring-white/10"
  >
    <img
      :src="cast.image"
      :alt="cast.name"
      class="block h-full w-full object-cover"
      loading="lazy"
    />
    <div
      class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/45 to-transparent"
    />
    <div class="absolute bottom-3 left-3 right-3 z-20">
      <h3
        class="line-clamp-2 font-black leading-tight text-pink-300 drop-shadow-md"
      >
        {{ cast.name }}
      </h3>
      <p
        class="mt-1 line-clamp-2 text-sm font-semibold text-white drop-shadow-md"
      >
        {{ cast.characterName }}
      </p>
    </div>
  </article>
</template>
