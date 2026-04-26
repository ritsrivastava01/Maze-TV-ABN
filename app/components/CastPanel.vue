<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import type {Cast} from '../../domains/showDetails/viewModel/showDetailsViewModel.type';
import Card from './Card.vue';
import Rail from './Rail.vue';

defineProps<{
  cast: Cast[];
}>();

const {t} = useI18n();

const cardClass =
  'relative isolate h-72 w-52 min-w-52 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10';
</script>

<template>
  <section v-if="cast.length > 0">
    <p class="text-xs uppercase tracking-[0.24em] text-slate-500">
      {{ t('showDetail.cast') }}
    </p>
    <Rail class="!mb-0 mt-3">
      <Card
        v-for="member in cast"
        :key="member.id"
        :preview="{
          id: member.id,
          title: member.name,
          image: member.image
        }"
        :class="cardClass"
      >
        <template #footer>
          <h3
            class="line-clamp-2 font-black leading-tight text-pink-300 drop-shadow-md"
          >
            {{ member.name }}
          </h3>
          <p
            class="mt-1 line-clamp-2 text-sm font-semibold text-white drop-shadow-md"
          >
            {{ member.characterName }}
          </p>
        </template>
      </Card>
    </Rail>
  </section>
</template>
