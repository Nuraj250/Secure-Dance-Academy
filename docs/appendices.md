# Appendices

Purpose: collect supporting evidence, document inventory, diagram inventory, and
submission notes for the final report.

## Appendix A - Documentation Inventory

| Area | Location |
| --- | --- |
| Requirements | `docs/requirements/` |
| Architecture | `docs/architecture/README.md` |
| Database | `docs/database/README.md` |
| UI/UX | `docs/ui/README.md` |
| Backend | `docs/backend/README.md` |
| API | `docs/api/README.md` |
| Security | `docs/security/` |
| Testing | `docs/testing/` |
| Formal methods | `docs/formal-methods/` |
| Deployment | `docs/deployment/README.md` |
| Developer guide | `docs/developer-guide.md` |
| Administrator guide | `docs/administrator-guide.md` |
| User guide | `docs/user-guide.md` |
| Maintenance guide | `docs/maintenance-guide.md` |
| Final report | `docs/final-report.md` |
| Presentation notes | `docs/presentation-notes.md` |
| References | `docs/references.md` |

## Appendix B - Verification Commands

The local release gate is:

```bash
npm run lint
npm run typecheck
npm run build
npm test -- --runInBand
```

Task 10 recorded all four commands passing. Task 11 is documentation-only and
should preserve those gates.

## Appendix C - Diagram Inventory

The documentation set includes Mermaid diagrams for:

- Requirements-to-formal-methods flow.
- Architecture context and system boundaries.
- Layered architecture.
- Module boundaries.
- Data flow.
- Authentication and authorization flows.
- Database entity relationships.
- Trust boundaries.
- Testing strategy.
- Formal FSM and Petri net models.

Every diagram is paired with explanatory text in its owning document.

## Appendix D - Security Evidence

Security evidence is stored in:

- `docs/security/SECURITY_REVIEW.md`.
- `docs/security/THREAT_MODEL.md`.
- `docs/security/RESIDUAL_RISK_REGISTER.md`.
- `docs/testing/SECURITY_TESTING_REPORT.md`.
- `docs/formal-methods/FORMAL_SPECIFICATION.md`.
- `docs/formal-methods/VERIFICATION_REPORT.md`.

## Appendix E - Known Residual Work

The current project records these future or environment-specific items:

- Execute Playwright browser checks in the target browser environment.
- Execute OWASP ZAP scans against a configured deployment.
- Execute SonarQube analysis against the final repository state.
- Add distributed rate limiting before horizontal scaling.
- Automate backup scheduling before production use.
- Select email and notification providers before notification expansion.

These items are documented and do not block Task 11 completion because they are
either planned QA execution steps or approved future improvements.
