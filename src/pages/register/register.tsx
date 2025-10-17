import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { performUserRegistration } from '../../services/slices/registerSlice';
import {
  selectRegistrationLoading,
  selectRegistrationError
} from '../../services/slices/registerSlice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectRegistrationLoading);
  const registrationError = useSelector(selectRegistrationError);

  const handleRegistration = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName.trim() || !email.trim() || !password.trim()) {
      return;
    }

    dispatch(
      performUserRegistration({
        name: userName,
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {});
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleRegistration}
      errorText={registrationError || ''}
    />
  );
};
