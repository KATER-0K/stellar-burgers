import React, { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '../../utils/types';
import { FeedInfoUI } from '../ui/feed-info';

import {
  selectCurrentOrders,
  selectTotalOrders,
  selectTotalTodayOrders
} from '../../services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(selectCurrentOrders);
  const total = useSelector(selectTotalOrders);
  const totalToday = useSelector(selectTotalTodayOrders);

  const feed = {
    total,
    totalToday
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
