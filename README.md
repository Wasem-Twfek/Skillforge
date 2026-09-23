# SkillForge

**SkillForge** is a full-stack microlearning platform for short, focused learning sessions across areas such as programming, design, and languages.

The project combines a React/TypeScript frontend with an Express/TypeScript backend, PostgreSQL persistence, Redis, Prisma, authentication, and Docker-based local deployment.

> **Project status:** active portfolio project. Some product and authentication flows are still being refined.

## What it demonstrates

- User authentication and protected application routes
- Course, lesson, enrollment, progress, quiz, and attempt domain models
- React-based learning interface with client-side state management
- REST API built with Express and TypeScript
- PostgreSQL persistence through Prisma ORM
- Redis integration for backend caching/infrastructure
- Google OAuth integration
- Docker Compose environment for PostgreSQL, Redis, backend, and frontend
- Automated frontend testing with Vitest and Testing Library
- PWA support for the frontend

## Architecture

```text
┌──────────────────────┐
│   React + TypeScript │
│        Frontend      │
└──────────┬───────────┘
           │ HTTP / REST
           ▼
┌──────────────────────┐
│ Express + TypeScript │
│       Backend        │
└───────┬────────┬─────┘
        │        │
        ▼        ▼
   PostgreSQL   Redis
    (Prisma)   (ioredis)
```

The application can also be started as a Docker Compose stack with PostgreSQL, Redis, the backend API, and an Nginx-served frontend.

## Tech stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Framer Motion
- Vitest + Testing Library
- vite-plugin-pwa

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Redis / ioredis
- JWT authentication
- Google OAuth
- Jest

### Infrastructure
- Docker
- Docker Compose
- Nginx

## Domain model

The backend uses Prisma models for the main learning workflow:

- **User**
- **Course**
- **Lesson**
- **Enrollment**
- **LessonProgress**
- **Quiz**
- **Attempt**

This provides a foundation for tracking learning content, enrollment, progress, and assessment results.

## Repository structure

```text
Skillforge/
├── frontend/              # React/Vite application
├── skillforge-backend/    # Express API and Prisma schema
├── public/                # Static frontend assets
├── scripts/               # Build and maintenance scripts
├── docker-compose.yml     # Local multi-service environment
├── nginx.conf             # Frontend/API reverse-proxy configuration
└── .env.example           # Example environment configuration
```

## Getting started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ (or Docker)
- Redis (or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/wasem15/Skillforge.git
cd Skillforge
```

### 2. Configure environment variables

Copy the example configuration and provide your local values:

```bash
cp .env.example .env
cp skillforge-backend/.env.example skillforge-backend/.env
```

Never commit real credentials or `.env` files.

### 3. Install dependencies

```bash
npm install
cd frontend
npm install
cd ../skillforge-backend
npm install
cd ..
```

### 4. Prepare the database

From `skillforge-backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Run the application

Start the backend:

```bash
cd skillforge-backend
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Use the local URLs printed by Vite and the backend during startup.

## Docker

The repository includes a Docker Compose setup for the main services:

```bash
docker compose up --build
```

This starts PostgreSQL, Redis, the backend API, and the Nginx-served frontend.

**Production note:** provide real secrets through the environment. Do not rely on the development fallback values in `docker-compose.yml`.

## Testing

Frontend tests:

```bash
cd frontend
npm test
npm run test:coverage
```

Backend tests:

```bash
cd skillforge-backend
npm test
```

## Security notes

- Environment files are intentionally excluded from version control.
- OAuth client secrets and JWT secrets must be supplied through environment variables.
- Credentials that have previously appeared in Git history should be rotated and the affected Git history should be scrubbed before using those credentials again.
- Debug logging should be disabled or restricted before production deployment.

## Roadmap

- Refine the authentication and OAuth flow
- Improve course authoring and learning workflows
- Expand automated backend/API test coverage
- Add production-ready configuration and secret validation
- Improve deployment and CI/CD automation
- Continue simplifying the frontend/backend repository structure

## License

License information should be added here once the project license is finalized.
