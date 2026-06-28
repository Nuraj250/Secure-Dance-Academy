# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner | Residual Risk |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-01 | Unauthorized access to sensitive or child-related data. | Medium | High | Strong authorization, ownership checks, audit logs. | Security Architect | Low |
| RISK-02 | Data inconsistency across attendance, performance, or injury records. | Medium | High | Clear business rules and later transactional design. | Solution Architect | Low |
| RISK-03 | Requirement ambiguity causes rework in later phases. | Medium | High | Measurable requirements and traceability. | Requirements Engineer | Low |
| RISK-04 | Accessibility issues reduce usability for real users. | Medium | Medium | WCAG-oriented requirements and testing. | UI/UX Lead | Low |
| RISK-05 | Scope creep adds non-approved features. | Medium | Medium | Strict scope and approval control. | Project Director | Low |
| RISK-06 | Sensitive data could be leaked through exports or reports. | Medium | High | Permission-filtered output and security review. | Backend Lead | Low |
| RISK-07 | Delays in future design choices affect schedule. | Medium | Medium | Record pending decisions and keep them separate from baseline. | Project Director | Medium |
| RISK-08 | Future maintainers misinterpret missing context. | Low | Medium | Strong documentation and traceability. | Technical Writer | Low |

## Risk Notes

- Child safeguarding and medical records are the highest priority risks.
- Risk ownership should transfer into later phases as architecture and implementation start.
