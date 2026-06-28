# Formal Methods Traceability

This document records how the formal models map back to requirements, ADRs,
implementation modules, and tests.

## Traceability Matrix

| Model | Requirements | Business rules | ADRs | Implementation / tests |
| --- | --- | --- | --- | --- |
| Authentication and sign-out | FR-01, SR-01 | BRULE-11, BRULE-05 | ADR 0003, ADR 0006 | `features/authentication/services/auth.service.ts`, `features/authentication/services/session.service.ts`, `tests/features/authentication/services/auth.service.test.ts`, `tests/features/authentication/services/session.service.test.ts` |
| Password recovery and reset | FR-02, SR-03, SR-04, SR-13 | BRULE-11 | ADR 0003, ADR 0006 | `features/authentication/services/auth.service.ts`, `tests/features/authentication/services/auth.service.test.ts` |
| Authorization and scope | FR-03, FR-04, FR-05, SR-02, SR-09 | BRULE-01, BRULE-02, BRULE-04, BRULE-06, BRULE-09, BRULE-10 | ADR 0004, ADR 0006 | `lib/auth/authorization.ts`, `lib/auth/rbac.ts`, `features/users/services/user.service.ts`, `tests/lib/auth/authorization.test.ts` |
| Session lifecycle | SR-03, SR-04, SR-10 | BRULE-05 | ADR 0003, ADR 0006 | `lib/security/cookies.ts`, `features/authentication/services/session.service.ts`, `tests/lib/security/cookies.test.ts`, `tests/features/authentication/services/session.service.test.ts` |
| Controlled onboarding and role assignment | FR-04, FR-05, FR-22, SR-07, SR-13 | BRULE-06, BRULE-11 | ADR 0004, ADR 0006 | `features/users/services/user.service.ts`, `app/api/users/route.ts`, `app/api/users/[id]/route.ts`, related user-service tests |
| Attendance recording and approval | FR-09, NFR-01 | BRULE-03, BRULE-07 | ADR 0004, ADR 0006 | `docs/requirements/03_FUNCTIONAL_REQUIREMENTS.md`, `docs/requirements/07_BUSINESS_RULES.md`, `docs/formal-methods/FORMAL_SPECIFICATION.md`, `docs/testing/INTEGRATION_TEST_PLAN.md` |
| Performance / injury / medical access | FR-10, FR-11, FR-12, FR-15, FR-16, FR-18, FR-19, SR-09 | BRULE-01, BRULE-02, BRULE-04, BRULE-10 | ADR 0004, ADR 0006 | `docs/security/SECURITY_REVIEW.md`, `docs/security/THREAT_MODEL.md`, `tests/lib/auth/authorization.test.ts`, `tests/features/users/services/user.service.test.ts` |
| Audit and administrative oversight | FR-17, FR-20, SR-07 | BRULE-05, BRULE-09 | ADR 0006 | `features/audit/services/audit.service.ts`, `tests/features/audit/services/audit.service.test.ts`, `app/api/audit/route.ts` |

## Traceability Rules

- Every model in `FORMAL_SPECIFICATION.md` references at least one approved
  requirement and one supporting implementation or review artefact.
- Requirements that are still specification-level are marked as such in the
  evidence matrix rather than being treated as executable behaviour.
- The traceability chain remains stable across the requirements, architecture,
  backend, security, testing, and formal methods documents.

## Update Summary

The formal-methods phase adds an explicit behavioural layer between the
requirements and the test evidence. This makes it easier to confirm that the
current implementation and the approved future workflows are aligned with the
same security and integrity rules.
