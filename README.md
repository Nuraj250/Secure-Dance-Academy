# Secure Dance Academy Management System

Secure Dance Academy is a production-oriented management system foundation for dance
academies handling artists, coaches, parents, attendance, injuries, performances, and
administrative activity.

Task 01 initializes the engineering baseline only. Business requirements and feature
implementation are intentionally deferred until Requirements Engineering is approved.

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Supabase Authentication
- Supabase PostgreSQL
- Prisma ORM
- Jest
- Playwright
- Docker and Docker Compose

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local environment variables:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architecture

The project follows feature-first Clean Architecture:

- `app/` contains Next.js routes, layouts, and route handlers.
- `features/` contains isolated feature modules.
- `components/` contains reusable UI and layout components.
- `services/` contains application/business use cases.
- `repositories/` contains Prisma data access.
- `lib/` contains shared infrastructure.
- `tests/` contains unit, integration, API, end-to-end, and security tests.
- `docs/` contains architecture, API, security, testing, deployment, and ADR content.

## Security Baseline

- Security headers are configured in `next.config.ts` and `middleware.ts`.
- Environment variables are validated through Zod.
- Supabase browser and server clients are prepared.
- Protected route prefixes are centralized.
- API response helpers, audit event structure, logging, validation, and rate-limit
  foundations are available.

## Development Rules

- Do not add business features before requirements approval.
- Do not commit real secrets.
- Keep business logic out of UI components.
- Keep database access inside repositories.
- Validate on both client and server.
- Update project memory after every completed task.
