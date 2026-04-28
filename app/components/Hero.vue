<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { ShowViewModel } from '../../domains/dashboard/viewModel/show.type';
import { useAppNavigation } from '../composables/useAppNavigation';
import RatingStars from './RatingStars.vue';

const { show } = defineProps<{
  show: ShowViewModel | null;
}>();

const { t } = useI18n();
const { getShowPath } = useAppNavigation();
</script>

<template>
  <section class="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden text-white">
    <NuxtImg
      v-if="show"
      :src="show.heroImage"
      :alt="show.title"
      class="absolute inset-0 z-0 h-full w-full object-cover"
      sizes="sm:100vw md:100vw lg:100vw xl:100vw"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
    <div v-else class="absolute inset-0 animate-pulse bg-slate-800/80" />
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

    <div class="container relative z-10 mx-auto flex h-full min-h-[inherit] px-4 pb-28 pt-28 sm:px-6 lg:px-10">
      <div v-if="show" class="mt-auto w-full max-w-xl">
        <slot name="eyebrow">
          <p class="ds-label-brand">
            {{ t('labels.featuredShow') }}
          </p>
        </slot>
        <h1 class="mt-4 ds-heading-hero">
          {{ show.title }}
        </h1>

        <RatingStars class="mt-5" :rating="show.rating" :rating-star-fills="show.ratingStarFills" />

        <!-- eslint-disable vue/no-v-html -- TVMaze summary is trusted API HTML, not user input -->
        <div
          class="mt-5 line-clamp-none max-w-xl overflow-hidden text-sm leading-6 text-slate-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [&_p]:m-0 md:[-webkit-line-clamp:8] lg:[display:block]"
          v-html="show.summary"
        />
        <!-- eslint-enable vue/no-v-html -->

        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink :to="getShowPath(show.id)" class="ds-btn-primary">
            {{ t('actions.watchNow') }}
          </NuxtLink>
          <button
            type="button"
            class="ds-btn-ghost"
            disabled
            :aria-disabled="true"
            :title="t('a11y.trailerUnavailable')"
          >
            {{ t('actions.trailer') }}
          </button>
        </div>
      </div>

      <!-- show loading skeleton if show is null -->
      <div v-else class="mt-auto w-full max-w-xl">
        <div class="h-3 w-36 animate-pulse rounded bg-pink-300/40" />
        <div class="mt-4 h-12 w-80 max-w-full animate-pulse rounded bg-slate-700/80 sm:h-14" />
        <div class="mt-5 h-5 w-40 animate-pulse rounded bg-slate-700/70" />
        <div class="mt-5 space-y-2">
          <div class="h-3 w-full animate-pulse rounded bg-slate-700/70" />
          <div class="h-3 w-11/12 animate-pulse rounded bg-slate-700/70" />
          <div class="h-3 w-10/12 animate-pulse rounded bg-slate-700/70" />
          <div class="h-3 w-8/12 animate-pulse rounded bg-slate-700/70" />
        </div>
        <div class="mt-8 flex gap-3">
          <div class="h-11 w-28 animate-pulse rounded-full bg-pink-400/50" />
          <div class="h-11 w-24 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  </section>
</template>
