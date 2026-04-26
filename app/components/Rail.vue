<script setup lang="ts">
import {computed, useSlots} from 'vue';
import Card from './Card.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  {
    loading: false,
    skeletonCount: 8
  }
);

const emit = defineEmits<{
  railScroll: [event: Event];
}>();

const slots = useSlots();
const scrollableRailClass =
  'overflow-x-scroll scrollbar-thin scrollbar-track-slate-700/70 scrollbar-thumb-pink-500 hover:scrollbar-thumb-pink-400';

const railOverflowClass = computed(() => {
  return props.loading ? 'overflow-x-hidden' : scrollableRailClass;
});

const onScroll = (event: Event): void => {
  emit('railScroll', event);
};
</script>

<template>
  <section class="mb-8" :aria-busy="loading">
    <div
      v-if="loading || Boolean(slots.header)"
      class="mb-3 flex min-h-7 items-center justify-between px-2"
    >
      <!-- Keep header height stable while data is loading. -->
      <template v-if="loading">
        <div class="h-7 w-28 animate-pulse rounded bg-slate-700/80" />
        <div class="h-4 w-16 animate-pulse rounded bg-slate-700/60" />
      </template>
      <!-- show header if not loading -->
      <slot v-else name="header" />
    </div>

    <div class="relative">
      <div
        class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
      />

      <div
        data-rail-scroll
        class="relative z-10 flex gap-7 overflow-y-visible py-16 pl-7 pr-28"
        :class="railOverflowClass"
        @scroll.passive="onScroll"
      >
        <!-- Rail owns the loading placeholder for consistent card spacing. -->
        <template v-if="loading">
          <Card
            v-for="n in skeletonCount"
            :key="`skeleton-card-${n}`"
          />
        </template>
        <slot v-else />
      </div>

      <!-- Soft edge fades hide abrupt card cutoffs at rail boundaries. -->
      <div
        class="pointer-events-none absolute bottom-10 left-0 top-10 z-20 w-8 rounded-l-3xl bg-gradient-to-r from-slate-800/95 to-transparent"
      />
      <div
        class="pointer-events-none absolute bottom-10 right-0 top-10 z-20 w-16 rounded-r-3xl bg-gradient-to-l from-slate-800/95 to-transparent"
      />
    </div>
  </section>
</template>
