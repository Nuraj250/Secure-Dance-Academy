# Assignment Compliance Matrix

This matrix maps the current repository to the marking focus requested for the
coursework submission. It describes the evidence that exists in the repo and
does not claim unexecuted external scans.

## Rubric Mapping

| Marking area | Current evidence | Status |
| --- | --- | --- |
| Design | Requirements baseline, architecture docs, database design, UI blueprint, and ADRs describe the approved system. | Complete |
| Development | Next.js application shell, feature services, repositories, route handlers, and Prisma schema exist for the implemented boundary. | Complete |
| Security testing and analysis | Security review, threat model, residual risk register, test plan, and security-focused unit tests are present. | Partially complete |
| Formal methods | Formal specification, verification evidence, traceability, and verification report are present. | Complete |
| Documentation | Final report, guides, presentation notes, references, appendices, documentation review, and final review package are present. | Complete |

## Design Evidence

- `docs/requirements/00_SRS.md`
- `docs/requirements/03_FUNCTIONAL_REQUIREMENTS.md`
- `docs/requirements/05_SECURITY_REQUIREMENTS.md`
- `docs/architecture/README.md`
- `docs/database/README.md`
- `docs/ui/README.md`
- `docs/decisions/0001-project-initialization.md` through `docs/decisions/0007-vercel-docker-deployment-boundary.md`

## Development Evidence

- `app/` routes and layouts
- `features/` feature modules
- `lib/` shared security, auth, validation, HTTP, and database helpers
- `prisma/schema.prisma`
- `tests/` Jest coverage for core services and helpers

## Security Evidence

- `docs/security/SECURITY_REVIEW.md`
- `docs/security/THREAT_MODEL.md`
- `docs/security/RESIDUAL_RISK_REGISTER.md`
- `docs/testing/SECURITY_TESTING_REPORT.md`
- `docs/testing/OWASP_ZAP_PREPARATION.md`
- `docs/testing/SONARQUBE_PREPARATION.md`
- `tests/lib/security/*.test.ts`
- `tests/lib/auth/*.test.ts`
- `tests/features/*/services/*.test.ts`

## Formal Methods Evidence

- `docs/formal-methods/FORMAL_SPECIFICATION.md`
- `docs/formal-methods/VERIFICATION_EVIDENCE.md`
- `docs/formal-methods/TRACEABILITY.md`
- `docs/formal-methods/VERIFICATION_REPORT.md`

## Documentation Evidence

- `README.md`
- `docs/index.md`
- `docs/deployment/README.md`
- `docs/developer-guide.md`
- `docs/administrator-guide.md`
- `docs/user-guide.md`
- `docs/maintenance-guide.md`
- `docs/final-report.md`
- `docs/final-review/*`
- `docs/references.md`
- `docs/appendices.md`

## Gaps To State Clearly

The repository does not include executed ZAP or SonarQube results inside this
workspace. Those checks are prepared and documented, but still need to be run in
the intended scan environment.

The repository also does not include browser automation execution evidence
beyond the documented test plan and the local Jest suite.

