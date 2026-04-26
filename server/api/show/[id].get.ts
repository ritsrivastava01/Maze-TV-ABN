import {useShowPresenter} from '../../../domains/show/presenters/show.presenter';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid show id'
    });
  }

  const {getShowDetail} = useShowPresenter();

  return await getShowDetail(id);
});
