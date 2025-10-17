import reducer, {
  fetchUserProfile,
  performLogout,
  updateUserProfile,
  performForgotPassword,
  performResetPassword,
  clearProfileError,
  resetProfileData
} from './profileSlice';
import { TUser } from '../../utils/types';

const mockLocalStorage = {
  removeItem: jest.fn()
};
const mockDeleteCookie = jest.fn();

jest.mock('../../utils/cookie', () => ({
  deleteCookie: () => mockDeleteCookie()
}));
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

const mockUser: TUser = {
  email: 'yaroslav@stellar-burgers.space',
  name: 'Космонавт Ярослав'
};

describe('profileSlice — полное управление профилем пользователя', () => {
  const initialState = {
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

  beforeEach(() => {
    mockLocalStorage.removeItem.mockClear();
    mockDeleteCookie.mockClear();
  });

  it('Должен установить isLoading в true и очистить ошибку при начале загрузки профиля', () => {
    const action = fetchUserProfile.pending('', undefined);
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.isAuthChecked).toBe(false);
  });

  it('Должен сохранить данные пользователя и отметить, что аутентификация проверена, при успешной загрузке профиля', () => {
    const action = fetchUserProfile.fulfilled(mockUser, '', undefined);
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.userData).toEqual(mockUser);
    expect(result.error).toBeNull();
    expect(result.isAuthChecked).toBe(true);
  });

  it('Должен обработать ошибку и отметить, что аутентификация проверена, при неудачной загрузке профиля', () => {
    const errorMessage = 'Сессия истекла';
    const action = fetchUserProfile.rejected(
      new Error(),
      '',
      undefined,
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.userData).toBeNull();
    expect(result.error).toBe(errorMessage);
    expect(result.isAuthChecked).toBe(true);
  });

  it('Должен установить isLoading в true при начале выхода из аккаунта', () => {
    const action = performLogout.pending('', undefined);
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('Должен очистить данные пользователя и сбросить всё связанное с аутентификацией состояние при успешном выходе', () => {
    const filledState = {
      ...initialState,
      userData: mockUser,
      forgotPasswordLoading: true,
      passwordResetSuccess: true
    };
    const action = performLogout.fulfilled(undefined, '', undefined);
    const result = reducer(filledState, action);

    expect(result.userData).toBeNull();
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
    expect(result.isAuthChecked).toBe(true);
    expect(result.forgotPasswordLoading).toBe(false);
    expect(result.passwordResetSuccess).toBe(false);
  });

  it('Должен обработать ошибку выхода, но всё равно отметить, что аутентификация проверена', () => {
    const errorMessage = 'Ошибка выхода';
    const action = performLogout.rejected(
      new Error(),
      '',
      undefined,
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.isAuthChecked).toBe(true);
  });

  it('Должен установить isLoading в true при начале обновления профиля', () => {
    const action = updateUserProfile.pending('', { name: 'Новое имя' });
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('Должен обновить данные пользователя при успешном обновлении профиля', () => {
    const updatedUser = { ...mockUser, name: 'Ярослав Космонавтович' };
    const action = updateUserProfile.fulfilled(updatedUser, '', {
      name: 'Ярослав Космонавтович'
    });
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.userData).toEqual(updatedUser);
    expect(result.error).toBeNull();
  });

  it('Должен обработать ошибку при неудачном обновлении профиля', () => {
    const errorMessage = 'Email уже занят';
    const action = updateUserProfile.rejected(
      new Error(),
      '',
      { email: 'taken@test.com' },
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });

  it('Должен установить forgotPasswordLoading в true и сбросить флаги при начале восстановления пароля', () => {
    const action = performForgotPassword.pending('', 'test@test.com');
    const result = reducer(initialState, action);
    expect(result.forgotPasswordLoading).toBe(true);
    expect(result.forgotPasswordError).toBeNull();
    expect(result.passwordResetSuccess).toBe(false);
  });

  it('Должен очистить forgotPasswordLoading при успешном запросе на восстановление пароля', () => {
    const action = performForgotPassword.fulfilled(
      { success: true },
      '',
      'test@test.com'
    );
    const result = reducer(initialState, action);
    expect(result.forgotPasswordLoading).toBe(false);
    expect(result.forgotPasswordError).toBeNull();
  });

  it('Должен обработать ошибку при неудачном запросе на восстановление пароля', () => {
    const errorMessage = 'Пользователь не найден';
    const action = performForgotPassword.rejected(
      new Error(),
      '',
      'notfound@test.com',
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.forgotPasswordLoading).toBe(false);
    expect(result.forgotPasswordError).toBe(errorMessage);
  });

  it('Должен установить resetPasswordLoading в true и сбросить флаги при начале сброса пароля', () => {
    const action = performResetPassword.pending('', {
      password: '123456',
      token: 'abc'
    });
    const result = reducer(initialState, action);
    expect(result.resetPasswordLoading).toBe(true);
    expect(result.resetPasswordError).toBeNull();
    expect(result.passwordResetSuccess).toBe(false);
  });

  it('Должен установить passwordResetSuccess в true при успешном сбросе пароля', () => {
    const action = performResetPassword.fulfilled({ success: true }, '', {
      password: '123456',
      token: 'abc'
    });
    const result = reducer(initialState, action);
    expect(result.resetPasswordLoading).toBe(false);
    expect(result.resetPasswordError).toBeNull();
    expect(result.passwordResetSuccess).toBe(true);
  });

  it('Должен обработать ошибку при неудачном сбросе пароля', () => {
    const errorMessage = 'Неверный токен';
    const action = performResetPassword.rejected(
      new Error(),
      '',
      { password: '123456', token: 'invalid' },
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.resetPasswordLoading).toBe(false);
    expect(result.resetPasswordError).toBe(errorMessage);
    expect(result.passwordResetSuccess).toBe(false);
  });

  it('Должен очистить ошибку профиля при вызове clearProfileError', () => {
    const stateWithError = { ...initialState, error: 'Ошибка профиля' };
    const result = reducer(stateWithError, clearProfileError());
    expect(result.error).toBeNull();
  });

  it('Должен сбросить всё состояние профиля к начальному', () => {
    const filledState = {
      isLoading: true,
      userData: mockUser,
      error: 'Ошибка',
      isAuthChecked: true,
      forgotPasswordLoading: true,
      forgotPasswordError: 'Ошибка восстановления',
      resetPasswordLoading: true,
      resetPasswordError: 'Ошибка сброса',
      passwordResetSuccess: true
    };
    const result = reducer(filledState, resetProfileData());
    expect(result).toEqual(initialState);
  });
});
