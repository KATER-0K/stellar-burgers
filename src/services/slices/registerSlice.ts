import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { registerUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import type { RootState } from '../store';

const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

type TRegisterApiResponse = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type TRegisterState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
};

const initialRegisterState: TRegisterState = {
  user: null,
  isLoading: false,
  error: null,
  isSuccess: false
};

export const registerUser = createAsyncThunk<
  TRegisterApiResponse,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(userData);
    if (
      !response ||
      !response.user ||
      !response.accessToken ||
      !response.refreshToken
    ) {
      return rejectWithValue(
        'Регистрация не удалась: некорректный ответ сервера'
      );
    }

    saveAuthTokens(response.accessToken, response.refreshToken);

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Ошибка при регистрации. Попробуйте позже.'
    );
  }
});

const registerSlice = createSlice({
  name: 'registration',
  initialState: initialRegisterState,
  reducers: {
    clearRegistrationError: (state) => {
      state.error = null;
    },
    resetRegistrationState: () => initialRegisterState
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          'Ошибка при регистрации. Попробуйте позже.';
        state.isSuccess = false;
      });
  }
});

export const { clearRegistrationError, resetRegistrationState } =
  registerSlice.actions;

export const selectRegistrationUser = (state: RootState) => state.register.user;
export const selectRegistrationLoading = (state: RootState) =>
  state.register.isLoading;
export const selectRegistrationError = (state: RootState) =>
  state.register.error;
export const selectRegistrationSuccess = (state: RootState) =>
  state.register.isSuccess;

export default registerSlice.reducer;
