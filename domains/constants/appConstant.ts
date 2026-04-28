/** Public asset (`public/no-image.svg`) — mappers use this when API omits poster URLs. */
export const FALLBACK_IMAGE = '/no-image.svg';

/** Base URL for IMDb title pages (id is TVMaze `externals.imdb`, e.g. `tt0903747`). */
export const IMDB_TITLE_BASE_URL = 'https://www.imdb.com/title/';

/** Default browse category when `type` query is missing or invalid. */
export const DEFAULT_NAV_CATEGORY = 'tv-shows' as const;

/** URL query key for search text. */
export const SEARCH_PARAM = 'q';

/** URL query key for dashboard / layout category filter. */
export const TYPE_PARAM = 'type';

/** Home (dashboard) path. */
export const PATH_HOME = '/';

/** Search results page path. */
export const PATH_SEARCH = '/search';

/** Prefix for show detail routes (`/shows/:id`). */
export const PATH_SHOWS = '/shows';
