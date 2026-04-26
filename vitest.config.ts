import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Vitest configuration for unit and integration tests.
 * E2E tests are handled separately by Playwright (playwright.config.ts).
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['domains/**/*.ts', 'app/composables/**/*.ts', 'server/**/*.ts'],
      exclude: ['**/*.type.ts', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
