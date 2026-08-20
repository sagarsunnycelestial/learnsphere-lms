# LearnSphere LMS

A Learning Management System for schools and corporate training. Monorepo (`client`, `server`), GraphQL-only API, TypeORM over Supabase Postgres, RBAC enforced on both UI and resolvers. React + TypeScript front, Express + Apollo Server back.


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


## Screenshots
<img width="1548" height="1000" alt="loginpage" src="https://github.com/user-attachments/assets/5a6b1d23-ce4a-4042-90e5-9b1a9836b798" />
<img width="1716" height="690" alt="student_home" src="https://github.com/user-attachments/assets/23723db5-a043-4af3-a36f-fc27aeb8eecd" />
<img width="1614" height="890" alt="quiz_card" src="https://github.com/user-attachments/assets/60338488-f207-48bd-a128-c526462ec4b4" />
<img width="1723" height="818" alt="instructor_page" src="https://github.com/user-attachments/assets/7d572ecf-af43-45b0-9d7d-cc89e37e7872" />
<img width="1057" height="788" alt="add_user_form" src="https://github.com/user-attachments/assets/75517022-eaf9-4170-8b2d-f7ee674c287e" />
<img width="976" height="620" alt="add_course_form" src="https://github.com/user-attachments/assets/92c75683-296c-48cc-bd9b-1d881f15b814" />
<img width="1724" height="727" alt="darkmode" src="https://github.com/user-attachments/assets/d5a36904-c3f7-48d5-842d-e6b24b3ddd19" />
<img width="1728" height="935" alt="admin_home_page" src="https://github.com/user-attachments/assets/911cf1ae-d79d-459e-969d-23021b24d803" />
