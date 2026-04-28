import { showDetailsPresenter } from '../../domains/showDetails/presenters/showDetails.presenter';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid show id',
    });
  }

  const { getShowDetails } = showDetailsPresenter();
  return await getShowDetails(id);
});
