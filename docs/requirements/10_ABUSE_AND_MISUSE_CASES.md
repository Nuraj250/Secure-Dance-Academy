# Abuse and Misuse Cases

## Abuse Cases

| ID | Abuse Case | Mitigation |
| --- | --- | --- |
| AC-01 | Credential stuffing against sign-in or recovery flows. | Rate limiting, strong recovery controls, monitoring. |
| AC-02 | Privilege escalation through manipulated role claims. | Server-side authorization and audit logging. |
| AC-03 | Unauthorized access to a linked or unlinked child record. | Ownership checks and strict role restrictions. |
| AC-04 | Theft of a session token or session replay. | Secure session handling and expiration controls. |
| AC-05 | Tampering with attendance, performance, or injury data. | Authorization, immutability checks, audit logs. |
| AC-06 | Exporting more data than the user is allowed to see. | Permission-filtered exports and access checks. |
| AC-07 | Attempts to read medical records without approval. | Restricted access and sensitive-data controls. |
| AC-08 | Malicious or oversized input to destabilize the system. | Input validation, size controls, and rejection. |

## Misuse Cases

| ID | Misuse Case | Prevention |
| --- | --- | --- |
| MC-01 | A user enters a weak password. | Strong password rules and feedback. |
| MC-02 | A coach records attendance for the wrong session. | Clear session selection and confirmation. |
| MC-03 | A parent attempts to open an unlinked child profile. | Ownership validation and denial. |
| MC-04 | An admin accidentally deletes a record that should be preserved. | Confirmation and soft-delete policy where applicable. |
| MC-05 | A user submits duplicate attendance by mistake. | Duplicate detection and validation. |
| MC-06 | A user navigates to a page after the session has expired. | Graceful session expiration handling. |
| MC-07 | A user exports a report with an incorrect filter. | Reviewable filters and export preview. |
| MC-08 | A user enters incomplete medical or contact information. | Required-field validation and inline feedback. |

## Notes

- Abuse cases model malicious intent.
- Misuse cases model accidental error and help shape safer workflows.
