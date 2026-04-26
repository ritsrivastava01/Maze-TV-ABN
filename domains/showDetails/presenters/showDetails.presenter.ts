import {
  fetchTvMazeShowById,
  fetchTvMazeShowCast,
  fetchTvMazeShowEpisodes
} from '../../tvmaze/api/tvmaze.api';
import {mapShowApiToShowDetailsViewModel} from '../mappers/showDetails.mapper';
import type {ShowDetailsPageViewModel} from '../viewModel/showDetailsViewModel.type';

export const useShowDetailsPresenter = () => {
  const getShowDetails = async (
    id: number
  ): Promise<ShowDetailsPageViewModel> => {
    const [apiShow, episodes, cast] = await Promise.all([
      fetchTvMazeShowById(id),
      fetchTvMazeShowEpisodes(id),
      fetchTvMazeShowCast(id)
    ]);

    return mapShowApiToShowDetailsViewModel(apiShow, episodes, cast);
  };

  return {
    getShowDetails
  };
};
