import api from './config';
import { UserProfile } from '../contexts/UserContext';

export const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>('/user/profile', updates);
  return response.data;
};

export const updateSettings = async (settings: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>('/user/settings', settings);
  return response.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.post('/user/password', {
    currentPassword,
    newPassword,
  });
};

export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post<{ avatarUrl: string }>('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}; 