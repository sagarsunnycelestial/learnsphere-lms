# AGENTS.md

LearnSphere LMS: React 19/Vite client + Express 5/Apollo/TypeORM server. The root, `client/`, and `server/` are independent npm projects (no workspaces, three lockfiles/node_modules). Run `npm install` in each before running anything.

## Stack

- Client: React 19, TypeScript, Vite 8, MUI 9, Apollo Client 4, TanStack Query 5, Redux Toolkit, React Router 8 (`react-router`, not `react-router-dom`), Supabase JS, Firebase, Zod, pdf-lib.
- Server: Node, Express 5, Apollo Server 5, GraphQL 16 (SDL-first), TypeORM/Postgres (Supabase), JWT/bcrypt, Nodemailer, Winston, Firebase Admin, Zod.
- Tests: server Jest + ts-jest; client Vitest + jsdom + Testing Library.

## Commands

Run from the repo root unless noted.

- Install: `npm install`, then `npm --prefix client install`, then `npm --prefix server install`.
- All tests: `npm test` (server Jest, then client Vitest). Single server test: `npx jest server/src/controllers/auth.controller.test.ts`; by name: `npx jest -t "should login successfully"`.
- Single client test: `npm --prefix client run test -- src/validation/courseSchema.test.ts`; watch mode: `npm --prefix client run test:watch`.
- `npm run lint` — ESLint for both packages. `npm run format` / `npm run format:check` — Prettier; `client/src/generated` is excluded.
- Client build/typecheck: `npm --prefix client run build` (`tsc -b && vite build`). Tests are excluded from the production tsconfig.
- Server typecheck: `npx tsc --noEmit -p server/tsconfig.json` (tests are excluded).
- Dev servers: `cd server && npm run dev` (`tsx watch`); `cd client && npm run dev` (Vite).
- Migrations from `server/`: `npm run migration:run|revert|generate`. Generate hardcodes the `InitialSchema` name; `synchronize: false`.
- Codegen: with the server running on port 3000, `cd client && npx graphql-codegen --config codegen.yml`. It is not an npm script.
- Husky pre-commit runs root `npm test`. There is no CI workflow.

Run server commands from `server/` — `dotenv/config`, `logs/`, and migration `--env-file` are all relative to that directory.

## Conventions

- Colocate tests beside their source as `<module>.test.ts` / `<module>.test.tsx` — for example, `courses.controller.test.ts` next to `courses.controller.ts`. Do not create `__tests__` folders. Every controller, resolver, middleware, service, utility, hook, store slice/thunk, validation schema, and UI component/page with behavior gets a colocated test. Exempt: generated code, static GraphQL documents, type-only files, theme/assets, entities/migrations, and config wiring.
- Server is ESM (`"type": "module"`, NodeNext): relative imports from `.ts` files must end in `.js` (e.g. `./config/dbConfig.js`). Root tooling is CommonJS. Client uses bundler resolution and may import `.ts`/extensionless.
- GraphQL is SDL-first. The schema string lives in `server/src/graphql/typeDefs.ts`; `resolvers.ts` only checks auth/role and delegates to `server/src/controllers/*.controller.ts`. Controllers throw `GraphQLError`s and are wrapped with `withErrorHandling(fn, fallbackMessage)` instead of try/catch.
- Server data access goes through the repositories exported from `server/src/entities/repos.ts` (bound to `AppDataSource` at import); controllers import them directly.
- Client fetch pattern: TanStack Query hooks call `apolloClient.query({ query: *Document, variables })` with generated documents (see `client/src/hooks/useFetchCourses.ts`). Apollo cache and Redux coexist, with `authSlice` holding the access token used by `SetContextLink`.
- RBAC is enforced twice: `client/src/permissions/auth.ts` only gates UI; server resolvers must check `context.user.role` themselves. Instructor course/quiz ownership scoping lives in controllers.
- ESLint errors on every code comment (`no-comments/disallowComments`) and on `any` in both packages. Do not add comments or JSDoc to production code. Test files may start with `/* eslint-disable */` for `any` mocks, matching the existing test precedent. Prettier: 80 cols, single quotes, semicolons.
- Work on a branch other than `main`; do not commit directly to `main`.

## Boundaries

- Never hand-edit `client/src/generated/**`; regenerate it with codegen after changing `typeDefs.ts` or client operations.
- Do not query the database outside `server/src/entities/repos.ts`; no ad-hoc `AppDataSource.getRepository` calls in controllers.
- Server-side RBAC is authoritative. Client permission checks are UI-only and must not replace resolver/controller checks.
- Do not enable TypeORM `synchronize`; schema changes go through versioned migrations.
- Uploads go browser → Supabase `profiles` / `lessons-lms` buckets; the backend stores only the `publicUrl`.
- Never commit `.env` secrets. `server/.env.test` is committed for tests.

## Tests

- Server: root Jest, colocated `*.test.ts`, loads `server/.env.test` via `jest.setup.cjs`, mocks `entities/repos.js` and external services. No DB, network, or running server. `server`'s own `npm test` is a failing stub.
- Client: Vitest + jsdom, colocated `*.test.ts(x)`, explicit `describe`/`it`/`expect`/`vi` imports. Shared setup is `client/src/test/setup.ts`; provider helpers are in `client/src/test/render.tsx`. Mock `apolloClient`, hooks, Supabase, Firebase, and PDF calls; no server needed.
- Root Jest is scoped to `server/`. Never add client tests to Jest, and never add server tests to Vitest.
- Test files may use `/* eslint-disable */` for `any` mocks. Production files may not contain comments or `any`.
- Cover the exported wrapper's success and failure paths. Do not test generated code, static GraphQL documents, type-only files, entities, migrations, or config wiring.

## Notes

- Env is Zod-validated in `server/src/config/env.ts` and fails at startup. The README env list is stale: Firebase `FB_*` vars are required, and the DB connects via `SUPABASE_DB_URL` even though `DB_*` are also required. Client needs `VITE_SERVER_URL` in addition to Supabase and Firebase vars.
- Auth: 15-minute JWT access token (Redux, memory only), opaque refresh token HMAC-hashed in DB, httpOnly cookie, rotated by the `refreshEndpoint` query. `HomePage` calls `refreshEndpoint` on mount to restore a session; `ProtectedLayout` only checks the Redux access token. `logout` clears both; `googleLogin` verifies Firebase ID tokens server-side.
- `CLAUDE.md` is a symlink to this file for Claude Code. Edit only `AGENTS.md`; the symlink resolves to the same content.
- Seed the first Admin and role rows directly in Postgres; there is no bootstrap endpoint (`registerUser` requires an existing Admin).
