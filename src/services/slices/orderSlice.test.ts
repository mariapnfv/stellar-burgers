import orderReducer, { createOrder } from './orderSlice'; // Импортируем редюсер и экшен создания заказа
import { TOrder } from '@utils-types';

// Создаем моковый объект заказа
const mockCreatedOrder: TOrder = {
  _id: 'order-777',
  ingredients: ['bun-1', 'main-2', 'bun-1'],
  status: 'done',
  name: 'Крафтовый Космический Бургер',
  createdAt: '2026-05-23T15:00:00.000Z',
  updatedAt: '2026-05-23T15:02:00.000Z',
  number: 77777
};

describe('тест редьюсера orderSlice', () => {
  const initialState = {
    orders: [],
    orderByNumber: null,
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  test('при вызове экшена createOrder.pending переменная orderRequest меняется на true', () => {
    const action = { type: createOrder.pending.type };
    const newState = orderReducer(initialState, action);

    expect(newState.orderRequest).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('при вызове экшена createOrder.fulfilled данные заказа записываются в orderModalData, а orderRequest меняется на false', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockCreatedOrder
    };

    const newState = orderReducer(
      { ...initialState, orderRequest: true },
      action
    );

    expect(newState.orderRequest).toBe(false);
    expect(newState.orderModalData).toEqual(mockCreatedOrder);
  });

  test('при вызове экшена createOrder.rejected текст ошибки записывается в стор, а orderRequest меняется на false', () => {
    const errorMessage = 'Не удалось оформить заказ. Попробуйте позже';

    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };

    const newState = orderReducer(
      { ...initialState, orderRequest: true },
      action
    );

    // Проверяем, что флаг сбросился, а текст ошибки зафиксирован в состоянии
    expect(newState.orderRequest).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });
});