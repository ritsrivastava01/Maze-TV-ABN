import {fetchAllShows, type ShowApiModel} from '../api/shows.api';
import {mapShowsToDashboardViewModel} from '../mappers/dashboard.mapper';
import {mapShowsApiToViewModel} from '../mappers/shows.mapper';
import type {
  DashboardCategory,
  DashboardViewModel
} from '../viewModel/dashboardViewModel.type';

export const useDashboardPresenter = () => {
  const getDashboard = async (
    category: DashboardCategory
  ): Promise<DashboardViewModel> => {
    const shows: ShowApiModel[] = await fetchAllShows();
    const viewModels = mapShowsApiToViewModel(shows);

    return mapShowsToDashboardViewModel(viewModels, category);
  };

  return {
    getDashboard
  };
};
