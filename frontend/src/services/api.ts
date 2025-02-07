import { config } from '../config';
import { Campaign, Analytics, Message, LeadScore } from '../types';
import { APIError, AuthError, handleAPIError } from '../utils/error';

const API_URL = `${config.API_BASE_URL}/api/${config.API_VERSION}`;

// Helper function to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthError();
    }
    
    const error = await response.json();
    throw new APIError(
      error.code || 'API_ERROR',
      error.message || 'API request failed',
      error.details
    );
  }
  return response.json();
};

// Campaign API endpoints
export const campaignAPI = {
  list: async (): Promise<Campaign[]> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockCampaigns } = await import('../mocks/data');
        return mockCampaigns;
      }

      const response = await fetch(`${API_URL}/campaigns`, {
        headers: getHeaders(),
      });
      return handleResponse<Campaign[]>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  create: async (campaign: Omit<Campaign, 'id'>): Promise<Campaign> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { ...campaign, id: Date.now().toString() } as Campaign;
      }

      const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(campaign),
      });
      return handleResponse<Campaign>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  update: async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockCampaigns } = await import('../mocks/data');
        return { ...mockCampaigns[0], ...updates };
      }

      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      return handleResponse<Campaign>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }

      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse<{ success: boolean }>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

// Analytics API endpoints
export const analyticsAPI = {
  getOverview: async (timeframe: '7d' | '30d' | '90d' = '7d'): Promise<Analytics> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockAnalytics } = await import('../mocks/data');
        return mockAnalytics;
      }

      const response = await fetch(
        `${API_URL}/analytics/overview?timeframe=${timeframe}`,
        { headers: getHeaders() }
      );
      return handleResponse<Analytics>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCampaignStats: async (campaignId: string): Promise<Analytics['campaigns'][0]> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockAnalytics } = await import('../mocks/data');
        return mockAnalytics.campaigns[0];
      }

      const response = await fetch(
        `${API_URL}/analytics/campaigns/${campaignId}`,
        { headers: getHeaders() }
      );
      return handleResponse<Analytics['campaigns'][0]>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

// Lead Scoring API endpoints
export const leadScoringAPI = {
  getScore: async (profileId: string): Promise<LeadScore> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockLeadScores } = await import('../mocks/data');
        return mockLeadScores[0];
      }

      const response = await fetch(
        `${API_URL}/leads/score/${profileId}`,
        { headers: getHeaders() }
      );
      return handleResponse<LeadScore>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  bulkScore: async (profileIds: string[]): Promise<Record<string, LeadScore>> => {
    try {
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { mockLeadScores } = await import('../mocks/data');
        return { [mockLeadScores[0].profileId]: mockLeadScores[0] };
      }

      const response = await fetch(`${API_URL}/leads/bulk-score`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ profileIds }),
      });
      return handleResponse<Record<string, LeadScore>>(response);
    } catch (error) {
      throw handleAPIError(error);
    }
  },
}; 