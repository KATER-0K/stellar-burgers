import { configureStore } from '@reduxjs/toolkit';
import loginReducer, {
  performUserLogin,
  clearLoginError,
  resetLoginState,
  selectLoginUser,
  selectLoginLoading,
  selectLoginError,
  selectIsAuthenticated
} from './loginSlice';
import { loginUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn()
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('loginSlice', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
  };

  it('should handle initial state', () => {
    expect(loginReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearLoginError', () => {
    const state = { ...initialState, error: 'Some error' };
    const action = clearLoginError();
    const result = loginReducer(state, action);
    expect(result.error).toBeNull();
  });

  it('should handle resetLoginState', () => {
    const state = {
      user: mockUser,
      isLoading: true,
      error: 'error',
      isAuthenticated: true
    };
    const action = resetLoginState();
    const result = loginReducer(state, action);
    expect(result).toEqual(initialState);
  });

  describe('performUserLogin async thunk', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should dispatch pending and fulfilled actions on success', async () => {
      (loginUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

      const store = configureStore({
        reducer: { login: loginReducer }
      });

      await store.dispatch(
        performUserLogin({ email: 'test@example.com', password: '123456' })
      );

      const state = store.getState().login;
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('should dispatch pending and rejected actions on error', async () => {
      const errorMessage = 'Invalid credentials';
      (loginUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const store = configureStore({
        reducer: { login: loginReducer }
      });

      await store.dispatch(
        performUserLogin({ email: 'bad@example.com', password: 'wrong' })
      );

      const state = store.getState().login;
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('selectors', () => {
    it('should select user', () => {
      const state = { login: { ...initialState, user: mockUser } };
      expect(selectLoginUser(state)).toEqual(mockUser);
    });

    it('should select loading', () => {
      const state = { login: { ...initialState, isLoading: true } };
      expect(selectLoginLoading(state)).toBe(true);
    });

    it('should select error', () => {
      const state = { login: { ...initialState, error: 'Auth failed' } };
      expect(selectLoginError(state)).toBe('Auth failed');
    });

    it('should select isAuthenticated', () => {
      const state = { login: { ...initialState, isAuthenticated: true } };
      expect(selectIsAuthenticated(state)).toBe(true);
    });
  });
});
