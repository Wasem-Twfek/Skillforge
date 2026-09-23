# DECISIONS.md — SkillForge Architecture Decision Log

Only decisions supported by the existing repository or explicitly decided
during the project belong here. During Phase 0 no new decisions were made;
this file records observed, evidence-backed conventions so future changes
stay aligned with the repository.

## Observed Conventions (evidence-backed, recorded during Phase 0)

- **Repo/tooling root**: git worktree root is `skillforge/` (branch `main`,
  single commit `e99fe3d`). No `.gitignore` exists.
- **Frontend SPA on Vite** (`frontend/package.json`, `frontend/vite.config.ts`):
  React 18, React Router 6, TanStack Query 5, Zustand 5, axios, Tailwind 3,
  `vite-plugin-pwa` (generateSW, prompt). Dev server on :3000 with `/api` and
  `/auth` proxied to `http://localhost:3001`.
- **Backend on Express + Prisma** (`skillforge-backend/package.json`,
  `src/server.ts`): routes mounted at `/`, `/health`, `/auth`, `/api/courses`,
  `/api/users`, `/api/lessons`, `/api/quizzes`; JWT auth via `authenticate`
  middleware; Prisma singleton pattern in `src/lib/prisma.ts`.
- **Docker topology** (`docker-compose.yml`, `nginx.conf`): Nginx serves the
  SPA and proxies `^/(api|health)` and rewrites `/api/auth/*` to `/auth/*`;
  backend command runs `prisma generate && prisma migrate deploy`; frontend
  build sets `VITE_API_URL=/api`.
- **Environment handling**: `DOCKER=true` skips dotenv; otherwise dev loads
  `skillforge-backend/.env`. Env names in use today include `PORT`,
  `NODE_ENV`, `FRONTEND_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `DATABASE_URL`, `REDIS_URL`,
  `POSTGRES_*`, `VITE_API_URL`. A `GOOGLE_CALLBACK_URL` name also appears in
  scripts/docs — the naming decision is deferred to Phase 5.
- **Frontend token storage**: JWT kept in `localStorage` and attached via an
  axios request interceptor (observed; security treatment deferred to
  Phase 1/5 decisions).

## Open decision items (will be decided and recorded before implementation)

| # | Topic | Phase | Status |
|---|---|---|---|
| D-001 | Redirect-URI env var name: unify `GOOGLE_REDIRECT_URI` vs `GOOGLE_CALLBACK_URL` | 5 | open |
| D-002 | OAuth CSRF state strategy (CSPRNG + verified cookie) | 5 | open |
| D-003 | JWT/token storage strategy if Phase 1 evidence requires change | 1/5 | open |
| D-004 | Redis: keep declared-but-unused, use it, or remove from compose/docs | 3 | open |
| D-005 | `/api/auth/*` prefix convention (nginx rewrite vs backend-mounted routes) | 4 | open |
| D-006 | Frontend/backend response-shape alignment for lessons/quizzes | 4/7 | open |
| D-007 | Dependency major-upgrade policy (vite/vitest/prisma/express majors) | 11 | open |
| D-008 | Seed idempotency approach (upsert pattern exists for instructor) | 6 | open |

## ADR format (use for every decision made during the project)

## ADR-001 (2026-09-23) — No hardcoded secret fallbacks; fail fast in production
Status: Accepted
Context: Phase 0 proved the backend ran with hardcoded credential defaults
(`src/server.ts` JWT fallback; compose `JWT_SECRET` default; hardcoded values
in tracked `skillforge-backend/dist/config/config.js`) and published credential
kinds in `README.md`, so production could silently run on dev secrets.
Decision: Production secrets come only from environment/configuration. The
server throws at startup when `JWT_SECRET` is missing under
`NODE_ENV=production` (warns otherwise); compose provides no `JWT_SECRET`
default; `.env.example` files carry placeholders only; build output and
generated Prisma clients stay untracked via `.gitignore`.
Consequences: Deploys without `JWT_SECRET` fail loudly instead of running
insecure; local dev must copy `.env.example` to `.env`. Previously committed
credential material is treated as compromised and must be rotated externally;
history is not rewritten.
Evidence: `skillforge-backend/src/server.ts`, `docker-compose.yml`,
`.gitignore`, `.env.example`, `skillforge-backend/.env.example`,
`docs/PROJECT_STATE.md` Phase 1 verification (tracked secret-kind scans clean;
reviewer PASS).

When a decision is made, append an entry:

```
## ADR-#### (Date) — <Title>
Status: Accepted | Superseded
Context: (evidence from the repository that motivates this decision)
Decision: (what was decided)
Consequences: (what this enables / what it requires not doing)
Evidence: (files/commands that prove the decision is consistent)
```