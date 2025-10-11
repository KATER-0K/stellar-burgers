import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';
import {
  selectAllOrders,
  selectOrderLoading
} from '../../services/slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrderList = useSelector(selectAllOrders);
  const isLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && userOrderList.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrderList} />;
};
