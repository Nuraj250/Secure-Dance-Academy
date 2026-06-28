# Verification Evidence

This document records the evidence used to validate the formal models.

## Evidence Sources

| Evidence | What it supports |
| --- | --- |
| `docs/requirements/03_FUNCTIONAL_REQUIREMENTS.md` | Functional scope and workflow identifiers. |
| `docs/requirements/07_BUSINESS_RULES.md` | Business invariants such as parent, coach, attendance, and onboarding constraints. |
| `docs/requirements/14_TRACEABILITY_MATRIX.md` | Requirement-to-model traceability. |
| `docs/security/THREAT_MODEL.md` | Trust boundaries, threat actors, and mitigation shape. |
| `docs/security/SECURITY_REVIEW.md` | Implemented security controls and RBAC matrix. |
| `docs/testing/MASTER_TEST_PLAN.md` | QA scope and quality gates. |
| `docs/testing/TEST_EVIDENCE.md` | Validation commands and core test results. |
| `tests/lib/auth/authorization.test.ts` | Role, ownership, and scope enforcement. |
| `tests/lib/security/csrf.test.ts` | Same-origin request protection. |
| `tests/lib/security/rate-limit.test.ts` | Abuse-throttling behaviour. |
| `tests/lib/security/cookies.test.ts` | Secure session cookie handling. |
| `tests/features/authentication/services/session.service.test.ts` | Session resolution and audit context shape. |
| `tests/features/authentication/services/auth.service.test.ts` | Sign-in, reset, and sign-out transitions. |
| `tests/features/audit/services/audit.service.test.ts` | Audit append and permission checks. |
| `tests/features/users/services/user.service.test.ts` | Self-access, admin access, and archive constraints. |
| `tests/features/dashboard/services/dashboard.service.test.ts` | Role-based dashboard selection. |

## Validation Commands

The formal-methods package is treated as valid when the repository passes the
project gate used for Task 09 and the documentation links remain consistent.
The latest validation run produced the following results:

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; Prisma Client regenerated and the Next.js production build completed. |
| `npm test -- --runInBand` | Passed; 18 suites and 51 tests succeeded. |

## Verification Matrix

| Model | Evidence type | Result |
| --- | --- | --- |
| Authentication model | Session and auth service tests; requirements and security docs. | Pass |
| Authorization model | Authorization helper, user service, and RBAC tests. | Pass |
| Session lifecycle model | Session service tests and cookie handling tests. | Pass |
| Controlled onboarding / role assignment | Requirements traceability and admin rules. | Pass at specification level. |
| Attendance model | Requirements, business rules, and formal transition constraints. | Pass at specification level. |
| Protected record access | Security review, threat model, and scoped service tests. | Pass |

## Notes

- The repository’s current executable evidence is strongest for authentication,
  session, authorization, audit, and sensitive-data protection.
- Attendance, onboarding, and protected-record workflows are formally specified
  against the approved baseline and remain ready for later implementation.
- No unreviewed critical inconsistencies were found between the models and the
  approved requirements set.
