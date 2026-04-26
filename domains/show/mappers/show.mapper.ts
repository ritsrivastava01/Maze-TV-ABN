import type {
  CastApiModel,
  EpisodeApiModel,
  ShowApiModel
} from '../../tvmaze/api/tvmaze.api';
import type {
  ShowDetailCastMemberViewModel,
  ShowDetailEpisodeViewModel,
  ShowDetailSeasonViewModel,
  ShowDetailViewModel
} from '../viewModel/showDetailViewModel.type';

const FALLBACK_IMAGE = 'https://via.placeholder.com/210x295?text=No+Image';
const STAR_COUNT = 5;

/** TVMaze dates are calendar `YYYY-MM-DD`; interpret in UTC so the day is stable. */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric'
});

const parseTvmazeIsoToUtc = (value: string | null | undefined): Date | null => {
  if (value == null) {
    return null;
  }

  const raw = String(value).trim();
  if (raw === '' || raw.toLowerCase() === 'unknown') {
    return null;
  }

  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) {
    return null;
  }

  const d = new Date(
    Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  );
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatTvmazeDate = (value: string | null | undefined): string => {
  const d = parseTvmazeIsoToUtc(value);
  if (d == null) {
    return 'Unknown';
  }

  return DATE_FORMATTER.format(d);
};

const premiereYearFromIso = (value: string | null | undefined): number | null => {
  const d = parseTvmazeIsoToUtc(value);
  return d == null ? null : d.getUTCFullYear();
};

export const mapShowApiToShowDetailViewModel = (
  show: ShowApiModel,
  episodes: EpisodeApiModel[],
  cast: CastApiModel[]
): ShowDetailViewModel => {
  const mappedEpisodes = episodes.map(mapEpisodeApiToViewModel);

  return {
    show: {
      id: show.id,
      title: show.name,
      image: show.image?.medium ?? show.image?.original ?? FALLBACK_IMAGE,
      heroImage: show.image?.original ?? show.image?.medium ?? FALLBACK_IMAGE,
      rating: show.rating.average ?? 0,
      ratingStarFills: mapRatingToStarFills(show.rating.average ?? 0),
      genres: show.genres ?? [],
      summary: show.summary ?? '',
      type: show.type ?? 'Unknown',
      language: show.language ?? 'Unknown',
      status: show.status ?? 'Unknown',
      runtime: `${show.averageRuntime ?? show.runtime ?? 0} min`,
      premiered: formatTvmazeDate(show.premiered),
      premieredYear: premiereYearFromIso(show.premiered),
      ended: formatTvmazeDate(show.ended),
      officialSite: show.officialSite ?? null,
      network: show.network?.name ?? 'Unknown',
      country: show.network?.country?.name ?? 'Unknown',
      scheduleDays: mapScheduleDays(show.schedule),
      scheduleTime: mapScheduleTime(show.schedule),
      imdbUrl: show.externals?.imdb
        ? `https://www.imdb.com/title/${show.externals.imdb}`
        : null
    },
    seasons: mapEpisodesToSeasons(mappedEpisodes),
    cast: cast.map(mapCastApiToViewModel),
    episodes: mappedEpisodes
  };
};

const mapEpisodeApiToViewModel = (
  episode: EpisodeApiModel
): ShowDetailEpisodeViewModel => {
  const rating = episode.rating.average ?? 0;

  return {
    id: episode.id,
    title: episode.name,
    season: episode.season,
    number: episode.number,
    image: episode.image?.medium ?? episode.image?.original ?? FALLBACK_IMAGE,
    rating,
    ratingStarFills: mapRatingToStarFills(rating),
    summary: episode.summary ?? ''
  };
};

const mapCastApiToViewModel = (
  castMember: CastApiModel
): ShowDetailCastMemberViewModel => {
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

const mapEpisodesToSeasons = (
  episodes: ShowDetailEpisodeViewModel[]
): ShowDetailSeasonViewModel[] => {
  const seasons = new Map<number, ShowDetailEpisodeViewModel[]>();

  for (const episode of episodes) {
    if (!seasons.has(episode.season)) {
      seasons.set(episode.season, []);
    }
    seasons.get(episode.season)!.push(episode);
  }

  return [...seasons.entries()].map(([season, seasonEpisodes]) => ({
    season,
    episodes: seasonEpisodes
  }));
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
