# SkillForge

[![CI](https://github.com/wasem15/Skillforge/actions/workflows/ci.yml/badge.svg)](https://github.com/wasem15/Skillforge/actions/workflows/ci.yml)
[![Security](https://github.com/wasem15/Skillforge/actions/workflows/security.yml/badge.svg)](https://github.com/wasem15/Skillforge/actions/workflows/security.yml)

SkillForge is a microlearning web app for short lessons, course enrollment, progress tracking, and quizzes. The frontend is built with React and TypeScript, with an Express API and PostgreSQL database behind it.

## What is included

- Course and lesson browsing
- Email/password authentication with JWT
- Google OAuth flow
- Course enrollment and progress tracking
- Lesson quizzes and attempts
- Responsive UI with dark mode
- PWA support
- PostgreSQL with Prisma
- Docker Compose and Nginx
- Frontend and backend automated tests

## Stack

| Part | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| Authentication | JWT, Google OAuth |
| Testing | Vitest, Testing Library, Jest |
| Deployment | Docker, Docker Compose, Nginx |
| PWA | vite-plugin-pwa |

## Repository layout

```text
Skillforge/
├── frontend/                 # React application
├── skillforge-backend/       # Express API and Prisma schema
├── docker-compose.yml        # Local multi-service stack
├── nginx.conf                # Reverse proxy configuration
└── docker-setup.ps1          # Windows Docker setup helper
```

## Run locally

### Requirements

- Node.js 20+
- npm
- PostgreSQL 16+, or Docker

### Install

```bash
cd frontend
npm ci

cd ../skillforge-backend
npm ci
```

Create the local `.env` files from the provided `.env.example` files and fill in your own values.

### Database

```bash
cd skillforge-backend
npm run prisma:generate
npm run prisma:migrate
```

### Start the app

Backend:

```bash
cd skillforge-backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The development frontend runs on port 3000.

## Docker

For the full local stack:

```bash
docker compose up --build
```

Open http://localhost after the containers start.

The compose file is intended for local use. Use deployment-managed secrets and a production database configuration when deploying elsewhere. Do not run the development seed against a production database.

## Testing

Frontend:

```bash
cd frontend
npm run lint
npm test
npm run test:coverage
npm run build
```

Backend:

```bash
cd skillforge-backend
npm test
npm run build
```

## Notes

The home page contains sample course content for the public UI. Enrolled-course data, lesson progress, and quiz attempts are handled by the backend API.

The Google OAuth flow is implemented, but the external provider exchange was not live-tested during the final validation because provider credentials were not available.

## Security

Keep real credentials and local `.env` files out of Git. See [SECURITY.md](SECURITY.md) for reporting and deployment notes.
