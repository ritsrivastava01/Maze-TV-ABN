<script setup lang="ts">
import { createError } from 'nuxt/app';

throw createError({ statusCode: 404, statusMessage: 'errors.pageNotFound', fatal: true });
</script>
