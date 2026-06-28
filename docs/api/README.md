# API Documentation

This folder records the backend API contract for the Secure Dance Academy
Management System.

## Conventions

- Every response uses the standard `{ status, message, data }` envelope.
- Errors use `{ status: "error", errorCode, message, validationDetails? }`.
- Mutating routes require same-origin requests and server-side validation.
- Protected routes resolve the current Supabase-backed session before business
  logic runs.
- Business logic stays in feature services, not route handlers.

## Implemented Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Lightweight service health check. |
| `/api/auth/session` | `GET` | Returns the current session context. |
| `/api/auth/login` | `POST` | Signs in a user with Supabase Auth. |
| `/api/auth/logout` | `POST` | Signs out the current user. |
| `/api/auth/forgot-password` | `POST` | Starts the password recovery flow. |
| `/api/auth/reset-password` | `POST` | Completes the password update flow. |
| `/api/me` | `GET` | Returns the active user profile. |
| `/api/users` | `GET` | Returns a paginated user list. |
| `/api/users/[id]` | `GET` | Returns a specific user profile. |
| `/api/users/[id]` | `PATCH` | Updates a user profile. |
| `/api/users/[id]` | `DELETE` | Archives a user profile. |
| `/api/audit` | `GET` | Returns a paginated audit trail. |

## Request Validation

Validation is centralized in Zod schemas under `features/*/schemas/` and parsed
through `lib/validation/request.ts`. This keeps route handlers thin and keeps the
validated shape aligned with the service contract.

## Error Model

The backend emits explicit application errors for:

- Validation failures.
- Authentication failures.
- Authorization failures.
- Account state conflicts.
- Not-found conditions.
- Rate limiting.
- CSRF failures.
- Service availability issues.
