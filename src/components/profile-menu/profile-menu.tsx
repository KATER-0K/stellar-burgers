import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '../ui/profile-menu';
import { useDispatch } from '../../services/store';

import { performLogout } from '../../services/slices/profileSlice';
import { resetLoginState } from '../../services/slices/loginSlice';
import { resetRegistrationState } from '../../services/slices/registerSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(performLogout())
      .unwrap()
      .then(() => {
        dispatch(resetLoginState());
        dispatch(resetRegistrationState());
        navigate('/login', { replace: true });
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
