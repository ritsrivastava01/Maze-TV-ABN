import {
  fetchTvMazeSeasonEpisodes,
  fetchTvMazeShowById,
  fetchTvMazeShowCast,
  fetchTvMazeShowSeasons,
} from '../../tvmaze/api/tvmaze.api';
import { mapEpisodeApiListToEpisodes, mapShowApiToShowDetailsViewModel } from '../mappers/showDetails.mapper';
import type { Episode, ShowDetailsViewModel } from '../viewModel/showDetailsViewModel.type';

/** Show-details use-case: TVMaze data to `ShowDetailsViewModel`, plus per-season episode loading for API routes. */
export const showDetailsPresenter = () => {
  /** Fetches show, seasons, cast, and first-season episodes, mapped to `ShowDetailsViewModel`. */
  const getShowDetails = async (id: number): Promise<ShowDetailsViewModel> => {
    const [apiShow, seasons, cast] = await Promise.all([
      fetchTvMazeShowById(id),
      fetchTvMazeShowSeasons(id),
      fetchTvMazeShowCast(id),
    ]);

    const sorted = [...seasons].sort((a, b) => a.number - b.number);
    const firstSeason = sorted[0];
    const firstSeasonEpisodesApi = firstSeason ? await fetchTvMazeSeasonEpisodes(firstSeason.id) : [];

    return mapShowApiToShowDetailsViewModel(apiShow, seasons, cast, firstSeasonEpisodesApi);
  };

  /**
   * get the episodes for a given season
   */
  const getSeasonEpisodes = async (seasonId: number): Promise<Episode[]> => {
    const api = await fetchTvMazeSeasonEpisodes(seasonId);
    return mapEpisodeApiListToEpisodes(api);
  };

  return {
    getShowDetails,
    getSeasonEpisodes,
  };
};
