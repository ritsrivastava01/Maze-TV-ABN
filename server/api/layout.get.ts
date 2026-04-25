import {useLayoutPresenter} from '../../domains/layout/presenters/layout.presenter';

export default defineEventHandler(async () => {
  const {getHeaderNavItems} = useLayoutPresenter();

  return await getHeaderNavItems();
});
