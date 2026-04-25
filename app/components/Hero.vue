<template>
  <section class="relative min-h-screen overflow-hidden text-white">
    <img
      :src="show.heroImage"
      :alt="show.title"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

    <div class="container relative z-10 mx-auto flex min-h-screen px-4 pb-28 pt-28 sm:px-6 lg:px-10">
      <div class="mt-auto w-full max-w-xl">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-pink-300">
          {{ t('labels.featuredShow') }}
        </p>
        <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
          {{ show.title }}
        </h1>

        <RatingStars
          class="mt-5"
          :rating="show.rating"
          :rating-star-fills="show.ratingStarFills"
        />

        <div
          class="mt-5 line-clamp-none max-w-xl overflow-hidden text-sm leading-6 text-slate-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [&_p]:m-0 md:[-webkit-line-clamp:8] lg:[display:block]"
          v-html="show.summary"
        />

        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink
            :to="getShowPath(show.id)"
            class="rounded-full bg-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
          >
            {{ t('actions.watchNow') }}
          </NuxtLink>
          <button
            type="button"
            class="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            {{ t('actions.trailer') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {useAppNavigation} from '#imports';
import RatingStars from './RatingStars.vue';
import type {ShowViewModel} from '../../domains/shows/viewModel/show.type';

defineProps<{
  show: ShowViewModel;
}>();

const {t} = useI18n();
const {getShowPath} = useAppNavigation();
</script>
