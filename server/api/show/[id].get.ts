import { useShowPresenter } from '../../../domains/show/presenters/show.presenter';

/**
 * Returns the full show detail view model for the given ID.
 * Cached per-show for 5 minutes. Show data (cast, episodes) is stable
 * enough that a short TTL avoids unnecessary TVMaze API calls.
 */
export default defineCachedEventHandler(
  async (event) => {
    const id = Number(event.context.params?.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'errors.invalidShowId',
      });
    }

    const { getShowDetail } = useShowPresenter();

    try {
      return await getShowDetail(id);
    } catch (error: unknown) {
      // TVMaze returns a 404 body for unknown IDs — surface it cleanly
      const status =
        error !== null &&
        error !== undefined &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: unknown }).status === 404
          ? 404
          : 500;

      throw createError({
        statusCode: status,
        statusMessage: status === 404 ? 'errors.showNotFound' : 'errors.showLoadFailed',
      });
    }
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'show-detail',
    getKey: (event) => String(event.context.params?.id ?? ''),
  },
);
