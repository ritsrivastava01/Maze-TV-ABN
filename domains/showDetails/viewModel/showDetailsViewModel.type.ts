import type {ShowViewModel} from '../../dashboard/viewModel/show.type';

/** One title on the details page: shared list fields + extra metadata (nested as `ShowDetailsPageViewModel.show`). */
export interface ShowDetailsViewModel extends Omit<ShowViewModel, 'heroImage'> {
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

export interface EpisodeViewModel {
  id: number;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  image: string;
  rating: number;
}

export interface CastViewModel {
  id: number;
  name: string;
  characterName: string;
  image: string;
}

export interface SeasonViewModel {
  season: number;
  episodes: EpisodeViewModel[];
}

/** Full payload for the show-details route (`show` + grouped seasons + cast). */
export interface ShowDetailsPageViewModel {
  show: ShowDetailsViewModel;
  seasons: SeasonViewModel[];
  cast: CastViewModel[];
}
