<script setup lang="ts">
const { t } = useI18n();

const description = computed(() => t('seo.description'));

useSeoMeta({
  description,
  ogDescription: description,
});
</script>

<template>
  <!-- Nuxt app shell: a11y announcer, layout wrapper, then the active page. -->
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
