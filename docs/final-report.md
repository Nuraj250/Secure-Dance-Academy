# Final MSc Report

Title: Secure Dance Academy Management System

Module: 7032CE Secure Design and Development

Version: 1.0

## 1. Introduction

The Secure Dance Academy Management System is a production-oriented web
application for managing academy users, artists, coaches, parents, activities,
attendance, performance records, injury records, medical summaries, reports,
notifications, settings, and audit logs. The project was designed to demonstrate
secure software engineering rather than only coursework completion. Its main
engineering concern is the protection of child, medical, identity, and
operational data while keeping daily workflows usable for administrators,
coaches, parents, and artists.

The application uses Next.js 15, TypeScript, Tailwind CSS, Supabase
Authentication, Supabase PostgreSQL, Prisma ORM, Jest, Playwright planning,
OWASP ZAP preparation, SonarQube preparation, Docker, and Vercel deployment
boundaries. The project follows feature-based Clean Architecture so that
presentation, business logic, infrastructure, and data access remain separated.

## 2. Requirements Analysis

The approved requirements baseline defines a single-academy system with future
expansion deliberately left open. Controlled onboarding is in scope, while
public self-registration is excluded. The main roles are administrator, coach,
parent, and artist. The system must support authentication, authorization,
profile management, artist records, attendance, performance tracking, injury
tracking, medical records, activities, reports, notifications, settings, audit
logs, search, filtering, pagination, and export preparation.

The highest-risk requirements relate to child protection, medical data, account
control, and auditability. Parents must only access their own linked children.
Coaches must only access assigned artists. Artists must only access their own
permitted records. Administrators have broad operational power, but that power
is still controlled through explicit role checks and audit logging.

## 3. System Design

The system is built around feature-based Clean Architecture. Route handlers and
server actions form the backend boundary. Services contain business rules.
Repositories contain Prisma data access. Shared infrastructure in `lib/`
provides authentication, authorization, validation, security headers, CSRF
checks, rate limiting, safe response envelopes, audit helpers, and Supabase
integration.

The database design is normalized around users, roles, artists, guardian
relationships, coach assignments, activities, attendance, performances,
injuries, medical profiles, notifications, report exports, settings,
invitations, consent records, and audit logs. UUIDs are used for public-facing
entities. Relationship tables model parent and coach access without duplicating
profile data.

## 4. Secure Development Methodology

Security was treated as an architectural requirement from the start. The
engineering rules prioritize security, correctness, maintainability, simplicity,
scalability, performance, developer convenience, and visual effects in that
order. The project uses Secure by Design, Privacy by Design, least privilege,
defense in depth, fail secure behavior, and zero trust assumptions.

Major security decisions are recorded in ADRs. Supabase Authentication and
secure cookie sessions are accepted in ADR 0003. Prisma repositories are
accepted in ADR 0004. Server-side security middleware, validation, and audit
logging are accepted in ADR 0006.

## 5. Implementation

The current implementation includes the application shell, public
authentication screens, protected layouts, role-aware navigation, dashboard
models, profile workflows, user APIs, audit APIs, authentication APIs, security
utilities, validation utilities, repository helpers, and a production Prisma
schema.

The frontend uses server components first and client components only where
interactivity is needed. Shared UI primitives provide buttons, cards, tables,
forms, badges, pagination, loading states, empty states, error states, charts,
and layout components. The protected screen surface renders role-scoped pages
for operational areas while server-side logic continues to enforce access.

## 6. Security Mechanisms

Authentication is delegated to Supabase Auth. Sessions are handled through
secure HTTP-only cookies. Protected routes use middleware for coarse session
presence and server services for final session resolution. Authorization uses
RBAC, account-state checks, ownership checks, and relationship scoping.

Mutating API routes enforce same-origin checks. Sensitive flows are rate
limited. Zod validates request bodies, query parameters, and server action
inputs. Errors use safe envelopes and avoid stack traces, SQL, secrets, and
framework internals. Security headers include content security policy, HSTS,
frame denial, referrer policy, and permissions policy. Audit records capture
actor, request, entity, action, outcome, before data, after data, and metadata
where appropriate.

## 7. Testing And Analysis

Testing evidence is organized under `docs/testing/`. The required local gates
are lint, type checking, production build, and Jest. The latest Task 10
verification recorded all four gates passing. The Jest suite covers RBAC,
authorization, API responses, route-handler errors, request validation, security
headers, cookies, CSRF, rate limiting, logging, sanitization, audit helpers,
authentication service behavior, session service behavior, audit service
behavior, dashboard role selection, and user service access control.

The QA documentation also defines integration, API, Playwright, OWASP ZAP,
SonarQube, accessibility, performance, regression, risk-based, bug, evidence,
coverage, and final QA artefacts. Browser and external scanner execution remain
planned for the target environment, which is recorded transparently as residual
release work rather than hidden.

## 8. Formal Methods

Task 10 added formal behavioral documentation under `docs/formal-methods/`.
The models cover authentication, password recovery, session lifecycle,
controlled onboarding, role assignment, attendance, protected record access,
and auditability. The package includes finite state machines, Petri net style
diagrams, transition tables, invariants, threat mitigation mapping, trust
boundary verification, data flow verification, evidence, traceability, and a
formal review report.

The formal methods work is model-based and manually reviewed. No separate
proof assistant or model checker was introduced. This is appropriate for the
current coursework and repository scope because the models are traceable to the
requirements, ADRs, security review, test evidence, and implementation
boundaries.

## 9. Legal And Ethical Considerations

The system processes personal information, child records, emergency contact
details, medical summaries, attendance history, and performance information.
The design therefore applies data minimization, purpose limitation, least
privilege, retention awareness, and secure deletion planning. GDPR and
Singapore PDPA principles are considered in the requirements and security
documentation.

Ethically, child and medical data should only be collected when operationally
necessary, accessed only by authorized users, and protected from unnecessary
disclosure. Audit logs support accountability, while role scoping reduces
inappropriate visibility.

## 10. Evaluation

The project demonstrates a coherent secure engineering lifecycle. Requirements
define scope and risks. Architecture establishes boundaries. Database design
protects integrity. Backend services enforce validation and authorization.
Frontend screens provide role-aware usability. Security documentation explains
controls and residual risks. Testing records evidence and quality gates. Formal
methods verify the highest-risk workflows at the behavioral level.

The main limitation is that some external quality activities, such as live ZAP
and SonarQube execution, are prepared but not executed inside this workspace.
This is acceptable for the current local delivery because the plans, scope, and
quality gates are documented and ready for execution in a target environment.

## 11. Future Improvements

Future work should add a distributed rate limiter, push notifications, email
provider integration, backup automation, richer analytics, mobile support,
calendar synchronization, payment integration, and multi-academy tenancy. These
should be introduced through new requirements, ADRs, tests, and documentation
updates rather than ad hoc implementation.

## 12. Conclusion

The Secure Dance Academy Management System satisfies the project goal of a
secure, maintainable, and professionally documented application. It protects
sensitive personal and medical data through layered controls, uses a normalized
database model, follows feature-based Clean Architecture, includes security and
quality evidence, and provides formal behavioral verification for critical
workflows. The project is ready for final engineering review.

## 13. Harvard References

See `docs/references.md` for the consolidated Harvard-style reference list used
by the project documentation.
