import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface SocialIntegration {
  provider: 'google' | 'outlook' | 'twitter' | 'linkedin';
  connected: boolean;
  email?: string;
  username?: string;
  avatar?: string;
  lastSync?: string;
  scope?: string[];
}

interface CalendarIntegration {
  provider: 'google' | 'outlook';
  connected: boolean;
  email?: string;
  calendars?: {
    id: string;
    name: string;
    color: string;
    selected: boolean;
  }[];
  lastSync?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  jobTitle: string;
  company: string;
  timezone: string;
  language: string;
  phoneNumber: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'daily' | 'weekly' | 'never';
    campaignNotifications: {
      start: boolean;
      end: boolean;
      milestone: boolean;
      error: boolean;
    };
    dndSchedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    activityStatus: boolean;
    readReceipts: boolean;
    dataRetention: number;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    ipWhitelist: string[];
    apiKeys: {
      key: string;
      name: string;
      created: string;
      lastUsed: string;
    }[];
  };
  linkedin: {
    accountConnected: boolean;
    dailyLimit: number;
    connectionDelay: number;
    messageDelay: number;
    weekendPause: boolean;
    ipRotation: boolean;
    restrictedKeywords: string[];
  };
  integrations: {
    social: SocialIntegration[];
    calendar: CalendarIntegration[];
    webhooks: {
      url: string;
      events: string[];
      active: boolean;
    }[];
    oauth: {
      app: string;
      connected: boolean;
      permissions: string[];
    }[];
  };
  sessions: {
    id: string;
    device: string;
    lastActive: string;
    location: string;
  }[];
  loginHistory: {
    date: string;
    ip: string;
    device: string;
    status: 'success' | 'failed';
  }[];
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  connectIntegration: (type: 'social' | 'calendar', provider: string) => Promise<void>;
  disconnectIntegration: (type: 'social' | 'calendar', provider: string) => Promise<void>;
  syncCalendars: (provider: string) => Promise<void>;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      // TODO: Replace with actual API call
      const mockUser: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '',
        jobTitle: 'Sales Manager',
        company: 'Acme Inc',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'en',
        phoneNumber: '',
        bio: '',
        socialLinks: {
          twitter: '',
          linkedin: '',
          website: ''
        },
        notifications: {
          email: true,
          push: true,
          inApp: true,
          digest: 'daily',
          campaignNotifications: {
            start: true,
            end: true,
            milestone: true,
            error: true
          },
          dndSchedule: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00'
          }
        },
        appearance: {
          theme: 'light',
          accentColor: '#6366F1',
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium'
        },
        privacy: {
          profileVisibility: 'public',
          activityStatus: true,
          readReceipts: true,
          dataRetention: 90
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
          loginAlerts: true,
          ipWhitelist: [],
          apiKeys: []
        },
        linkedin: {
          accountConnected: false,
          dailyLimit: 100,
          connectionDelay: 30,
          messageDelay: 45,
          weekendPause: true,
          ipRotation: false,
          restrictedKeywords: [],
          cooldownPeriod: 24
        },
        integrations: {
          social: [
            {
              provider: 'linkedin',
              connected: false
            },
            {
              provider: 'twitter',
              connected: false
            }
          ],
          calendar: [
            {
              provider: 'google',
              connected: false
            },
            {
              provider: 'outlook',
              connected: false
            }
          ],
          webhooks: [],
          oauth: []
        },
        sessions: [],
        loginHistory: []
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      
      // Broadcast the name change event for other components
      if (updates.name) {
        window.dispatchEvent(new CustomEvent('userNameChanged', { 
          detail: { newName: updates.name } 
        }));
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const connectIntegration = async (type: 'social' | 'calendar', provider: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser(prev => {
        if (!prev) return null;
        
        const updatedIntegrations = {
          ...prev.integrations,
          [type]: prev.integrations[type].map(integration =>
            integration.provider === provider
              ? { ...integration, connected: true, lastSync: new Date().toISOString() }
              : integration
          )
        };
        
        return { ...prev, integrations: updatedIntegrations };
      });
      
      toast.success(`Connected to ${provider} successfully`);
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectIntegration = async (type: 'social' | 'calendar', provider: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => {
        if (!prev) return null;
        
        const updatedIntegrations = {
          ...prev.integrations,
          [type]: prev.integrations[type].map(integration =>
            integration.provider === provider
              ? { ...integration, connected: false, lastSync: undefined }
              : integration
          )
        };
        
        return { ...prev, integrations: updatedIntegrations };
      });
      
      toast.success(`Disconnected from ${provider}`);
    } catch (error) {
      toast.error(`Failed to disconnect from ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCalendars = async (provider: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual calendar sync API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(prev => {
        if (!prev) return null;
        
        const updatedCalendars = prev.integrations.calendar.map(integration =>
          integration.provider === provider
            ? {
                ...integration,
                lastSync: new Date().toISOString(),
                calendars: [
                  { id: '1', name: 'Primary', color: '#4285f4', selected: true },
                  { id: '2', name: 'Work', color: '#34a853', selected: false },
                  { id: '3', name: 'Personal', color: '#fbbc05', selected: false },
                ]
              }
            : integration
        );
        
        return {
          ...prev,
          integrations: {
            ...prev.integrations,
            calendar: updatedCalendars
          }
        };
      });
      
      toast.success('Calendars synced successfully');
    } catch (error) {
      toast.error('Failed to sync calendars');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const token = 'mock-jwt-token';
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }
      
      await loadUser();
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const token = 'mock-jwt-token';
      localStorage.setItem('authToken', token);
      
      await loadUser();
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear auth token and user data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      setUser(null);
      
      // Redirect to login
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUserProfile,
        connectIntegration,
        disconnectIntegration,
        syncCalendars,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 