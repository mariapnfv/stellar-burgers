import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap() // Позволяет дождаться завершения асинхронного экшена
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка при выходе:', err);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
