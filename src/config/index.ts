// Validate required environment variables
const validateEnv = () => {
  const required = [
    'REACT_APP_API_BASE_URL',
  ];

  const missing = required.filter(
    key => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Run validation
validateEnv();

export const config = {
  USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL!,
  API_TIMEOUT: 30000, // 30 seconds
  API_VERSION: 'v1',
  
  // Campaign Limits
  CAMPAIGN_LIMITS: {
    MAX_DAILY_CONNECTIONS: Number(process.env.REACT_APP_MAX_DAILY_CONNECTIONS || 100),
    MAX_DAILY_MESSAGES: Number(process.env.REACT_APP_MAX_DAILY_MESSAGES || 50),
    MAX_CAMPAIGNS: Number(process.env.REACT_APP_MAX_CAMPAIGNS || 10),
  },

  // Analytics Settings
  ANALYTICS: {
    DEFAULT_TIMEFRAME: process.env.REACT_APP_ANALYTICS_DEFAULT_TIMEFRAME || '7d',
    AVAILABLE_TIMEFRAMES: ['7d', '30d', '90d'] as const,
  },

  // Feature Flags
  FEATURES: {
    ENABLE_LEAD_SCORING: process.env.REACT_APP_ENABLE_LEAD_SCORING === 'true',
    ENABLE_EMAIL_VERIFICATION: process.env.REACT_APP_ENABLE_EMAIL_VERIFICATION === 'true',
    ENABLE_IP_ROTATION: process.env.REACT_APP_ENABLE_IP_ROTATION === 'true',
  }
} as const;

// Type for the config object
export type Config = typeof config;

// Helper to get typed config values
export const getConfig = <K extends keyof Config>(key: K): Config[K] => config[key]; 