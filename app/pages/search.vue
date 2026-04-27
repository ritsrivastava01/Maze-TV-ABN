<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SearchCard from '../components/SearchCard.vue';
import { useSearch } from '../composables/useSearch';

const { t } = useI18n();
const { searchQuery, data, status, visibleResults, hasMore, loadMore, PAGE_SIZE } = useSearch();
</script>

<template>
  <div class="px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
    <!-- ── Page header ──────────────────────────────────────────────────── -->
    <div class="mb-8">
      <p class="ds-label-brand mb-2">{{ t('search.label') }}</p>
      <h1 class="ds-heading-page text-white">
        <span class="text-slate-400 font-normal">{{ t('search.resultsFor') }}</span>
        &ldquo;{{ searchQuery }}&rdquo;
      </h1>

      <!-- Result count badge (once loaded) -->
      <p v-if="status === 'success'" class="mt-3 text-sm text-slate-400">
        {{ data?.totalResults ? t('search.resultCount', { count: data.totalResults }) : t('search.noResults') }}
      </p>
    </div>

    <!-- ── Loading grid (skeleton) ─────────────────────────────────────── -->
    <section
      v-if="status === 'pending'"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading search results"
    >
      <SearchCard v-for="n in PAGE_SIZE" :key="`sk-${n}`" />
    </section>

    <!-- ── Empty state ──────────────────────────────────────────────────── -->
    <div v-else-if="data?.totalResults === 0" class="py-24 text-center">
      <p class="text-5xl">🔍</p>
      <p class="mt-6 text-lg font-semibold text-white">{{ t('search.noResults') }}</p>
      <p class="mt-2 text-sm text-slate-400">
        {{ t('search.tryDifferent') }}
      </p>
    </div>

    <!-- ── Results grid ─────────────────────────────────────────────────── -->
    <template v-else>
      <!-- Progress indicator: "Showing X of Y" -->
      <p v-if="data && data.totalResults > 0" class="mb-5 text-xs text-slate-500">
        {{
          t('search.showing', {
            visible: visibleResults.length,
            total: data.totalResults,
          })
        }}
      </p>

      <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-label="Search results">
        <SearchCard v-for="result in visibleResults" :key="result.id" :result="result" />
      </section>

      <!-- ── Load more ──────────────────────────────────────────────────── -->
      <div v-if="hasMore" class="mt-10 flex justify-center">
        <button type="button" class="ds-btn-glass inline-flex h-11 items-center gap-2 px-6" @click="loadMore">
          {{ t('search.loadMore') }}
          <span class="text-xs text-slate-400">
            ({{ data!.totalResults - visibleResults.length }} {{ t('search.remaining') }})
          </span>
        </button>
      </div>
    </template>
  </div>
</template>
