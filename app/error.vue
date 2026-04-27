<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { clearError } from 'nuxt/app';

const props = defineProps<{
  error: { statusCode: number; statusMessage: string; message?: string };
}>();

const { t, te } = useI18n();

const is404 = props.error.statusCode === 404;

const errorMessage = computed(() => {
  const key = props.error.statusMessage;
  if (key && te(key)) return t(key);
  return key || props.error.message || t('errors.unexpectedError');
});

const handleGoHome = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout>
    <div class="flex min-h-[65vh] flex-col items-center justify-center px-4 py-16 text-center">
    <p class="ds-label-brand mb-4">
      {{ is404 ? '404' : String(error.statusCode) }}
    </p>

    <h1 class="ds-heading-page mb-4">
      {{ is404 ? t('errors.pageNotFound') : t('errors.somethingWentWrong') }}
    </h1>

    <p class="max-w-md text-sm leading-6 text-slate-400">
      {{ is404 ? t('errors.pageNotFoundMessage') : errorMessage }}
    </p>

    <button type="button" class="ds-btn-primary mt-8" @click="handleGoHome">
      {{ t('actions.goHome') }}
    </button>
    </div>
  </NuxtLayout>
</template>
