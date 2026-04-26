import type {
  CastApiModel,
  EpisodeApiModel,
  ShowApiModel
} from '../../tvmaze/api/tvmaze.api';
import type {
  CastViewModel,
  EpisodeViewModel,
  SeasonViewModel,
  ShowDetailsPageViewModel
} from '../viewModel/showDetailsViewModel.type';

const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';
const STAR_COUNT = 5;

/** Format TVMaze date as `MMM D, YYYY` (e.g. “Apr 26, 2008”). */
const formatTvmazeDate = (date?: string | null): string => {
  if (date == null) {
    return 'Unknown';
  }

  const d = new Date(String(date).trim());
  if (Number.isNaN(d.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
};

/** Extract year from TVMaze date (e.g. “2008” from “Apr 26, 2008”). */
const premiereYearFromIso = (date?: string | null): number | null => {
  if (date == null) {
    return null;
  }

  const d = new Date(String(date).trim());
  return Number.isNaN(d.getTime()) ? null : d.getUTCFullYear();
};

export const mapShowApiToShowDetailsViewModel = (
  apiShow: ShowApiModel,
  episodes: EpisodeApiModel[],
  cast: CastApiModel[]
): ShowDetailsPageViewModel => {
  const mappedEpisodes = episodes.map(mapEpisodeApiToEpisodeViewModel);

  return {
    show: {
      id: apiShow.id,
      title: apiShow.name,
      image: apiShow.image?.medium ?? apiShow.image?.original ?? FALLBACK_IMAGE,
      rating: apiShow.rating.average ?? 0,
      ratingStarFills: mapRatingToStarFills(apiShow.rating.average ?? 0),
      genres: apiShow.genres ?? [],
      summary: apiShow.summary ?? '',
      type: apiShow.type ?? 'Unknown',
      language: apiShow.language ?? 'Unknown',
      status: apiShow.status ?? 'Unknown',
      runtime: `${apiShow.averageRuntime ?? apiShow.runtime ?? 0} min`,
      premiereDate: formatTvmazeDate(apiShow.premiered),
      premieredYear: premiereYearFromIso(apiShow.premiered),
      ended: formatTvmazeDate(apiShow.ended),
      officialSite: apiShow.officialSite ?? null,
      network: apiShow.network?.name ?? 'Unknown',
      country: apiShow.network?.country?.name ?? 'Unknown',
      scheduleDays: mapScheduleDays(apiShow.schedule),
      scheduleTime: mapScheduleTime(apiShow.schedule),
      imdbUrl: apiShow.externals?.imdb
        ? `https://www.imdb.com/title/${apiShow.externals.imdb}`
        : null
    },
    seasons: mapEpisodesToSeasons(mappedEpisodes),
    cast: cast.map(mapCastApiToCastViewModel)
  };
};

/** Map TVMaze episode to `EpisodeViewModel`. */
const mapEpisodeApiToEpisodeViewModel = (
  episode: EpisodeApiModel
): EpisodeViewModel => {
  const rating = episode.rating.average ?? 0;

  return {
    id: episode.id,
    title: episode.name,
    seasonNumber: episode.season,
    episodeNumber: episode.number,
    image: episode.image?.medium ?? episode.image?.original ?? FALLBACK_IMAGE,
    rating
  };
};

/** One entry per distinct `seasonNumber`, each with every episode in that season. */
const mapEpisodesToSeasons = (
  episodes: EpisodeViewModel[]
): SeasonViewModel[] => {
  const seasonNumbers = [...new Set(episodes.map((e) => e.seasonNumber))].sort(
    (a, b) => a - b
  );

  return seasonNumbers.map((season) => ({
    season,
    episodes: episodes.filter((e) => e.seasonNumber === season)
  }));
};

/** Map TVMaze cast member to `CastViewModel`. */
const mapCastApiToCastViewModel = (castMember: CastApiModel): CastViewModel => {
  return {
    id: castMember.person.id,
    name: castMember.person.name,
    characterName: castMember.character.name,
    image:
      castMember.person.image?.medium ??
      castMember.person.image?.original ??
      FALLBACK_IMAGE
  };
};

const mapScheduleDays = (schedule: ShowApiModel['schedule']): string => {
  const days = schedule?.days ?? [];
  return days.length === 0 ? 'Unknown' : days.join(', ');
};

const mapScheduleTime = (schedule: ShowApiModel['schedule']): string => {
  if (!schedule) {
    return 'Unknown';
  }

  const t = schedule.time?.trim();
  return t ? t : 'Unknown';
};

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
