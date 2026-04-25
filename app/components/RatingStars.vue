<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const props = defineProps<{
  rating: number;
  ratingStarFills: number[];
}>();

const {t} = useI18n();
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex text-2xl leading-none text-white/25" aria-hidden="true">
      <span
        v-for="(fillWidth, index) in props.ratingStarFills"
        :key="index"
        class="relative inline-block w-[1em]"
      >
        <span>★</span>
        <span
          class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-pink-400"
          :style="{width: `${fillWidth}%`}"
        >
          ★
        </span>
      </span>
    </div>
    <span class="text-sm font-semibold text-slate-200">
      {{ t('labels.ratingOutOfTen', {rating: props.rating}) }}
    </span>
  </div>
</template>
