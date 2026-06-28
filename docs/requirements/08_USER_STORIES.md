# User Stories

| ID | User Story | Acceptance Criteria | Security Considerations |
| --- | --- | --- | --- |
| US-01 | As an administrator, I want to manage users and roles so that access stays controlled. | Admin can create, update, disable, and reassign users and roles. | Changes are logged and authorized. |
| US-02 | As a coach, I want to record attendance so that class participation is tracked accurately. | Attendance can be created and reviewed for a session. | Duplicate attendance is prevented. |
| US-03 | As a parent, I want to view my linked child’s attendance and progress so that I can stay informed. | Parent can see only linked child records. | No unrelated child data is exposed. |
| US-04 | As an artist, I want to keep my profile current so that my records stay accurate. | Profile fields can be updated where permitted. | Sensitive fields remain protected. |
| US-05 | As an administrator, I want to review audit logs so that I can investigate important actions. | Audit log entries are readable and immutable. | Audit access is restricted. |
| US-06 | As a coach, I want to record performance and injury information so that I can track progress and welfare. | Entries can be created for assigned artists. | Access is limited to assigned artists. |
| US-07 | As a parent or administrator, I want to manage emergency contacts and medical notes so that safeguarding is possible. | Restricted users can update the relevant fields. | Medical data is protected. |
| US-08 | As a user, I want to search and filter records so that I can find information quickly. | Search and filter return the expected subset. | Only authorized data is returned. |
| US-09 | As an administrator, I want to generate reports so that I can make operational decisions. | Reports can be generated for permitted data sets. | Report output respects permissions. |
| US-10 | As a user, I want to receive notifications so that I do not miss important changes. | Pending notifications are visible to me. | Notification content avoids sensitive leakage. |

## User Story Notes

- Stories are intentionally written around business outcomes.
- Every story should become testable during later QA and acceptance work.
