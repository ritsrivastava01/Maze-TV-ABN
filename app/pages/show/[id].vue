<template>
  <main class="min-h-screen bg-slate-950 pt-24 text-white">
    <section class="container mx-auto px-4 sm:px-6 lg:px-10">
      <p class="text-sm text-slate-300">Show detail page</p>
      <h1 class="mt-2 text-3xl font-bold">Show {{ showId }}</h1>
    </section>
  </main>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

const showId = computed(() => {
  return route.params.id;
});
</script>
