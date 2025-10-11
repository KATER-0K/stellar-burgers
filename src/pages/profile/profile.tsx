import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectProfileUser,
  updateUserProfile
} from '../../services/slices/profileSlice';

export const Profile: FC = () => {
  const currentUser = useSelector(selectProfileUser);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: ''
      });
    }
  }, [currentUser]);

  const hasUnsavedChanges =
    formData.name !== (currentUser?.name || '') ||
    formData.email !== (currentUser?.email || '') ||
    formData.password.trim() !== '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!hasUnsavedChanges) return;

    const updatePayload: Partial<typeof formData> = {
      name: formData.name,
      email: formData.email
    };

    if (formData.password.trim()) {
      updatePayload.password = formData.password;
    }

    dispatch(updateUserProfile(updatePayload))
      .unwrap()
      .then(() => {
        setFormData((prev) => ({ ...prev, password: '' }));
      });
  };

  const handleResetForm = (event: SyntheticEvent) => {
    event.preventDefault();
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: ''
      });
    }
  };

  return (
    <ProfileUI
      formValue={formData}
      isFormChanged={hasUnsavedChanges}
      handleCancel={handleResetForm}
      handleSubmit={handleFormSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
