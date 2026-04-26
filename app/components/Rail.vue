<script setup lang="ts">
import {useSlots} from 'vue';

const emit = defineEmits<{
  railScroll: [event: Event];
}>();

const slots = useSlots();
const scrollableRailClass =
  'overflow-x-scroll scrollbar-thin scrollbar-track-slate-700/70 scrollbar-thumb-pink-500 hover:scrollbar-thumb-pink-400';

const onScroll = (event: Event): void => {
  emit('railScroll', event);
};
</script>

<template>
  <section class="mb-6">
    <div
      v-if="slots.header"
      class="mb-3 flex min-h-7 items-center justify-between px-2"
    >
      <slot name="header" />
    </div>

    <div class="relative">
      <div
        class="pointer-events-none absolute inset-x-0 inset-y-10 rounded-3xl border border-white/10 bg-slate-800/90"
      />

      <div
        data-rail-scroll
        class="relative z-10 flex gap-10 overflow-y-visible py-16 pl-7 pr-28"
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
