import api from './config';
import { UserProfile } from '../contexts/UserContext';

interface LoginResponse {
  token: string;
  user: UserProfile;
}

interface SignupResponse {
  token: string;
  user: UserProfile;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/auth/signup', {
    name,
    email,
    password,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
}; 