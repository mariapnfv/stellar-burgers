import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { ProtectedRoute } from '../protected-route/protected-route';
import { checkUserAuth } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';
import { authChecked } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  /** TODO: взять переменные из стора */
  const { ingredients, isIngredientsLoading, error } = useSelector(
    (state) => state.ingredients
  );
  const { isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    // Загружаем ингредиенты
    dispatch(fetchIngredients());

    // Проверка пользователя
    const hasToken = getCookie('accessToken');
    if (hasToken) {
      dispatch(checkUserAuth());
    } else {
      dispatch(authChecked());
    }
  }, []);

  const closeModal = () => {
    navigate(-1);
  };
  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route
              path='/'
              element={
                ingredients.length > 0 ? (
                  <ConstructorPage />
                ) : (
                  <div
                    className={`${styles.title} text text_type_main-medium pt-4`}
                  >
                    Нет ингредиентов
                  </div>
                )
              }
            />

            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={<ProtectedRoute onlyUnAuth component={<Login />} />}
            />
            <Route
              path='/register'
              element={<ProtectedRoute onlyUnAuth component={<Register />} />}
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth component={<ForgotPassword />} />
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth component={<ResetPassword />} />
              }
            />

            <Route
              path='/profile'
              element={<ProtectedRoute component={<Profile />} />}
            />
            <Route
              path='/profile/orders'
              element={<ProtectedRoute component={<ProfileOrders />} />}
            />
            <Route
              path='/profile/orders/:number'
              element={<ProtectedRoute component={<OrderInfo />} />}
            />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title={'Детали заказа'} onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title={'Детали ингредиента'} onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute
                    component={
                      <Modal title={'Детали заказа'} onClose={closeModal}>
                        <OrderInfo />
                      </Modal>
                    }
                  />
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
