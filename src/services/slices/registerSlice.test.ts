import reducer, {
  performUserRegistration,
  clearRegistrationError,
  resetRegistrationState
} from './registerSlice';
import { TUser } from '../../utils/types';

const mockSetCookie = jest.fn();
const mockLocalStorage = {
  setItem: jest.fn()
};

jest.mock('../../utils/cookie', () => ({
  setCookie: (...args: any[]) => mockSetCookie(...args)
}));
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

const mockUser: TUser = {
  email: 'yaroslav@stellar-burgers.space',
  name: 'Космонавт Ярослав'
};

const mockRegisterResponse = {
  success: true,
  user: mockUser,
  accessToken: 'fake-access-token',
  refreshToken: 'fake-refresh-token'
};

describe('registerSlice — регистрация пользователя', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isSuccess: false
  };

  beforeEach(() => {
    mockSetCookie.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('Должен установить isLoading в true и сбросить ошибку и флаг успеха при начале регистрации', () => {
    const action = performUserRegistration.pending('', {
      email: 'test@test.com',
      password: '123456',
      name: 'Тест'
    });
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.isSuccess).toBe(false);
  });

  it('Должен сохранить данные пользователя, установить флаг успеха и сохранить токены при успешной регистрации', () => {
    const action = performUserRegistration.fulfilled(mockRegisterResponse, '', {
      email: 'test@test.com',
      password: '123456',
      name: 'Тест'
    });
    const result = reducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.user).toEqual(mockUser);
    expect(result.isSuccess).toBe(true);
    expect(result.error).toBeNull();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'fake-refresh-token'
    );
    expect(mockSetCookie).toHaveBeenCalledWith(
      'accessToken',
      'fake-access-token'
    );
  });

  it('Должен обработать ошибку при неудачной регистрации', () => {
    const errorMessage = 'Email уже используется';
    const action = performUserRegistration.rejected(
      new Error(),
      '',
      { email: 'taken@test.com', password: '123456', name: 'Тест' },
      errorMessage
    );
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.isSuccess).toBe(false);
    expect(result.user).toBeNull();
  });

  it('Должен использовать сообщение об ошибке по умолчанию, если оно не предоставлено', () => {
    const action = performUserRegistration.rejected(
      new Error(),
      '',
      { email: 'bad@test.com', password: '123', name: 'Тест' },
      undefined
    );
    const result = reducer(initialState, action);
    expect(result.error).toBe('Ошибка при регистрации. Попробуйте позже.');
  });

  it('Должен очистить ошибку при вызове clearRegistrationError', () => {
    const stateWithError = { ...initialState, error: 'Ошибка регистрации' };
    const result = reducer(stateWithError, clearRegistrationError());
    expect(result.error).toBeNull();
  });

  it('Должен сбросить всё состояние регистрации к начальному', () => {
    const filledState = {
      user: mockUser,
      isLoading: true,
      error: 'Ошибка',
      isSuccess: true
    };
    const result = reducer(filledState, resetRegistrationState());
    expect(result).toEqual(initialState);
  });
});
