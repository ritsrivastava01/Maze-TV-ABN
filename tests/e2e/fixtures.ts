import type { Page } from '@playwright/test';

import { DEFAULT_NAV_CATEGORY, FALLBACK_IMAGE, IMDB_TITLE_BASE_URL } from '../../domains/constants/appConstant';

// ─── Shared mock data ───────────────────────────────────────────────────────

export const MOCK_SHOW = {
  id: 1,
  title: 'E2E Mock Show',
  image: FALLBACK_IMAGE,
  heroImage: FALLBACK_IMAGE,
  rating: 9.5,
  ratingStarFills: [100, 100, 100, 100, 75],
  genres: ['Drama', 'Crime'],
  summary: '<p>A high school chemistry teacher diagnosed with cancer turns to making meth.</p>',
};

export const MOCK_LAYOUT = {
  headerNavItems: [
    { value: DEFAULT_NAV_CATEGORY, labelKey: 'nav.tvShows', order: 1 },
    { value: 'movies', labelKey: 'nav.movies', order: 2 },
  ],
};

export const MOCK_DASHBOARD = {
  featuredShow: MOCK_SHOW,
  genreRows: [{ genre: 'Drama', shows: [MOCK_SHOW] }],
};

export const MOCK_SHOW_DETAIL = {
  show: {
    id: 1,
    title: 'E2E Mock Show',
    image: FALLBACK_IMAGE,
    ratingStarFills: [100, 100, 100, 100, 75],
    genres: ['Drama', 'Crime'],
    summary: '<p>A chemistry teacher turns to making meth.</p>',
    type: 'Scripted',
    language: 'English',
    status: 'Ended',
    runtime: '47 min',
    premiereDate: '2008-01-20',
    premieredYear: 2008,
    ended: '2013-09-29',
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    network: 'AMC',
    country: 'United States',
    scheduleDays: 'Sunday',
    scheduleTime: '21:00',
    imdbUrl: `${IMDB_TITLE_BASE_URL}tt0903747`,
  },
  seasonList: [{ id: 1, number: 1 }],
  cast: [],
  episodes: [],
};

export const MOCK_SEARCH = {
  query: 'breaking',
  totalResults: 1,
  results: [{ id: 1, title: 'E2E Mock Show', image: FALLBACK_IMAGE, rating: 9.5, ratingStarFills: [100, 100, 100, 100, 75] }],
};

// ─── Route mock helper ──────────────────────────────────────────────────────

// PLAYWRIGHT_E2E=1 (set in playwright.config.ts webServer env) switches Nuxt to CSR mode
// so useFetch runs in the browser and page.route() intercepts apply correctly.

export async function setupRouteMocks(page: Page): Promise<void> {
  await page.route((url) => url.href.includes('/api/layout'), (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LAYOUT) })
  );
  await page.route((url) => url.href.includes('/api/dashboard'), (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_DASHBOARD) })
  );
  await page.route((url) => /\/api\/1(\?|$)/.test(url.href), (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SHOW_DETAIL) })
  );
  await page.route((url) => url.href.includes('/api/search'), (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SEARCH) })
  );
}
