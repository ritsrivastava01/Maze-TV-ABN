import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration.
 *
 * **Which URL to test:** `page.goto('/')` resolves against `baseURL`.
 * - Defaults to `http://localhost:3000` (or whatever port `PLAYWRIGHT_DEV_PORT` sets).
 * - If port 3000 is another app, run Nuxt on a free port and point Playwright at it — do not rely on `:3000` being this project.
 *
 * **Serving the app**
 * - Default: Playwright starts `nuxt dev` on the **same host/port as `baseURL`** (see webServer below).
 * - The dev server runs with **`PLAYWRIGHT_E2E=1`** so Nuxt turns off SSR (`routeRules`). Otherwise
 *   `useFetch` runs only on the server — Playwright’s `page.route()` mocks never apply and tests see live API data.
 * - Already running the app yourself? Use **`PLAYWRIGHT_E2E=1`** on that dev process too:
 *   `PLAYWRIGHT_E2E=1 PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e` (and match `PLAYWRIGHT_BASE_URL`).
 *
 * Playwright HTML report: `coverage/e2e`. Open with `npm run test:e2e:report`.
 *
 * Browsers: `postinstall` runs `playwright install chromium webkit`.
 * CI can set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` and install browsers in a separate step.
 */

function resolveBaseURL(): string {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    return process.env.PLAYWRIGHT_BASE_URL;
  }
  const port = process.env.PLAYWRIGHT_DEV_PORT ?? '3000';
  return `http://localhost:${port}`;
}

const baseURL = resolveBaseURL();

/** Port Playwright waits on and passes to `nuxt dev --port` when starting the server. */
function portForDevServer(urlString: string): string {
  try {
    const { port } = new URL(urlString);
    return port !== '' ? port : process.env.PLAYWRIGHT_DEV_PORT ?? '3000';
  } catch {
    return process.env.PLAYWRIGHT_DEV_PORT ?? '3000';
  }
}

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

/** Local default is 1 so headed runs show a single browser; set `PLAYWRIGHT_WORKERS=4` to parallelize. */
function resolvedWorkers(): number | undefined {
  if (process.env.PLAYWRIGHT_WORKERS !== undefined) {
    const n = Number.parseInt(process.env.PLAYWRIGHT_WORKERS, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }
  return process.env.CI ? undefined : 1;
}

export default defineConfig({
  testDir: 'tests/e2e',
  /** With multiple workers + headed, you get several browser windows; use `workers: 1` (default locally). */
  fullyParallel: true,
  /** Fail CI immediately on .only — prevents accidentally focused tests shipping. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: resolvedWorkers(),
  reporter: [['html', { open: 'never', outputFolder: 'coverage/e2e' }], ['list']],

  use: {
    baseURL,
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

  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: `npm run dev -- --port ${portForDevServer(baseURL)}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          stdout: 'ignore',
          stderr: 'pipe',
          env: {
            ...process.env,
            PLAYWRIGHT_E2E: '1',
          },
        },
      }),
});
