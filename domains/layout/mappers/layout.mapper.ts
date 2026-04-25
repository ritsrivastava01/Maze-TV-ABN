import type {LayoutNavApiModel} from '../api/layout.api';
import type {HeaderViewModel} from '../viewModel/layoutViewModel.type';

const mapHeaderNavItemsApiToViewModel = (
  navItems: LayoutNavApiModel[]
): HeaderViewModel['headerNavItems'] => {
  return navItems
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      value: item.value,
      labelKey: item.labelKey,
      order: item.order
    }));
};

/**
 * Maps layout navigation API data into the header view model consumed by the UI.
 */
export const mapHeaderNavItemsToViewModel = (
  navItems: LayoutNavApiModel[]
): HeaderViewModel => {
  return {
    headerNavItems: mapHeaderNavItemsApiToViewModel(navItems)
  };
};
