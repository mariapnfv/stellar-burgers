import constructorReducer, {
  addIngredient,
  removeIngredient,
  reorderIngredient
} from './constructorSlice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
  _id: '1',
  name: 'булка(тест)',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 150,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockMain: TIngredient = {
  _id: '2',
  name: 'начинка(тест)',
  type: 'main',
  proteins: 20,
  fat: 20,
  carbohydrates: 5,
  calories: 300,
  price: 250,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockSauce: TIngredient = {
  _id: '3',
  name: 'соус(тест)',
  type: 'sauce',
  proteins: 1,
  fat: 5,
  carbohydrates: 10,
  calories: 50,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('тестирование редьюсера burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('тест добавления булки', () => {
    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);

    expect(newState.bun).toEqual(expect.objectContaining({ _id: '1', type: 'bun' }));
    expect(newState.bun).toHaveProperty('id');
  });

  test('тест добавления начинки', () => {
    const action = addIngredient(mockMain);
    const newState = constructorReducer(initialState, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(expect.objectContaining({ _id: '2', type: 'main' }));
    expect(newState.ingredients[0]).toHaveProperty('id');
  });

  test('тест удаления ингридиента', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [{ ...mockMain, id: 'unique-id-123' }]
    };

    const action = removeIngredient('unique-id-123');
    const newState = constructorReducer(stateWithIngredient, action);

    expect(newState.ingredients).toHaveLength(0);
  });

  test('тест изменения порядка ингредиентов в начинке', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'id-1' },
        { ...mockSauce, id: 'id-2' }
      ]
    };

    const action = reorderIngredient({ index: 0, direction: 'down' });
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients[0].id).toBe('id-2');
    expect(newState.ingredients[1].id).toBe('id-1');
  });
});
