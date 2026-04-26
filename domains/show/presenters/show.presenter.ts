import {
  fetchTvMazeShowById,
  fetchTvMazeShowCast,
  fetchTvMazeShowEpisodes
} from '../../tvmaze/api/tvmaze.api';
import {mapShowApiToShowDetailViewModel} from '../mappers/show.mapper';
import type {ShowDetailViewModel} from '../viewModel/showDetailViewModel.type';

export const useShowPresenter = () => {
  const getShowDetail = async (id: number): Promise<ShowDetailViewModel> => {
    const [show, episodes, cast] = await Promise.all([
      fetchTvMazeShowById(id),
      fetchTvMazeShowEpisodes(id),
      fetchTvMazeShowCast(id)
    ]);

    return mapShowApiToShowDetailViewModel(show, episodes, cast);
  };

  return {
    getShowDetail
  };
};
