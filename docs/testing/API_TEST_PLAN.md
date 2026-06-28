# API Test Plan

This plan defines the expected API contract checks for the implemented route
handlers.

## Route Coverage

| Route | Method | Key checks |
| --- | --- | --- |
| `/api/auth/session` | `GET` | Returns the current session, applies rate limit, and never exposes secrets. |
| `/api/auth/login` | `POST` | Validates credentials, rate limits by IP and account, and returns the secure session envelope. |
| `/api/auth/logout` | `POST` | Terminates the current session and records an audit event. |
| `/api/auth/forgot-password` | `POST` | Returns a generic success message and rate limits requests. |
| `/api/auth/reset-password` | `POST` | Requires a verified reset session and rejects invalid payloads. |
| `/api/me` | `GET` | Returns the current user profile and role/permission arrays. |
| `/api/users` | `GET` | Requires `users:read`, supports pagination and filtering, and returns a paginated envelope. |
| `/api/users/[id]` | `GET` | Enforces self-or-admin access. |
| `/api/users/[id]` | `PATCH` | Enforces self-or-admin access, validation, and audit logging. |
| `/api/users/[id]` | `DELETE` | Requires `users:write`, archives the account, and audits the change. |
| `/api/audit` | `GET` | Requires `audit:read` and returns stable pagination. |

## Contract Checks

- Correct status code for success and failure cases.
- Standard `{ status, message, data }` envelope on success.
- Standard `{ status, errorCode, message, validationDetails? }` envelope on error.
- CSRF rejection on state-changing requests.
- `Retry-After` on rate-limited responses.
- `no-store` on sensitive responses.
- No secrets, SQL, or framework internals in error payloads.

## Role Matrix

| Role | Expected access |
| --- | --- |
| Anonymous | Public auth pages only; protected APIs return `401` or redirect equivalents. |
| Administrator | Full route access, including users and audit. |
| Coach | Assigned, scoped access only. |
| Parent | Linked child access only. |
| Artist | Own profile and permitted record views only. |

## Validation Cases

- Empty body.
- Malformed JSON.
- Missing required fields.
- Invalid email, password, or date formats.
- Cross-site request attempt on mutating endpoints.
- Exceeding rate limit thresholds.

## Evidence

- Route-wrapper tests already verify error mapping and rate-limit headers.
- Service-level tests now verify the auth, audit, and user permission paths.
- Future Postman collections should mirror this plan exactly.
