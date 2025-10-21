import { ConstructorState } from './burgerConstructorSlice';
import { v4 as uuidv4 } from 'uuid';
import reducer, { addIngredient } from './burgerConstructorSlice';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-123')
}));

const mockBun = {
  _id: 'bun-1',
  name: 'Краторная булка',
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

const mockSauce = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 90,
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const mockMain = {
  _id: 'main-1',
  name: 'Мясо марсианского быка',
  type: 'main',
  price: 988,
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  image: 'meat.png',
  image_large: 'meat-large.png',
  image_mobile: 'meat-mobile.png'
};

describe('burgerConstructor reducer', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  beforeEach(() => {
    (uuidv4 as jest.Mock).mockClear();
  });

  it('Должен добавить булку, если тип ингредиента — "bun"', () => {
    const action = addIngredient(mockBun);
    const result = reducer(initialState, action);

    const expectedBun = { ...mockBun, id: 'mocked-uuid-123' };
    expect(result.bun).toEqual(expectedBun);
    expect(result.ingredients).toHaveLength(0);
  });

  it('Должен добавить ингредиент (не булку) в массив ingredients', () => {
    const action = addIngredient(mockSauce);
    const result = reducer(initialState, action);

    const expectedSauce = { ...mockSauce, id: 'mocked-uuid-123' };
    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(expectedSauce);
  });

  it('Должен удалить ингредиент по id', () => {
    const stateWithIngredients: ConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'id-1' },
        { ...mockMain, id: 'id-2' }
      ]
    };

    const result = reducer(stateWithIngredients, {
      type: 'burgerConstructor/removeIngredient',
      payload: 'id-1'
    });

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('id-2');
  });

  it('Должен переместить ингредиент вверх, если он не находится в самом верху', () => {
    const stateWithIngredients: ConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'id-1' },
        { ...mockMain, id: 'id-2' }
      ]
    };

    const result = reducer(stateWithIngredients, {
      type: 'burgerConstructor/moveIngredientUp',
      payload: 'id-2'
    });

    expect(result.ingredients[0].id).toBe('id-2');
    expect(result.ingredients[1].id).toBe('id-1');
  });

  it('Не должен перемещать ингредиент вверх, если он уже находится в самом верху', () => {
    const stateWithIngredients: ConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'id-1' },
        { ...mockMain, id: 'id-2' }
      ]
    };

    const result = reducer(stateWithIngredients, {
      type: 'burgerConstructor/moveIngredientUp',
      payload: 'id-1'
    });

    expect(result.ingredients[0].id).toBe('id-1');
    expect(result.ingredients[1].id).toBe('id-2');
  });

  it('Должен переместить ингредиент вниз, если он не находится в самом низу', () => {
    const stateWithIngredients: ConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'id-1' },
        { ...mockMain, id: 'id-2' }
      ]
    };

    const result = reducer(stateWithIngredients, {
      type: 'burgerConstructor/moveIngredientDown',
      payload: 'id-1'
    });

    expect(result.ingredients[0].id).toBe('id-2');
    expect(result.ingredients[1].id).toBe('id-1');
  });

  it('Не должен перемещать ингредиент вниз, если он уже находится в самом низу', () => {
    const stateWithIngredients: ConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'id-1' },
        { ...mockMain, id: 'id-2' }
      ]
    };

    const result = reducer(stateWithIngredients, {
      type: 'burgerConstructor/moveIngredientDown',
      payload: 'id-2'
    });

    expect(result.ingredients[0].id).toBe('id-1');
    expect(result.ingredients[1].id).toBe('id-2');
  });

  it('Должен очистить всё состояние конструктора', () => {
    const filledState: ConstructorState = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockSauce, id: 'ing-id' }]
    };

    const result = reducer(filledState, {
      type: 'burgerConstructor/clearConstructor'
    });

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(0);
  });
});
