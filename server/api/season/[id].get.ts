import { showDetailsPresenter } from '../../../domains/showDetails/presenters/showDetails.presenter';

export default defineEventHandler(async (event) => {
  const seasonId = Number(event.context.params?.id);

  if (!Number.isInteger(seasonId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid TVMaze season id',
    });
  }

  const { getSeasonEpisodes } = showDetailsPresenter();
  return await getSeasonEpisodes(seasonId);
});
