<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  error: { statusCode: number; statusMessage: string; message?: string };
}>();

const router = useRouter();

const is404 = props.error.statusCode === 404;

const handleBack = (): void => {
  router.push('/');
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
    <p class="ds-label-brand mb-4">
      {{ is404 ? '404' : String(error.statusCode) }}
    </p>

    <h1 class="ds-heading-page mb-4">
      {{ is404 ? 'Page not found' : 'Something went wrong' }}
    </h1>

    <p class="mb-10 max-w-md text-sm leading-6 text-slate-400">
      {{
        is404
          ? "The page you're looking for doesn't exist or was moved."
          : error.statusMessage || error.message || 'An unexpected error occurred.'
      }}
    </p>

    <button type="button" class="ds-btn-primary" @click="handleBack">Back to home</button>
  </div>
</template>
