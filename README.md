# LearnSphere LMS

A Learning Management System for schools and corporate training. Monorepo (`client`, `server`), GraphQL-only API, TypeORM over Supabase Postgres, RBAC enforced on both UI and resolvers. React + TypeScript front, Express + Apollo Server back.

Live: https://learnsphere-client-pi.vercel.app

## Key concepts

- **resolvers - controllers** — `resolvers.ts` only checks auth/role and delegates to per-domain controllers (auth, courses, lessons, quiz, students, users).
- **No self-registration** — only Admins can create accounts (`registerUser`); a temp password is emailed via Nodemailer and can also be downloaded as a PDF (`pdf-lib`).
- **Hashed opaque refresh tokens** — access token is a 15-min JWT; refresh token is a random hex string, HMAC-hashed and stored, set as an httpOnly cookie, rotated via a `refreshEndpoint` query.
- **RBAC enforced twice** — frontend `hasPermission()` map (Admin/Instructor/Student) gates UI; backend resolvers check `context.user.role` before calling controllers, with course/quiz ownership scoping for instructors.
- **TypeORM + migrations** — `Users`, `Roles`, `Courses`, `Lessons`, `Quizzes`, `Questions`, `Options`, `Results`, `Enrollments`, with `synchronize: false` and versioned migrations.
- **Auto-graded quizzes** — answers are scored server-side against stored `correctOption` relations and saved as `Results`.
- **Supabase for DB + storage** — Postgres is Supabase-hosted; client uploads directly to `profiles` and `lessons-lms` buckets and sends back only the `publicUrl`.
- **Client-side PDFs** — `pdf-lib` + `downloadjs` generate new-user credential PDFs and quiz result certificates, no server round-trip.
- **GraphQL Codegen** — typed hooks generated from the live schema into `client/src/generated`.
- Apollo Client + TanStack Query for data fetching/caching; Redux Toolkit (`authSlice`, `themeSlice`, `formSlice`, `profileSlice`) for client state.

## Features

- **Admin** — create users, manage any course, view enrollments.
- **Instructor** — CRUD their own courses/lessons/quizzes, view enrolled students.
- **Student** — browse/enroll in courses, take lessons, take quizzes, download result PDF.
- Avatar upload and role-based UI for everyone.

## How it works

- **Auth:** `login` mutation issues a JWT access token + httpOnly refresh cookie; `refreshEndpoint` query validates the cookie and reissues an access token; `logout` clears both.
- **Provisioning:** admin-only `registerUser` creates a user with a generated temp password, emails it, and returns it for a client-side PDF.
- **Authorization:** every `/graphql` request attaches `{ user_id, role }` from the JWT to context; resolvers check the role before touching data, scoped further by course ownership.
- **Uploads:** file → Supabase bucket → `publicUrl` → sent to backend → stored in Postgres.
- **Quiz submission:** answers → checked for duplicates → scored against `correctOption` → saved as a `Results` row → rendered into a PDF client-side.

## Stack

**Client:** React 19, TypeScript, MUI, Apollo Client, TanStack Query, Redux Toolkit, React Router, Supabase JS, pdf-lib, GraphQL Codegen
**Server:** Express 5, Apollo Server, GraphQL (SDL-first), TypeORM, PostgreSQL (Supabase), JWT, bcrypt, Nodemailer, Zod

## Running it locally

```bash
git clone https://github.com/sagarsunnycelestial/learnsphere-lms.git
cd learnsphere-lms
npm install
```

`server/.env`:

```env
PORT=
DB_TYPE=postgres
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_NAME=
DB_PASSWORD=
DB_SSL=true
SUPABASE_DB_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY_TIME=
ALLOWED_ORIGIN1=
ALLOWED_ORIGIN2=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

`client/.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

```bash
# server/
npm run migration:run
npm run dev

# client/
npm run dev
```

Seed the first Admin directly in the database — `registerUser` needs an existing Admin to call it.
