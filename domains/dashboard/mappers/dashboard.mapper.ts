import type {ShowApiModel} from '../../tvmaze/api/tvmaze.api';
import type {
  DashboardCategory,
  DashboardGenreRow,
  DashboardViewModel
} from '../viewModel/dashboardViewModel.type';
import type {ShowViewModel} from '../viewModel/show.type';

// default fallback image
const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';
// number of stars
const STAR_COUNT = 5;

// set of movie genres
const MOVIE_GENRES = new Set([
  'Action',
  'Adventure',
  'Fantasy',
  'Science-Fiction',
  'Romance'
]);

// set of documentary genres
const DOCUMENTARY_GENRES = new Set(['Documentary', 'History', 'Nature']);

/**
 *   used to map the shows API model to the dashboard view model
 */
const mapShowsApiToDashboardViewModel = (
  shows: ShowApiModel[],
  category: DashboardCategory
): DashboardViewModel => {
  const sortedShows = mapShowsApiToDashboardShows(shows);
  const filteredShows = filterShowsByCategory(sortedShows, category);
  // if there are no filtered shows, use the sorted shows
  const effectiveShows = filteredShows.length > 0 ? filteredShows : sortedShows;

  return {
    featuredShow: effectiveShows[0] ?? null, // the featured show
    genreRows: mapShowsToGenreRows(effectiveShows) // the genre rows
  };
};

/**
 *   used to map the show API model to the show view model
 */
const mapShowApiToDashboardShow = (show: ShowApiModel): ShowViewModel => {
  const rating = show.rating.average ?? 0;

  return {
    id: show.id,
    title: show.name,
    image: show.image?.medium ?? show.image?.original ?? FALLBACK_IMAGE,
    heroImage: show.image?.original ?? show.image?.medium ?? FALLBACK_IMAGE,
    rating,
    ratingStarFills: mapRatingToStarFills(rating),
    genres: show.genres ?? [],
    summary: show.summary ?? ''
  };
};

/**
 *   used to map the shows API model to the dashboard shows view model
 *   and sort the shows by rating
 */
const mapShowsApiToDashboardShows = (
  shows: ShowApiModel[]
): ShowViewModel[] => {
  return shows
    .map(mapShowApiToDashboardShow)
    .sort((a, b) => b.rating - a.rating);
};

/*
 *   used to filter the shows by category
 */
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

/**
 *   used to map the shows to the genre rows
 *   the genre rows are sorted by the number of shows in the genre
 */
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

  return [...genreMap.entries()]
    .map(([genre, genreShows]) => ({
      genre,
      shows: genreShows
    }))
    .sort((a, b) => b.shows.length - a.shows.length);
};

/**
 *   used to map the rating to the star fills
 *   the rating is on a scale of 0 to 10, so we need to convert it to a scale of 0 to 5
 *   and then convert it to a scale of 0 to 100
 *   the result is an array of numbers, each number is the fill percentage for the corresponding star
 */
const mapRatingToStarFills = (rating: number): number[] => {
  const ratingOnFiveScale = rating / 2;
  const ratingStarsOnFiveScale = Math.max(
    0,
    Math.min(5, Math.round(ratingOnFiveScale * 4) / 4)
  );

  return Array.from({length: STAR_COUNT}, (_, index) => {
    const fill = Math.max(0, Math.min(1, ratingStarsOnFiveScale - index));
    return fill * 100;
  });
};

export {mapShowsApiToDashboardViewModel};
