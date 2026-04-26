export interface ShowDetailShowViewModel {
  id: number;
  title: string;
  image: string;
  heroImage: string;
  rating: number;
  ratingStarFills: number[];
  genres: string[];
  summary: string;
  type: string;
  language: string;
  status: string;
  runtime: string;
  /** API `YYYY-MM-DD` → en-US short month, UTC (see mapper). */
  premiered: string;
  /** Same source as `premiered`, for compact “· 2008 ·” line. */
  premieredYear: number | null;
  ended: string;
  officialSite: string | null;
  network: string;
  country: string;
  /** TVMaze `schedule.days` joined for the detail grid. */
  scheduleDays: string;
  /** TVMaze `schedule.time` (local air time). */
  scheduleTime: string;
  imdbUrl: string | null;
}

export interface ShowDetailEpisodeViewModel {
  id: number;
  title: string;
  season: number;
  number: number;
  image: string;
  rating: number;
  ratingStarFills: number[];
  summary: string;
}

export interface ShowDetailCastMemberViewModel {
  id: number;
  name: string;
  characterName: string;
  image: string;
}

export interface ShowDetailSeasonViewModel {
  season: number;
  episodes: ShowDetailEpisodeViewModel[];
}

export interface ShowDetailViewModel {
  show: ShowDetailShowViewModel;
  seasons: ShowDetailSeasonViewModel[];
  cast: ShowDetailCastMemberViewModel[];
  episodes: ShowDetailEpisodeViewModel[];
}
