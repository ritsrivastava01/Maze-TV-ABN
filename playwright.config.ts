import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

/**
 * Minimal Playwright config.
 *
 * PLAYWRIGHT_E2E=1 is passed to `nuxt dev` so Nuxt switches all routes to CSR.
 * This lets page.route() mocks intercept API calls (useFetch runs in the browser, not on the server).
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 90_000,
  workers: 1,
  reporter: [['html', { open: 'never', outputFolder: 'coverage/e2e' }], ['list']],

  use: {
    baseURL: BASE_URL,
    headless: true,
    navigationTimeout: 60_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      PLAYWRIGHT_E2E: '1',
    },
  },
});
