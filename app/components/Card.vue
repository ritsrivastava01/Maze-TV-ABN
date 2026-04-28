<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '../utils/cn';
import CardSkeleton from './CardSkeleton.vue';

export type CardPreview = { id: number | string; title: string; image: string };

const PANEL_BASE = 'absolute inset-0 isolate overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50';

const props = withDefaults(
  defineProps<{
    preview?: CardPreview | null;
    imageLoading?: 'lazy' | 'eager';
    shellClass?: string;
  }>(),
  {
    imageLoading: 'lazy',
    preview: null,
    shellClass: undefined,
  }
);

const panelClass = computed(() => cn(PANEL_BASE, props.shellClass));
</script>

<template>
  <div
    class="relative min-h-0 max-w-full"
    :role="!preview ? 'presentation' : undefined"
    :aria-hidden="!preview ? true : undefined"
  >
    <div v-if="!preview" class="absolute inset-0">
      <CardSkeleton class="h-full w-full" />
    </div>

    <div v-else :class="panelClass">
      <NuxtImg
        :src="preview.image"
        :alt="preview.title"
        class="absolute inset-0 z-0 h-full w-full object-cover"
        sizes="(max-width: 768px) 90vw, 320px"
        :loading="imageLoading"
        :fetchpriority="imageLoading === 'eager' ? 'high' : undefined"
        decoding="async"
      />
      <div v-if="$slots.header" class="absolute right-0 top-0 z-10 p-3">
        <slot name="header" />
      </div>
      <div
        v-if="$slots.footer"
        class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-12"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
