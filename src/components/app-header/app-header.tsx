import React, { FC } from 'react';
import { AppHeaderUI } from '../ui/app-header';
import { useSelector } from '../../services/store';

import { selectProfileUser } from '../../services/slices/profileSlice';

export const AppHeader: FC = () => {
  const currentUser = useSelector(selectProfileUser);

  return <AppHeaderUI userName={currentUser?.name || ''} />;
};
