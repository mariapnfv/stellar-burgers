import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, total, totalToday, isLoading } = useSelector(
    (state) => state.feeds
  );

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      total={total}
      totalToday={totalToday}
      {...({ feed: { total, totalToday } } as any)}
      handleGetFeeds={() => dispatch(fetchFeeds())}
    />
  );
};
