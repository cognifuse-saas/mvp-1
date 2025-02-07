export interface LinkedInProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  profileUrl: string;
  connectionDegree?: '1st' | '2nd' | '3rd';
  email?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'connection' | 'message' | 'content';
  status: 'scheduled' | 'running' | 'completed' | 'paused';
  target: {
    total: number;
    reached: number;
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    dailyLimits: {
      connections: number;
      messages: number;
    };
  };
  targeting: {
    industries: string[];
    locations: string[];
    jobTitles: string[];
    companySizes: string[];
  };
  performance: {
    connections: number;
    responses: number;
    meetings: number;
    responseRate: number;
  };
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  campaignId: string;
  type: 'connection' | 'followUp1' | 'followUp2' | 'followUp3';
  template: string;
  variables: string[];
  performance?: {
    sent: number;
    responses: number;
    responseRate: number;
  };
}

export interface Analytics {
  overview: {
    totalConnections: number;
    totalMessages: number;
    totalResponses: number;
    averageResponseRate: number;
    totalMeetings: number;
  };
  trends: {
    daily: Array<{
      date: string;
      connections: number;
      messages: number;
      responses: number;
    }>;
    weekly: Array<{
      week: string;
      connections: number;
      messages: number;
      responses: number;
    }>;
  };
  campaigns: Array<{
    id: string;
    name: string;
    performance: {
      connections: number;
      responses: number;
      responseRate: number;
    };
  }>;
}

export interface LeadScore {
  profileId: string;
  score: number;
  factors: {
    industryMatch: number;
    titleMatch: number;
    connectionStrength: number;
    activityLevel: number;
  };
} 