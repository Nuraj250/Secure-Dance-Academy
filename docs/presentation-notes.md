# Presentation Notes

Purpose: provide a concise presentation structure for demonstrating the Secure
Dance Academy Management System to assessors and stakeholders.

Target length: 8 to 10 minutes.

## Slide 1 - Project Overview

Message: The project is a secure management system for dance academies handling
children, adults, coaches, parents, attendance, injuries, performances, medical
records, reports, and audit logs.

Speaker notes:

- State the problem: sensitive academy operations need controlled digital
  workflows.
- Explain the goal: production-quality secure software, not a throwaway
  coursework prototype.

## Slide 2 - Requirements And Scope

Message: The approved baseline supports administrator, coach, parent, and artist
workflows in a single-academy system.

Speaker notes:

- Controlled onboarding is in scope.
- Public self-registration, payments, mobile apps, AI, and multi-tenancy are out
  of scope for this release.
- Child and medical data protection drives the design.

## Slide 3 - Architecture

Message: The system follows feature-based Clean Architecture.

Speaker notes:

- App Router and route handlers form the boundary.
- Services contain business rules.
- Repositories contain Prisma data access.
- Shared security utilities enforce consistent behavior.

## Slide 4 - Database Design

Message: The PostgreSQL schema is normalized and designed for integrity,
auditability, and future growth.

Speaker notes:

- Users link to Supabase identities.
- Roles, guardian links, and coach assignments model authorization scope.
- Attendance, performance, injury, medical, report, notification, and audit data
  are separate entities.

## Slide 5 - Security Controls

Message: Security is layered across authentication, authorization, validation,
headers, CSRF, rate limiting, safe errors, and audit logging.

Speaker notes:

- Supabase Auth handles identity.
- Backend authorization remains mandatory.
- Sensitive data is scoped by role and relationship.
- Audit records support accountability.

## Slide 6 - Implementation

Message: The implementation includes protected layouts, role-aware navigation,
dashboards, auth flows, user workflows, audit APIs, and operational read views.

Speaker notes:

- Show `/login`.
- Show a protected dashboard.
- Explain role-aware navigation.
- Show user or audit workflows if a seeded environment is available.

## Slide 7 - Testing And QA

Message: The project uses layered quality evidence.

Speaker notes:

- Lint, typecheck, build, and Jest pass locally.
- Jest covers high-risk server logic.
- Browser, ZAP, SonarQube, accessibility, performance, and regression plans are
  documented for target environment execution.

## Slide 8 - Formal Methods

Message: Critical workflows are formally modeled.

Speaker notes:

- Authentication, session lifecycle, onboarding, attendance, protected access,
  and auditability are modeled.
- FSMs, Petri nets, invariants, reachability, deadlock, safety, and liveness are
  documented.

## Slide 9 - Evaluation

Message: The project demonstrates a complete secure SDLC from requirements to
formal verification.

Speaker notes:

- Strengths: traceability, layered security, normalized data model, documented
  risks, repeatable verification.
- Limitations: external scanner execution belongs in the deployment environment.

## Slide 10 - Conclusion

Message: The system is ready for final engineering review.

Speaker notes:

- Reiterate protection of child and medical data.
- Reiterate professional engineering evidence.
- Close with future improvements: distributed rate limiting, backup automation,
  notifications, analytics, and multi-academy support.

## Demo Checklist

- Environment variables configured.
- Database seeded or known test data available.
- `npm run build` passes before the demo.
- Login page opens.
- Protected route redirects unauthenticated users.
- Dashboard renders for the selected role.
- Audit or user management page is available for administrator demonstration.
