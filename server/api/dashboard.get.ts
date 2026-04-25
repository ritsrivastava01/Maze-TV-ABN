import {useDashboardPresenter} from '../../domains/dashboard/presenters/dashboard.presenter';
import type {DashboardCategory} from '../../domains/dashboard/viewModel/dashboardViewModel.type';

/**
 *   used to get the dashboard (shows, genres and featured show) for the given category from the query string
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category = (query.type ?? 'tv-shows') as DashboardCategory;
  const {getDashboard} = useDashboardPresenter();

  return await getDashboard(category);
});
