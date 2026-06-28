# Developer Guide

Purpose: explain how future contributors should work on the Secure Dance
Academy Management System without breaking the approved architecture, security
model, or documentation traceability.

## Project Structure

| Path | Responsibility |
| --- | --- |
| `app/` | Next.js App Router pages, layouts, and API route handlers. |
| `features/` | Feature-owned components, schemas, services, repositories, and types. |
| `components/` | Reusable UI and layout primitives. |
| `lib/` | Shared infrastructure: auth, security, HTTP, validation, Supabase, Prisma. |
| `repositories/` | Shared repository helpers such as pagination. |
| `prisma/` | Prisma schema and seed script. |
| `tests/` | Jest tests plus API, integration, security, and e2e suites. |
| `docs/` | Requirements, architecture, database, UI, backend, security, testing, formal methods, and final documentation. |

## Architecture Rules

- Follow feature-based Clean Architecture.
- Keep business rules in services.
- Keep persistence in repositories.
- Keep route handlers thin: parse, validate, resolve session, authorize, call service, return response.
- Never trust browser authorization.
- Use Zod for request and form validation.
- Use Prisma for database access unless an approved exception exists.
- Write audit records for sensitive operations.

## Local Workflow

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Before handing off work:

```bash
npm run lint
npm run typecheck
npm run build
npm test -- --runInBand
```

## Adding A Feature

1. Confirm the feature exists in the approved requirements baseline.
2. Create or update the feature folder under `features/`.
3. Define Zod schemas for request or form input.
4. Add service methods for business rules.
5. Add repository methods for data access.
6. Add route handlers or server actions that call the service layer.
7. Add UI only after the server-side authorization path exists.
8. Add focused tests for validation, authorization, and service behavior.
9. Update relevant documentation and traceability.

## Creating An API Route

Use `withApiRoute` from `lib/http/route-handler.ts` for consistent behavior.

Each protected route should include:

- Request context creation.
- CSRF check for mutating methods.
- Rate limit where abuse is realistic.
- Zod validation.
- Session resolution.
- Authorization check.
- Feature service call.
- Standard success or error response.

## Database Changes

1. Update `prisma/schema.prisma`.
2. Validate schema changes locally.
3. Generate Prisma Client.
4. Create and review a migration.
5. Update seed data if baseline roles or settings change.
6. Update `docs/database/README.md` when entities, relationships, constraints,
   or indexes change.

## Security Expectations

- Do not store tokens in `localStorage`.
- Do not hardcode secrets.
- Do not expose stack traces, SQL, environment variables, or private keys.
- Use RBAC and ownership checks together.
- Scope parent, coach, and artist access by relationship.
- Keep medical and child data tightly selected.
- Prefer safe denial over partial execution.

## Testing Expectations

Use Jest for unit and service tests. High-risk areas need tests before release:

- Authentication and password recovery.
- Authorization and ownership.
- Rate limiting and CSRF.
- Audit logging.
- Request validation.
- Sensitive data projection.

Browser, accessibility, ZAP, and SonarQube work are documented under
`docs/testing/` and should be executed in the intended release environment.

## Documentation Workflow

Every material change should update the relevant document:

- Requirements changes: `docs/requirements/`.
- Architecture changes: `docs/architecture/` and ADRs.
- Data model changes: `docs/database/README.md`.
- API changes: `docs/api/README.md`.
- Security changes: `docs/security/`.
- Test evidence: `docs/testing/`.
- Formal behavior: `docs/formal-methods/`.

Update `codex/00_PROJECT_MEMORY.md` only after a task is actually complete.

## Contribution Checklist

- Scope is approved.
- Implementation follows the architecture.
- Security checks are server-side.
- Tests pass.
- Documentation is updated.
- No secrets are committed.
- Worktree state is reviewed before handoff.
