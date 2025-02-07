import api from './config';
import { SocialIntegration, CalendarIntegration } from '../contexts/UserContext';

// Social Integrations
export const connectSocialAccount = async (
  provider: string,
  code: string
): Promise<SocialIntegration> => {
  const response = await api.post<SocialIntegration>(`/integrations/social/${provider}/connect`, {
    code,
  });
  return response.data;
};

export const disconnectSocialAccount = async (
  provider: string
): Promise<void> => {
  await api.post(`/integrations/social/${provider}/disconnect`);
};

export const getSocialAccounts = async (): Promise<SocialIntegration[]> => {
  const response = await api.get<SocialIntegration[]>('/integrations/social');
  return response.data;
};

// Calendar Integrations
export const connectCalendar = async (
  provider: string,
  code: string
): Promise<CalendarIntegration> => {
  const response = await api.post<CalendarIntegration>(`/integrations/calendar/${provider}/connect`, {
    code,
  });
  return response.data;
};

export const disconnectCalendar = async (
  provider: string
): Promise<void> => {
  await api.post(`/integrations/calendar/${provider}/disconnect`);
};

export const getCalendars = async (): Promise<CalendarIntegration[]> => {
  const response = await api.get<CalendarIntegration[]>('/integrations/calendar');
  return response.data;
};

export const syncCalendar = async (
  provider: string
): Promise<CalendarIntegration> => {
  const response = await api.post<CalendarIntegration>(`/integrations/calendar/${provider}/sync`);
  return response.data;
};

// OAuth URLs
export const getOAuthUrl = async (
  provider: string,
  type: 'social' | 'calendar'
): Promise<{ url: string }> => {
  const response = await api.get<{ url: string }>(`/integrations/${type}/${provider}/oauth-url`);
  return response.data;
}; 