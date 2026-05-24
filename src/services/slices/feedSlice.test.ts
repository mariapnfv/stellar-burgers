import feedReducer, { fetchFeeds } from './feedSlice'; // Импортируем редьюсер и асинхронный экшен
import { TOrder } from '@utils-types';

// моковые (тестовые) данные
const mockFeedsResponse = {
  orders: [
    {
      _id: 'feed-order-111',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Космический бургер',
      createdAt: '2026-05-23T12:00:00.000Z',
      updatedAt: '2026-05-23T12:05:00.000Z',
      number: 12345
    }
  ] as TOrder[],
  total: 4500,
  totalToday: 35
};

describe('Тестирование асинхронного редьюсера feedSlice', () => {
  // начальное состояние слайса ленты заказов до любых запросов
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  test('при вызове экшена fetchFeeds.pending переменная isLoading меняется на true', () => {
    const action = { type: fetchFeeds.pending.type };
    const newState = feedReducer(initialState, action);

    // Проверяем, что флаг загрузки активировался
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('при вызове экшена fetchFeeds.fulfilled данные ленты записываются в стор, а isLoading меняется на false', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedsResponse
    };

    // Передаем стейт, в котором флаг загрузки уже был активен
    const newState = feedReducer(
      { ...initialState, isLoading: true },
      action
    );
    expect(newState.isLoading).toBe(false);
    // Проверяем точное совпадение записанных данных с тем, что вернул сервер
    expect(newState.orders).toEqual(mockFeedsResponse.orders);
    expect(newState.total).toBe(mockFeedsResponse.total);
    expect(newState.totalToday).toBe(mockFeedsResponse.totalToday);
  });

  test('при вызове экшена fetchFeeds.rejected текст ошибки записывается в стор, а isLoading меняется на false', () => {
    const errorMessage = 'Не удалось загрузить общую ленту заказов';

    // Имитируем падение запроса
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: errorMessage }
    };

    const newState = feedReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });
});