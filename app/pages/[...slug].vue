<script setup lang="ts">
import { createError } from 'nuxt/app';

// global 404 page handler.
throw createError({ statusCode: 404, statusMessage: 'errors.pageNotFound', fatal: true });
</script>
