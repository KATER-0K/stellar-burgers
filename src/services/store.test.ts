import store from './store';

describe('store — начальное состояние', () => {
  it('Должен возвращать корректное начальное состояние для всех слайсов', () => {
    const initialState = store.getState();

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      profile: {
        isLoading: false,
        userData: null,
        error: null,
        isAuthChecked: false,
        forgotPasswordLoading: false,
        forgotPasswordError: null,
        resetPasswordLoading: false,
        resetPasswordError: null,
        passwordResetSuccess: false
      },
      login: {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      },
      register: {
        user: null,
        isLoading: false,
        error: null,
        isSuccess: false
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        allOrders: [],
        fetchError: null,
        totalCount: 0,
        totalTodayCount: 0,
        isFeedLoading: false
      },
      orders: {
        orderList: [],
        currentOrder: null,
        newOrder: null,
        isLoading: false,
        error: null
      }
    });
  });
});
