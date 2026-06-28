# ADR 0001: Project Initialization Foundation

## Status

Accepted

## Date

2026-06-28

## Decision

Initialize the application as a Next.js 15 TypeScript project using a feature-first
Clean Architecture folder structure with Supabase, Prisma, Tailwind CSS, shadcn-style
component conventions, Jest, Playwright, Docker, and secure configuration defaults.

## Reason

Task 01 requires a production-ready foundation without business feature implementation.
This structure keeps UI, business logic, data access, infrastructure, testing, and
documentation concerns separated from the beginning.

## Alternatives Considered

- Use a generator and accept its default folder structure.
- Build a minimal Next.js shell only and defer security/testing configuration.

## Impact

Future tasks can add requirements, architecture, database models, APIs, and UI screens
without reorganizing the project foundation.
