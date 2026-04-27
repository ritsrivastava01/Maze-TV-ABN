<script setup lang="ts">
import { computed } from 'vue';
import { useFetch, showError } from 'nuxt/app';
import { useI18n } from 'vue-i18n';
import { useRoute, useAppNavigation } from '#imports';
import Card from '../components/Card.vue';
import RatingStars from '../components/RatingStars.vue';
import { PhMagnifyingGlass } from '@phosphor-icons/vue';
import type { SearchViewModel } from '../../domains/search/viewModel/searchViewModel.type';

const GRID_CLASS =
  'grid grid-cols-2 gap-8 gap-y-14 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

const route = useRoute();
const { t } = useI18n();
const { getShowPath } = useAppNavigation();

const searchQuery = computed<string>(() =>
  typeof route.query.q === 'string' ? route.query.q.trim() : ''
);

const { data, status } = useFetch<SearchViewModel>('/api/search', {
  query: computed(() => ({ q: searchQuery.value })),
  onResponseError({ response }) {
    showError({
      statusCode: response.status,
      statusMessage: response._data?.statusMessage ?? response.statusText,
      fatal: true
    });
  }
});

const results = computed(() => data.value?.results ?? []);
// Mirror API result count for skeletons so the loading grid matches what will appear
const skeletonCount = computed(() => data.value?.totalResults ?? 10);
</script>

<template>
  <div class="px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
    <div class="mb-8">
      <p class="ds-label-brand mb-2">{{ t('search.label') }}</p>
      <h1 class="text-2xl font-bold text-white sm:text-3xl">
        <span class="font-normal text-slate-400">{{
          t('search.resultsFor')
        }}</span>
        &ldquo;{{ searchQuery }}&rdquo;
      </h1>
      <p v-if="status === 'success'" class="mt-2 text-sm text-slate-400">
        {{
          results.length
            ? t('search.resultCount', { count: results.length })
            : t('search.noResults')
        }}
      </p>
    </div>

    <!-- Loading grid (skeleton) -->
    <section
      v-if="status === 'pending'"
      :class="GRID_CLASS"
      aria-label="Loading search results"
    >
      <div
        v-for="n in skeletonCount"
        :key="`sk-${n}`"
        class="aspect-[2/3] w-full"
      >
        <Card :preview="null" class="h-full w-full" />
      </div>
    </section>

    <!-- Empty state -->
    <div v-else-if="!results.length" class="py-24 text-center">
      <PhMagnifyingGlass
        :size="64"
        weight="thin"
        class="mx-auto text-slate-500"
      />
      <p class="mt-6 text-lg font-semibold text-white">
        {{ t('search.noResults') }}
      </p>
      <p class="mt-2 text-sm text-slate-400">{{ t('search.tryDifferent') }}</p>
    </div>

    <!-- Results grid -->
    <section v-else :class="GRID_CLASS" aria-label="Search results">
      <div
        v-for="result in results"
        :key="result.id"
        class="aspect-[2/3] w-full"
      >
        <NuxtLink
          :to="getShowPath(result.id)"
          class="group block h-full w-full"
        >
          <Card
            :preview="result"
            class="h-full w-full"
            shell-class="ds-card-rail-shell hover:scale-110"
          >
            <template #footer>
              <h3
                class="truncate text-sm font-bold leading-tight text-white transition-colors group-hover:text-pink-300"
              >
                {{ result.title }}
              </h3>
              <div class="mt-1 scale-75 origin-left">
                <RatingStars
                  :rating="result.rating"
                  :rating-star-fills="result.ratingStarFills"
                />
              </div>
            </template>
          </Card>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
