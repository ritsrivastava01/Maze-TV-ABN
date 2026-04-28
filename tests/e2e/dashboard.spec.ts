import { expect, test } from '@playwright/test';

import { setupRouteMocks } from './fixtures';

test.beforeEach(async ({ page }) => {
  await setupRouteMocks(page);
});

test('dashboard loads and shows featured show in hero', async ({ page }) => {
  const dashboardReady = page.waitForResponse((r) => r.url().includes('/api/dashboard') && r.ok());
  const layoutReady = page.waitForResponse((r) => r.url().includes('/api/layout') && r.ok());
  await page.goto('/');
  await Promise.all([dashboardReady, layoutReady]);
  await expect(page.getByText('E2E Mock Show').first()).toBeVisible({ timeout: 15_000 });
});
