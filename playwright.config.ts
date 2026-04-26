import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration.
 *
 * The Nuxt dev server is started automatically before the test run.
 * Set PLAYWRIGHT_BASE_URL to override (e.g. for CI pointing at a preview deploy).
 *
 * Run once to install browsers: npx playwright install chromium
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  /** Fail CI immediately on .only — prevents accidentally focused tests shipping. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    /** Re-use an already running dev server locally; always spin up a fresh one in CI. */
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
