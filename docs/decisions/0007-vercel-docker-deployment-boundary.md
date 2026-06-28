# ADR 0007: Vercel and Docker Deployment Boundary

## Status

Accepted

## Date

2026-06-28

## Decision

Deploy the production application on Vercel and use Docker Compose for local parity
and repeatable integration work. Keep Supabase as the managed authentication and
database platform.

## Reason

This matches the approved stack, keeps deployment simple, and allows local and
production environments to share the same architectural shape.

## Alternatives Considered

- A self-hosted Node.js server in production.
- Kubernetes or a custom orchestration stack.
- Directly exposing the database as a public dependency.

## Impact

Deployment remains predictable and easy to document. Local development can mirror the
production shape without adding unnecessary operational complexity.

