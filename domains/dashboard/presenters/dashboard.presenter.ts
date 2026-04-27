import { fetchTvMazeShows, type ShowApiModel } from '../../tvmaze/api/tvmaze.api';
import { mapShowsApiToDashboardViewModel } from '../mappers/dashboard.mapper';
import type { DashboardCategory, DashboardViewModel } from '../viewModel/dashboardViewModel.type';

export const useDashboardPresenter = () => {
  /**
   *   used to get the dashboard (shows, genres and featured show) for the given category from the query string
   */
  const getDashboard = async (category: DashboardCategory): Promise<DashboardViewModel> => {
    // fetch all shows from the API
    const shows: ShowApiModel[] = await fetchTvMazeShows();

    return mapShowsApiToDashboardViewModel(shows, category);
  };

  return {
    getDashboard,
  };
};
