import { rootReducer } from './store';

describe('store — начальное состояние', () => {
  it('Должен возвращать корректное начальное состояние для всех слайсов', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('profile');
    expect(initialState).toHaveProperty('login');
    expect(initialState).toHaveProperty('register');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orders');

    expect(initialState.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(initialState.login).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false
    });

    expect(initialState.register).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isSuccess: false
    });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(initialState.feed).toEqual({
      allOrders: [],
      fetchError: null,
      totalCount: 0,
      totalTodayCount: 0,
      isFeedLoading: false
    });

    expect(initialState.orders).toEqual({
      orderList: [],
      currentOrder: null,
      newOrder: null,
      isLoading: false,
      error: null
    });

    expect(initialState.profile).toBeDefined();
  });
});
