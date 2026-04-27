<script setup lang="ts">
import type { ShowDetails } from '~/domains/showDetails/viewModel/showDetailsViewModel.type';

const props = defineProps<{
  show: ShowDetails | null;
  seasonCount: number;
}>();

const { t } = useI18n();

const detailItems = computed(() => {
  if (!props.show) return [];
  return [
    { label: t('showDetail.meta.status'), value: props.show.status },
    { label: t('showDetail.meta.premiered'), value: props.show.premiereDate },
    { label: t('showDetail.meta.ended'), value: props.show.ended },
    { label: t('showDetail.meta.country'), value: props.show.country },
    { label: t('showDetail.meta.days'), value: props.show.scheduleDays },
    { label: t('showDetail.meta.time'), value: props.show.scheduleTime },
    { label: t('showDetail.meta.seasons'), value: String(props.seasonCount) },
    { label: t('showDetail.meta.type'), value: props.show.type },
    { label: t('showDetail.meta.language'), value: props.show.language }
  ];
});
</script>

<template>
  <!-- Skeleton: while show data is loading -->
  <div v-if="!show" class="space-y-4">
    <div class="ds-skeleton h-3 w-2/3 max-w-xs" />
    <div class="ds-skeleton h-10 w-4/5 max-w-md" />
    <div class="ds-skeleton h-5 w-32" />
    <div class="space-y-2 pt-2">
      <div class="ds-skeleton h-3 w-full" />
      <div class="ds-skeleton h-3 w-5/6" />
      <div class="ds-skeleton h-3 w-2/3" />
    </div>
    <div
      class="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6 lg:grid-cols-3"
    >
      <div v-for="n in 9" :key="`sk-${n}`" class="space-y-2">
        <div class="ds-skeleton h-2 w-20" />
        <div class="ds-skeleton h-4 w-28 max-w-full" />
      </div>
    </div>
  </div>

  <!-- Loaded -->
  <div v-else>
    <div v-if="show.genres.length" class="flex flex-wrap gap-2">
      <span v-for="genre in show.genres" :key="genre" class="ds-badge-genre">
        {{ genre }}
      </span>
    </div>

    <h1 class="ds-heading-page mt-4 text-white">{{ show.title }}</h1>

    <div
      class="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
    >
      <p class="text-sm text-slate-300">
        {{ show.network }} ·
        <span v-if="show.premieredYear != null">{{ show.premieredYear }}</span>
        · {{ show.status }} · {{ show.runtime }}
      </p>
      <RatingStars
        :rating="show.rating"
        :rating-star-fills="show.ratingStarFills"
      />
    </div>

    <div
      class="mt-6 line-clamp-none max-w-3xl overflow-hidden text-sm leading-7 text-slate-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] sm:[-webkit-line-clamp:8] md:[-webkit-line-clamp:none] [&_p]:m-0"
      v-html="show.summary"
    />

    <div class="mt-6 flex flex-wrap gap-3">
      <a
        v-if="show.officialSite"
        :href="show.officialSite"
        target="_blank"
        rel="noreferrer"
        class="ds-btn-primary"
      >
        {{ t('showDetail.meta.officialSite') }}
      </a>
      <a
        v-if="show.imdbUrl"
        :href="show.imdbUrl"
        target="_blank"
        rel="noreferrer"
        class="ds-btn-ghost"
      >
        {{ t('showDetail.meta.imdb') }}
      </a>
    </div>

    <dl
      class="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-white/10 pt-8 text-sm sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-3"
    >
      <template v-for="item in detailItems" :key="item.label">
        <div class="min-w-0">
          <dt class="ds-label-meta">{{ item.label }}</dt>
          <dd class="mt-1.5 break-words text-base font-semibold text-slate-100">
            {{ item.value }}
          </dd>
        </div>
      </template>
    </dl>
  </div>
</template>
