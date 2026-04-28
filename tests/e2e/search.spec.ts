import { expect, test } from '@playwright/test';

import { PATH_SEARCH, SEARCH_PARAM } from '../../domains/constants/appConstant';
import { setupRouteMocks } from './fixtures';

test.beforeEach(async ({ page }) => {
  await setupRouteMocks(page);
});

test('search page shows results for a query', async ({ page }) => {
  await page.goto(`${PATH_SEARCH}?${SEARCH_PARAM}=breaking`);
  await expect(page.getByText('E2E Mock Show').first()).toBeVisible({ timeout: 15_000 });
});
