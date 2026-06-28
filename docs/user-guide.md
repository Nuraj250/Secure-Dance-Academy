# User Guide

Purpose: explain how administrators, coaches, parents, and artists use the
Secure Dance Academy Management System for common daily work.

## Signing In

1. Open `/login`.
2. Enter the registered email address and password.
3. Submit the form.
4. If the account is active, the system opens the protected dashboard.

If the account is pending approval, the system shows the pending approval page.
If access is denied, contact the academy administrator.

## Password Recovery

1. Open `/forgot-password`.
2. Enter the account email address.
3. Follow the reset link sent by Supabase Auth.
4. Set a new password at `/reset-password`.

The system uses generic messages so attackers cannot confirm whether an email
address is registered.

## Navigation

The left navigation is role-aware. Users see only the areas relevant to their
role and permissions.

Common areas:

- Dashboard.
- Profile.
- Notifications.
- Search.
- Artists.
- Activities.
- Attendance.
- Performances.
- Reports.

Administrator-only areas include user management, audit logs, invitations, and
settings.

## Profile Management

Open `/profile` to review and update permitted contact details and local
preferences. Some fields, such as account status and role assignment, require
administrator approval.

## Administrator Tasks

Administrators use the system to:

- Review the academy dashboard.
- Manage user accounts.
- Review pending approvals and invitations.
- Monitor audit logs.
- Review reports and settings.
- Check academy-wide artists, activities, attendance, and sensitive records.

Administrators should follow `docs/administrator-guide.md` for operational and
security responsibilities.

## Coach Tasks

Coaches use the system to:

- View assigned artists.
- Review today's activities.
- Track attendance records.
- Review performance records.
- Monitor injury follow-up.
- Use reports for assigned operational work.

Coaches should only access records connected to their assigned artists.

## Parent Tasks

Parents use the system to:

- View linked child profiles.
- Review permitted attendance and performance summaries.
- See notifications from the academy.
- Review medical profile status where access is allowed.
- Open reports that are scoped to their children.

Parents cannot access unrelated artists or other families' records.

## Artist Tasks

Artists use the system to:

- Review their personal dashboard.
- View profile information.
- Check activity enrollment and attendance history.
- Review performance history.
- See permitted medical profile status.
- Read notifications.

Child artist access is protected and managed through authorized adults.

## Search

Use `/search` to find permitted records across artists, activities,
notifications, and reports. Search results are scoped by role and relationship.
If a record is not visible, the user is not authorized for that record.

## Notifications

Notifications show relevant academy updates. Users should review unread
notifications regularly and follow any action requested by the academy.

## Reports

Reports show queued or completed exports. Users can only see report records
that match their role and scope.

## Troubleshooting

| Issue | Action |
| --- | --- |
| Cannot sign in | Confirm credentials and use password recovery if needed. |
| Pending approval page appears | Contact the administrator to complete onboarding. |
| Access denied page appears | The account lacks permission for that area. |
| Expected child or artist is missing | Ask an administrator to review relationship links. |
| Password reset link fails | Request a new reset link. |
| Data looks incorrect | Report the issue to an administrator with the page and record name. |

## Security Reminders

- Do not share passwords.
- Sign out on shared devices.
- Do not export or share child or medical data unless authorized.
- Report suspicious access or incorrect data immediately.
