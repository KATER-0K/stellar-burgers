import React, { FC } from 'react';
import { AppHeaderUI } from '../ui/app-header';
import { useSelector } from '../../services/store';
import { selectLoginUser } from '../../services/slices/loginSlice';

export const AppHeader: FC = () => {
  const currentUser = useSelector(selectLoginUser);

  return <AppHeaderUI userName={currentUser?.name || ''} />;
};
