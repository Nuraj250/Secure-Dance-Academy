# SonarQube Execution Steps

Status: Prepared for execution

This document gives the exact steps to run SonarQube analysis against the
current repository. It does not claim that SonarQube has already been executed
here.

## Prerequisites

- A running SonarQube server or SonarCloud project.
- A project key for this repository.
- Local validation gates already run in the workspace.

## Scope

Include:

- `app/**/*.ts`
- `config/**/*.ts`
- `features/**/*.ts`
- `lib/**/*.ts`
- `middleware.ts`
- `tests/**/*.ts`

Exclude:

- `node_modules/`
- `.next/`
- `coverage/`
- generated or temporary build output

## Steps

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Run `npm test -- --runInBand`.
5. Confirm the SonarQube project key and branch settings.
6. Execute the SonarScanner from the repository root.
7. Review new code issues and security hotspots.
8. Fix any issues that map to approved requirements or ADRs.
9. Re-run the scan after fixes.
10. Save the SonarQube project URL and issue summary with the submission
    evidence.

## Evidence To Capture

- SonarQube dashboard URL.
- Analysis date and branch.
- Issue summary.
- Security hotspot review notes.
- Any accepted-risk notes.

## Reporting Rule

If the scan has not been run, report it as “prepared for execution” rather than
as completed evidence.

