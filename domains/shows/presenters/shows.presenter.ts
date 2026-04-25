import {
  fetchAllShows,
  fetchShowById,
  type ShowApiModel
} from '../api/shows.api';
import {
  mapShowApiToViewModel,
  mapShowsApiToViewModel
} from '../mappers/shows.mapper';
import type {ShowViewModel} from '../viewModel/show.type';

export const useShowsPresenter = () => {
  const getAllShows = async (): Promise<ShowViewModel[]> => {
    const shows: ShowApiModel[] = await fetchAllShows();
    return mapShowsApiToViewModel(shows);
  };

  const getShowById = async (id: number): Promise<ShowViewModel> => {
    const show: ShowApiModel = await fetchShowById(id);
    return mapShowApiToViewModel(show);
  };

  return {
    getAllShows,
    getShowById
  };
};
