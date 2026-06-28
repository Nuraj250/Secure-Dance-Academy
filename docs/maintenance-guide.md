# Maintenance Guide

Purpose: define the recurring operational, security, and documentation
maintenance work required to keep the Secure Dance Academy Management System
reliable after implementation.

## Maintenance Principles

- Preserve security before convenience.
- Keep documentation synchronized with the deployed system.
- Review audit evidence regularly.
- Test before and after changes.
- Back up before migrations.
- Record residual risks instead of hiding them.

## Routine Checks

| Frequency | Check |
| --- | --- |
| Daily | Confirm login, dashboard, protected-route redirect, and `/api/health`. |
| Weekly | Review audit logs for repeated failures or unusual administrative actions. |
| Weekly | Review pending users, invitations, and disabled accounts. |
| Monthly | Run lint, typecheck, build, and Jest against the current branch. |
| Monthly | Review dependency updates and security advisories. |
| Before release | Run full verification and update test evidence. |
| Before migration | Capture a backup or restore point. |

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run build
npm test -- --runInBand
```

Run Playwright, ZAP, and SonarQube according to the plans in `docs/testing/`
when preparing a release environment.

## Dependency Maintenance

1. Review dependency updates.
2. Prefer patch and minor updates first.
3. Read release notes for Next.js, React, Prisma, Supabase, and security
   tooling.
4. Run the full verification suite.
5. Update documentation if behavior or commands change.

## Database Maintenance

- Review Prisma schema changes before migration.
- Avoid manual production database edits.
- Keep migration history with the application code.
- Validate seed data against the approved baseline roles and settings.
- Monitor indexes and query performance when datasets grow.

## Backup And Restore

Before migrations or releases:

- Confirm Supabase backup or point-in-time recovery settings.
- For local Docker PostgreSQL, export a dump with `pg_dump`.
- Store backups outside the application repository.
- Test restore steps periodically.

## Security Maintenance

Review:

- Supabase Auth settings.
- Redirect URLs.
- Environment variables and secret rotation needs.
- CSP and security headers.
- Rate limit assumptions.
- Residual risk register.
- Audit logs for denied actions.

Move the in-memory rate limiter to a distributed store if the application is
scaled across multiple processes or regions.

## Incident Response

If a security incident is suspected:

1. Preserve audit logs.
2. Disable affected accounts when appropriate.
3. Rotate compromised credentials.
4. Review Supabase Auth events.
5. Identify affected data classes.
6. Apply a fix and run regression checks.
7. Record the incident, impact, mitigation, and verification.

## Documentation Maintenance

Update the relevant document after every material change:

- Requirements and scope changes: `docs/requirements/`.
- Architecture changes: `docs/architecture/` and ADRs.
- Data model changes: `docs/database/README.md`.
- API changes: `docs/api/README.md`.
- Security changes: `docs/security/`.
- QA evidence: `docs/testing/`.
- Formal behavior changes: `docs/formal-methods/`.
- Deployment changes: `docs/deployment/README.md`.

## Maintenance Checklist

- No critical security issue is open.
- Verification commands pass.
- Database backup is recent.
- Documentation matches implementation.
- Known risks are tracked.
- Release notes or handoff notes are updated.
