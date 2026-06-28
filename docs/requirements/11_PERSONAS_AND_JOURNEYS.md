# Personas and User Journeys

## Personas

| Persona | Goals | Frustrations | Technical Skills | Accessibility Needs |
| --- | --- | --- | --- | --- |
| Administrator | Control access, keep records accurate, and oversee operations. | Too many manual checks and unclear history. | Moderate to high. | Fast navigation, dense but clear layouts. |
| Coach | Track attendance, progress, and safeguarding issues. | Repeating data entry and hunting for the right records. | Moderate. | Keyboard support, clear forms, fast search. |
| Parent | Monitor child wellbeing and progress. | Not knowing where to find information quickly. | Low to moderate. | Simple navigation, readable text, mobile-friendly layouts. |
| Adult Artist | Review own progress and update profile information. | Unclear status and too many irrelevant screens. | Moderate. | Clear status, responsive design, accessible focus states. |
| Child Artist | Receive protected oversight through adults and staff. | Confusing or overly complex interfaces. | Low. | Very simple language and minimal cognitive load. |

## User Journeys

### Controlled Account Onboarding

1. An administrator creates or approves an account.
2. The user receives credentials or a recovery path.
3. The user signs in and reaches the correct role area.
4. The system confirms the session and available actions.

Pain points:

- Account setup errors
- Missing role assignment
- Poor recovery guidance

Security risks:

- Unauthorized account creation
- Credential compromise

Improvement opportunities:

- Clear validation
- Controlled recovery
- Guided role setup

### Performance Tracking

1. A coach opens the assigned artist list.
2. The coach selects the artist and the performance context.
3. The coach records the performance details.
4. The system saves the entry and keeps it visible to permitted viewers.

Pain points:

- Slow navigation to the correct artist
- Incomplete or inconsistent performance notes

Security risks:

- Access to unassigned artists
- Exposure of non-permitted performance data

Improvement opportunities:

- Search, filters, and assignment-aware permissions

### Logout

1. The user selects sign out.
2. The system ends the session and clears access.
3. The user returns to a safe unauthenticated state.

Pain points:

- Unclear session end state
- Users not knowing whether sign out completed

Security risks:

- Session reuse after sign out

Improvement opportunities:

- Clear confirmation and session expiration handling

### Attendance Recording

1. A coach selects the session.
2. The coach selects the artist.
3. The coach records attendance and saves it.
4. The system confirms the record and logs the event.

Pain points:

- Wrong session selection
- Duplicate entry
- Slow list navigation

Security risks:

- Unassigned access
- Tampering with attendance history

Improvement opportunities:

- Search, filter, and duplicate prevention
- Clear confirmation

### Medical Update Review

1. An authorized user opens a protected record.
2. The user updates approved fields.
3. The system validates and stores the change.
4. The event is logged for accountability.

Pain points:

- Overly complex forms
- Unclear authorization boundaries

Security risks:

- Unapproved data exposure
- Incorrect edits

Improvement opportunities:

- Restricted visibility
- Strong validation and auditability

### Report Review and Export

1. The user selects a report type and filter set.
2. The system returns permitted results.
3. The user reviews and exports the report if allowed.

Pain points:

- Slow filtering
- Excessive data in results

Security risks:

- Data leakage through exports

Improvement opportunities:

- Clear filters
- Authorization-aware export
