<script setup lang="ts">
import { ref } from 'vue';
import { useAppNavigation } from '#imports';
import type { SearchResultViewModel } from '../../domains/search/viewModel/searchViewModel.type';

const props = defineProps<{
  result?: SearchResultViewModel | null;
}>();

const imageLoaded = ref(false);
const { getShowPath } = useAppNavigation();
</script>

<template>
  <!-- Skeleton tile when no result is passed -->
  <div v-if="!result" class="ds-card overflow-hidden" role="presentation" aria-hidden="true">
    <div class="aspect-[2/3] w-full ds-skeleton-dark" />
    <div class="p-3 space-y-2">
      <div class="h-4 w-3/4 ds-skeleton rounded" />
      <div class="h-3 w-1/2 ds-skeleton rounded" />
    </div>
  </div>

  <!-- Real card -->
  <NuxtLink
    v-else
    :to="getShowPath(result.id)"
    class="group ds-card block overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(236,72,153,0.35)]"
  >
    <!-- Poster image with lazy-load shimmer -->
    <div class="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
      <div v-show="!imageLoaded" class="absolute inset-0 ds-skeleton-dark" aria-hidden="true" />
      <img
        :src="result.image"
        :alt="result.title"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="imageLoaded = true"
        @error="imageLoaded = true"
      />
      <!-- Subtle gradient so text sits on the image if needed later -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
        aria-hidden="true"
      />
    </div>

    <!-- Title + rating row -->
    <div class="p-3">
      <h3 class="truncate text-sm font-bold leading-tight text-white group-hover:text-pink-300 transition-colors">
        {{ result.title }}
      </h3>
      <div class="mt-1 flex items-center gap-2">
        <!-- Star strip -->
        <div class="flex text-sm leading-none text-white/25" aria-hidden="true">
          <span v-for="(fillWidth, i) in result.ratingStarFills" :key="i" class="relative inline-block w-[1em]">
            <span>★</span>
            <span
              class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-pink-400"
              :style="{ width: `${fillWidth}%` }"
              >★</span
            >
          </span>
        </div>
        <span class="text-xs text-slate-400">
          {{ result.rating > 0 ? `${result.rating}/10` : 'N/A' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
