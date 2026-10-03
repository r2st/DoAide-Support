# DoAide Support

AI-powered customer support desk for businesses.

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **AI**: OpenRouter (GPT-4o-mini)
- **Real-time**: WebSocket live chat

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../keys/.env.example ../keys/.env  # edit with your values
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

Create a PostgreSQL database named `doaide_support`. Tables are created automatically on first run.

## Environment Variables

See `keys/.env.example` for all required environment variables.

## Tests

```bash
cd backend
pip install -r requirements-test.txt
pytest tests/ -v
```

## Features

- JWT authentication with role-based access
- Ticket management with status, priority, tags, SLA tracking
- AI auto-response via OpenRouter
- Knowledge base with markdown articles
- Live chat via WebSocket
- Email ticket creation
- Canned response templates
- Customer self-service portal
- Analytics and reporting dashboard
- Dark/light/system theme support
