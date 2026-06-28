# Project Documentation Index

This index points to the implementation-ready documentation that defines the
Secure Dance Academy Management System. Use these files as the authoritative
reference for requirements, design, implementation, testing, and deployment.

## Core References

| Section | Purpose | Primary Files |
| --- | --- | --- |
| Requirements | Approved business scope, functional rules, constraints, and traceability. | `docs/requirements/README.md`, `docs/requirements/00_SRS.md`, `docs/requirements/03_FUNCTIONAL_REQUIREMENTS.md`, `docs/requirements/05_SECURITY_REQUIREMENTS.md`, `docs/requirements/11_PERSONAS_AND_JOURNEYS.md`, `docs/requirements/14_TRACEABILITY_MATRIX.md`, `docs/requirements/21_ACCEPTANCE_CRITERIA.md` |
| Architecture | System architecture, boundaries, integration patterns, and ADR links. | `docs/architecture/README.md`, `docs/decisions/0001-project-initialization.md` through `docs/decisions/0007-vercel-docker-deployment-boundary.md` |
| Database | Logical and physical data design, Prisma alignment, and seed strategy. | `docs/database/README.md` |
| UI | UX blueprint, design system, screen inventory, and responsive behavior. | `docs/ui/README.md` |
| API | Backend route contract, response envelopes, and request validation notes. | `docs/api/README.md` |
| Backend | Backend foundation, feature modules, and implementation notes. | `docs/backend/README.md` |
| Security | Security controls, trust boundaries, threat model, and residual risk tracking. | `docs/security/README.md`, `docs/security/SECURITY_REVIEW.md`, `docs/security/THREAT_MODEL.md`, `docs/security/RESIDUAL_RISK_REGISTER.md` |
| Testing | Test strategy, validation expectations, quality gates, and QA evidence. | `docs/testing/README.md`, `docs/testing/MASTER_TEST_PLAN.md`, `docs/testing/INTEGRATION_TEST_PLAN.md`, `docs/testing/API_TEST_PLAN.md`, `docs/testing/PLAYWRIGHT_TEST_PLAN.md`, `docs/testing/SECURITY_TESTING_REPORT.md`, `docs/testing/OWASP_ZAP_PREPARATION.md`, `docs/testing/SONARQUBE_PREPARATION.md`, `docs/testing/ACCESSIBILITY_CHECKLIST.md`, `docs/testing/PERFORMANCE_CHECKLIST.md`, `docs/testing/REGRESSION_CHECKLIST.md`, `docs/testing/RISK_BASED_TEST_MATRIX.md`, `docs/testing/BUG_REGISTER.md`, `docs/testing/TEST_EVIDENCE.md`, `docs/testing/COVERAGE_SUMMARY.md`, `docs/testing/FINAL_QA_REPORT.md` |
| Formal Methods | Behavioural models, invariants, verification evidence, and traceability. | `docs/formal-methods/README.md`, `docs/formal-methods/FORMAL_SPECIFICATION.md`, `docs/formal-methods/VERIFICATION_EVIDENCE.md`, `docs/formal-methods/TRACEABILITY.md`, `docs/formal-methods/VERIFICATION_REPORT.md` |
| Deployment | Runtime and deployment guidance for local and production environments. | `docs/deployment/README.md` |
| Decisions | Architecture Decision Records captured during the approved design phases. | `docs/decisions/*.md` |

## Navigation Notes

- Start with `docs/requirements/README.md` to confirm the approved scope.
- Use the architecture, database, and UI sections before changing implementation
  code.
- Use the backend, API, and security sections when modifying server logic.
- Use the testing and deployment sections before release or environment changes.
