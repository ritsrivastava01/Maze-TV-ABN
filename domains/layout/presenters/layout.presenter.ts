import { fetchTvMazeLayoutNavItems, type LayoutNavApiModel } from '../../tvmaze/api/tvmaze.api';
import { mapHeaderNavItemsToViewModel } from '../mappers/layout.mapper';
import type { HeaderViewModel } from '../viewModel/layoutViewModel.type';

/**
 * Presenter for the layout domain
 * @returns ViewModel for the layout domain
 */

export const layoutPresenter = () => {
  const getHeaderNavItems = async (): Promise<HeaderViewModel> => {
    const navItems: LayoutNavApiModel[] = await fetchTvMazeLayoutNavItems();
    return mapHeaderNavItemsToViewModel(navItems);
  };

  return {
    getHeaderNavItems,
  };
};
