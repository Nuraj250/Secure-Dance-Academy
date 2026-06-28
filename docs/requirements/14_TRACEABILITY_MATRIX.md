# Requirements Traceability Matrix

| Requirement Area | Key IDs | Business Goal | Verification | Formal Method | Report Section |
| --- | --- | --- | --- | --- | --- |
| Authentication and access | FR-01, FR-02, FR-03, SR-01, SR-02, SR-03, SR-04 | Secure access and safeguarding | Auth tests, authorization tests, session tests | Authentication FSM | Security and Testing |
| Controlled onboarding | FR-22, BR-11, BRULE-11, SR-13 | Safe account creation | Onboarding and password policy tests | Registration and access-control model | Requirements and Security |
| User and role management | FR-04, FR-05, BRULE-06 | Controlled administration | Role management tests | Role assignment FSM | Requirements and Security |
| Artist, parent, coach relationships | FR-06, FR-07, FR-08, BRULE-01, BRULE-02, BRULE-07 | Accurate academy relationships | Relationship tests, permission tests | Reachability model | Requirements and Database |
| Attendance | FR-09, BRULE-03, BRULE-07, NFR-01 | Reliable attendance records | Integration and regression tests | Attendance FSM and Petri net | Requirements and Formal Methods |
| Performance, injury, and medical records | FR-10, FR-11, FR-12, SR-09 | Track wellbeing and progress safely | Security and integration tests | Access-control model | Security and Testing |
| Activities and notifications | FR-13, FR-14, US-10 | Keep users informed | Functional and end-to-end tests | Notification flow model | Requirements and UI |
| Dashboards, reports, and export | FR-15, FR-16, FR-18, FR-21 | Operational visibility | API, UI, and report tests | Report flow model | Requirements and Testing |
| Audit and administrative oversight | FR-17, FR-20, BRULE-05, BRULE-09, SR-07 | Accountability and control | Audit log tests and review | Audit event model | Security and Documentation |
| Privacy and legal compliance | PR-01 to PR-08, LR-01 to LR-06 | Data protection and compliance | Review against policy and acceptance criteria | Compliance mapping | Security and Documentation |
| Quality attributes | NFR-01 to NFR-12 | Usability, reliability, and delivery readiness | Performance, accessibility, and recovery tests | Validation scenarios | Testing and Final Review |

## Traceability Notes

- Each requirement document should remain numbered so later design and test work can
  reference stable identifiers.
- This matrix is intentionally requirement-centric rather than implementation-centric.
