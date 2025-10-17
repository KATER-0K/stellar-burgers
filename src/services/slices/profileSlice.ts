import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';

type TProfileState = {
  isLoading: boolean;
  userData: TUser | null;
  error: string | null;
  isAuthChecked: boolean;
  forgotPasswordLoading: boolean;
  forgotPasswordError: string | null;
  resetPasswordLoading: boolean;
  resetPasswordError: string | null;
  passwordResetSuccess: boolean;
};

const initialProfileState: TProfileState = {
  isLoading: false,
  userData: null,
  error: null,
  isAuthChecked: false,
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
  passwordResetSuccess: false
};

export const fetchUserProfile = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>('profile/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    if (!response || !response.user) {
      return rejectWithValue(
        'Не удалось загрузить профиль: некорректный ответ сервера'
      );
    }
    return response.user;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Ошибка при загрузке профиля пользователя'
    );
  }
});

export const performLogout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('profile/performLogout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при выходе из аккаунта');
  }
});

export const updateUserProfile = createAsyncThunk<
  TUser,
  Partial<TUser>,
  { rejectValue: string }
>('profile/updateUserProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    if (!response || !response.user) {
      return rejectWithValue(
        'Не удалось обновить данные: некорректный ответ сервера'
      );
    }
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при обновлении профиля');
  }
});

export const performForgotPassword = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>('profile/performForgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await forgotPasswordApi({ email });
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Не удалось отправить запрос на восстановление пароля'
    );
  }
});

export const performResetPassword = createAsyncThunk<
  any,
  { password: string; token: string },
  { rejectValue: string }
>(
  'profile/performResetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi({ password, token });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось сбросить пароль');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfileData: (state) => initialProfileState
  },
  selectors: {
    selectProfileUser: (state) => state.userData,
    selectProfileLoading: (state) => state.isLoading,
    selectProfileError: (state) => state.error,
    selectIsUserAuthenticated: (state) => !!state.userData,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectForgotPasswordLoading: (state) => state.forgotPasswordLoading,
    selectForgotPasswordError: (state) => state.forgotPasswordError,
    selectResetPasswordLoading: (state) => state.resetPasswordLoading,
    selectResetPasswordError: (state) => state.resetPasswordError,
    selectPasswordResetSuccess: (state) => state.passwordResetSuccess
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.userData = action.payload;
          state.error = null;
          state.isAuthChecked = true;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.userData = null;
        state.isAuthChecked = true;
      })
      .addCase(performLogout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.userData = null;
        state.error = null;
        state.isAuthChecked = true;
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = null;
        state.resetPasswordLoading = false;
        state.resetPasswordError = null;
        state.passwordResetSuccess = false;
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.userData = action.payload;
          state.error = null;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(performForgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
        state.passwordResetSuccess = false;
      })
      .addCase(performForgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = null;
      })
      .addCase(performForgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload as string;
      })
      .addCase(performResetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.passwordResetSuccess = false;
      })
      .addCase(performResetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = null;
        state.passwordResetSuccess = true;
      })
      .addCase(performResetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload as string;
        state.passwordResetSuccess = false;
      });
  }
});

export const { clearProfileError, resetProfileData } = profileSlice.actions;
export const {
  selectProfileUser,
  selectProfileLoading,
  selectProfileError,
  selectIsUserAuthenticated,
  selectIsAuthChecked,
  selectForgotPasswordLoading,
  selectForgotPasswordError,
  selectResetPasswordLoading,
  selectResetPasswordError,
  selectPasswordResetSuccess
} = profileSlice.selectors;

export default profileSlice.reducer;
