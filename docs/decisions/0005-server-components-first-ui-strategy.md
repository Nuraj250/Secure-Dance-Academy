# ADR 0005: Server Components First UI Strategy

## Status

Accepted

## Date

2026-06-28

## Decision

Use Server Components first and introduce Client Components only when interaction
requires them. Prefer local state and Server Actions over global client state.

## Reason

This reduces bundle size, keeps data fetching close to the server, and preserves the
server as the source of truth. It also matches the approved Next.js architecture.

## Alternatives Considered

- A fully client-rendered application shell.
- A large global state store for all screens.
- Using client components for every route by default.

## Impact

The UI remains fast and easier to secure. Interactive islands stay small, and
mutations are easier to reason about.

