import { test, expect } from '@playwright/test';
import ingredientsMock from './fixtures/ingredients.json';

const MOCK_ACCESS_TOKEN = 'Bearer mock-jwt-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

test.describe('перехват и мокирование запроса ингредиентов', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'fallback',
      update: false, 
    });

    await page.goto('http://localhost:4000');
  });

  test('проверяем, что моковые данные загрузились', async ({ page }) => {
    await expect(page.locator('text=Флюоресцентная булка R2-D3').first()).toBeVisible();
    await expect(page.locator('text=Говяжий метеорит (отбивная)').first()).toBeVisible();
  });

});

test.describe('интеграционные тесты страницы конструктора бургеров', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/constructor.har', {
      url: '**/api/**',
      notFound: 'fallback',
      update: false, 
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          success: true,
          user: { email: 'mariapnfv@yandex.ru', name: 'Мария' }
        },
      });
    });

    // ПОДСТАНОВКА МОКОВЫХ ТОКЕНОВ АВТОРИЗАЦИИ НАПРЯМУЮ В БРАУЗЕР
    await page.addInitScript(({ accessToken, refreshToken }) => {
      document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/;`;
      window.localStorage.setItem('refreshToken', refreshToken);
    }, { accessToken: MOCK_ACCESS_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });

    await page.goto('http://localhost:4000');
  });

  test('добавление ингредиента из списка в конструктор (начинка)', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';

    const sourceElement = page.getByText(ingredientName).first();
    await expect(sourceElement).toBeVisible({ timeout: 10000 });

    const constructorArea = page.locator('section').filter({ hasText: /Выберите булки|Соберите бургер|Оформить заказ/i }).first();

    const addButton = page.locator('article, li, div').filter({ hasText: ingredientName }).locator('button').first();

    // клип по кнопке "добавить"
    if (await addButton.isVisible()) {
      await addButton.click();
    } else {
      await sourceElement.dragTo(constructorArea);
    }
    // проверка появления ингридиента
    await expect(page.locator('section, div').filter({ hasText: 'Оформить заказ' }).getByText(ingredientName).first()).toBeVisible();
  });

  test('открываем модальное окно ингридиента', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';

    const ingredientCard = page.getByText(ingredientName).first();
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    // клик по карточке ингридиента
    await ingredientCard.click();

    // проверяем открыто ли окно
   // await expect(page.locator('#modals').getByText('Детали ингредиента').first()).toBeVisible();
    // исправлено
    await expect(page.locator('#modals').getByText(ingredientName).first()).toBeVisible();
  });

  test('закрываем модальное окно ингридиента кликом на крестик', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';

    const ingredientCard = page.getByText(ingredientName).first();
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    //открываем окно 
    await ingredientCard.click();
    await expect(page.locator('#modals').getByText('Детали ингредиента').first()).toBeVisible();
  await expect(page.locator('#modals').getByText(ingredientName).first()).toBeVisible();

    // закрываем окно
    const closeButton = page.locator('#modals button').first();
    await closeButton.click();

    // проверяем закрыто ли окно
    await expect(page.locator('#modals').getByText('Детали ингредиента')).not.toBeVisible();
     await expect(page.locator('#modals').getByText(ingredientName)).not.toBeVisible();
  });

  test('закрываем модальное окно ингридиента кликом на оверлей', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';

    const ingredientCard = page.getByText(ingredientName).first();
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    await ingredientCard.click();
    await expect(page.locator('#modals').getByText('Детали ингредиента').first()).toBeVisible();
     await expect(page.locator('#modals').getByText(ingredientName).first()).toBeVisible();

    // многое испробовано, помогло только это (гарантирует клик вне модалки)
    await page.mouse.click(10, 10);

    // проверяем закрыто ли окно
    await expect(page.locator('#modals').getByText('Детали ингредиента')).not.toBeVisible();
     await expect(page.locator('#modals').getByText(ingredientName)).not.toBeVisible();
  });

  test('проверяем создание заказа', async ({ page }) => {
    const ingredientName = 'Говяжий метеорит (отбивная)';
    const mockOrderNumber = '12345';

    const sourceElement = page.getByText(ingredientName).first();
    await expect(sourceElement).toBeVisible({ timeout: 10000 });

    const constructorArea = page.locator('section, div').filter({ hasText: /Выберите булки|Соберите бургер|Оформить заказ/i }).first();
    const addButton = page.locator('article, li, div').filter({ hasText: ingredientName }).locator('button').first();

    // собираем бургер
    if (await addButton.isVisible()) {
      await addButton.click();
    } else {
      await sourceElement.dragTo(constructorArea);
    }

    // проверяем собран ли бургер
    const addedIngredientInConstructor = page.locator('section, div').filter({ hasText: 'Оформить заказ' }).getByText(ingredientName).first();
    await expect(addedIngredientInConstructor).toBeVisible();

    //  Созданы моковые данные ответа на запрос создания заказа.
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          success: true,
          name: "Флюоресцентный метеоритный бургер",
          order: {
            number: Number(mockOrderNumber),
            status: "done",
            ingredients: ["643d69a5c3f7b9001cfa0940"],
            _id: "mock-order-id-777",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
      });
    });

    // Вызывается клик по кнопке «Оформить заказ».
    const orderButton = page.getByRole('button', { name: /Оформить заказ/i }).first();
    await orderButton.click();

    // Проверяется, что модальное окно открылось и номер заказа верный.
    const orderNumberLocator = page.locator(`text=${mockOrderNumber}`).first();
    await expect(orderNumberLocator).toBeVisible({ timeout: 10000 });

    // Закрывается модальное окно и проверяется успешность закрытия.
    const closeButton = page.locator('#modals button').first();
    await closeButton.click();

    // Проверяем успешность закрытия 
    await expect(orderNumberLocator).not.toBeVisible();

    // Проверяется, что конструктор пуст.
    await expect(page.locator('text=Выберите булки').first()).toBeVisible({ timeout: 5000 });

  });

});