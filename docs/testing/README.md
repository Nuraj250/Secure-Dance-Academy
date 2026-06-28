# Testing Documentation

Status: Task 09 delivered and validated

This folder records the quality strategy, execution evidence, and release
validation notes for the Secure Dance Academy Management System.

## Document Set

- `MASTER_TEST_PLAN.md` - end-to-end QA strategy and quality gates.
- `UNIT_TEST_EXPANSION.md` - new and expanded unit coverage for core logic.
- `INTEGRATION_TEST_PLAN.md` - service, repository, and transaction scenarios.
- `API_TEST_PLAN.md` - route-level verification matrix and status expectations.
- `PLAYWRIGHT_TEST_PLAN.md` - browser journeys and accessibility smoke checks.
- `SECURITY_TESTING_REPORT.md` - security control verification summary.
- `OWASP_ZAP_PREPARATION.md` - scan scope, context, and execution notes.
- `SONARQUBE_PREPARATION.md` - static-analysis setup and quality gates.
- `ACCESSIBILITY_CHECKLIST.md` - WCAG 2.2 AA review checklist.
- `PERFORMANCE_CHECKLIST.md` - response-time, rendering, and bundle budgets.
- `REGRESSION_CHECKLIST.md` - workflows that must be rerun after changes.
- `RISK_BASED_TEST_MATRIX.md` - risks mapped to test layers and evidence.
- `BUG_REGISTER.md` - issues found during QA and their status.
- `TEST_EVIDENCE.md` - commands, artifacts, and verification record.
- `COVERAGE_SUMMARY.md` - measured coverage for the core application logic.
- `FINAL_QA_REPORT.md` - release-readiness conclusion and residual risks.

## Current Validation

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm test -- --runInBand` passed.

## Validation Commands

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test -- --runInBand`

## Scope

Testing covers the approved application boundary, with emphasis on:

- Authentication and session security. [SR-01, SR-03, SR-04, ADR 0003]
- Authorization, ownership, and sensitive-data access control. [SR-02, SR-09, ADR 0006]
- Input validation and safe error handling. [SR-05, SR-06, ADR 0006]
- Audit logging and accountability. [SR-07, ADR 0006]
- Secrets, environment values, and transport hardening. [SR-08, SR-10]
- Security testing and standards alignment. [SR-11, SR-12]
- Password policy enforcement. [SR-13]
- Performance and accessibility quality gates. [NFR-01, NFR-06]

## Evidence Summary

- Unit tests now cover security helpers, session resolution, audit logging,
  authorization, auth service branches, dashboard selection, and user service
  access control.
- The testing report and coverage summary record the measured results from the
  current codebase.
- Security, performance, accessibility, and regression concerns are documented
  as explicit checklists rather than left implicit.
