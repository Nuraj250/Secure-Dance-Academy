# ADR 0003: Supabase Auth and Secure Cookie Sessions

## Status

Accepted

## Date

2026-06-28

## Decision

Use Supabase Authentication for identity, password recovery, email verification, and
session refresh. Store session state in secure HTTP-only cookies. Keep onboarding
controlled rather than public.

## Reason

This matches the approved technology stack and reduces security risk. It avoids
localStorage token storage, keeps password and session handling centralized, and
supports the required recovery flows.

## Alternatives Considered

- A custom JWT implementation.
- Storing tokens in localStorage.
- Public self-registration without controlled onboarding.

## Impact

Authentication logic stays server-oriented. Browser exposure is reduced. Login,
logout, password recovery, and email verification flows remain consistent.

