# AGENTS.md — SkillForge Engineering Rules

This file is the permanent engineering contract for this repository. It is
read at the start of every working session, before any repository-wide
re-reading, along with:

- `docs/PROJECT_STATE.md`
- `docs/PRODUCTION_PLAN.md`

## 1. Project Overview (evidence-based)

SkillForge is a microlearning platform. Repository evidence:

- Root: `G:\Projects\SkillForge\skillforge` (this is the git worktree root).
- Single git commit: `e99fe3d Initial commit: SkillForge project with frontend & backend` on branch `main`.
- There is **no `.gitignore`** anywhere.
- Top-level layout: `frontend/`, `skillforge-backend/`, `docker-compose.yml`,
  `nginx.conf`, `docker-setup.ps1`, `public/`, `scripts/`, `dist/` (tracked build
  output), `README.md`, `package.json`, `package-lock.json`.
- `dist/` (frontend) and `skillforge-backend/dist/` and
  `skillforge-backend/prisma/src/generated/` are **tracked in git** today.

## 2. Architecture (as built)

- Frontend (SPA) served by Nginx in Docker; backend exposed through the Nginx
  reverse proxy.
- `docker-compose.yml` runs: `postgres` (postgres:16-alpine), `redis`
  (redis:alpine), `backend` (Express), `frontend` (Nginx).
- Backend mounts: `GET /`, `/health`, `/auth*`, `/api/courses`, `/api/users`,
  `/api/lessons`, `/api/quizzes`, `/api/protected`.
- `nginx.conf` rewrites `/api/auth/*` -> `/auth/*` and proxies `^/(api|health)`
  to `backend:3001`.

Do not invent components or connections that the repository does not show.

## 3. Frontend Technology (evidence: `frontend/package.json`, `frontend/vite.config.ts`)

- React 18.2, React DOM 18.2, TypeScript ~5.3.3, Vite 5.4.
- Tailwind CSS 3.4, PostCSS, Autoprefixer.
- React Router DOM 6, TanStack Query 5, Zustand 5, axios, date-fns, framer-motion, lucide-react.
- PWA: `vite-plugin-pwa` 1.0 (generateSW, `injectRegister: 'auto'`, `registerType: 'prompt'`).
- Tests: Vitest 0.34 + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`), jsdom.
- Build script: `node scripts/create-pwa-icons.cjs && tsc -b && vite build`.
- Dev proxy in `vite.config.ts`: `/api` -> `http://localhost:3001`, `/auth` -> `http://localhost:3001`.

## 4. Backend Technology (evidence: `skillforge-backend/package.json`, `tsconfig.json`)

- Node/Express 4, TypeScript 5.x, CommonJS output to `dist/`.
- Prisma 6.7 (CLI) / @prisma/client 6.8.2, PostgreSQL.
- Auth: `jsonwebtoken` 9, `google-auth-library` 9, `bcrypt` 5.
- `cors`, `dotenv`, `axios`, `express-session` (only used in dead file
  `src/app.ts`), `ioredis` (declared; no production usage found).
- Entry point: `src/server.ts` (dev) / `dist/server.js` (start).
- Tests: Jest + ts-jest, config `jest.config.js`.
- Scripts include `prisma:generate`, `prisma:migrate`, `prisma:seed`, `migrate`.

## 5. Database Technology (evidence: `skillforge-backend/prisma/schema.prisma`, migrations)

- PostgreSQL via Prisma. Models: `User`, `Course`, `Lesson`, `Enrollment`,
  `LessonProgress`, `Quiz`, `Attempt`.
- One migration: `prisma/migrations/20250406214213_init/migration.sql`.
- Seed: `prisma/seed.ts` (instructor user + one course + three lessons).
- `datasource db.url` and `directUrl` both read `env("DATABASE_URL")`.

## 6. Development Commands

Frontend (`workdir: frontend`):

- `npm run dev` — Vite dev server on :3000
- `npm run build` — PWA icons + `tsc -b` + `vite build`
- `npm run preview` — serve the build
- `npm test` — Vitest (watch); use `npx vitest run` for one-shot

Backend (`workdir: skillforge-backend`):

- `npm run dev` — `ts-node-dev --require dotenv/config ... src/server.ts`
- `npm run build` — `tsc -p tsconfig.json`
- `npm start` — `node dist/server.js`
- `npm run prisma:generate` / `prisma:migrate` / `prisma:seed`
- `npm test` — Jest

Root: `docker compose up` (see Phase 10 plan; currently asserted broken).

## 7. Verification Commands (the standard gate set)

Run the smallest relevant subset, then the full set for a phase gate:

- Backend: `npx tsc --noEmit -p tsconfig.json` (build gate = `npm run build`)
- Frontend: `npx tsc --noEmit -p tsconfig.app.json` and `npx tsc --noEmit -p tsconfig.node.json`
- Lint: `npx eslint .` (frontend workdir)
- Tests: `npx vitest run` (frontend), `npx jest` (backend)
- Prisma: `npx prisma validate` (requires `DATABASE_URL` in env)
- Docker: `docker compose config --quiet` and targeted builds later
- Security: `npm audit` (report only — never `npm audit fix --force`)

## 8. Repository Conventions

- Prefer existing patterns over new ones; existing code is the source of truth.
- Keep dependencies already present; do not add libraries without a documented reason.
- Do not print or commit secrets, tokens, credentials, or their values.
- Environment variables already in use (evidence): local dev expects a backend
  `.env`; `DOCKER=true` skips dotenv. Names in use: `PORT`, `NODE_ENV`,
  `FRONTEND_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
  `GOOGLE_REDIRECT_URI`, `DATABASE_URL`, `REDIS_URL`, `POSTGRES_*`,
  `VITE_API_URL`. (A `GOOGLE_CALLBACK_URL` name also appears in docs/scripts —
  inconsistency to be resolved in Phase 5, not invented here.)

## 9. Phase System

Work is strictly phased. See `docs/PRODUCTION_PLAN.md`. The phase order is:

0. Bootstrap (done) -> 1 Security -> 2 Backend build/startup ->
3 Backend hardening -> 4 API contract -> 5 Auth/OAuth -> 6 Database/Prisma ->
7 Frontend correctness -> 8 PWA -> 9 Testing -> 10 Docker/Nginx ->
11 Dependency/security maintenance -> 12 End-to-end validation -> 13 Final review.

Do not change the order unless a documented blocker proves it impossible.

## 10. Anti-Hallucination Rules

Before every implementation decision answer:

- What file proves this?
- What existing code proves this?
- What command/test proves this?
- What API/schema/config proves this?

If evidence does not exist: STOP and ask. Do not invent missing design.

## 11. No-Future-Phase Rule

Never implement work belonging to a future phase. If you discover something
for a future phase, record it in `docs/PROJECT_STATE.md` under
"Discovered Issues — Future Phases" and do not fix it early.

## 12. Security Rules

- Never expose/print secrets: the only cookie set by live code is `oauth_state`
  (httpOnly only, no secure flag); JWT is stored in browser `localStorage` by
  the frontend — both are recorded issues for Phase 5/Phase 1, not to be
  repeated.
- No hardcoded secrets in new code; load all credentials from environment.
- Treat any secret that ever appeared in a file or log as compromised once rotated.

## 13. No-Secret-Output Rule

Never print secret values in terminal output, reports, commits, comments, or
documentation. Report only the file path and the type of secret.

## 14. No Destructive Git Operations

Forbidden: `git reset --hard`, force push, history rewriting, deleting
branches to hide mistakes. Never modify Git history as part of normal work.
Commit only when instructed.

## 15. No Fake Test Rule

Do not write fake or trivial tests to make CI pass. Backend
`src/routes/__tests__/auth.test.ts` currently contains no assertions — this is
a recorded defect for Phase 9, not a template to copy.

## 16. Evidence-Before-Change Rule

Read the current file before editing it. Identify all references before
deleting anything. Keep changes minimal and scoped. Do not silently change
behavior unrelated to the current phase.

## 17. Evidence-Before-Success Rule

Never report success without actual command output. When a command fails,
treat the failure as real evidence and investigate it. Never skip
TypeScript/lint/tests/builds/security checks to get a green result. Never
modify a Dockerfile or build script to ignore errors instead of fixing the
underlying issue. Do not claim production readiness before Phase 13 is
verified.

## 18. Context-Reading Rule

Do not re-read the whole repository every session. At session start read only:
`AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/PRODUCTION_PLAN.md`, then inspect
only files relevant to the current phase. Do not read `node_modules`,
generated output, build output, or lock files unless relevant.