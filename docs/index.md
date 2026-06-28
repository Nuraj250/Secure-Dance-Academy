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
| Security | Security controls, trust boundaries, and server-side protection model. | `docs/security/README.md` |
| Testing | Test strategy, validation expectations, and quality gates. | `docs/testing/README.md` |
| Deployment | Runtime and deployment guidance for local and production environments. | `docs/deployment/README.md` |
| Decisions | Architecture Decision Records captured during the approved design phases. | `docs/decisions/*.md` |

## Navigation Notes

- Start with `docs/requirements/README.md` to confirm the approved scope.
- Use the architecture, database, and UI sections before changing implementation
  code.
- Use the backend, API, and security sections when modifying server logic.
- Use the testing and deployment sections before release or environment changes.
