# LinkedIn Automation Tool - Backend Requirements

## Overview
This document outlines the backend requirements for the LinkedIn Automation Tool. The frontend is built with React and TypeScript, and requires a RESTful API backend.

## Core Features Required

### 1. Campaign Management
- CRUD operations for campaigns
- Campaign scheduling and automation
- Message template management
- A/B testing capabilities

### 2. LinkedIn Profile Management
- Profile data storage
- Interaction history tracking
- Connection status management

### 3. Analytics
- Real-time campaign performance tracking
- Historical data analysis
- Custom report generation

### 4. Lead Scoring
- Profile scoring algorithm
- Engagement tracking
- Score history

### 5. Safety Features
- IP rotation mechanism
- Action rate limiting
- Account protection measures

## API Endpoints Specification

### Authentication
```typescript
POST /api/v1/auth/login
- Request: { email: string, password: string }
- Response: { token: string, refreshToken: string }

POST /api/v1/auth/refresh
- Request: { refreshToken: string }
- Response: { token: string }
```

### Campaigns
```typescript
GET /api/v1/campaigns
- Query Parameters:
  - status?: 'scheduled' | 'running' | 'completed' | 'paused'
  - page?: number
  - limit?: number
- Response: { 
    data: Campaign[], 
    total: number, 
    page: number, 
    totalPages: number 
  }

POST /api/v1/campaigns
- Body: Campaign (without id)
- Response: Campaign

PUT /api/v1/campaigns/:id
- Body: Partial<Campaign>
- Response: Campaign

DELETE /api/v1/campaigns/:id
- Response: { success: boolean }
```

### Analytics
```typescript
GET /api/v1/analytics/overview
- Query Parameters:
  - timeframe: '7d' | '30d' | '90d'
- Response: Analytics

GET /api/v1/analytics/campaigns/:id
- Response: CampaignAnalytics
```

### Lead Scoring
```typescript
GET /api/v1/leads/score/:profileId
- Response: LeadScore

POST /api/v1/leads/bulk-score
- Body: { profileIds: string[] }
- Response: { [profileId: string]: LeadScore }
```

## Data Models

All TypeScript interfaces are available in `src/types/index.ts`. Key models include:
- Campaign
- Message
- Analytics
- LeadScore
- LinkedInProfile

## Safety Requirements

### 1. IP Rotation
- Implement IP rotation mechanism
- Track IP usage per account
- Maintain IP health scores

### 2. Rate Limiting
- Per-user rate limits
- Per-IP rate limits
- Cooldown periods between actions

### 3. Action Limits
- Daily connection request limits (default: 100)
- Message sending limits (default: 50)
- Profile view limits

## Development Guidelines

### 1. Authentication
- Use JWT for authentication
- Implement refresh token mechanism
- Include rate limiting on auth endpoints

### 2. Error Handling
Standard error response format:
```typescript
{
  code: string;        // Error code
  message: string;     // User-friendly message
  details?: any;       // Additional error details
}
```

### 3. Response Format
Standard success response format:
```typescript
{
  data: T;            // Response data
  meta?: {            // Optional metadata
    page?: number;
    totalPages?: number;
    total?: number;
  }
}
```

## MVP Priorities

### Phase 1 (Essential)
1. Basic campaign CRUD operations
2. Simple IP rotation
3. Basic analytics
4. Essential safety features

### Phase 2 (Important)
1. Advanced analytics
2. Lead scoring
3. Email verification
4. Advanced safety features

### Phase 3 (Nice to Have)
1. A/B testing
2. Advanced personalization
3. Multi-channel integration

## Technical Requirements

### 1. Performance
- API response time < 200ms
- Support for handling 1000+ concurrent users
- Efficient data pagination

### 2. Security
- HTTPS only
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### 3. Scalability
- Horizontal scaling capability
- Caching strategy
- Database indexing

## Integration Points

### 1. Email Verification
- Integration with Hunter.io
- API key management
- Rate limit handling

### 2. Cloud Infrastructure
- AWS/Cloud provider setup
- IP rotation mechanism
- Scalable architecture

## Testing Requirements

1. Unit tests for all endpoints
2. Integration tests for critical flows
3. Load testing for concurrent users
4. Security testing

## Monitoring Requirements

1. Error tracking
2. Performance monitoring
3. Rate limit monitoring
4. IP health monitoring

## Documentation Requirements

1. API documentation (OpenAPI/Swagger)
2. Database schema documentation
3. Deployment documentation
4. Integration guide

