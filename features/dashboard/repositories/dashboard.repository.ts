import { prisma } from "@/lib/prisma";
import type { DashboardModel, DashboardTableRow } from "@/features/dashboard/types";
import type { SessionUser } from "@/types/auth";
import { formatDate, formatDateTime } from "@/lib/date";

function dayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function toRows<T>(
  items: T[],
  mapper: (item: T) => DashboardTableRow,
) {
  return items.map(mapper);
}

export class DashboardRepository {
  async buildAdminDashboard(user: SessionUser): Promise<DashboardModel> {
    const { start, end } = dayRange();
    const [
      activeUserCount,
      pendingUserCount,
      suspendedUserCount,
      archivedUserCount,
      upcomingActivities,
      pendingUsers,
      recentAudit,
      recentInvitations,
      queuedExports,
      unreadNotifications,
    ] = await prisma.$transaction([
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.user.count({ where: { status: "ARCHIVED" } }),
        prisma.activity.findMany({
          where: {
            starts_at: { gte: start, lt: new Date(end.getTime() + 7 * 24 * 60 * 60 * 1000) },
            status: { in: ["SCHEDULED", "DRAFT"] },
          },
          orderBy: { starts_at: "asc" },
          take: 5,
          select: {
            id: true,
            title: true,
            kind: true,
            starts_at: true,
            location: true,
            status: true,
          },
        }),
        prisma.user.findMany({
          where: { status: "PENDING" },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            display_name: true,
            email: true,
            status: true,
            created_at: true,
            user_roles: {
              where: { status: "ACTIVE" },
              select: { role: { select: { name: true, code: true } } },
            },
          },
        }),
        prisma.auditLog.findMany({
          orderBy: { occurred_at: "desc" },
          take: 5,
          select: {
            id: true,
            occurred_at: true,
            actor_display_name: true,
            actor_role_code: true,
            action: true,
            entity_type: true,
            entity_id: true,
            outcome: true,
          },
        }),
        prisma.accountInvitation.findMany({
          where: { status: "PENDING" },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            email: true,
            expires_at: true,
            invited_role: { select: { name: true } },
            status: true,
          },
        }),
        prisma.reportExport.findMany({
          where: { status: { in: ["QUEUED", "PROCESSING"] } },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            report_type: true,
            status: true,
            format: true,
            created_at: true,
            completed_at: true,
          },
        }),
        prisma.notification.count({
          where: {
            recipient_user: { status: "ACTIVE" },
            status: { not: "READ" },
          },
        }),
    ]);
    const statusChart = [
      { label: "Active", value: activeUserCount },
      { label: "Pending", value: pendingUserCount },
      { label: "Suspended", value: suspendedUserCount },
      { label: "Archived", value: archivedUserCount },
    ];

    return {
      role: user.primaryRole ?? "administrator",
      title: "Administrator dashboard",
      description: "System oversight, account review, and operational health at a glance.",
      primaryAction: { label: "Create user", href: "/users" },
      secondaryActions: [
        { label: "Review audit", href: "/audit-log", tone: "outline" },
        { label: "Open reports", href: "/reports", tone: "secondary" },
      ],
      metrics: [
        { label: "Active users", value: String(activeUserCount), description: "Approved accounts in use" },
        { label: "Pending users", value: String(pendingUserCount), description: "Awaiting activation" },
        { label: "Upcoming activities", value: String(upcomingActivities.length), description: "Within the next seven days" },
        { label: "Open exports", value: String(queuedExports.length), description: "Queued or processing" },
        { label: "Unread notifications", value: String(unreadNotifications), description: "Visible to active recipients" },
      ],
      chart: {
        title: "User status distribution",
        description: "Account status counts across the active academy user base.",
        points: statusChart,
      },
      lists: [
        {
          title: "Recent audit events",
          description: "Latest accountability trail entries.",
          items: recentAudit.map((entry) => ({
            title: `${entry.action} - ${entry.entity_type}`,
            description: `${entry.actor_display_name ?? "Unknown actor"} • ${entry.actor_role_code} • ${entry.outcome}`,
            timestamp: formatDateTime(entry.occurred_at),
            tone: entry.outcome === "SUCCESS" ? "success" : entry.outcome === "DENIED" ? "warning" : "danger",
          })),
          emptyTitle: "No audit events yet",
          emptyDescription: "Audit entries will appear after protected actions are performed.",
          action: { label: "View audit log", href: "/audit-log", tone: "outline" },
        },
        {
          title: "Pending approvals",
          description: "Accounts waiting for review or activation.",
          items: pendingUsers.map((record) => ({
            title: record.display_name,
            description: record.email,
            timestamp: formatDate(record.created_at),
            tone: "warning",
          })),
          emptyTitle: "No pending approvals",
          emptyDescription: "New accounts will appear here before activation.",
          action: { label: "Open users", href: "/users", tone: "outline" },
        },
        {
          title: "Pending invitations",
          description: "Controlled onboarding still awaiting acceptance.",
          items: recentInvitations.map((invitation) => ({
            title: invitation.email,
            description: `${invitation.invited_role.name} • expires ${formatDate(invitation.expires_at)}`,
            tone: "secondary",
          })),
          emptyTitle: "No invitations in flight",
          emptyDescription: "Invite records will appear here when generated.",
          action: { label: "Manage invitations", href: "/users/invitations", tone: "outline" },
        },
      ],
      tables: [
        {
          title: "Upcoming activities",
          description: "Scheduled operational sessions.",
          columns: [
            { label: "Title" },
            { label: "Kind" },
            { label: "Starts" },
            { label: "Location" },
            { label: "Status" },
          ],
          rows: toRows(upcomingActivities, (activity) => ({
            cells: [
              activity.title,
              activity.kind.toLowerCase(),
              formatDateTime(activity.starts_at),
              activity.location ?? "Not set",
              activity.status.toLowerCase(),
            ],
          })),
          emptyTitle: "No scheduled activities",
          emptyDescription: "Create activities to populate the timetable.",
          action: { label: "Open activities", href: "/activities", tone: "outline" },
        },
        {
          title: "Exports in progress",
          description: "Latest generated or queued exports.",
          columns: [
            { label: "Report" },
            { label: "Format" },
            { label: "Status" },
            { label: "Created" },
          ],
          rows: toRows(queuedExports, (item) => ({
            cells: [
              item.report_type,
              item.format,
              item.status,
              formatDateTime(item.created_at),
            ],
          })),
          emptyTitle: "No exports in progress",
          emptyDescription: "Create a report export to track generation here.",
          action: { label: "Open reports", href: "/reports", tone: "outline" },
        },
      ],
    };
  }

  async buildCoachDashboard(user: SessionUser): Promise<DashboardModel> {
    const { start, end } = dayRange();
    const [
      assignments,
      todayActivities,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      pendingCount,
      recentInjuries,
    ] = await prisma.$transaction([
      prisma.coachArtistAssignment.findMany({
        where: { coach_user_id: user.id, status: "ACTIVE" },
        orderBy: [{ is_primary: "desc" }, { assigned_at: "desc" }],
        take: 12,
        select: {
          artist: {
            select: {
              id: true,
              stage_name: true,
              preferred_name: true,
              legal_first_name: true,
              legal_last_name: true,
              status: true,
            },
          },
          is_primary: true,
          assigned_at: true,
        },
      }),
      prisma.activity.findMany({
        where: {
          starts_at: { gte: start, lt: end },
          status: { in: ["SCHEDULED", "COMPLETED"] },
        },
        orderBy: { starts_at: "asc" },
        take: 8,
        select: {
          id: true,
          title: true,
          kind: true,
          starts_at: true,
          location: true,
          status: true,
        },
      }),
      prisma.attendanceRecord.count({
        where: { recorded_at: { gte: start, lt: end }, status: "PRESENT" },
      }),
      prisma.attendanceRecord.count({
        where: { recorded_at: { gte: start, lt: end }, status: "ABSENT" },
      }),
      prisma.attendanceRecord.count({
        where: { recorded_at: { gte: start, lt: end }, status: "LATE" },
      }),
      prisma.attendanceRecord.count({
        where: { recorded_at: { gte: start, lt: end }, status: "EXCUSED" },
      }),
      prisma.attendanceRecord.count({
        where: { recorded_at: { gte: start, lt: end }, status: "PENDING" },
      }),
      prisma.injuryRecord.findMany({
        where: { status: { in: ["OPEN", "MONITORING"] } },
        orderBy: { updated_at: "desc" },
        take: 6,
        select: {
          id: true,
          body_area: true,
          severity: true,
          status: true,
          incident_at: true,
          artist: {
            select: {
              stage_name: true,
              preferred_name: true,
              legal_first_name: true,
              legal_last_name: true,
            },
          },
        },
      }),
    ]);

    const attendanceMap = {
      PRESENT: presentCount,
      ABSENT: absentCount,
      LATE: lateCount,
      EXCUSED: excusedCount,
      PENDING: pendingCount,
    } as const;

    return {
      role: user.primaryRole ?? "coach",
      title: "Coach dashboard",
      description: "Today's classes, assigned artists, attendance work, and follow-up alerts.",
      primaryAction: { label: "Record attendance", href: "/attendance" },
      secondaryActions: [
        { label: "Add performance", href: "/performances", tone: "secondary" },
        { label: "Open activities", href: "/activities", tone: "outline" },
      ],
      metrics: [
        { label: "Assigned artists", value: String(assignments.length), description: "Current active assignments" },
        { label: "Today's activities", value: String(todayActivities.length), description: "Scheduled for today" },
        { label: "Present records", value: String(attendanceMap.PRESENT), description: "Attendance captured today" },
        { label: "Open injuries", value: String(recentInjuries.length), description: "Requires attention or review" },
      ],
      chart: {
        title: "Attendance by status today",
        description: "Operational attendance mix for the current day.",
        points: [
          { label: "Present", value: attendanceMap.PRESENT },
          { label: "Absent", value: attendanceMap.ABSENT },
          { label: "Late", value: attendanceMap.LATE },
          { label: "Excused", value: attendanceMap.EXCUSED },
        ],
      },
      lists: [
        {
          title: "Assigned artists",
          description: "Artists currently connected to the coach.",
          items: assignments.map((assignment) => ({
            title:
              assignment.artist.stage_name ??
              assignment.artist.preferred_name ??
              `${assignment.artist.legal_first_name} ${assignment.artist.legal_last_name}`,
            description: assignment.is_primary ? "Primary assignment" : "Secondary assignment",
            tone: assignment.artist.status === "ACTIVE" ? "success" : "warning",
          })),
          emptyTitle: "No assigned artists",
          emptyDescription: "Assignments will appear here once they are created.",
          action: { label: "Open artists", href: "/artists", tone: "outline" },
        },
        {
          title: "Today's schedule",
          description: "Classes and events in time order.",
          items: todayActivities.map((activity) => ({
            title: activity.title,
            description: `${activity.kind.toLowerCase()} • ${activity.location ?? "No location"}`,
            timestamp: formatDateTime(activity.starts_at),
            tone: activity.status === "SCHEDULED" ? "secondary" : "success",
          })),
          emptyTitle: "No classes scheduled today",
          emptyDescription: "Today's schedule appears here when activities are present.",
          action: { label: "Open activities", href: "/activities", tone: "outline" },
        },
        {
          title: "Open injury follow-up",
          description: "Recent injury records that still need review.",
          items: recentInjuries.map((injury) => ({
            title:
              injury.artist.stage_name ??
              injury.artist.preferred_name ??
              `${injury.artist.legal_first_name} ${injury.artist.legal_last_name}`,
            description: `${injury.body_area} • ${injury.severity.toLowerCase()} • ${injury.status.toLowerCase()}`,
            timestamp: formatDateTime(injury.incident_at),
            tone: injury.severity === "CRITICAL" || injury.severity === "HIGH" ? "danger" : "warning",
          })),
          emptyTitle: "No open injury follow-up",
          emptyDescription: "Injuries awaiting review will appear here.",
          action: { label: "Open injuries", href: "/injuries", tone: "outline" },
        },
      ],
      tables: [
        {
          title: "Attendance snapshot",
          description: "Captured attendance counts for the current day.",
          columns: [
            { label: "Status" },
            { label: "Count", align: "right" },
          ],
          rows: [
            { cells: ["Present", String(attendanceMap.PRESENT)] },
            { cells: ["Absent", String(attendanceMap.ABSENT)] },
            { cells: ["Late", String(attendanceMap.LATE)] },
            { cells: ["Excused", String(attendanceMap.EXCUSED)] },
            { cells: ["Pending", String(attendanceMap.PENDING)] },
          ],
          emptyTitle: "No attendance yet",
          emptyDescription: "Attendance entries will appear once the day is recorded.",
        },
      ],
    };
  }

  async buildParentDashboard(user: SessionUser): Promise<DashboardModel> {
    const [
      linkedChildren,
      recentNotifications,
      rehearsalCount,
      performanceCount,
      assessmentCount,
      competitionCount,
      showcaseCount,
      otherCount,
    ] = await prisma.$transaction([
      prisma.artistGuardian.findMany({
        where: { guardian_user_id: user.id, status: "ACTIVE" },
        orderBy: [{ is_primary: "desc" }, { granted_at: "desc" }],
        select: {
          artist: {
            select: {
              id: true,
              stage_name: true,
              preferred_name: true,
              legal_first_name: true,
              legal_last_name: true,
              status: true,
              medical_profile: {
                select: { status: true, updated_at: true },
              },
            },
          },
          relationship_type: true,
          is_primary: true,
          granted_at: true,
        },
      }),
      prisma.notification.findMany({
        where: { recipient_user_id: user.id },
        orderBy: { created_at: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          body: true,
          category: true,
          created_at: true,
          status: true,
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "REHEARSAL",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "PERFORMANCE",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "ASSESSMENT",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "COMPETITION",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "SHOWCASE",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
      prisma.performanceRecord.count({
        where: {
          kind: "OTHER",
          artist: {
            artist_guardians_artist: {
              some: { guardian_user_id: user.id, status: "ACTIVE" },
            },
          },
        },
      }),
    ]);

    const performanceMap = {
      REHEARSAL: rehearsalCount,
      PERFORMANCE: performanceCount,
      ASSESSMENT: assessmentCount,
      COMPETITION: competitionCount,
      SHOWCASE: showcaseCount,
      OTHER: otherCount,
    } as const;
    const performanceSummaryCount = Object.values(performanceMap).filter((count) => count > 0).length;

    return {
      role: user.primaryRole ?? "parent",
      title: "Parent dashboard",
      description: "Linked child summaries, notifications, and permitted medical snapshots.",
      primaryAction: { label: "Open children", href: "/artists" },
      secondaryActions: [
        { label: "Notifications", href: "/notifications", tone: "secondary" },
        { label: "Reports", href: "/reports", tone: "outline" },
      ],
      metrics: [
        { label: "Linked children", value: String(linkedChildren.length), description: "Accessible child profiles" },
        { label: "Unread notifications", value: String(recentNotifications.filter((item) => item.status !== "READ").length), description: "Need attention" },
        { label: "Performance kinds", value: String(performanceSummaryCount), description: "Recent categories with activity" },
      ],
      chart: {
        title: "Performance mix",
        description: "Counts by performance record type for linked children.",
        points: [
          { label: "Rehearsal", value: performanceMap.REHEARSAL },
          { label: "Performance", value: performanceMap.PERFORMANCE },
          { label: "Assessment", value: performanceMap.ASSESSMENT },
          { label: "Competition", value: performanceMap.COMPETITION },
          { label: "Showcase", value: performanceMap.SHOWCASE },
        ],
      },
      lists: [
        {
          title: "Linked children",
          description: "Only approved relationships are shown.",
          items: linkedChildren.map((link) => ({
            title:
              link.artist.stage_name ??
              link.artist.preferred_name ??
              `${link.artist.legal_first_name} ${link.artist.legal_last_name}`,
            description: `${link.relationship_type.toLowerCase()} • ${link.is_primary ? "primary" : "secondary"}`,
            tone: link.artist.status === "ACTIVE" ? "success" : "warning",
          })),
          emptyTitle: "No linked children",
          emptyDescription: "Ask the administrator to link the appropriate artist profiles.",
          action: { label: "Open artists", href: "/artists", tone: "outline" },
        },
        {
          title: "Recent notifications",
          description: "Messages that may need review.",
          items: recentNotifications.map((item) => ({
            title: item.title,
            description: item.body.slice(0, 120),
            timestamp: formatDateTime(item.created_at),
            tone: item.status === "READ" ? "muted" : "secondary",
          })),
          emptyTitle: "No notifications yet",
          emptyDescription: "Updates from the academy will show up here.",
          action: { label: "Open notifications", href: "/notifications", tone: "outline" },
        },
      ],
      tables: [
        {
          title: "Child medical status",
          description: "Available medical profile states for linked children.",
          columns: [
            { label: "Child" },
            { label: "Medical profile" },
            { label: "Updated" },
          ],
          rows: linkedChildren.map((link) => ({
            cells: [
              link.artist.stage_name ??
                link.artist.preferred_name ??
                `${link.artist.legal_first_name} ${link.artist.legal_last_name}`,
              link.artist.medical_profile?.status ?? "Not created",
              link.artist.medical_profile?.updated_at
                ? formatDateTime(link.artist.medical_profile.updated_at)
                : "Not available",
            ],
          })),
          emptyTitle: "No medical profiles available",
          emptyDescription: "Medical details appear only after a profile is created.",
          action: { label: "Open medical", href: "/medical", tone: "outline" },
        },
      ],
    };
  }

  async buildArtistDashboard(user: SessionUser): Promise<DashboardModel> {
    const [artist, upcomingActivities, recentPerformance, recentAttendance] = await prisma.$transaction([
      prisma.artist.findFirst({
        where: { user_id: user.id },
        select: {
          id: true,
          stage_name: true,
          preferred_name: true,
          legal_first_name: true,
          legal_last_name: true,
          status: true,
          medical_profile: {
            select: { status: true, updated_at: true },
          },
        },
      }),
      prisma.activityEnrollment.findMany({
        where: {
          artist: { user_id: user.id },
          status: { in: ["ENROLLED", "WAITLISTED"] },
        },
        orderBy: { enrolled_at: "desc" },
        take: 5,
        select: {
          activity: {
            select: {
              title: true,
              kind: true,
              starts_at: true,
              location: true,
              status: true,
            },
          },
          status: true,
        },
      }),
      prisma.performanceRecord.findMany({
        where: { artist: { user_id: user.id } },
        orderBy: { performed_at: "desc" },
        take: 5,
        select: {
          kind: true,
          score: true,
          performed_at: true,
          activity: { select: { title: true } },
        },
      }),
      prisma.attendanceRecord.findMany({
        where: { enrollment: { artist: { user_id: user.id } } },
        orderBy: { recorded_at: "desc" },
        take: 5,
        select: {
          status: true,
          recorded_at: true,
          enrollment: { select: { activity: { select: { title: true, starts_at: true } } } },
        },
      }),
    ]);

    const performancePoints = recentPerformance
      .map((record, index) => ({
        label: record.activity?.title ?? `Entry ${index + 1}`,
        value: Number(record.score ?? 0),
      }))
      .reverse();

    return {
      role: user.primaryRole ?? "artist",
      title: "Artist dashboard",
      description: "Personal schedule, performance history, and attendance status.",
      primaryAction: { label: "Open profile", href: "/profile" },
      secondaryActions: [
        { label: "View attendance", href: "/attendance", tone: "secondary" },
        { label: "View reports", href: "/reports", tone: "outline" },
      ],
      metrics: [
        { label: "Training items", value: String(upcomingActivities.length), description: "Current active enrollments" },
        { label: "Recent performances", value: String(recentPerformance.length), description: "Latest logged entries" },
        { label: "Recent attendance", value: String(recentAttendance.length), description: "Most recent attendance records" },
        { label: "Medical profile", value: artist?.medical_profile?.status ?? "Not created", description: "Current protected profile state" },
      ],
      chart: {
        title: "Performance trend",
        description: "Most recent score values from the performance timeline.",
        points:
          performancePoints.length > 0
            ? performancePoints
            : [
                { label: "No data", value: 0 },
              ],
      },
      lists: [
        {
          title: "Upcoming training",
          description: "Your active enrollments and scheduled work.",
          items: upcomingActivities.map((enrollment) => ({
            title: enrollment.activity.title,
            description: `${enrollment.activity.kind.toLowerCase()} • ${enrollment.status.toLowerCase()}`,
            timestamp: formatDateTime(enrollment.activity.starts_at),
            tone: enrollment.activity.status === "SCHEDULED" ? "secondary" : "muted",
          })),
          emptyTitle: "No upcoming training",
          emptyDescription: "Enrollments and scheduled sessions appear here.",
          action: { label: "Open activities", href: "/activities", tone: "outline" },
        },
        {
          title: "Recent performance",
          description: "Latest recorded performance entries.",
          items: recentPerformance.map((record) => ({
            title: record.activity?.title ?? record.kind.toLowerCase(),
            description: `${record.kind.toLowerCase()}${record.score ? ` • score ${record.score}` : ""}`,
            timestamp: formatDateTime(record.performed_at),
            tone: record.score && Number(record.score) >= 80 ? "success" : "secondary",
          })),
          emptyTitle: "No performance entries yet",
          emptyDescription: "Your performance history will appear after entries are recorded.",
          action: { label: "Open performances", href: "/performances", tone: "outline" },
        },
        {
          title: "Recent attendance",
          description: "Latest attendance states captured for your profile.",
          items: recentAttendance.map((record) => ({
            title: record.enrollment.activity.title,
            description: record.status.toLowerCase(),
            timestamp: formatDateTime(record.recorded_at),
            tone:
              record.status === "PRESENT"
                ? "success"
                : record.status === "ABSENT"
                  ? "warning"
                  : "secondary",
          })),
          emptyTitle: "No attendance yet",
          emptyDescription: "Attendance history appears after sessions are recorded.",
          action: { label: "Open attendance", href: "/attendance", tone: "outline" },
        },
      ],
      tables: [
        {
          title: "Profile snapshot",
          description: "Current protected details for the artist account.",
          columns: [
            { label: "Field" },
            { label: "Value" },
          ],
          rows: [
            {
              cells: [
                "Display name",
                artist?.stage_name ??
                  artist?.preferred_name ??
                  (artist ? `${artist.legal_first_name} ${artist.legal_last_name}` : "Not set"),
              ],
            },
            {
              cells: ["Status", artist?.status ?? "Not created"],
            },
            {
              cells: ["Medical profile", artist?.medical_profile?.status ?? "Not created"],
            },
          ],
          emptyTitle: "No artist profile",
          emptyDescription: "An artist profile will appear once the account is linked.",
          action: { label: "Open profile", href: "/profile", tone: "outline" },
        },
      ],
    };
  }
}
