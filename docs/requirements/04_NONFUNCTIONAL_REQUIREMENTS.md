# Non Functional Requirements

| ID | Category | Requirement | Measure |
| --- | --- | --- | --- |
| NFR-01 | Performance | Common pages and record views shall load within 2 seconds under normal operating conditions. | Median response under 2 seconds for standard actions. |
| NFR-02 | Availability | The system shall be available 99.5% of scheduled operating time excluding maintenance windows. | Monthly uptime report. |
| NFR-03 | Reliability | The system shall not lose committed data during normal operation. | Confirmed by transaction integrity and recovery testing. |
| NFR-04 | Scalability | The system shall support at least 2x growth in active users and records without redesign. | Load and growth assumptions documented. |
| NFR-05 | Maintainability | Feature modules shall remain independently understandable and changeable. | New work should not require broad refactoring. |
| NFR-06 | Accessibility | The system shall meet WCAG 2.2 AA expectations. | Keyboard, screen reader, contrast, and focus testing pass. |
| NFR-07 | Usability | Critical tasks shall be completable without special training for common user roles. | Task completion observed in acceptance review. |
| NFR-08 | Compatibility | The system shall support the latest two stable versions of major desktop browsers. | Verified in cross-browser testing. |
| NFR-09 | Portability | The system shall be deployable in a reproducible environment using the approved deployment approach. | Successful repeatable deployment evidence. |
| NFR-10 | Backup | Recoverable backups shall exist for system data and configuration. | Backup completion and restore evidence. |
| NFR-11 | Disaster Recovery | Recovery objectives shall be defined and testable. | RPO and RTO documented and validated. |
| NFR-12 | Logging and Monitoring | Important security and operational events shall be logged and reviewable. | Logs contain actionable event history. |

## Non Functional Requirement Notes

- These requirements define quality thresholds, not implementation mechanics.
- Performance and availability must not weaken security or data integrity.
