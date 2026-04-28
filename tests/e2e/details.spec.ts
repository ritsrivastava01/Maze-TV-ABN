import { expect, test } from '@playwright/test';

import { setupRouteMocks } from './fixtures';

test.beforeEach(async ({ page }) => {
  await setupRouteMocks(page);
});

test('clicking hero link navigates to show details page', async ({ page }) => {
  const dashboardReady = page.waitForResponse((r) => r.url().includes('/api/dashboard') && r.ok());
  const layoutReady = page.waitForResponse((r) => r.url().includes('/api/layout') && r.ok());
  await page.goto('/');
  await Promise.all([dashboardReady, layoutReady]);

  const link = page.getByRole('link', { name: /show details/i });
  await link.waitFor({ state: 'visible', timeout: 15_000 });

  const detailReady = page.waitForResponse((r) => r.url().includes('/api/1') && r.ok());
  await link.click({ force: true });
  await detailReady;

  await expect(page).toHaveURL(/\/shows\/1/);
  await expect(page.getByRole('heading', { name: 'E2E Mock Show', level: 1 })).toBeVisible({ timeout: 15_000 });
});
