import reducer, {
  fetchUserOrders,
  fetchOrderDetails,
  createNewOrder,
  clearNewOrder,
  clearCurrentOrder,
  clearOrderError,
  resetOrderState
} from './orderSlice';
import { TOrder } from '../../utils/types';

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Космический бургер',
  createdAt: '2025-10-16',
  updatedAt: '2025-10-16',
  number: 12345,
  ingredients: ['ing-1', 'ing-2']
};

const mockOrders: TOrder[] = [
  mockOrder,
  { ...mockOrder, _id: 'order-2', number: 12346 }
];

describe('orderSlice — полное управление заказами', () => {
  const initialState = {
    orderList: [],
    currentOrder: null,
    newOrder: null,
    isLoading: false,
    error: null
  };

  it('Должен установить загрузку в значение true и сбросить ошибку при ожидании fetchUserOrders', () => {
    const action = { type: 'ordersManager/fetchUserOrders/pending' };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('Должен сохранять выполненные заказы пользователей на fetchUserOrders', () => {
    const action = {
      type: 'ordersManager/fetchUserOrders/fulfilled',
      payload: mockOrders
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.orderList).toEqual(mockOrders);
    expect(result.error).toBeNull();
  });

  it('Должен обработать ошибку при отклонении fetchUserOrders', () => {
    const action = {
      type: 'ordersManager/fetchUserOrders/rejected',
      payload: 'Сетевая ошибка'
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Сетевая ошибка');
    expect(result.orderList).toHaveLength(0);
  });

  it('Должен сбросить currentOrder и установить загрузку fetchOrderDetails в режиме ожидания', () => {
    const filledState = { ...initialState, currentOrder: mockOrder };
    const action = { type: 'ordersManager/fetchOrderDetails/pending' };
    const result = reducer(filledState, action);
    expect(result.isLoading).toBe(true);
    expect(result.currentOrder).toBeNull();
    expect(result.error).toBeNull();
  });

  it('Должен сохранить сведения о заказе на fetchOrderDetails выполнено', () => {
    const action = {
      type: 'ordersManager/fetchOrderDetails/fulfilled',
      payload: mockOrder
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.currentOrder).toEqual(mockOrder);
    expect(result.error).toBeNull();
  });

  it('Должен очистить currentOrder и установить ошибку fetchOrderDetails denied', () => {
    const action = {
      type: 'ordersManager/fetchOrderDetails/rejected',
      payload: 'Заказ не найден'
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.currentOrder).toBeNull();
    expect(result.error).toBe('Заказ не найден');
  });

  it('Должен сбросить newOrder и установить загрузку createNewOrder в режим ожидания', () => {
    const filledState = { ...initialState, newOrder: mockOrder };
    const action = { type: 'ordersManager/createNewOrder/pending' };
    const result = reducer(filledState, action);
    expect(result.isLoading).toBe(true);
    expect(result.newOrder).toBeNull();
    expect(result.error).toBeNull();
  });

  it('Должен сохранить новый заказ при выполнении createNewOrder', () => {
    const action = {
      type: 'ordersManager/createNewOrder/fulfilled',
      payload: mockOrder
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.newOrder).toEqual(mockOrder);
    expect(result.error).toBeNull();
  });

  it('Должен очистить newOrder и установить ошибку при createNewOrder denied', () => {
    const action = {
      type: 'ordersManager/createNewOrder/rejected',
      payload: 'Ингредиенты не найдены'
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.newOrder).toBeNull();
    expect(result.error).toBe('Ингредиенты не найдены');
  });

  it('Должен очистить newOrder при отправке clearNewOrder', () => {
    const stateWithNewOrder = { ...initialState, newOrder: mockOrder };
    const result = reducer(stateWithNewOrder, clearNewOrder());
    expect(result.newOrder).toBeNull();
  });

  it('Должен очистить currentOrder при отправке clearCurrentOrder', () => {
    const stateWithCurrentOrder = { ...initialState, currentOrder: mockOrder };
    const result = reducer(stateWithCurrentOrder, clearCurrentOrder());
    expect(result.currentOrder).toBeNull();
  });

  it('Должен очистить ошибку при отправке clearOrderError', () => {
    const stateWithError = { ...initialState, error: 'Произошла ошибка' };
    const result = reducer(stateWithError, clearOrderError());
    expect(result.error).toBeNull();
  });

  it('Должен сбросить все состояние заказа до начального', () => {
    const filledState = {
      orderList: mockOrders,
      currentOrder: mockOrder,
      newOrder: mockOrder,
      isLoading: true,
      error: 'Ошибка'
    };
    const result = reducer(filledState, resetOrderState());
    expect(result).toEqual(initialState);
  });
});
