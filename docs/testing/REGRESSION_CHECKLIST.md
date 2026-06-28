# Regression Checklist

Re-run this checklist after changes to authentication, routing, data access,
security, or shared UI primitives.

## Authentication And Sessions

- [ ] Login succeeds for valid accounts. [SR-01]
- [ ] Logout clears the current session. [SR-03]
- [ ] Password reset flow validates and updates the credential safely. [SR-13]
- [ ] Session expiry routes the user back to the login flow. [SR-04]

## Authorization And Access Control

- [ ] Administrator access remains broad and consistent. [SR-02]
- [ ] Coach access remains scoped to assigned records. [SR-09]
- [ ] Parent access remains limited to linked child data. [SR-09]
- [ ] Artist access remains limited to the account owner and permitted views.
- [ ] Forbidden requests do not reveal hidden fields or stack traces. [SR-06]

## Data Integrity

- [ ] User profile edits persist correctly and record an audit event. [SR-07]
- [ ] Archive and restore flows keep status values consistent.
- [ ] Audit records remain append-only.
- [ ] Search, pagination, and filtering do not drop records.

## Security

- [ ] CSRF rejects cross-site mutation attempts. [SR-03, SR-10]
- [ ] Rate limiting still applies to auth and abuse-prone routes. [SR-01, SR-10]
- [ ] Secure headers remain in place on protected responses. [SR-10]
- [ ] Error messages stay generic and do not leak secrets. [SR-05, SR-06]

## User Interface

- [ ] Navigation remains role-aware.
- [ ] Loading, empty, and error states are still present.
- [ ] Forms remain keyboard accessible.
- [ ] Tables still support pagination and row actions.
- [ ] Mobile layouts remain usable at narrow widths. [NFR-06]

## Evidence

- Record the date, tester, build hash, and affected screens.
- Link any new defect to the bug register and the follow-up fix.

