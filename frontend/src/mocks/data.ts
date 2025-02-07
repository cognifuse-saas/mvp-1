import { Campaign, Analytics, Message, LeadScore } from '../types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Tech Leaders Q1 2024',
    type: 'connection',
    status: 'running',
    target: {
      total: 1000,
      reached: 654
    },
    schedule: {
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      timezone: 'America/New_York',
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dailyLimits: {
        connections: 100,
        messages: 50
      }
    },
    targeting: {
      industries: ['Technology', 'Software'],
      locations: ['United States', 'Canada'],
      jobTitles: ['CTO', 'VP of Engineering', 'Technical Director'],
      companySizes: ['51-200', '201-500', '501-1000']
    },
    performance: {
      connections: 654,
      responses: 234,
      meetings: 45,
      responseRate: 35.8
    },
    lastActive: '2024-03-12T15:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-12T15:30:00Z'
  }
];

export const mockAnalytics: Analytics = {
  overview: {
    totalConnections: 2547,
    totalMessages: 15243,
    totalResponses: 4251,
    averageResponseRate: 27.9,
    totalMeetings: 342
  },
  trends: {
    daily: [
      {
        date: '2024-03-12',
        connections: 45,
        messages: 320,
        responses: 120
      }
    ],
    weekly: [
      {
        week: '2024-W10',
        connections: 315,
        messages: 2240,
        responses: 840
      }
    ]
  },
  campaigns: [
    {
      id: '1',
      name: 'Tech Leaders Q1 2024',
      performance: {
        connections: 654,
        responses: 234,
        responseRate: 35.8
      }
    }
  ]
};

export const mockMessages: Message[] = [
  {
    id: '1',
    campaignId: '1',
    type: 'connection',
    template: 'Hi {{firstName}}, I noticed we share an interest in {{industry}}. Would love to connect!',
    variables: ['firstName', 'industry'],
    performance: {
      sent: 654,
      responses: 234,
      responseRate: 35.8
    }
  }
];

export const mockLeadScores: LeadScore[] = [
  {
    profileId: '1',
    score: 85,
    factors: {
      industryMatch: 90,
      titleMatch: 85,
      connectionStrength: 80,
      activityLevel: 85
    }
  }
]; 