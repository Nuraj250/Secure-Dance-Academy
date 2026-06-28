# ADR 0006: Security Middleware, Validation, and Audit Logging

## Status

Accepted

## Date

2026-06-28

## Decision

Apply security headers and coarse protected-route gating in middleware, then enforce
authentication, authorization, Zod validation, rate limiting, and immutable audit
logging again in the server layer.

## Reason

The security model must not rely on the browser. A layered approach reduces attack
surface and keeps sensitive workflows traceable.

## Alternatives Considered

- Frontend-only authorization.
- Ad hoc per-feature security checks.
- Mutable audit logs mixed with application logs.

## Impact

Security controls are consistent across the system. Sensitive operations remain
traceable, and denied requests fail securely before business logic executes.

