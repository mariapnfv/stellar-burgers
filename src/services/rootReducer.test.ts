import store from './store';
import { configureStore } from '@reduxjs/toolkit';

describe('тест rootReducer', () => {
  test('должен возвращать корректное начальное состояние при инициализации', () => {

    const initialState = store.getState();

    // Проверяем, что все ключевые слайсы присутствуют в сторе
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('feeds');

    // Проверяем дефолтные значения каждого слайса
    expect(initialState.ingredients).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      error: null
    });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(initialState.user).toEqual({
      user: null,
      isAuthChecked: false,
      error: null
    });

    expect(initialState.order).toEqual({
      orders: [],
      orderByNumber: null,
      orderRequest: false,
      orderModalData: null,
      error: null
    });

    expect(initialState.feeds).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });
});