<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <footer class="relative z-30 border-t border-white/10 bg-slate-950 py-10 text-center">
    <p class="text-sm font-semibold tracking-[0.3em] text-slate-300">
      {{ t('brand.appName') }}
    </p>
  </footer>
</template>
