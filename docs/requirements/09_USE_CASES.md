# Use Cases

## UC-01 Sign In

- Actor: Administrator, coach, parent, artist
- Preconditions: The user has valid access credentials or approved recovery access.
- Main flow: The user enters credentials, the system authenticates, and the user lands in the correct role-aware area.
- Alternative flow: The user requests password recovery.
- Exception flow: Invalid credentials are rejected without exposing account details.
- Postconditions: The session is active or the attempt is safely denied.
- Security requirements: Authentication, rate limiting, session control, safe error handling.

## UC-02 Manage User Roles

- Actor: Administrator
- Preconditions: The administrator is authenticated and authorized.
- Main flow: The administrator reviews an account, changes the role, and saves the update.
- Alternative flow: The administrator cancels the change before save.
- Exception flow: Unauthorized role changes are blocked.
- Postconditions: The role change is recorded and auditable.
- Security requirements: Authorization, audit logging, change provenance.

## UC-03 Record Attendance

- Actor: Coach or administrator
- Preconditions: The session and artist exist.
- Main flow: The user selects the session, selects the artist, records attendance, and saves.
- Alternative flow: The user corrects the entry before submission.
- Exception flow: Duplicate entries are rejected.
- Postconditions: Attendance is stored consistently.
- Security requirements: Ownership checks, input validation, audit logging.

## UC-04 Update Performance Record

- Actor: Coach or administrator
- Preconditions: The artist is assigned and the user is authorized.
- Main flow: The user enters performance information and saves it.
- Alternative flow: The user adds supplementary notes before save.
- Exception flow: Access to unassigned artists is denied.
- Postconditions: The record is available to permitted viewers.
- Security requirements: Authorization, restricted visibility, audit log.

## UC-05 Update Injury or Medical Record

- Actor: Administrator or authorized coach
- Preconditions: The actor is authorized for the protected record.
- Main flow: The user enters the update and submits it for storage.
- Alternative flow: The user cancels and returns to the record.
- Exception flow: Unauthorized edits are blocked.
- Postconditions: Sensitive record data is updated safely.
- Security requirements: Restricted access, audit logging, safe validation.

## UC-06 View Linked Child Data

- Actor: Parent
- Preconditions: The parent account is active and linked to the child profile.
- Main flow: The parent opens the child record and reviews permitted fields.
- Alternative flow: The parent switches between linked children.
- Exception flow: Unlinked child access is denied.
- Postconditions: The parent sees only permitted information.
- Security requirements: Ownership validation and access restriction.

## UC-07 Generate Report

- Actor: Administrator, coach, parent where permitted
- Preconditions: The actor has report access for the requested data.
- Main flow: The user selects report parameters and generates the report.
- Alternative flow: The user narrows the report scope with filters.
- Exception flow: Restricted data is excluded from output.
- Postconditions: A permitted report is produced.
- Security requirements: Authorization, output filtering, auditability.

## UC-08 Review Audit Log

- Actor: Administrator or system administrator
- Preconditions: The actor has audit access.
- Main flow: The user filters and opens audit events.
- Alternative flow: The user narrows the search window or action type.
- Exception flow: Attempted changes to audit history are rejected.
- Postconditions: Audit evidence remains intact.
- Security requirements: Immutability, restricted access, logging integrity.
