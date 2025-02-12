# LinkedIn Automation Tool

A powerful LinkedIn automation tool for managing connections, sending personalized messages, and automating outreach campaigns.

## Features

### Core Features
- 🔍 LinkedIn Profile Search
- 🤝 Automated Connection Requests
- 💬 Message Follow-ups
- 🤖 AI-Powered Message Generation
- ⚡ Rate Limiting & Safety Features

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- LinkedIn API
- OpenAI Integration

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- LinkedIn Account
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your credentials:
- `LINKEDIN_EMAIL`: Your LinkedIn email
- `LINKEDIN_PASSWORD`: Your LinkedIn password
- `OPENAI_API_KEY`: Your OpenAI API key
- Other configuration variables as needed

### Running the Application

1. Start the backend server:
```bash
cd src/api
python run.py
```
The API will be available at `http://localhost:8000`

2. Start the frontend development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

## API Endpoints

### Search
- `POST /search`
  - Search for LinkedIn profiles
  - Parameters: `keywords`, `limit`

### Connection Requests
- `POST /connect`
  - Send connection requests
  - Parameters: `profile_id`, `message` (optional)

### Messages
- `POST /message`
  - Send messages to connections
  - Parameters: `profile_id`, `message`

## Safety Features

- Rate limiting for LinkedIn requests
- Daily connection request limits
- Random delays between actions
- Error handling and retry mechanisms

## Configuration

All configuration is done through environment variables. See `.env.example` for available options:

### Backend Configuration
- `LINKEDIN_EMAIL`: LinkedIn account email
- `LINKEDIN_PASSWORD`: LinkedIn account password
- `OPENAI_API_KEY`: OpenAI API key
- `MAX_DAILY_CONNECTIONS`: Maximum daily connection requests

### Frontend Configuration
- `VITE_API_URL`: Backend API URL
- `VITE_ENV`: Environment (development/production)
- Feature flags and limits

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your chosen license]

## Support

For support, please [create an issue](your-repo-issues-url) or contact [your-email].
