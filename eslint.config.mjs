// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // ── Import sorting ────────────────────────────────────────────────────
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // ── Unused imports ────────────────────────────────────────────────────
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },

  // ── TypeScript & Vue source files ──────────────────────────────────────
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      // Enforces === over == — use eslint-disable-next-line for intentional == null checks
      eqeqeq: ['error', 'always'],
      // Handled by unused-imports plugin — avoids duplicate reports
      '@typescript-eslint/no-unused-vars': 'off',
      // Consistent type imports  (import type {...})
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      // Prefer const over let where reassignment does not happen
      'prefer-const': 'error',
      // No console.log left in source — use console.warn/error for intentional output
      'no-console': ['warn', { allow: ['warn', 'error'] }],
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
      'vue/html-self-closing': [
        'warn',
        {
          html: { void: 'any', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      // Enforce component attribute ordering
      'vue/attributes-order': ['warn', { alphabetical: false }],
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
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'coverage/**'],
  },

  // ── Prettier — must be last to disable conflicting formatting rules ────
  eslintConfigPrettier
);
