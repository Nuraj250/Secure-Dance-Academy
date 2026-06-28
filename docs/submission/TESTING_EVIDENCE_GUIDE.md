# Testing Evidence Guide

This guide explains how the current repository demonstrates testing evidence
for the assignment rubric.

## What Exists

- Local validation gates are documented and have passed in this workspace:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm test -- --runInBand`
- Unit tests cover the most security-sensitive helpers and services.
- QA plans exist for integration, API, Playwright, security, accessibility,
  performance, regression, and risk-based coverage.
- Final QA evidence is recorded in `docs/testing/FINAL_QA_REPORT.md`.

## Where To Look

- `docs/testing/README.md`
- `docs/testing/TEST_EVIDENCE.md`
- `docs/testing/COVERAGE_SUMMARY.md`
- `docs/testing/FINAL_QA_REPORT.md`
- `tests/`

## How To Present The Evidence

1. Start with the four local gates listed above.
2. Point to the Jest suites under `tests/lib/` and `tests/features/`.
3. Show the coverage summary and final QA report.
4. Use the QA plans to explain what remains environment-dependent.
5. Distinguish local evidence from prepared external scans.

## What Not To Claim

- Do not claim browser automation execution if only the plan exists.
- Do not claim OWASP ZAP execution unless a scan report is attached.
- Do not claim SonarQube execution unless the dashboard or report is attached.

## Evidence Summary For Marking

| Evidence type | Status | Notes |
| --- | --- | --- |
| Local lint/typecheck/build/test gates | Complete | Verified in this workspace. |
| Security unit tests | Complete | Core auth, RBAC, audit, and security helpers are covered. |
| Coverage summary | Complete | Captured in `docs/testing/COVERAGE_SUMMARY.md`. |
| Browser automation execution | Prepared for execution | Documented in `docs/testing/PLAYWRIGHT_TEST_PLAN.md`. |
| OWASP ZAP execution | Prepared for execution | Steps are documented in `OWASP_ZAP_EXECUTION_STEPS.md`. |
| SonarQube execution | Prepared for execution | Steps are documented in `SONARQUBE_EXECUTION_STEPS.md`. |

