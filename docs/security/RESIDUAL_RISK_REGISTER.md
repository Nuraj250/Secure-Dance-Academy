# Residual Risk Register

Status: Task 08 complete

| ID | Risk | Impact | Likelihood | Current Treatment | Residual Status |
| --- | --- | --- | --- | --- | --- |
| RR-01 | In-memory rate limiting resets when the process restarts and does not coordinate across replicas. | Medium | Medium | Login, reset, session, and admin routes are throttled in-process and by request scope. | Accepted for current deployment profile. |
| RR-02 | The production CSP still allows inline scripts because of Next.js runtime requirements. | Medium | Medium | HSTS, frame denial, same-origin requests, and strict server-side authorization reduce the impact. | Accepted with monitoring. |
| RR-03 | Supabase auth and password reset availability depend on the external provider. | Medium | Low | Failures return safe service-unavailable errors and no secrets are exposed. | Accepted as a platform dependency. |
| RR-04 | Browser-based abuse can still attempt high-volume distributed requests. | Medium | Medium | Authentication, recovery, and sensitive listing routes are rate limited and audited. | Accepted pending future distributed throttling. |
| RR-05 | Future features may introduce new file upload or external integration surfaces. | High | Low | Current implementation does not expose those surfaces. Security review must be repeated before they are added. | Deferred to future change review. |

## Owner And Review Cadence

- Owner: Security lead.
- Review trigger: new authentication flow, new sensitive data type, new upload
  surface, or deployment topology change.
- Review expectation: update the threat model, add tests, and refresh the risk
  register before release.
