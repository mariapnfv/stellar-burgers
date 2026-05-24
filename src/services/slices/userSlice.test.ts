import userReducer, { loginUser } from './userSlice'; // Импортируем редьюсер и экшен логина
import { TUser } from '@utils-types';

// Создаем моковый объект пользователя
const mockUser: TUser = {
  email: 'cosmo-shef@burger.space',
  name: 'Космический Шеф'
};

describe('тест редьюсера userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    error: null
  };

  test('при вызове экшена loginUser.fulfilled данные пользователя записываются в стор, а isAuthChecked меняется на true', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };

    const newState = userReducer(initialState, action);

    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(mockUser);
    expect(newState.error).toBeNull();
  });

  test('при вызове экшена loginUser.rejected текст ошибки записывается в стор, а isAuthChecked меняется на true', () => {
    const errorMessage = 'Неверный логин или пароль';

    const action = {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    };

    const newState = userReducer(initialState, action);

    expect(newState.isAuthChecked).toBe(true);
    expect(newState.error).toBe(errorMessage);
    expect(newState.user).toBeNull();
  });
});