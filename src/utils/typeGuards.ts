import { Campaign, Analytics, Message, LeadScore } from '../types';

export const isCampaign = (data: any): data is Campaign => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.type === 'string' &&
    ['connection', 'message', 'content'].includes(data.type) &&
    typeof data.status === 'string' &&
    ['scheduled', 'running', 'completed', 'paused'].includes(data.status)
  );
};

export const isAnalytics = (data: any): data is Analytics => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.overview === 'object' &&
    data.overview !== null &&
    Array.isArray(data.trends?.daily) &&
    Array.isArray(data.trends?.weekly) &&
    Array.isArray(data.campaigns)
  );
};

export const isMessage = (data: any): data is Message => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.campaignId === 'string' &&
    typeof data.type === 'string' &&
    ['connection', 'followUp1', 'followUp2', 'followUp3'].includes(data.type) &&
    typeof data.template === 'string' &&
    Array.isArray(data.variables)
  );
};

export const isLeadScore = (data: any): data is LeadScore => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.profileId === 'string' &&
    typeof data.score === 'number' &&
    typeof data.factors === 'object' &&
    data.factors !== null &&
    typeof data.factors.industryMatch === 'number' &&
    typeof data.factors.titleMatch === 'number' &&
    typeof data.factors.connectionStrength === 'number' &&
    typeof data.factors.activityLevel === 'number'
  );
}; 