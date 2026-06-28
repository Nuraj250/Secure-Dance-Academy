# Secure Dance Academy Management System

Secure Dance Academy is a secure, production-oriented management system for
dance academies handling artists, coaches, parents, attendance, injuries,
performances, medical records, reports, notifications, settings, and audit
logs.

The project was built for the 7032CE Secure Design and Development module and
is organized as a portfolio-quality secure web application rather than a
throwaway coursework prototype.

## Features

- Supabase-backed authentication and password recovery.
- Role-based access for administrators, coaches, parents, and artists.
- Controlled onboarding; public self-registration is out of scope.
- Protected dashboard and role-aware navigation.
- User profile and account management.
- Artist, parent, coach, activity, attendance, performance, injury, medical,
  report, notification, settings, and audit-log views.
- Zod validation, safe API responses, CSRF checks, rate limiting, security
  headers, and audit logging.
- Prisma PostgreSQL schema for normalized production data.
- Requirements, architecture, database, UI, backend, security, testing, formal
  methods, deployment, user, administrator, developer, maintenance, report, and
  presentation documentation.

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Supabase Authentication
- Supabase PostgreSQL
- Prisma ORM
- Jest
- Playwright
- OWASP ZAP and SonarQube preparation
- Docker, Docker Compose, and Vercel deployment boundary

## Architecture

The project follows feature-based Clean Architecture:

- `app/` contains Next.js routes, layouts, and route handlers.
- `features/` contains feature-owned schemas, services, components,
  repositories, and types.
- `components/` contains reusable UI and layout primitives.
- `lib/` contains shared infrastructure for auth, security, HTTP, validation,
  Supabase, Prisma, and utilities.
- `repositories/` contains shared repository helpers.
- `prisma/` contains the database schema and seed script.
- `tests/` contains Jest tests plus API, integration, security, and
  end-to-end test layers.
- `docs/` contains the complete project documentation set.

See `docs/index.md` for the authoritative documentation map.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local environment variables:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Configuration

The application reads these environment variables:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode. |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL for redirects and CSRF checks. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous browser key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sensitive server-side key reserved for privileged operations. |

Do not commit `.env` files or production secrets.

## Verification

Run the local quality gate before handoff:

```bash
npm run lint
npm run typecheck
npm run build
npm test -- --runInBand
```

Additional planned release checks are documented in `docs/testing/`, including
Playwright, OWASP ZAP, SonarQube, accessibility, performance, and regression
plans.

## Deployment

Deployment instructions are in `docs/deployment/README.md`.

Supported deployment paths:

- Local development with `npm run dev`.
- Docker with `docker compose up --build`.
- Vercel or similar Node.js hosting with `npm run build`.

## Documentation

Key entry points:

- Project index: `docs/index.md`
- Final report: `docs/final-report.md`
- Final review: `docs/final-review/README.md`
- Developer guide: `docs/developer-guide.md`
- Administrator guide: `docs/administrator-guide.md`
- User guide: `docs/user-guide.md`
- Maintenance guide: `docs/maintenance-guide.md`
- Presentation notes: `docs/presentation-notes.md`
- References: `docs/references.md`
- Appendices: `docs/appendices.md`

## Screenshots And Evidence

Testing evidence, browser test planning, and presentation/demo guidance are
stored under `docs/testing/` and `docs/presentation-notes.md`. Generate fresh
screenshots from the target environment before final submission so evidence
matches the deployed build.

## License

MIT. See `LICENSE`.
