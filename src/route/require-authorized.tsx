import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';

import {
  selectLoginUser,
  selectLoginLoading
} from '../services/slices/loginSlice';

const Preloader: FC = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
);

interface RequireAuthorizedProps {
  element: React.ReactElement;
}

export const RequireAuthorized: FC<RequireAuthorizedProps> = ({ element }) => {
  const location = useLocation();

  const user = useSelector(selectLoginUser);
  const isLoading = useSelector(selectLoginLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
