import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalePath } from '#imports';
import type { LayoutNavCategory } from '../../domains/layout/viewModel/layoutViewModel.type';

export const useAppNavigation = () => {
  const route = useRoute();
  const router = useRouter();
  const localePath = useLocalePath();

  const selectedCategory = computed<LayoutNavCategory>(() => {
    return (route.query.type as LayoutNavCategory) ?? 'tv-shows';
  });

  const setCategory = async (category: LayoutNavCategory): Promise<void> => {
    await router.push(
      localePath({
        path: '/',
        query: {
          ...route.query,
          type: category,
        },
      }),
    );
  };

  const setSearchQuery = async (search: string): Promise<void> => {
    const trimmed = search.trim();
    if (!trimmed) return;
    await router.push(
      localePath({
        path: '/search',
        query: { q: trimmed },
      }),
    );
  };

  const getShowPath = (showId: number): string => {
    return localePath({
      path: `/show/${showId}`,
      query: {
        type: selectedCategory.value,
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
