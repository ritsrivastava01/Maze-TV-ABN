<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Card from '../components/Card.vue';
import Rail from '../components/Rail.vue';
import { useDashboard } from '../composables/useDashboard';

const { t } = useI18n();

const {
  status,
  error,
  featuredShow,
  visibleGenreRows,
  searchQuery,
  getVisibleShows,
  onRailScroll,
  RAIL_CARD_BATCH_SIZE,
  RAIL_COUNT,
} = useDashboard();

const heroHeightClass = 'h-[75vh]';
</script>

<template>
  <Hero :show="featuredShow" :class="heroHeightClass" />

  <div v-if="error" class="mx-auto container rounded-2xl bg-red-900/40 px-4 py-10 text-red-100 sm:px-6 lg:px-10">
    <div class="rounded-2xl bg-black/20 p-6">Failed to load shows: {{ error.message }}</div>
  </div>

  <section v-else class="relative z-20 -mt-20 mx-auto container px-4 pb-10 sm:px-6 lg:px-10">
    <section v-if="status === 'pending' || (visibleGenreRows.length === 0 && !searchQuery)">
      <Rail v-for="row in RAIL_COUNT" :key="`loading-row-${row}`">
        <template #header>
          <div class="h-7 w-28 animate-pulse rounded bg-slate-700/80" />
          <div class="h-4 w-16 animate-pulse rounded bg-slate-700/60" />
        </template>
        <Card v-for="n in RAIL_CARD_BATCH_SIZE" :key="`skeleton-card-${row}-${n}`" />
      </Rail>
    </section>

    <!-- No results for active search query -->
    <div v-else-if="searchQuery && visibleGenreRows.length === 0" class="py-20 text-center text-slate-400">
      <p class="text-lg font-semibold">{{ t('labels.noResults', { query: searchQuery }) }}</p>
    </div>

    <Rail v-for="row in visibleGenreRows" v-else :key="row.genre" @rail-scroll="onRailScroll($event, row.genre)">
      <template #header>
        <h3 class="text-xl font-bold">{{ row.genre }}</h3>
        <span class="text-xs text-slate-300">
          {{ t('labels.showsCount', { count: row.shows.length }) }}
        </span>
      </template>

      <Card v-for="show in getVisibleShows(row.genre, row.shows)" :key="show.id" :show="show" />
    </Rail>
  </section>
</template>
