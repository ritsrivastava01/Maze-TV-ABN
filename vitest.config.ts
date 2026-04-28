import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const i18nComposables = fileURLToPath(
  new URL('node_modules/@nuxtjs/i18n/dist/runtime/composables/index.js', import.meta.url)
);

/**
 * Vitest configuration for unit and integration tests.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['domains/**/*.spec.ts', 'app/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['domains/**/*.ts', 'app/composables/**/*.ts', 'server/**/*.ts'],
      exclude: ['**/*.type.ts', '**/*.d.ts', '**/*.spec.ts'],
    },
  },
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '#i18n': i18nComposables,
    },
  },
});
