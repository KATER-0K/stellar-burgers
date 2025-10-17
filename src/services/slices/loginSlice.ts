import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type TLoginState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialLoginState: TLoginState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

export const performUserLogin = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка авторизации. Проверьте email и пароль.'
      );
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },
    resetLoginState: () => initialLoginState
  },
  selectors: {
    selectLoginUser: (state) => state.user,
    selectLoginLoading: (state) => state.isLoading,
    selectLoginError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(performUserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performUserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(performUserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          'Ошибка авторизации. Проверьте email и пароль.';
        state.isAuthenticated = false;
      });
  }
});

export const { clearLoginError, resetLoginState } = loginSlice.actions;
export const {
  selectLoginUser,
  selectLoginLoading,
  selectLoginError,
  selectIsAuthenticated
} = loginSlice.selectors;

export default loginSlice.reducer;
