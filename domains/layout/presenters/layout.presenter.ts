import {fetchLayoutNavItems, type LayoutNavApiModel} from '../api/layout.api';
import {mapHeaderNavItemsToViewModel} from '../mappers/layout.mapper';
import type {HeaderViewModel} from '../viewModel/layoutViewModel.type';

/**
 * Presenter for the layout domain
 * @returns ViewModel for the layout domain
 */

export const useLayoutPresenter = () => {
  const getHeaderNavItems = async (): Promise<HeaderViewModel> => {
    const navItems: LayoutNavApiModel[] = await fetchLayoutNavItems();
    return mapHeaderNavItemsToViewModel(navItems);
  };

  return {
    getHeaderNavItems
  };
};
