// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/eslint'],

  /**
   * Point @nuxtjs/tailwindcss at our custom entry file.
   * tailwind.css includes @tailwind base/components/utilities and
   * imports design-system.css into the correct Tailwind layer.
   */
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', '@phosphor-icons/vue'],
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
    ],
  },
});
