# SkillForge Release Checklist

Controlled-release procedure for the Dockerized SkillForge stack
(frontend → Nginx → backend → PostgreSQL). Only commands and procedures
supported by the actual repository are listed. All values below are
placeholders — never commit real secrets.

## Prerequisites

- Docker Engine + `docker compose` v2 (verified with Desktop 4.46.0 / Engine 28.4.0).
- Environment variables supplied EXTERNALLY (shell env or a gitignored root
  `.env`; see `.env.example` for names — placeholders only):
  - `JWT_SECRET` — REQUIRED. The backend fails fast at startup without it in
    production (ADR-001). Generate a long random value per environment.
  - `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` — defaults exist
    for local dev only; set real values for anything beyond local.
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` —
    required ONLY if Google login is enabled. Without them the app runs with
    email authentication; the OAuth start route still responds and the
    callback safely rejects (`invalid_state`/`missing_code`). A live provider
    exchange was never executed here — perform one with real credentials
    before advertising Google login.
- Ports 80 (frontend), 3001 (backend), 5432 (postgres), 6379 (redis) are
  published on the host by `docker-compose.yml` as local-dev convenience.
  For non-local deployments, scope or firewall these (especially 5432/6379).
- Previously committed credential material (initial git history) must be
  rotated externally (Google OAuth secret, JWT/session secret kinds) and
  never reused — history is kept as-is by policy.

## Build

```powershell
docker compose config --quiet   # must exit 0 with no warnings
docker compose build            # backend: npm ci + prisma generate + tsc; frontend: icons + tsc -b + vite build
```

Both builds must succeed with no bypasses (no `sed`, no `|| true`, real
`tsc`). The frontend build precaches ~41 entries with no glob warnings.

## Database

- Fresh database: `docker compose down -v` (project-scoped volumes ONLY —
  never touch other projects' volumes), then `docker compose up -d`.
  Freshness is established by volume removal, not by assumption.
- Migrations run automatically at backend startup:
  `npx prisma generate && npx prisma migrate deploy && node dist/server.js`.
  Expect both migrations in order (`20250406214213_init`,
  `20260924000000_add_lookup_indexes`); follow-ups must report
  "No pending migrations to apply".
- Seed policy: NEVER run `npm run prisma:seed` against a production-like
  database. The seed carries a weak dev-only instructor password and demo
  content. Seed is idempotent (safe to run twice in dev), but production
  data must come from real user flows.
- Back up `postgres-data` before any manual database operation.

## Runtime

- `docker compose ps` — postgres healthy, backend healthy (its healthcheck
  hits the DB-checking `GET /health`), frontend up.
- `GET /` → 200 SPA shell; `GET /health` → 200 `{"status":"healthy",...}`.
- API proxy through Nginx (`:80`): `GET /api/courses` → 200;
  `GET /api/auth/me` without token → 401.
- SPA fallback: `GET /courses` → 200 (not 404).
- OAuth routing: `GET /auth/google/callback` (no state) → 302 to
  `/auth/callback?error=invalid_state`; `/auth/callback` serves the SPA.
  In SW-controlled browsers the service worker lets `/auth/google*`
  through to the network (denylist in `vite.config.ts`) — do not remove it.
- Authenticated flow: register → login → `/api/auth/me` → enroll → progress
  → logout; anon `/dashboard` redirects to `/login`.
- PWA: `/manifest.webmanifest`, `/sw.js`, `/icons/*.png` all 200; exactly
  one SW registration path (`useRegisterSW` in `PWAUpdatePrompt`).

## Security

- Confirm no secret values in `docker compose config` output, container
  logs (backend logs presence-only: `Set`/`Not set`), or committed files.
- Confirm `JWT_SECRET` is non-empty in the backend environment.
- Review the current `npm audit` summary (frontend + backend, full and
  `--omit=dev`). Remaining findings as of Phase 11 require major upgrades
  (vitest, bcrypt/tar chain, react-router v7, eslint 9, gaxios/uuid) or are
  unreachable dev/build/install-time issues — see `docs/PROJECT_STATE.md`
  Phase 11 classification. Do not `npm audit fix --force`.
- Known gaps (no silent fix; see project state): no rate limiting, no CSP
  (blocked by the inline-script OAuth page), JWT in `localStorage` by
  decision (ADR-004), 7-day JWT expiry as contracted.

## Rollback

- Stop everything: `docker compose down` (keeps volumes/DB).
- Full reset to clean slate: `docker compose down -v` (DELETES the database
  — back up first; project volumes only).
- Roll back code with `git revert <commit>` (never rewrite history); then
  `docker compose build` + `docker compose up -d`.
- Database migrations are forward-only (`migrate deploy`); there is no
  down-migration path — restore from backup if a migration must be undone.
- Rotating `JWT_SECRET` invalidates all existing sessions (users re-login;
  no data impact).
