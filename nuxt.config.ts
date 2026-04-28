// https://nuxt.com/docs/api/configuration/nuxt-config

/**
 * When Playwright runs E2E, `page.route()` mocks browser fetches. Server-side SSR would call
 * `/api/*` directly on Nitro — mocks never apply — so we disable SSR for E2E-only runs.
 * Start Nuxt with `PLAYWRIGHT_E2E=1` (playwright.config does this for the spawned dev server).
 */
const isPlaywrightE2E = process.env.PLAYWRIGHT_E2E === '1';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/i18n',
      {
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        langDir: 'locales',
        locales: [
          { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
          { code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
        ],
      },
    ],
    '@nuxt/eslint',
  ],

  app: {
    head: {
      title: 'Maze TV',
    },
  },

  /**
   * Point @nuxtjs/tailwindcss at our custom entry file.
   * tailwind.css includes @tailwind base/components/utilities and
   * imports design-system.css into the correct Tailwind layer.
   */
  css: ['~/assets/css/tailwind.css'],

  vite: {
    /** Avoids Rollup “incorrect sourcemap” warning from `nuxt:module-preload-polyfill` (no map for injected preload). */
    build: {
      modulePreload: {
        polyfill: false,
      },
    },
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', '@phosphor-icons/vue', 'clsx', 'tailwind-merge'],
    },
  },

  ...(isPlaywrightE2E ? { routeRules: { '/**': { ssr: false } } } : {}),
});
