import reducer from './ingredientsSlice';
import { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredient1: TIngredient = {
  _id: 'ing-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockIngredient2: TIngredient = {
  _id: 'ing-2',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const mockIngredients: TIngredient[] = [mockIngredient1, mockIngredient2];

describe('ingredientsSlice — асинхронная загрузка ингредиентов', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('Должен установить isLoading в true и очистить ошибку при начале загрузки', () => {
    const action = fetchIngredients.pending('', undefined);
    const result = reducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('Должен сохранить список ингредиентов и остановить загрузку при успешном ответе', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
    const result = reducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.error).toBeNull();
  });

  it('Должен обработать ошибку с указанием сообщения при неудачной загрузке', () => {
    const action = {
      type: 'ingredients/getAll/rejected',
      error: { message: 'Network error' }
    };
    const result = reducer(initialState, action as any);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('Должен использовать сообщение об ошибке по умолчанию, если конкретное сообщение не предоставлено', () => {
    const action = {
      type: 'ingredients/getAll/rejected',
      error: { message: undefined }
    };
    const result = reducer(initialState, action as any);

    expect(result.error).toBe('Ошибка загрузки');
  });
});
