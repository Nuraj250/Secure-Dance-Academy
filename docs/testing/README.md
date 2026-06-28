# Testing Documentation

This folder records the backend test strategy and the validation evidence for the
foundation that is now implemented.

## Current Coverage

- RBAC helper behavior.
- CSRF origin validation.
- Rate limit helper behavior.
- Sanitization helpers.
- Standard API response helpers.
- Request validation helpers.
- Route handler error mapping.

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm test -- --runInBand`

## Test Strategy

Backend tests focus on the highest-risk control points first:

1. Pure security helpers.
2. API response contract.
3. Validation helpers.
4. Route wrapper error handling.

Service and repository tests can be added in later phases when the next feature
modules need deeper regression coverage.
