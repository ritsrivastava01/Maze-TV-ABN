// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // ── TypeScript & Vue source files ──────────────────────────────────────
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      // Enforces === over == — use eslint-disable-next-line for intentional == null checks
      'eqeqeq': ['error', 'always'],
      // Disallow unused variables (underscore prefix to opt-out)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
      // Consistent type imports  (import type {...})
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports', disallowTypeAnnotations: false},
      ],
      // Prefer const over let where reassignment does not happen
      'prefer-const': 'error',
      // No console.log left in source — use console.warn/error for intentional output
      'no-console': ['warn', {allow: ['warn', 'error']}],
    },
  },

  // ── Vue-specific rules ─────────────────────────────────────────────────
  {
    files: ['**/*.vue'],
    rules: {
      // Project uses intentional single-word component names
      'vue/multi-word-component-names': 'off',
      // Vue 3 supports multiple template roots (fragments)
      'vue/no-multiple-template-root': 'off',
      // Allow self-closing void HTML elements (<img />, <input />, <hr />) in Vue templates
      'vue/html-self-closing': ['warn', {
        html: {void: 'any', normal: 'always', component: 'always'},
        svg: 'always',
        math: 'always',
      }],
      // Enforce component attribute ordering
      'vue/attributes-order': ['warn', {alphabetical: false}],
      // Consistent v-bind shorthand
      'vue/v-bind-style': ['error', 'shorthand'],
      // No unused component refs
      'vue/no-unused-refs': 'warn',
      // Disallow <template> v-for without :key
      'vue/require-v-for-key': 'error',
      // No side-effects in computed properties
      'vue/no-side-effects-in-computed-properties': 'error',
      // v-html used intentionally for TVMaze HTML content — warn only
      'vue/no-v-html': 'warn',
    },
  },

  // ── Test files — relaxed rules ─────────────────────────────────────────
  {
    files: ['tests/**/*.{ts,spec.ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // vi.mock() calls are intentionally placed before other imports — Vitest hoists them
      'import/first': 'off',
    },
  },

  // ── Ignore compiled / generated output ────────────────────────────────
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
    ],
  },
);
