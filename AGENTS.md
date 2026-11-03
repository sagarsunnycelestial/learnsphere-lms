# AGENTS.md

LearnSphere LMS: React 19/Vite client + Express 5/Apollo/TypeORM server. The root, `client/`, and `server/` are independent npm projects (no workspaces, three lockfiles/node_modules). Run `npm install` in each before running anything.

## Commands

Run from repo root unless noted:

- `npm test` — Jest unit tests for server controllers (`server/src/controllers/__tests__`); there is no client test suite. Single test: `npx jest server/src/controllers/__tests__/auth.test.ts`, or `npx jest -t "should login successfully"`.
- `npm run lint` — ESLint for both packages; per-directory flat configs are picked up automatically. `server` has no `lint` script.
- `npm run format` / `npm run format:check` — Prettier; `client/src/generated` is excluded.
- `cd server && npm run dev` — `tsx watch`; `start` runs without watch. There is no server build step, and `server`'s own `npm test` is a failing stub.
- `cd client && npm run dev` — Vite. `npm run build` (`tsc -b && vite build`) is the client typecheck gate; `tsconfig.app.json` fails on unused locals/params and on non-erasable syntax (no TS `enum`; use `as const` objects like `UserRoles`).
- Server typecheck: `npx tsc --noEmit -p server/tsconfig.json` (tests are excluded).
- Migrations from `server/`: `npm run migration:run|revert|generate`. Generate hardcodes the `InitialSchema` name (TypeORM prepends a timestamp); `synchronize: false`.
- Husky pre-commit runs root `npm test`. There is no CI workflow.

Run server commands from `server/` — `dotenv/config`, `logs/`, and migration `--env-file` are all relative to that directory.

## Repo-specific rules

- ESLint errors on every code comment (`no-comments/disallowComments`) and on `any` in both packages. Do not add comments or JSDoc; the auth test uses a top-level `/* eslint-disable */` as its escape hatch. Prettier: 80 cols, single quotes, semicolons.
- Server is ESM (`"type": "module"`, NodeNext): relative imports from `.ts` files must end in `.js` (e.g. `./config/dbConfig.js`). Root tooling is CommonJS. Client uses bundler resolution and may import `.ts`/extensionless.
- GraphQL is SDL-first. The schema string lives in `server/src/graphql/typeDefs.ts`; `resolvers.ts` only checks auth/role and delegates to `server/src/controllers/*.controller.ts`. Controllers throw `GraphQLError`s and are wrapped with `withErrorHandling(fn, fallbackMessage)` instead of try/catch.
- Server data access goes through the repositories exported from `server/src/entities/repos.ts` (bound to `AppDataSource` at import); controllers import them directly.
- Client routing uses React Router v8 imported from `react-router`; `react-router-dom` is not installed.
- Adding/changing an operation touches: `typeDefs.ts` → `resolvers.ts` → controller → `client/src/graphql/{queries,mutations}` → codegen. Codegen is not an npm script: with the server running on port 3000, run `cd client && npx graphql-codegen --config codegen.yml`. `client/src/generated/` is committed.
- Client fetch pattern: TanStack Query hooks call `apolloClient.query({ query: *Document, variables })` with generated documents (see `client/src/hooks/useFetchCourses.ts`); Apollo cache and Redux coexist, with `authSlice` holding the access token used by `SetContextLink`.
- RBAC is enforced twice: `client/src/permissions/auth.ts` only gates UI; server resolvers must check `context.user.role` themselves. Instructor course/quiz ownership scoping lives in controllers.
- Env is Zod-validated in `server/src/config/env.ts` and fails at startup. The README env list is stale: Firebase `FB_*` vars are required, and the DB actually connects via `SUPABASE_DB_URL` even though `DB_*` are also required. Client needs `VITE_SERVER_URL` in addition to the Supabase vars. Tests load `server/.env.test` via root `jest.setup.cjs` and mock repositories, so no DB is needed.
- CORS allows only `ALLOWED_ORIGIN1`, `ALLOWED_ORIGIN2`, or requests with no origin; add a new client origin there.
- Seed the first Admin and role rows directly in Postgres; there is no bootstrap endpoint (`registerUser` requires an existing Admin).

## Architecture notes

- Auth: 15-minute JWT access token (Redux, memory only), opaque refresh token HMAC-hashed in DB, httpOnly cookie, rotated by the `refreshEndpoint` query. `HomePage` calls `refreshEndpoint` on mount to restore a session; `ProtectedLayout` only checks the Redux access token. `logout` clears both; `googleLogin` verifies Firebase ID tokens server-side.
- Uploads go browser → Supabase `profiles` / `lessons-lms` buckets → backend stores only the `publicUrl`. PDFs (credentials, quiz certificates) are generated client-side.
