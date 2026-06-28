# Administrator Guide

Purpose: explain the administrative operation of the Secure Dance Academy
Management System for academy owners, system administrators, and support staff.

## Administrator Responsibilities

Administrators manage the operational and security state of the academy:

- Review dashboards and activity summaries.
- Manage users and account status.
- Control onboarding through invitations and approvals.
- Review artist, parent, and coach relationships.
- Monitor attendance, performance, injury, and medical records.
- Review reports and exports.
- Inspect audit logs.
- Maintain settings and operational configuration.

## Access

Administrators sign in through `/login`. Accounts must be active before access
is granted. Pending, suspended, disabled, and archived accounts are blocked from
protected routes.

If a user forgets a password, use the password recovery flow from
`/forgot-password`. The reset process uses Supabase Auth and returns generic
messages to reduce account enumeration risk.

## Dashboard

The administrator dashboard provides:

- Active, pending, suspended, and archived user counts.
- Upcoming activities.
- Pending approvals.
- Recent audit events.
- Invitations awaiting acceptance.
- Open report exports.
- Unread notification counts.

Use this dashboard as the first daily operational review.

## User Management

User management is available from `/users`.

Common actions:

- Search and filter users.
- Review role and status.
- Open a user profile.
- Update permitted profile fields.
- Change account status where authorized.
- Archive users when operationally required.

Archive instead of deleting users when audit history must remain intact.

## Controlled Onboarding

The system baseline excludes public self-registration. New accounts should be
created through controlled administrative onboarding and invitations.

Operational rules:

- Assign only the required role.
- Link parent and coach access to the correct artist relationships.
- Keep accounts inactive until approval is complete.
- Review pending invitations regularly.

## Artist, Parent, And Coach Records

Administrators can review academy-wide artist, guardian, and coach assignment
records. Relationship records are security controls, not only directory data.

- Parents should see only linked child artists.
- Coaches should see only assigned artists unless granted broader access.
- Artists should see only their own permitted profile and activity data.

## Attendance And Performance

Attendance and performance pages provide operational visibility into recent
records. Administrators should use filters and reports to review:

- Missing or pending attendance.
- Performance activity by artist.
- Activity schedules and coverage.
- Records that need correction or review.

## Injury And Medical Records

Injury and medical information is sensitive. Administrators should access it
only for legitimate operational, safety, or safeguarding reasons.

Review:

- Open or monitoring injury records.
- Follow-up due dates.
- Medical profile status.
- Emergency instruction availability.

Do not export or disclose medical information outside approved academy
processes.

## Reports

Reports show queued and completed export records. Before sharing a report:

- Confirm the requester is authorized.
- Confirm filters do not include unrelated child or medical data.
- Confirm the export has not expired.
- Record sensitive report handling in the audit trail where appropriate.

## Audit Logs

The audit log is available from `/audit-log`.

Use it to review:

- Authentication events.
- Authorization failures.
- User updates and archives.
- Security-sensitive administrative activity.
- Unexpected access attempts.

Audit records are designed to support accountability and investigation.

## Settings

Settings are administrator-only. Treat settings changes as production changes:

- Review the current value.
- Confirm the business reason.
- Apply the smallest necessary change.
- Verify behavior after the change.

## Operational Maintenance

Administrators should confirm:

- Verification commands pass before release.
- Backups or restore points exist before migrations.
- Supabase redirect URLs match deployed environments.
- Known residual risks are reviewed.
- Documentation remains aligned with the deployed system.

## Escalation

Escalate immediately if:

- Unauthorized access is suspected.
- Audit logs show repeated denied access.
- Medical or child data appears outside approved scopes.
- Authentication or password reset behavior is unavailable.
- Database recovery is required.
