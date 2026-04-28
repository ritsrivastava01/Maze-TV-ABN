import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useLocalePath } from '#i18n';

import {
  DEFAULT_NAV_CATEGORY,
  PATH_HOME,
  PATH_SEARCH,
  PATH_SHOWS,
  SEARCH_PARAM,
  TYPE_PARAM,
} from '../../domains/constants/appConstant';
import type { LayoutNavCategory } from '../../domains/layout/viewModel/layoutViewModel.type';

export const useAppNavigation = () => {
  const route = useRoute();
  const router = useRouter();
  const localePath = useLocalePath();

  const selectedCategory = computed<LayoutNavCategory>(() => {
    return (route.query[TYPE_PARAM] as LayoutNavCategory) ?? DEFAULT_NAV_CATEGORY;
  });

  const setCategory = async (category: LayoutNavCategory): Promise<void> => {
    await router.push(
      localePath({
        path: PATH_HOME,

        query: { [TYPE_PARAM]: category },
      })
    );
  };

  const setSearchQuery = async (search: string): Promise<void> => {
    const trimmed = search.trim();
    if (!trimmed) return;
    await router.push(
      localePath({
        path: PATH_SEARCH,
        query: { ...route.query, [SEARCH_PARAM]: trimmed },
      })
    );
  };

  const getShowPath = (showId: number): string => {
    return localePath({
      path: `${PATH_SHOWS}/${showId}`,
      query: {
        [TYPE_PARAM]: selectedCategory.value,
      },
    });
  };

  const goToShow = async (showId: number): Promise<void> => {
    await router.push(getShowPath(showId));
  };

  return {
    selectedCategory,
    setCategory,
    setSearchQuery,
    getShowPath,
    goToShow,
  };
};
