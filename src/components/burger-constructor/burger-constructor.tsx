import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '../ui/burger-constructor';

import { ConstructorState } from '../../services/slices/burgerConstructorSlice';
import {
  selectOrderLoading,
  selectCreatedOrder,
  selectOrderError
} from '../../services/slices/orderSlice';
import { selectProfileUser } from '../../services/slices/profileSlice';

import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import {
  clearNewOrder,
  createNewOrder
} from '../../services/slices/orderSlice';

const selectConstructorItems = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor;

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectCreatedOrder);
  const orderError = useSelector(selectOrderError);
  const currentUser = useSelector(selectProfileUser);

  const isAuthenticated = !!currentUser;

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login', { replace: true });
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ing: TConstructorIngredient) => ing._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createNewOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
