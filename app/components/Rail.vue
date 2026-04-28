<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = defineProps<{
  /** Set to `null` for a pulse header (dashboard loading). Omit entirely when no header row (e.g. cast rail). */
  headerTitle?: string | null;
  headerSubtitle?: string | null;
}>();

const emit = defineEmits<{
  railScroll: [event: Event];
}>();

const slots = useSlots();
const hasHeaderSlot = computed(() => !!slots.header);

const showPropHeader = computed(() => {
  const t = props.headerTitle;
  return typeof t === 'string' && t.length > 0;
});

const showHeaderSkeleton = computed(() => {
  const t = props.headerTitle;
  return t === null || t === '';
});

const scrollableRailClass =
  'overflow-x-scroll scrollbar-thin scrollbar-track-slate-700/70 scrollbar-thumb-pink-500 hover:scrollbar-thumb-pink-400';

const onScroll = (event: Event): void => {
  emit('railScroll', event);
};
</script>

<template>
  <section class="mb-6">
    <div v-if="hasHeaderSlot" class="mb-3 flex min-h-7 items-center justify-between px-2">
      <slot name="header" />
    </div>
    <div v-else-if="showPropHeader" class="mb-3 flex min-h-7 items-center justify-between px-2">
      <h3 class="text-xl font-bold">
        {{ headerTitle }}
      </h3>
      <span v-if="headerSubtitle != null && headerSubtitle !== ''" class="text-xs text-slate-300">
        {{ headerSubtitle }}
      </span>
    </div>
    <div v-else-if="showHeaderSkeleton" class="mb-3 flex min-h-7 items-center justify-between px-2">
      <div class="h-7 w-28 animate-pulse rounded bg-slate-700/80" />
      <div class="h-4 w-16 animate-pulse rounded bg-slate-700/60" />
    </div>

    <div class="relative">
      <div
        class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
      />

      <div
        data-rail-scroll
        class="relative z-10 flex items-start gap-10 overflow-y-visible py-16 px-7"
        :class="scrollableRailClass"
        @scroll.passive="onScroll"
      >
        <slot />
      </div>

      <div
        class="pointer-events-none absolute bottom-10 left-0 top-10 z-20 w-8 rounded-l-3xl bg-gradient-to-r from-slate-800/95 to-transparent"
      />
      <div
        class="pointer-events-none absolute bottom-10 right-0 top-10 z-20 w-16 rounded-r-3xl bg-gradient-to-l from-slate-800/95 to-transparent"
      />
    </div>
  </section>
</template>
