import { FALLBACK_IMAGE, IMDB_TITLE_BASE_URL } from '../../constants/appConstant';
import { mapRatingToStarFills } from '../../dashboard/mappers/dashboard.mapper';
import type { CastApi, EpisodeApi, SeasonApi, ShowApi } from '../../tvmaze/api/tvmaze.api';
import type { Cast, Episode, Season, ShowDetailsViewModel } from '../viewModel/showDetailsViewModel.type';

/** Format TVMaze date as `MMM D, YYYY` (e.g. "Apr 26, 2008"). */
const formatDate = (date?: string | null): string => {
  if (date === null || date === undefined) {
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
    timeZone: 'UTC',
  }).format(d);
};

/** Extract year from TVMaze date (e.g. "2008" from "Apr 26, 2008"). */
const premiereYearFromIso = (date?: string | null): number | null => {
  if (date === null || date === undefined) {
    return null;
  }

  const d = new Date(String(date).trim());
  return Number.isNaN(d.getTime()) ? null : d.getUTCFullYear();
};

/**
 * Maps a TVMaze episode payload list to app `Episode` models (titles, images, ratings normalized).
 */
export const mapEpisodeApiListToEpisodes = (episodes: EpisodeApi[]): Episode[] => episodes.map(mapEpisodeApiToEpisode);

/**
 * Maps TVMaze season rows to app `Season` models sorted by ascending season number (dropdown-ready `id` / `number`).
 */
export const mapSeasonApiListToSeasons = (seasons: SeasonApi[]): Season[] =>
  [...seasons].sort((a, b) => a.number - b.number).map((s) => ({ id: s.id, number: s.number }));

/**
 * Maps TVMaze show + seasons + cast + first-season episodes into app `ShowDetailsViewModel`.
 */
export const mapShowApiToShowDetailsViewModel = (
  apiShow: ShowApi,
  seasons: SeasonApi[],
  cast: CastApi[],
  firstSeasonEpisodes: EpisodeApi[] = []
): ShowDetailsViewModel => {
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
      premiereDate: formatDate(apiShow.premiered),
      premieredYear: premiereYearFromIso(apiShow.premiered),
      ended: formatDate(apiShow.ended),
      officialSite: apiShow.officialSite ?? null,
      network: apiShow.network?.name ?? 'Unknown',
      country: apiShow.network?.country?.name ?? 'Unknown',
      scheduleDays: mapScheduleDays(apiShow.schedule),
      scheduleTime: mapScheduleTime(apiShow.schedule),
      imdbUrl: apiShow.externals?.imdb ? `${IMDB_TITLE_BASE_URL}${apiShow.externals.imdb}` : null,
    },
    seasonList: mapSeasonApiListToSeasons(seasons),
    cast: cast.map(mapCastApiToCast),
    episodes: mapEpisodeApiListToEpisodes(firstSeasonEpisodes),
  };
};

const mapEpisodeApiToEpisode = (episode: EpisodeApi): Episode => {
  const rating = episode.rating.average ?? 0;

  return {
    id: episode.id,
    title: episode.name,
    seasonNumber: episode.season,
    episodeNumber: episode.number,
    image: episode.image?.medium ?? episode.image?.original ?? FALLBACK_IMAGE,
    rating,
  };
};

/** Map TVMaze cast member to `Cast`. */
const mapCastApiToCast = (castMember: CastApi): Cast => {
  return {
    id: castMember.person.id,
    name: castMember.person.name,
    characterName: castMember.character.name,
    image: castMember.person.image?.medium ?? castMember.person.image?.original ?? FALLBACK_IMAGE,
  };
};

const mapScheduleDays = (schedule: ShowApi['schedule']): string => {
  const days = schedule?.days ?? [];
  return days.length === 0 ? 'Unknown' : days.join(', ');
};

const mapScheduleTime = (schedule: ShowApi['schedule']): string => {
  if (!schedule) {
    return 'Unknown';
  }

  const t = schedule.time?.trim();
  return t ? t : 'Unknown';
};
