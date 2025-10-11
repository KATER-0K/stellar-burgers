import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '../ui/profile-menu';
import { useDispatch } from '../../services/store';

import { performLogout } from '../../services/slices/profileSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(performLogout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
