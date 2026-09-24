# SkillForge

[![CI](https://github.com/wasem15/Skillforge/actions/workflows/ci.yml/badge.svg)](https://github.com/wasem15/Skillforge/actions/workflows/ci.yml)
[![Security](https://github.com/wasem15/Skillforge/actions/workflows/security.yml/badge.svg)](https://github.com/wasem15/Skillforge/actions/workflows/security.yml)

SkillForge is a full-stack microlearning platform for short, focused learning sessions. It brings course browsing, lessons, enrollment, progress tracking, quizzes, authentication, PWA support, and Docker deployment into one application.

## Features

- Course and lesson browsing
- Email/password authentication with JWT
- Google OAuth integration
- Course enrollment and progress tracking
- Lesson quizzes and attempts
- Responsive React interface
- Progressive Web App support
- PostgreSQL persistence with Prisma
- Docker Compose deployment with Nginx

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| Authentication | JWT, Google OAuth |
| Testing | Vitest, Testing Library, Jest |
| Infrastructure | Docker, Docker Compose, Nginx |
| PWA | vite-plugin-pwa |

## Project structure

Skillforge/
├── frontend/              React application
├── skillforge-backend/    Express API and Prisma schema
├── docker-compose.yml     Local multi-service environment
└── nginx.conf             Reverse proxy and SPA routing

## Run locally

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ or Docker

### Install dependencies

    cd frontend
    npm ci

    cd ../skillforge-backend
    npm ci

Create the local environment files from the provided .env.example files and set your local values.

### Database

    cd skillforge-backend
    npm run prisma:generate
    npm run prisma:migrate

### Start the application

Backend:

    cd skillforge-backend
    npm run dev

Frontend:

    cd frontend
    npm run dev

The Vite development server uses http://localhost:3000.

## Docker

Start the full local stack with:

    docker compose up --build

The default entry point is http://localhost.

Use deployment-managed secrets in production. Do not run the development seed against a production database.

## Testing

Frontend:

    cd frontend
    npm run lint
    npm test
    npm run test:coverage
    npm run build

Backend:

    cd skillforge-backend
    npm test
    npm run build

## Security

Keep .env files out of version control and supply secrets through the environment or a secret manager. Previously exposed credentials should be rotated or revoked before reuse.

See SECURITY.md for the reporting process.

## Project notes

Google OAuth is implemented in the application, but the external provider exchange was not live-tested during the final local validation because provider credentials were unavailable.

The landing page uses sample course data for presentation. The main learning flows use the backend API.