import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedData } from '../../services/slices/feedSlice';

import {
  selectCurrentOrders,
  selectFeedLoadingStatus
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectCurrentOrders);
  const isLoading = useSelector(selectFeedLoadingStatus);

  useEffect(() => {
    dispatch(fetchFeedData());
  }, [dispatch]);

  if (isLoading || orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeedData())} />
  );
};
