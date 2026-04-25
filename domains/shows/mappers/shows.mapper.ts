import type {ShowApiModel} from '../api/shows.api';
import type {ShowViewModel} from '../viewModel/show.type';

const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';
const STAR_COUNT = 5;
const FULL_STAR_FILL = 100;

export const mapShowApiToViewModel = (show: ShowApiModel): ShowViewModel => {
  const rating = show.rating.average ?? 0;
  const ratingOnFiveScale = rating / 2;
  const ratingStarsOnFiveScale = Math.max(
    0,
    Math.min(5, Math.round(ratingOnFiveScale * 2) / 2)
  );
  const ratingStarFills = Array.from({length: STAR_COUNT}, (_, index) => {
    const fill = Math.max(0, Math.min(1, ratingStarsOnFiveScale - index));
    return fill * FULL_STAR_FILL;
  });

  return {
    id: show.id,
    title: show.name,
    image: show.image?.medium ?? show.image?.original ?? FALLBACK_IMAGE,
    heroImage: show.image?.original ?? show.image?.medium ?? FALLBACK_IMAGE,
    rating,
    ratingStarFills,
    genres: show.genres ?? [],
    summary: show.summary ?? ''
  };
};

export const mapShowsApiToViewModel = (
  shows: ShowApiModel[]
): ShowViewModel[] => {
  return shows.map(mapShowApiToViewModel).sort((a, b) => b.rating - a.rating);
};

