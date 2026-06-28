# Presentation Demo Script

This script supports the assignment presentation by showing how the current
implementation meets the marking focus areas.

## Opening

“This project is a secure management system for a dance academy. It follows
feature-based Clean Architecture, uses Supabase Authentication, Prisma,
Next.js 15, and documents the security, testing, and formal-methods evidence
required for the coursework.”

## Design

Show:

- `docs/requirements/00_SRS.md`
- `docs/architecture/README.md`
- `docs/ui/README.md`
- `docs/database/README.md`

Say:

- The project baseline is single-academy and controlled-access.
- The UI blueprint is role-aware and enterprise-oriented.
- The database model separates users, artists, guardians, coaches, activities,
  attendance, injuries, medical records, reports, settings, and audit logs.

## Development

Show:

- `app/`
- `features/`
- `lib/`
- `prisma/schema.prisma`

Say:

- The implementation uses route handlers, feature services, repositories, and a
  Prisma-backed database layer.
- Auth, audit, validation, and shared response helpers are centralized.

## Security Testing And Analysis

Show:

- `docs/security/SECURITY_REVIEW.md`
- `docs/security/THREAT_MODEL.md`
- `docs/testing/SECURITY_TESTING_REPORT.md`
- `docs/testing/OWASP_ZAP_PREPARATION.md`
- `docs/testing/SONARQUBE_PREPARATION.md`

Say:

- Security is layered across authentication, authorization, session handling,
  CSRF, rate limiting, secure headers, validation, and audit logging.
- ZAP and SonarQube are prepared for execution, but not claimed as run inside
  this workspace.

## Formal Methods

Show:

- `docs/formal-methods/FORMAL_SPECIFICATION.md`
- `docs/formal-methods/TRACEABILITY.md`
- `docs/formal-methods/VERIFICATION_REPORT.md`

Say:

- Critical workflows were modeled formally.
- The formal package ties the models back to requirements and tests.

## Close

End by pointing to `docs/final-review/FINAL_APPROVAL_REPORT.md` and
`docs/submission/REPORT_EVIDENCE_MAP.md` as the final evidence map for marking.

