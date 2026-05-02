import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrderByNumber,
  clearOrderData
} from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const { ingredients } = useSelector((state) => state.ingredients);
  const orderData = useSelector((state) => {
    if (state.order.orderByNumber?.number === Number(number)) {
      return state.order.orderByNumber;
    }
    const userOrder = state.order.orders.find(
      (o) => o.number === Number(number)
    );
    if (userOrder) return userOrder;

    const feedOrder = state.feeds.orders.find(
      (o) => o.number === Number(number)
    );
    if (feedOrder) return feedOrder;

    return null;
  });

  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(+number));
    }
    return () => {
      dispatch(clearOrderData());
    };
  }, [dispatch, orderData, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
