import { expect, test } from '@playwright/test';
import type { ShowDetailViewModel } from '../../domains/show/viewModel/showDetailViewModel.type';
import type { HeaderViewModel } from '../../domains/layout/viewModel/layoutViewModel.type';

// ─── Mock fixtures ─────────────────────────────────────────────────────────

const MOCK_LAYOUT: HeaderViewModel = {
  headerNavItems: [
    { value: 'tv-shows', labelKey: 'nav.tvShows', order: 1 },
    { value: 'movies', labelKey: 'nav.movies', order: 2 },
  ],
};

const MOCK_SHOW_DETAIL: ShowDetailViewModel = {
  show: {
    id: 1,
    title: 'Breaking Bad',
    image: 'https://via.placeholder.com/210x295?text=Breaking+Bad',
    heroImage: 'https://via.placeholder.com/1200x800?text=Breaking+Bad',
    rating: 9.5,
    ratingStarFills: [100, 100, 100, 100, 75],
    genres: ['Drama', 'Crime'],
    summary:
      '<p>A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.</p>',
    type: 'Scripted',
    language: 'English',
    status: 'Ended',
    runtime: '47 min',
    premiered: 'Jan 20, 2008',
    premieredYear: 2008,
    ended: 'Sep 29, 2013',
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    network: 'AMC',
    country: 'United States',
    scheduleDays: 'Sunday',
    scheduleTime: '22:00',
    imdbUrl: 'https://www.imdb.com/title/tt0903747',
  },
  seasons: [
    {
      season: 1,
      episodes: [
        {
          id: 101,
          title: 'Pilot',
          season: 1,
          number: 1,
          image: 'https://via.placeholder.com/320x180?text=S1E1',
          rating: 8.2,
          ratingStarFills: [100, 100, 100, 100, 10],
          summary: '<p>Walter White begins his transformation.</p>',
        },
        {
          id: 102,
          title: "Cat's in the Bag",
          season: 1,
          number: 2,
          image: 'https://via.placeholder.com/320x180?text=S1E2',
          rating: 8.5,
          ratingStarFills: [100, 100, 100, 100, 25],
          summary: '<p>Walt and Jesse face a serious problem.</p>',
        },
      ],
    },
    {
      season: 2,
      episodes: [
        {
          id: 201,
          title: 'Seven Thirty-Seven',
          season: 2,
          number: 1,
          image: 'https://via.placeholder.com/320x180?text=S2E1',
          rating: 8.8,
          ratingStarFills: [100, 100, 100, 100, 40],
          summary: '<p>The consequences of the past catch up.</p>',
        },
      ],
    },
  ],
  cast: [
    {
      id: 1,
      name: 'Bryan Cranston',
      characterName: 'Walter White',
      image: 'https://via.placeholder.com/210x295?text=Bryan',
    },
    {
      id: 2,
      name: 'Aaron Paul',
      characterName: 'Jesse Pinkman',
      image: 'https://via.placeholder.com/210x295?text=Aaron',
    },
  ],
  episodes: [],
};

// ─── Setup ────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.route('/api/layout', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LAYOUT) }),
  );
  await page.route('/api/show/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SHOW_DETAIL) }),
  );
});

// ─── Tests ─────────────────────────────────────────────────────────────────

test('renders the show title on the detail page', async ({ page }) => {
  await page.goto('/show/1');
  await expect(page.getByRole('heading', { name: 'Breaking Bad', level: 1 })).toBeVisible({
    timeout: 10_000,
  });
});

test('renders genre badges', async ({ page }) => {
  await page.goto('/show/1');
  await expect(page.getByText('Drama')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Crime')).toBeVisible({ timeout: 10_000 });
});

test('renders the show metadata grid with network and status', async ({ page }) => {
  await page.goto('/show/1');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('AMC')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Ended')).toBeVisible({ timeout: 10_000 });
});

test('renders the season selector dropdown', async ({ page }) => {
  await page.goto('/show/1');
  const seasonSelect = page.getByRole('combobox', { name: /choose season/i });
  await expect(seasonSelect).toBeVisible({ timeout: 10_000 });
});

test('switching seasons updates the episode list', async ({ page }) => {
  await page.goto('/show/1');
  const seasonSelect = page.getByRole('combobox', { name: /choose season/i });
  await seasonSelect.waitFor({ state: 'visible', timeout: 10_000 });

  // Default shows season 1 episodes
  await expect(page.getByText('Pilot')).toBeVisible();

  // Switch to season 2
  await seasonSelect.selectOption('2');
  await expect(page.getByText('Seven Thirty-Seven')).toBeVisible();
  await expect(page.getByText('Pilot')).not.toBeVisible();
});

test('renders the cast rail with cast member names', async ({ page }) => {
  await page.goto('/show/1');
  await expect(page.getByText('Bryan Cranston')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Aaron Paul')).toBeVisible({ timeout: 10_000 });
});

test('"Back to shows" button navigates back to the homepage', async ({ page }) => {
  await page.goto('/show/1?type=tv-shows');
  const backBtn = page.getByRole('link', { name: /back to shows/i });
  await backBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await backBtn.click();
  await expect(page).toHaveURL(/\/(\?|$)/);
});

test('renders the official site and IMDb external links', async ({ page }) => {
  await page.goto('/show/1');
  await page.waitForLoadState('networkidle');
  const officialLink = page.getByRole('link', { name: /official site/i });
  const imdbLink = page.getByRole('link', { name: /imdb/i });
  await expect(officialLink).toBeVisible({ timeout: 10_000 });
  await expect(imdbLink).toBeVisible({ timeout: 10_000 });
});
