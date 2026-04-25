import type {
  DashboardCategory,
  DashboardGenreRow,
  DashboardViewModel
} from '../viewModel/dashboardViewModel.type';
import type {ShowViewModel} from '../viewModel/show.type';

const MOVIE_GENRES = new Set([
  'Action',
  'Adventure',
  'Fantasy',
  'Science-Fiction',
  'Romance'
]);

const DOCUMENTARY_GENRES = new Set(['Documentary', 'History', 'Nature']);

const filterShowsByCategory = (
  shows: ShowViewModel[],
  category: DashboardCategory
): ShowViewModel[] => {
  if (category === 'tv-shows') {
    return shows;
  }

  if (category === 'movies') {
    return shows.filter((show) =>
      show.genres.some((genre) => MOVIE_GENRES.has(genre))
    );
  }

  return shows.filter((show) =>
    show.genres.some((genre) => DOCUMENTARY_GENRES.has(genre))
  );
};

const mapShowsToGenreRows = (shows: ShowViewModel[]): DashboardGenreRow[] => {
  const genreMap = new Map<string, ShowViewModel[]>();

  for (const show of shows) {
    const genres = show.genres.length ? show.genres : ['Other'];
    for (const genre of genres) {
      if (!genreMap.has(genre)) {
        genreMap.set(genre, []);
      }
      genreMap.get(genre)!.push(show);
    }
  }

  return [...genreMap.entries()].map(([genre, genreShows]) => ({
    genre,
    shows: genreShows
  }));
};

const mapShowsToUniqueGenres = (shows: ShowViewModel[]): string[] => {
  return [...new Set(shows.flatMap((show) => show.genres))]
    .filter((genre) => Boolean(genre))
    .sort((a, b) => a.localeCompare(b));
};

export const mapShowsToDashboardViewModel = (
  shows: ShowViewModel[],
  category: DashboardCategory
): DashboardViewModel => {
  const filteredShows = filterShowsByCategory(shows, category);
  const effectiveShows = filteredShows.length > 0 ? filteredShows : shows;

  return {
    shows: effectiveShows,
    featuredShow: effectiveShows[0] ?? null,
    genreRows: mapShowsToGenreRows(effectiveShows),
    genres: mapShowsToUniqueGenres(shows)
  };
};
