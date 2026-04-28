import { vi } from 'vitest';

/**
 * Shared doubles for `useAppNavigation` tests. Same refs so route/push assertions stay stable.
 */
export const routeState = { query: {} as Record<string, string | string[] | undefined> };
export const mockPush = vi.fn();

export function vueRouterMockFactory() {
  return {
    useRoute: () => routeState,
    useRouter: () => ({ push: mockPush }),
  };
}

export function i18nMockFactory() {
  return {
    useLocalePath:
      () =>
      (to: { path: string; query?: Record<string, string> }) => {
        const q =
          to.query && Object.keys(to.query).length
            ? `?${new URLSearchParams(to.query).toString()}`
            : '';
        return `${to.path}${q}`;
      },
  };
}
