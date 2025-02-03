# LinkedIn Automation Tool - Frontend

A modern React application for managing LinkedIn outreach campaigns with advanced automation features.

## Features

- Campaign Management
- Analytics Dashboard
- Lead Scoring
- IP Rotation Safety
- Real-time Performance Tracking

## Tech Stack

- React 18
- TypeScript
- Framer Motion
- Recharts
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
# or
yarn dev
```

## Development

### Environment Variables

See `.env.example` for all required environment variables.

### Mock Data

The application uses mock data by default. To use real API:
1. Set `REACT_APP_USE_MOCK_DATA=false` in your `.env`
2. Ensure backend API is running at `REACT_APP_API_BASE_URL`

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── types/         # TypeScript interfaces
├── mocks/         # Mock data
├── services/      # API services
└── config/        # Configuration
```

## Backend Integration

See `BACKEND_REQUIREMENTS.md` for detailed API specifications and requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Your chosen license]

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/your-repo-name](https://github.com/yourusername/your-repo-name)
