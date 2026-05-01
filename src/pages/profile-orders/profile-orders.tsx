import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getOrdersApi } from '../../utils/burger-api';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);
  console.log('Данные для Истории:', orders);
  return <ProfileOrdersUI orders={orders} />;
};
