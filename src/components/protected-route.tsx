import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectIsUserAuthenticated
} from '../services/slices/profileSlice';

type ProtectedRouteProps = {
  children?: React.ReactElement;
  unAuthOnly?: boolean;
};

export const ProtectedRoute = ({
  children,
  unAuthOnly = false
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (unAuthOnly) {
    if (isUserAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }
  } else {
    if (!isUserAuthenticated) {
      return <Navigate to='/login' replace state={{ from: location }} />;
    }
  }

  return <>{children}</>;
};
