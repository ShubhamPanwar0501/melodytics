# Melodytics

A platform to analyze and visualize playlist data.

## Features

- Data Ingestion: Load song data from JSON files into a database.
- Song Table: View songs with pagination, sorting, and search.
- Ratings: Rate songs from 1 to 5 stars.
- Visualizations: Charts for energy, danceability, duration, and tempo.
- Export: Download data as CSV.

## Technical Stack

- Backend: FastAPI (Python), SQLAlchemy, PostgreSQL, Alembic.
- Frontend: React (TypeScript), TanStack Query, Recharts, SCSS.
- Infrastructure: Docker, Docker Compose.

## How to Run

### Using Docker (Recommended)

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Start the application:
   ```bash
   docker compose up --build
   ```
   *Note: Database migrations will run automatically on startup.*

3. Access the app:
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

### Running Without Docker

1. Backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Database Migrations (Alembic)

When you change the database models in `backend/app/models.py`, follow these steps:

1. Create a new migration:
   ```bash
   docker compose exec api alembic revision --autogenerate -m "describe your changes"
   ```

2. Apply the migration:
   ```bash
   docker compose exec api alembic upgrade head
   ```

## Viewing Logs

View backend logs in real-time:
```bash
docker compose logs -f api
```

## Testing

### Backend
Run the backend tests from the project root:
```bash
backend/venv/bin/pytest backend/tests
```

If you are inside the `backend` directory and using an activated virtual environment:
```bash
pytest tests
```

Generate a terminal coverage report with missing lines:
```bash
backend/venv/bin/pytest backend/tests --cov=app --cov-report=term-missing
```

Generate an HTML coverage report:
```bash
backend/venv/bin/pytest backend/tests --cov=app --cov-report=html
```

Open the backend HTML report at:
```text
htmlcov/index.html
```

When running from the project root, the report directory is created at `htmlcov/`.

### Frontend
Run the frontend tests:
```bash
cd frontend
npm test
```

Generate frontend coverage:
```bash
cd frontend
npm run test:coverage
```

Open the frontend HTML report at:
```text
frontend/coverage/lcov-report/index.html
```

## Architecture

### Backend
The backend uses a Router-Service-Repository pattern:
- Routers: Handle API requests and validation.
- Services: Contain business logic (e.g., data transformation).
- Repositories: Handle database queries and persistence.

### Frontend
The frontend follows a component-based structure:
- Components: Modular UI elements (Table, Upload, Charts).
- Hooks: Custom hooks manage state and API calls using TanStack Query.
- API Client: Centralized Axios instance for backend communication.

Melodytics 2024.
