// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      {code: 'en', language: 'en-US', file: 'en.json', name: 'English'},
      {code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands'}
    ]
  }
});
