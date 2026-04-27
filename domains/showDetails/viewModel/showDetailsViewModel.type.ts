import type { ShowViewModel } from '../../dashboard/viewModel/show.type';

/** One title's metadata for show details: shared list fields + extra fields (nested as `ShowDetailsViewModel.show`). */
export interface ShowDetails extends Omit<ShowViewModel, 'heroImage'> {
  type: string;
  language: string;
  status: string;
  runtime: string;
  premiereDate: string;
  premieredYear: number | null;
  ended: string;
  officialSite: string | null;
  network: string;
  country: string;
  scheduleDays: string;
  scheduleTime: string;
  imdbUrl: string | null;
}

/** App episode (rail / cards). Maps from `EpisodeApi` in `domains/tvmaze/api`. */
export interface Episode {
  id: number;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  image: string;
  rating: number;
}

export interface Cast {
  id: number;
  name: string;
  characterName: string;
  image: string;
}

/** App season row (dropdown). Maps from `SeasonApi` in `domains/tvmaze/api`. */
export interface Season {
  id: number;
  number: number;
}

/**
 * Show-details payload: show + season list + cast + **episodes for the first season** (lowest season number).
 * Other seasons load via `GET /api/season/:seasonId` when the user changes the dropdown.
 */
export interface ShowDetailsViewModel {
  show: ShowDetails;
  seasonList: Season[];
  cast: Cast[];
  episodes: Episode[];
}
