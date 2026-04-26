import scrollbar from 'tailwind-scrollbar';

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      /**
       * Semantic design tokens — use these instead of raw palette values
       * (e.g. `bg-surface-card` instead of `bg-slate-900`).
       */
      colors: {
        brand: {
          DEFAULT: '#f472b6', // pink-400 — interactive highlights, active states
          strong:  '#ec4899', // pink-500 — primary CTA fills
          subtle:  '#f9a8d4', // pink-300 — eyebrow labels, muted accents
        },
        surface: {
          page:    '#020617', // slate-950 — app background
          card:    '#0f172a', // slate-900 — card surfaces
          raised:  '#1e293b', // slate-800 — elevated / hover surfaces
          overlay: '#334155', // slate-700 — skeleton, dividers
        },
        content: {
          primary:   '#ffffff',      // primary text
          secondary: '#e2e8f0',      // slate-200 — body copy
          muted:     '#94a3b8',      // slate-400 — supporting text
          faint:     '#64748b',      // slate-500 — metadata labels
        },
      },
    },
  },
  plugins: [scrollbar],
};
