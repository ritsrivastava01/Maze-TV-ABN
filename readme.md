# Maze TV Dashboard

TV dashboard application built with Nuxt and Vue. It consumes the TVMaze API and provides:

- genre/category based dashboard
- detailed show page
- search by show title
- responsive UI with accessibility support
- multilingual UI
- error handling: dedicated 404 page and a global error boundary for unhandled network/server errors

## Specifications

This implementation addresses the assignment requirements:

- list TV shows by category/genre in **horizontal rails** (per assignment: “preferably horizontal list”)
- within each genre, shows are **sorted by rating** (highest first)
- UI is responsive and mobile friendly
- navigate from dashboard card to show details
- include search flow
- keep code reusable and clean
- provide unit tests and end-to-end tests

### Data fetching & performance

All TVMaze access goes through **Nitro `/api/*` routes**. The strategy favors **fewer round-trips, parallel fetches where it helps, and HTTP caching** on the server.

- **Dashboard** — **`GET /shows`** loads the browse catalog in one shot. The app **groups rails by each show’s `genres[]`**, **filters** by the selected category (`tv-shows` / `movies` / `documentaries`), and **sorts by `rating.average`**. **`/api/dashboard`** is **cached for 5 minutes** (per category) so typical navigation does not hammer TVMaze.
- **Search** — **`GET /search/shows?q=...`**. **`/api/search`** uses a **30-second cache** per normalized query to smooth repeat searches.
- **Show detail** — **`GET /shows/:id`**, **`GET /shows/:id/seasons`**, and **`GET /shows/:id/cast`** run **in parallel**. **Only the first season’s episodes** load initially via **`GET /seasons/{seasonId}/episodes`**. When the user picks another season, **`/api/season/:id`** fetches that season’s episodes **on demand**, so we **do not download every season’s episode list up front**.

- design system foundation: reusable `ds-*` CSS classes built on top of Tailwind, scoped in `assets/css/design-system.css`
- code quality enforced with Prettier, ESLint (with unused-import and import-sort plugins), and Commitlint (conventional commits)
- pre-commit hooks via Husky + lint-staged run ESLint + Prettier automatically on staged files

## Tech Stack

- Nuxt 4 (Vue 3 + Nitro)
- TypeScript
- Tailwind CSS + `tailwind-scrollbar` plugin
- `@phosphor-icons/vue` icon set
- `clsx` + `tailwind-merge` for conditional class merging (`cn` utility)
- `@nuxtjs/i18n`
- Vitest + `@vitest/coverage-v8` (unit/integration)
- Playwright (e2e)
- Husky + lint-staged + Commitlint

## Why Nuxt

Nuxt was selected because it gives a good balance of product speed and architecture quality:

- built-in SSR for fast first render and SEO-friendly HTML
- file-based routing for clean page organization
- server API routes via Nitro so browser code does not call third-party APIs directly
- easy mix of SSR and CSR behaviors in one codebase
- strong Vue ecosystem compatibility

## Domain-Driven Design (DDD)

The project uses a domain-oriented structure rather than a flat component-only structure.

Each feature/domain has clear responsibilities:

- `mappers`: convert API models into UI-friendly view models
- `presenters`: orchestrate data fetching + mapping
- `viewModel`: types used by UI/pages/components

This keeps business/data transformation logic independent from page/component rendering and makes testing easier.

## Application Structure

High-level structure:

```
|-app
|   |-components                # Reusable UI components (Card, Hero, Rail, etc.)
|   |-pages                     # Route pages
|   |   |- index                # Dashboard / landing page
|   |   |- search               # Search results page
|   |   |- shows/[id]           # Show details page
|   |-composables               # UI / navigation composables
|   |-layouts                   # Default shell layout (Header + Footer)
|
|-domains                       # Domain-Driven Design layer
|   |-dashboard                 # Genre/category dashboard domain
|   |   |-mappers               # API model → view model transformation
|   |   |-presenters            # Data fetching + mapping orchestration
|   |   |-viewModel             # TypeScript types for UI
|   |-layout                    # Navigation / layout domain
|   |   |-mappers
|   |   |-presenters
|   |   |-viewModel
|   |-search                    # Show search domain
|   |   |-mappers
|   |   |-presenters
|   |   |-viewModel
|   |-showDetails               # Show detail + seasons/cast domain
|   |   |-mappers
|   |   |-presenters
|   |   |-viewModel
|   |-tvmaze                    # TVMaze API client (raw API calls)
|
|-server
|   |-api                       # Nitro server endpoints (SSR data layer)
|
|-i18n
|   |-locales                   # Language files (en, nl)
|
|-tests
|   |-e2e                       # Playwright end-to-end scenarios
|   |-mocks                     # Shared test factories and stubs
|
|-assets
|   |-css                       # Tailwind + design system stylesheets
```

## SSR and CSR Boundaries

### SSR

- Initial page data fetching is SSR-enabled through `useFetch` in page setup (for example dashboard and show details page load).
- Nitro routes in `server/api/*` execute server-side and wrap domain presenters.
- Cached server handlers are used for expensive or repeated requests:
  - dashboard endpoint: 5 min cache
  - search endpoint: 30 sec cache

### CSR

- User-driven interactions run on client side:
  - category switch re-fetch
  - infinite rail loading on dashboard scroll
  - season change fetching in show details page
  - search query updates and navigation

## Accessibility Implemented

Key accessibility additions in the current implementation:

- descriptive `aria-label` usage on navigation, search controls, and result containers
- semantic headings and structured sections
- alt text for content images
- decorative icons marked with `aria-hidden`
- keyboard interactions for search (`Enter`, `Escape`)
- accessible locale switch labels

## Language Support

Internationalization is enabled with `@nuxtjs/i18n`.

- default locale: `en`
- supported locales: `en` (English), `nl` (Nederlands)
- strategy: `prefix_except_default`
- translation files:
  - `i18n/locales/en.json`
  - `i18n/locales/nl.json`

## Other Implemented Features

- category filter flow (`tv-shows`, `movies`, `documentaries`)
- search result grid with loading skeletons and empty state
- show detail page with metadata, cast panel, episode panel and season switching
- reusable rating star-fill mapping and display
- shared test factories/scenarios to reduce test duplication

## Setup and Run

### Prerequisites

- **Node.js**: `v22.17.0` (use the same major version when possible; run `node -v` to confirm)
- **npm**: `11.4.2` (`npm -v`)

### Before submission (assignment checklist)

- Run `npm run dev`, click through dashboard → details → search, and confirm **no errors in the browser console**
- Run `npm test` and `npm run build` successfully

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build and Preview

```bash
npm run build
npm run preview
```

### Lint and Format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Testing

### Unit/Integration (Vitest)

```bash
npm test
npm run test:watch
npm run test:coverage   # runs Vitest with v8 coverage and opens HTML report
```

Coverage report is generated in `coverage/vitest/index.html`.

Current coverage across the **domains layer** (mappers, presenters, composables):

| Layer                 | Statements | Branches | Functions | Lines    |
| --------------------- | ---------- | -------- | --------- | -------- |
| `app/composables`     | 100%       | 100%     | 100%      | 100%     |
| `domains/dashboard`   | 100%       | ~79%     | 100%      | 100%     |
| `domains/layout`      | 100%       | 100%     | 100%      | 100%     |
| `domains/search`      | 100%       | 80%      | 100%      | 100%     |
| `domains/showDetails` | ~97%       | ~88%     | 100%      | ~97%     |
| **All files**         | **~99%**   | **~85%** | **100%**  | **~99%** |

The `server/api` and `domains/tvmaze/api` layers are intentionally excluded from unit test coverage — they are covered by the Playwright e2e suite instead.

Current unit/integration specs include:

- `domains/layout/mappers/layout.mapper.spec.ts`
- `domains/layout/presenters/layout.presenter.spec.ts`
- `domains/dashboard/mappers/dashboard.mapper.spec.ts`
- `domains/dashboard/presenters/dashboard.presenter.spec.ts`
- `domains/search/mappers/search.mapper.spec.ts`
- `domains/search/presenters/search.presenter.spec.ts`
- `domains/showDetails/mappers/showDetails.mapper.spec.ts`
- `domains/showDetails/presenters/showDetails.presenter.spec.ts`
- `app/composables/useAppNavigation.spec.ts`

### End-to-End (Playwright)

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
```

Current e2e specs:

- `tests/e2e/dashboard.spec.ts`
- `tests/e2e/details.spec.ts`
- `tests/e2e/search.spec.ts`

## TODO / Improvements

- add more unit tests and e2e tests
- replace the layout (header and footer) data with an actual API
- add API contract tests for server routes
