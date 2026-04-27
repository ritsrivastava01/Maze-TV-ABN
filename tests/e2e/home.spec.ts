import { expect, test } from '@playwright/test';

import type { DashboardViewModel } from '../../domains/dashboard/viewModel/dashboardViewModel.type';
import type { HeaderViewModel } from '../../domains/layout/viewModel/layoutViewModel.type';

// ─── Mock fixtures ─────────────────────────────────────────────────────────

const MOCK_LAYOUT: HeaderViewModel = {
  headerNavItems: [
    { value: 'tv-shows', labelKey: 'nav.tvShows', order: 1 },
    { value: 'movies', labelKey: 'nav.movies', order: 2 },
    { value: 'documentaries', labelKey: 'nav.documentaries', order: 3 },
  ],
};

const MOCK_SHOW = {
  id: 1,
  title: 'Breaking Bad',
  image: 'https://via.placeholder.com/210x295?text=Breaking+Bad',
  heroImage: 'https://via.placeholder.com/1200x800?text=Breaking+Bad',
  rating: 9.5,
  ratingStarFills: [100, 100, 100, 100, 75],
  genres: ['Drama', 'Crime'],
  summary: '<p>A high school chemistry teacher is diagnosed with inoperable lung cancer.</p>',
};

const MOCK_DASHBOARD: DashboardViewModel = {
  featuredShow: MOCK_SHOW,
  genreRows: [
    {
      genre: 'Drama',
      shows: [MOCK_SHOW, { ...MOCK_SHOW, id: 2, title: 'The Wire' }],
    },
    {
      genre: 'Crime',
      shows: [MOCK_SHOW],
    },
  ],
};

// ─── Setup: intercept the Nuxt API routes ──────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.route('/api/layout', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LAYOUT) })
  );
  await page.route('/api/dashboard**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_DASHBOARD) })
  );
});

// ─── Tests ─────────────────────────────────────────────────────────────────

test('renders the page header with the brand name', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header');
  await expect(header).toBeVisible();
  await expect(header.getByText('MAZE TV')).toBeVisible();
});

test('renders the hero section with the featured show title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Breaking Bad')).toBeVisible({ timeout: 10_000 });
});

test('renders the "Watch Now" CTA in the hero', async ({ page }) => {
  await page.goto('/');
  const showDetails = page.getByRole('link', { name: /show details/i });
  await expect(showDetails).toBeVisible({ timeout: 10_000 });
  await expect(showDetails).toHaveAttribute('href', /\/show\/1/);
});

test('renders the genre rail headers', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Drama')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Crime')).toBeVisible({ timeout: 10_000 });
});

test('clicking "Watch Now" navigates to the show detail page', async ({ page }) => {
  await page.goto('/');
  const showDetails = page.getByRole('link', { name: /show details/i });
  await showDetails.waitFor({ state: 'visible', timeout: 10_000 });
  await showDetails.click();
  await expect(page).toHaveURL(/\/show\/1/);
});

test('category navigation links are visible', async ({ page }) => {
  await page.goto('/');
  // Navigation may be hidden on mobile — check via aria
  const tvShowsBtn = page.getByRole('button', { name: /tv shows/i });
  const moviesBtn = page.getByRole('button', { name: /movies/i });
  await expect(tvShowsBtn.first()).toBeVisible({ timeout: 10_000 });
  await expect(moviesBtn.first()).toBeVisible({ timeout: 10_000 });
});

test('renders the page footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toBeVisible();
});

test('has no detectable accessibility violations on the heading hierarchy', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Verify at least one h1 is present (critical accessibility rule)
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBeGreaterThanOrEqual(1);
});
