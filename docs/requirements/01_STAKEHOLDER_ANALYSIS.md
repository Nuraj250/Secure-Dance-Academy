# Stakeholder Analysis

| Stakeholder | Responsibilities | Goals | Permissions | Pain Points | Security Concerns | Success Metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Administrator | Manage users, roles, records, reports, and settings. | Operate the academy efficiently and safely. | Full administrative access with least-privilege enforcement. | Too much manual admin work, inconsistent records. | Privilege abuse, data leakage, weak auditing. | Faster admin workflows, complete records, no unresolved security findings. |
| Coach | Record attendance, performance, injuries, and progress. | Track class activity and student progress. | Access assigned artists and relevant reports. | Repetitive data entry, unclear assignments. | Unauthorized access to unassigned records. | Accurate attendance, timely updates, low correction rate. |
| Parent | View and manage linked child information. | Monitor child attendance, wellbeing, and progress. | Access only linked child records. | Hard to know progress or upcoming issues. | Exposure of non-child records, privacy loss. | High portal usage, low support requests, clear visibility. |
| Artist | View own schedule, progress, and profile data. | Stay informed and maintain personal information. | Access own authorized records. | Confusing navigation, incomplete profile data. | Exposure of private or medical data. | Completed profile data, quick access to progress and notifications. |
| System Administrator | Support deployment, configuration, and recovery. | Keep the platform available and maintainable. | Controlled operational access. | Deployment drift, configuration mistakes. | Secret leakage, misconfiguration, data loss. | Stable environment, recoverable systems, secure configuration. |
| Future Developers | Extend and maintain the system. | Add features without breaking existing behavior. | Read code, docs, tests, and architecture decisions. | Missing context, duplicated logic, unclear boundaries. | Inherited security debt, accidental regression. | Low onboarding time, clean change history, clear docs. |
| University Assessors | Evaluate quality, security, and completeness. | Confirm the project meets assessment criteria. | Read-only access to deliverables. | Incomplete evidence or unclear traceability. | Missing proof of security or testing. | Clear marking evidence and strong alignment to criteria. |

## Stakeholder Notes

- Child artists are represented as protected dependent profiles rather than assuming
  independent access in all cases.
- The system must support both operational users and assessment stakeholders.
- Security and privacy expectations are highest for records involving children and
  medical information.
