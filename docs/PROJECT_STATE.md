# PROJECT_STATE.md — SkillForge Persistent State

CURRENT_PHASE: 2 (Backend build and startup)
CURRENT_STATUS: PHASE 2 COMPLETE — reviewer PASS; STOP, do not start Phase 3 without explicit instruction
LAST_VERIFIED: 2026-09-23
LAST_COMMIT: (Phase 2 closure commit) "Fix backend configuration and build startup"

---

## Current Phase

Phase 2 — Backend build and startup. Make the backend compile, generate Prisma
correctly, build, and start from `src/`. No architectural/contract redesign.

## Current Objective

Per `docs/PRODUCTION_PLAN.md` Phase 2: resolve the confirmed TS2307 build
blocker with the smallest evidence-backed change, verify Prisma generation,
prove local startup (`node dist/server.js` + `npm run dev`) serves `/` and
`/health`, validate the Docker backend path as far as the environment permits.
Then STOP and await approval for Phase 3.

## Completed Work (Phase 2)

- Root cause (verified, not assumed): `src/config/config.ts` was never
  committed — `src/config/` held only `checkenv.ts` — while three modules
  import `{ config }` from `../config/config`. The only prior artifact was a
  stale compiled `dist/config/config.js` (untracked in Phase 1).
- Created `skillforge-backend/src/config/config.ts`: env-backed `config`
  object with exactly the keys proven by callers and the old module shape
  (`PORT`, `NODE_ENV`, `FRONTEND_URL`, `JWT_SECRET`, `DATABASE_URL`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`).
  Zero hardcoded secrets; non-secret defaults mirror `src/server.ts`;
  credentials default to `''`; production throws on missing `JWT_SECRET`
  (ADR-001, same rule as `server.ts`); no value logging. No new env vars
  invented (`GOOGLE_CALLBACK_URL` inconsistency left for Phase 5).
- Refreshed Prisma client via the repo's own `npm run prisma:generate`
  (v6.7.0, node_modules output). No schema/generator change.
- `npm run build` now exits 0. `node dist/server.js` boots and stays alive:
  `GET /` → 200 (API doc), `GET /health` → 500 `unhealthy` with no PostgreSQL
  running (graceful DB-down path, allowed: any DB state). `npm run dev` smoke:
  `GET /` → 200. Ephemeral dummy values used in command env only; nothing
  committed; no secrets printed.
- Dockerfile untouched (already `prisma generate` → `npm run build`, no
  bypasses). `docker compose build backend` could not run: Docker Desktop
  engine pipe unavailable in this environment; `docker compose config --quiet`
  still passes. Full container boot deferred to Phase 10 (owns Docker).
- No other files modified. `git diff --check` clean.

## Completed Work (Phase 1 — historical record, reviewer PASS 2026-09-23)

- Created `.gitignore` (ignores `dist/`, `**/dist/`, `.env`/`**/.env`,
  `skillforge-backend/prisma/src/generated/`, `node_modules/`, coverage/logs;
  keeps `!.env.example` tracked).
- Created `.env.example` (root, compose-oriented) and
  `skillforge-backend/.env.example` (backend dev) — placeholders only, using
  only env names proven in `AGENTS.md` §8. No new canonical vars invented.
- `README.md`: replaced the published credential block (Google OAuth
  credential kinds, JWT/session placeholder kinds) with placeholders pointing
  at `.env.example`, plus a rotation warning.
- `skillforge-backend/src/server.ts`: removed hardcoded `JWT_SECRET` fallback;
  production fails fast when `JWT_SECRET` is missing; dev warns without a
  baked-in secret. Startup log is presence-only (`Set`/`Not set`). Debug
  middleware now logs method+URL only (no headers/user objects).
- `skillforge-backend/src/middleware/auth.ts`: removed header/token-fragment/
  decoded-token/user logging; catch logs message text only.
- `skillforge-backend/src/routes/auth.ts`: removed credential-config log,
  callback-param/token-exchange-param/header/token-fragment/decoded/user logs
  and the redirect-URL-with-token log; OAuth catch-all no longer echoes
  internal error text into the redirect URL; remaining errors log message text
  only. No route/flow logic changed.
- `skillforge-backend/src/routes/courses.ts`: removed request-header/user
  logging on `GET /user` (same sensitive-logging class as the Phase 1 set).
- `skillforge-backend/src/routes/users.ts`: `POST /` now hashes the password
  with the existing `bcrypt` dependency (cost 10) and validates required
  fields. Previously stored plaintext.
- `skillforge-backend/src/config/checkenv.ts`,
  `src/scripts/check-env.ts`, `src/scripts/check-oauth-config.ts`,
  `src/scripts/start-auth-test.ts`: presence/structure-only logging (never
  values, no full OAuth URLs, no client-ID prefixes).
- `docker-compose.yml`: removed the insecure `JWT_SECRET` default; empty value
  plus backend fail-fast instead. `POSTGRES_*` dev defaults kept as
  local-dev convenience with an override comment (no compose redesign).
- Untracked via `git rm --cached` (no history rewrite, no force-push):
  `dist/`, `skillforge-backend/dist/` (including the hardcoded-config
  compiled file kind), `skillforge-backend/prisma/src/generated/`. Working-tree
  files remain on disk, now gitignored, until Phase 2 rebuilds.
- Phase 0 control files (`AGENTS.md`, `docs/*`, `.opencode/agents/reviewer.md`)
  committed together with this phase (they were untracked since bootstrap).

## Current Blockers

1. RESOLVED in Phase 2 (reviewer PASS 2026-09-23): backend TS2307 x3 fixed by
   new `src/config/config.ts`; `npm run build` exits 0; `node dist/server.js`
   and `npm run dev` boot and serve `/` (200) with graceful DB-down `/health`.
2. RESOLVED in Phase 2 as far as code is concerned: backend Docker build
   failure was the same TS2307 — `npm run build` now passes and the Dockerfile
   (`prisma generate` → `npm run build`, no bypasses) is valid by inspection;
   image build + container boot could not run here (no Docker engine) and full
   container verification belongs to Phase 10.
3. Frontend typecheck fails: `src/hooks/useOptimizedQuery.ts:32` (TS6133),
   `:85` (TS2352). -> Phase 7.
4. Frontend lint fails: 704 problems; majority are false-positive
   `react/react-in-jsx-scope` under the react-jsx runtime. -> Phase 7.
5. Frontend tests: 2 files failed / 6 tests failed / 9 passed. -> Phase 9.
6. Docker OAuth callback path is not proxied in `nginx.conf` (`/auth/*` falls
   into the SPA `location /`). -> Phase 5 / Phase 10.
7. Production API double prefix `/api/api/*` (Vite `VITE_API_URL=/api` in
   Docker build + services calling `/api/...`). -> Phase 4.
8. Phase 0 security findings — RESOLVED in Phase 1 (reviewer PASS 2026-09-23):
   tracked credential block in `README.md` replaced with placeholders;
   `skillforge-backend/dist/config/config.js` untracked from the index (staged
   deletion, history kept); `.gitignore` + both `.env.example` files created;
   hardcoded `JWT_SECRET` fallback removed with production fail-fast;
   plaintext password path in `src/routes/users.ts` now bcrypt-hashed;
   header/token/credential logging removed (server/middleware/auth/courses/
   checkenv/scripts). Remaining history exposure needs external rotation
   (see Risks). Weak `oauth_state` + unverified state + missing `secure` flag
   intentionally left for Phase 5.

## Verified Commands (Phase 2, actual output)

| Command (workdir) | Result |
|---|---|
| `git status --short` | only `?? skillforge-backend/src/config/config.ts` (then this file's own update); `git diff --check` clean |
| `npx tsc --noEmit -p tsconfig.json` (skillforge-backend) | PASS — exit 0 (was FAIL TS2307 x3 in Phase 0/1 baseline) |
| `npm run build` (skillforge-backend) | PASS — exit 0 |
| `npm run prisma:generate` (skillforge-backend) | PASS — Prisma Client v6.7.0 to `node_modules/@prisma/client` (one upstream generator-output-path deprecation warning, untouched — future-phase owned) |
| `npx prisma validate` with `DATABASE_URL` set | PASS — schema valid |
| `node dist/server.js` boot (ephemeral test env, :3001) | process stays alive, Prisma initialized; `GET /` → 200 API-doc JSON; `GET /health` → 500 `unhealthy` (no PostgreSQL running — graceful DB-down path, allowed) |
| `npm run dev` boot smoke (:3002) | `GET /` → 200 |
| `npx jest` (skillforge-backend) | PASS — 1 suite, 1 test (placeholder, unchanged, no test files touched) |
| `docker compose config --quiet` (root) | PASS — only obsolete `version:` warning (unchanged) |
| `docker compose build backend` | NOT RUN — no Docker engine in this environment (client-only connect error); Dockerfile valid by inspection, full image/container verification belongs to Phase 10 |
| secret/value logging check | no `console.*` in new `config.ts`; startup logs presence-only; ephemeral dummy test values in command env only, never committed |
| Reviewer (`general` subagent per `.opencode/agents/reviewer.md`) | PASS (evidence recorded in session; tsc/jest/validate re-verified by reviewer) |

## Verified Commands (Phase 1, actual output — historical record)

| Command (workdir) | Result |
|---|---|
| `git status --short` | `M README.md` + 11 unstaged src/compose files; staged `D` x105 (`dist/`, `skillforge-backend/dist/`, `.../prisma/src/generated/`); `??` only `.gitignore`, `.env.example`, `skillforge-backend/.env.example`, `.opencode/`, `AGENTS.md`, `docs/` (`node_modules` now ignored) |
| `git grep -l -i -E "GOCSPX-|your-secure-jwt-secret|your_jwt_secret"` (tracked) | no matches (GOOD) |
| `git grep -l -E "apps\.googleusercontent\.com"` (tracked) | no matches (GOOD) |
| added-lines-only diff scan for the above kinds | no matches (GOOD) |
| `git grep -n -E "console\.(log\|warn\|error).*(header\|token\|Authorization\|client_id\|client_secret\|GOOGLE_CLIENT)"` (server/middleware/auth/courses/checkenv) | only 3 generic no-value messages (GOOD) |
| `git check-ignore` (`skillforge-backend/dist/...`, `dist/...`, `skillforge-backend/.env`) | all ignored via `.gitignore` (GOOD) |
| `npx tsc --noEmit -p tsconfig.json` (skillforge-backend) | FAIL — same TS2307 `../config/config` x3, exit 2 (unchanged baseline, Phase 2 blocker, acceptable) |
| `npx jest` (skillforge-backend) | PASS — 1 suite, 1 test (placeholder, unchanged) |
| `docker compose config --quiet` (root) | PASS (exit 0) — only obsolete `version:` warning (unchanged) |
| Reviewer (`general` subagent per `.opencode/agents/reviewer.md`) | PASS (evidence recorded in session) |

Phase 0 baseline carried forward (not re-run in Phase 1): frontend
`tsc`/`eslint`/`vitest` failures, `prisma validate` PASS, `npm audit` counts,
`vite build` workbox warning — all unchanged, owned by later phases.
Full Phase 0 baseline table (historical record):

| Command (workdir) | Phase 0 result |
|---|---|
| `git branch --show-current` | main |
| `git log --oneline -10` | `e99fe3d Initial commit...` (single commit) |
| `npx tsc --noEmit -p tsconfig.app.json` (frontend) | FAIL — `useOptimizedQuery.ts:32,85`, exit 1 |
| `npx eslint . --format compact` (frontend) | FAIL — 704 problems |
| `npx vitest run` (frontend) | FAIL — 2 test files / 6 tests failed, 9 passed |
| `npx prisma validate` with `DATABASE_URL` set | PASS — schema valid (exit 0) |

Recorded but not re-run in this session (same environment, prior evidence):
- `npm audit` frontend: 37 vulnerabilities (3 low, 6 moderate, 26 high,
  2 critical). Backend: 22 (4 low, 5 moderate, 11 high, 2 critical). — Phase 11.
- `npx vite build --outDir <temp>` succeeded; workbox warning: precache glob
  (`globDirectory: './dist'` vs actual `outDir: '../dist'`) matched nothing. — Phase 8.
- `node dist/server.js` failed at startup (Prisma not generated). — Phase 2.

## Files Changed in Current Phase (Phase 2)

New: `skillforge-backend/src/config/config.ts` (only implementation file).
Updated: `docs/PROJECT_STATE.md` (this file). No other files modified or
renamed. `DECISIONS.md` unchanged (no new decision — module shape dictated by
existing callers; fail-fast already ADR-001).

Phase 1 file record (historical): new `.gitignore`, `.env.example`,
`skillforge-backend/.env.example`; modified `README.md`, `docker-compose.yml`,
`skillforge-backend/src/server.ts`, `src/middleware/auth.ts`,
`src/routes/auth.ts`, `src/routes/courses.ts`, `src/routes/users.ts`,
`src/config/checkenv.ts`, `src/scripts/check-env.ts`,
`src/scripts/check-oauth-config.ts`, `src/scripts/start-auth-test.ts`,
`docs/PROJECT_STATE.md`, `docs/DECISIONS.md`.
Staged deletions (untracked, history kept): `dist/`,
`skillforge-backend/dist/`, `skillforge-backend/prisma/src/generated/`
(105 files).
Committed Phase 0 control files (were untracked since bootstrap): `AGENTS.md`,
`docs/PRODUCTION_PLAN.md`, `.opencode/agents/reviewer.md` (plus this file).

## Discovered Issues — Future Phases

Recorded for later phases; do not fix early.

- Phase 1 (residual, verified 2026-09-23 — all in-index instances resolved):
  historical credential material remains in git history (`e99fe3d`) and
  requires EXTERNAL rotation (Google OAuth client secret, JWT/session secrets);
  history is NOT rewritten per policy. Working-tree `dist/` was rebuilt from
  source by `npm run build` in Phase 2 (still gitignored). Weak `oauth_state`
  (`Math.random()`), unverified state, missing `secure` flag, and JWT
  `localStorage` handling intentionally deferred to Phase 5.
- Phase 2 (residual): no Docker engine in this environment, so image build +
  container boot are unverified here; Dockerfile is valid by inspection
  (`prisma generate` → `npm run build`, no bypasses). Full container
  verification belongs to Phase 10. Upstream Prisma generator output-path
  deprecation warning left untouched (no schema/generator changes in Phase 2).
- Phase 3: 5 PrismaClient instances; no helmet/rate-limit/body-size;
  no transactions on enroll/progress; duplicate `/health` (`server.ts:123`);
  dead `src/app.ts` and `src/routes/lessonRoutes.js`; Redis declared but unused.
- Phase 4: `/api/auth/*` contract exists only in frontend `hooks/useAuth.ts`
  and nginx rewrite; no backend paths; `AuthContext.tsx` PUT `/api/users/profile`
  has no backend route; dev vs prod proxy behavior differs.
- Phase 5: `GOOGLE_REDIRECT_URI` (server/compose) vs `GOOGLE_CALLBACK_URL`
  (docs/scripts/checkenv.ts); OAuth callback redirect vs nginx SPA catch-all;
  README-referenced `/auth/test-google` and `/auth/debug-page` do not exist.
- Phase 6: seed `course.create` (not upsert) can duplicate; no `@@index` on
  `Lesson.order`, `LessonProgress.enrollmentId`; progress math can produce NaN;
  committed generated Prisma client (`.so`/`.dll`) bloats repo.
- Phase 7: frontend type/lint failures; dead components/pages list; `/courses`
  renders lessons; `LessonDetail` gates on token; two theme stores; SDK v5
  `@types/react-router-dom` stub; undeclared `VITE_API_URL`/`VITE_ENABLE_PERFORMANCE_MONITORING`.
- Phase 8: placeholder text PNG icons in `frontend/Dockerfile`; missing
  root `apple-touch-icon.png`/`masked-icon.svg`; manifest screenshots mismatch;
  triple SW registration + two update prompts; empty workbox precache.
- Phase 9: broken/outdated Navbar & Features tests; backend `auth.test.ts` has
  no assertions; jest 70% coverage thresholds unachievable.
- Phase 10: `docker-setup.ps1` references missing `.env.example`; deprecated
  `docker-compose`; compose `version:` obsolete; backend image/container boot
  still unverified (no engine here; code-side build blocker resolved in
  Phase 2).
- Phase 11: `npm audit` findings above; dependency-outdated list recorded in
  prior audit (axios, prisma, vite, vitest, express, etc.) — upgrade only in
  this phase, coordinated.

## Decisions Already Made

See `docs/DECISIONS.md`. Phase 0 recorded evidence-based observations only.
Phase 1 added one security decision: ADR-001 (no hardcoded secret fallbacks;
production fail-fast on missing `JWT_SECRET`).

## Risks

- SECURITY FOLLOW-UP (external action required): credential material from the
  initial commit `e99fe3d` remains in git history by policy (no rewrite in this
  phase). The Google OAuth client secret, JWT secret, and session secret kinds
  previously committed MUST be rotated/revoked in Google Cloud Console and all
  deployment environments. New values must only ever live in environment/
  `.env` (gitignored), never in docs or code.
- Seed `prisma/seed.ts` still contains a weak demo password (dev-only,
  bcrypt-hashed at seed time; seed flow owned by Phase 6) — change before any
  prod-like use.
- Single-commit history means there is no clean-after baseline; git history is
  not to be rewritten.
- Director-level phased work requires discipline: reviewers must confirm phase
  gates before any forward movement.
- Node version in this environment is v22.x while package manifests list
  engines/ranges for older toolchains — verification output reflects the
  inspected environment, not a CI matrix.

## Next Allowed Action

Phase 2 gate PASSED (reviewer PASS 2026-09-23). STOP. Await explicit
instruction to begin Phase 3 (Backend architecture and hardening). Do not
start Phase 3 automatically.