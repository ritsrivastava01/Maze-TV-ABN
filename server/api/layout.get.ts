import { useLayoutPresenter } from '../../domains/layout/presenters/layout.presenter';

export default defineEventHandler(async () => {
  const { getHeaderNavItems } = useLayoutPresenter();

  try {
    return await getHeaderNavItems();
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'errors.headerLoadFailed'
    });
  }
});
