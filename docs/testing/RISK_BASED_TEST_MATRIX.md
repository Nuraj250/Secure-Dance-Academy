# Risk-Based Test Matrix

This matrix prioritizes the highest-value test work against the approved scope
and security baseline.

| Risk | Impact | Likelihood | Primary tests | Evidence |
| --- | --- | --- | --- | --- |
| Broken access control | Unauthorized access to user, child, medical, or audit data. [SR-02, SR-09] | Medium | Auth service tests, user service tests, audit service tests, route-handler tests, ZAP prep. | Unit and route tests, security report. |
| Session theft or reuse | Hijacked session grants unauthorized access. [SR-03, SR-04, SR-10] | Medium | Cookie, session, and header tests; login/logout flow tests; ZAP prep. | Security report and test logs. |
| CSRF on mutating requests | State changes are triggered by a cross-site request. [SR-03, SR-10] | Medium | CSRF helper tests, route-handler tests, regression checklist. | Security report and API plan. |
| Credential abuse | Brute force or repeated auth attempts degrade security. [SR-01, SR-13] | Medium | Rate-limit tests, auth route tests, manual abuse checks. | Test logs and security report. |
| Sensitive data leakage | Child or medical data is exposed to the wrong role. [SR-09] | High | User service tests, dashboard tests, manual access checks, Playwright plan. | Service tests and QA evidence. |
| Unsafe error handling | Stack traces or internals leak to users. [SR-05, SR-06] | Medium | Route-handler tests, API contract checks, regression checklist. | API plan and unit tests. |
| Audit loss | Material events are not written or are mutable. [SR-07] | Medium | Audit helper tests, audit service tests, integration plan. | Audit tests and report. |
| Accessibility regression | A core workflow becomes unusable with keyboard or assistive tech. [NFR-06] | Medium | Accessibility checklist, Playwright plan, manual review. | Checklist and browser evidence. |
| Performance regression | Common pages exceed the 2 second usability target. [NFR-01] | Medium | Performance checklist, browser smoke checks, build review. | Performance notes and timing records. |

## Test Priority Order

1. Authentication and access control.
2. Child and medical data protection.
3. CSRF, rate limiting, and secure headers.
4. Audit logging and safe errors.
5. Accessibility and performance.

