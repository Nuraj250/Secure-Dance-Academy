# ADR 0004: Prisma Repository Data Layer

## Status

Accepted

## Date

2026-06-28

## Decision

Use Prisma as the only application-facing database access mechanism and wrap it in
repositories. Keep the schema normalized, use UUID primary keys, and treat audit
history as immutable.

## Reason

The approved architecture calls for a separate data access layer and strict control
over database access. Repositories keep persistence concerns isolated from business
logic and presentation code.

## Alternatives Considered

- Raw SQL directly inside route handlers or services.
- Direct Prisma usage from UI-facing code.
- A denormalized schema optimized before the business model is stable.

## Impact

Database access becomes easier to test and review. Schema changes remain explicit.
Business rules stay out of persistence code.

