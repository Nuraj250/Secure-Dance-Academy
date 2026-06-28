# OWASP ZAP Execution Steps

Status: Prepared for execution

This document gives the exact steps to run OWASP ZAP against the current
application boundary. It does not claim that the scan was executed in this
workspace.

## Prerequisites

- A running local or staging build of the application.
- Dedicated test accounts for administrator, coach, parent, and artist roles.
- Access to OWASP ZAP Desktop or the ZAP baseline/active scan tooling.

## Scope

- Public authentication pages.
- Logged-in dashboard and role-aware routes.
- Session, profile, users, audit, and settings routes.
- APIs that accept user input.

## Steps

1. Start the application and confirm the base URL.
2. Sign in with a dedicated test account for each role that you want to scan.
3. Import the authenticated session into ZAP using the browser session or
   cookies for the current app host.
4. Add the application host to the ZAP context and include the approved route
   scope only.
5. Run a spider against the public routes and the authenticated routes in the
   context.
6. Run passive scanning first and review all informational and low findings.
7. Run a targeted active scan only against the approved scope.
8. Triage each alert manually.
9. Retest any fixed issue using the same authenticated context.
10. Export the final ZAP report and attach it to the evidence bundle.

## Evidence To Capture

- Context definition export.
- Authentication setup notes.
- Passive scan report.
- Active scan report.
- Manual triage notes.
- Retest report if fixes were applied.

## Reporting Rule

If the scan has not been run, report it as “prepared for execution” rather than
as completed evidence.

