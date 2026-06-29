# Deployment Guide

Purpose: provide repeatable deployment instructions for the Secure Dance Academy
Management System across local development, Docker, and Vercel-style production
hosting.

Audience: developers, assessors, system administrators, and deployment owners.

## Prerequisites

- Node.js 22 or later.
- npm 10 or later.
- PostgreSQL 16 or a Supabase PostgreSQL project.
- Supabase project with Authentication enabled.
- Git checkout of this repository.
- Environment variables from `.env.example` copied into `.env.local` for local
  development.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Yes | Runtime mode: `development`, `test`, or `production`. |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical application URL used for redirects and CSRF checks. |
| `DATABASE_URL` | Yes for database-backed runs | Prisma connection string for PostgreSQL. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for Supabase auth | Public Supabase project URL. Must not be the example placeholder. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for browser auth | Public anonymous Supabase key. Must not be an example placeholder. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional, sensitive | Reserved for privileged server operations. Never expose it to the browser. |

For local coursework review, missing or placeholder Supabase URL/anon-key values
activate a safe unauthenticated demo mode only when `NODE_ENV=development`.
Production must use real Supabase values and fails securely when auth
configuration is missing or invalid. Never commit `.env.local`, `.env`, or
production secrets. Use Vercel environment settings, Docker secrets, or the
target platform's secret manager for production values.

## Local Installation

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create a local environment file.

   ```bash
   cp .env.example .env.local
   ```

3. Fill `.env.local` with real values when authentication, password recovery,
   or database-backed workflows are part of the local run. The required
   Supabase values are:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<project-anon-key>
   ```

4. Generate Prisma Client.

   ```bash
   npm run prisma:generate
   ```

5. Apply database migrations when migration files are present.

   ```bash
   npm run prisma:migrate
   ```

6. Seed baseline data when needed.

   ```bash
   npm run db:seed
   ```

7. Start the app.

   ```bash
   npm run dev
   ```

## Supabase Setup

1. Create a Supabase project.
2. Enable Supabase Authentication.
3. Configure the site URL to match `NEXT_PUBLIC_APP_URL`.
4. Add allowed redirect URLs for login and password reset flows, including
   `/login`, `/forgot-password`, and `/reset-password` on the deployed domain.
5. Copy the project URL and anonymous key into the runtime environment.
6. Use the database connection string as `DATABASE_URL`.
7. Keep service-role keys out of client code and out of Git.

## Prisma Setup

The Prisma schema is stored in `prisma/schema.prisma`. The production data model
uses PostgreSQL and maps entities to snake_case database tables.

Common commands:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run db:seed
```

Run Prisma migrations only against the intended target database. Review schema
changes before applying them to production.

## Docker Deployment

The repository includes `Dockerfile` and `docker-compose.yml`.

Build and run the local stack:

```bash
docker compose up --build
```

The compose file starts:

- `app` on port `3000`.
- `database` on port `5432`.
- A named PostgreSQL volume called `postgres_data`.

For production Docker deployments:

- Replace local database credentials.
- Use a managed PostgreSQL or Supabase database.
- Inject secrets through the runtime platform.
- Ensure HTTPS termination is provided by the platform or reverse proxy.
- Run migrations before switching traffic to a new release.

## Vercel Deployment

1. Import the repository into Vercel.
2. Set the Node.js version to 22 or later.
3. Add all required environment variables.
4. Use the default build command:

   ```bash
   npm run build
   ```

5. Set the production domain as `NEXT_PUBLIC_APP_URL`.
6. Configure Supabase redirect URLs for the production domain.
7. Run the verification commands before promoting a release.

## Production Verification

Before release:

```bash
npm run lint
npm run typecheck
npm run build
npm test -- --runInBand
```

After release:

- Visit `/login`.
- Visit `/api/health`.
- Confirm secure headers are present.
- Confirm protected routes redirect unauthenticated users.
- Confirm audit and authentication flows work with the target Supabase project.

## Backup And Recovery

For Supabase:

- Enable point-in-time recovery when the plan supports it.
- Export or snapshot the database before major migrations.
- Keep migration history aligned with the deployed application version.

For Docker PostgreSQL:

```bash
docker compose exec database pg_dump -U postgres secure_dance_academy > backup.sql
```

Restore into a clean database:

```bash
docker compose exec -T database psql -U postgres secure_dance_academy < backup.sql
```

Validate restored systems with the standard verification commands and a manual
login smoke test.

## Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Build cannot connect to Prisma | Missing or invalid `DATABASE_URL` | Check environment values and network access. |
| Login redirects fail | Supabase redirect URL mismatch | Update Supabase Auth URL settings. |
| CSRF errors in production | `NEXT_PUBLIC_APP_URL` mismatch | Set it to the exact deployed origin. |
| Secure cookies unavailable locally | Production cookie settings in non-HTTPS context | Use development mode locally or run behind HTTPS. |
| Prisma Client missing | Client not generated | Run `npm run prisma:generate`. |

## Release Checklist

- Environment variables configured.
- Supabase Auth URLs configured.
- Database migration reviewed and applied.
- Verification commands pass.
- Security headers confirmed.
- Backup or restore point captured.
- Known residual risks reviewed.
