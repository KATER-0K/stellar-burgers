import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectLoginUser,
  selectLoginLoading
} from '../services/slices/loginSlice';

const Preloader: FC = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
);

interface RequireUnauthorizedProps {
  element: React.ReactElement;
}

export const RequireUnauthorized: FC<RequireUnauthorizedProps> = ({
  element
}) => {
  const location = useLocation();

  const user = useSelector(selectLoginUser);
  const isLoading = useSelector(selectLoginLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  return element;
};
