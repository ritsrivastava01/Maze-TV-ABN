import { useDashboardPresenter } from '../../domains/dashboard/presenters/dashboard.presenter';
import type { DashboardCategory } from '../../domains/dashboard/viewModel/dashboardViewModel.type';

/**
 * Returns the dashboard view model for the requested category.
 * Cached per-category for 5 minutes so the TVMaze API is not hit on every
 * page load (TVMaze data changes infrequently).
 */
export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    const category = (query.type ?? 'tv-shows') as DashboardCategory;
    const { getDashboard } = useDashboardPresenter();

    return await getDashboard(category);
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'dashboard',
    getKey: (event) => {
      const query = getQuery(event);
      return String(query.type ?? 'tv-shows');
    },
  },
);
