import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { AuditService } from "@/features/audit/services/audit.service";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { UserProfileForm } from "@/features/users/components/user-profile-form";
import { UserService } from "@/features/users/services/user.service";
import { formatDate, formatDateTime } from "@/lib/date";
import { requirePermission, requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { pageSchema, pageSizeSchema, searchTextSchema } from "@/lib/validation/primitives";
import { cn } from "@/lib/utils";
import type { SessionContext } from "@/types/auth";
import { Button as ButtonPrimitive } from "@/components/ui/button";

type ProtectedScreenProps = {
  session: SessionContext;
  slug: string[];
  searchParams: Record<string, string | string[] | undefined>;
};

const dashboardService = new DashboardService();
const userService = new UserService();
const auditService = new AuditService();

function queryValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : "";
}

function pageValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number,
) {
  const raw = queryValue(searchParams, key);
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function artistName(
  artist:
    | {
        stage_name: string | null;
        preferred_name: string | null;
        legal_first_name: string;
        legal_last_name: string;
      }
    | null
    | undefined,
) {
  if (!artist) {
    return "Not available";
  }

  return (
    artist.stage_name ??
    artist.preferred_name ??
    `${artist.legal_first_name} ${artist.legal_last_name}`
  );
}

function tableValue(value: unknown) {
  if (value == null) {
    return "Not available";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function isAdministrator(session: SessionContext) {
  return session.user?.primaryRole === "administrator";
}

function hasOperationalScope(session: SessionContext) {
  return isAdministrator(session) || session.user?.primaryRole === "coach";
}

async function getAccessibleArtistIds(session: SessionContext) {
  if (!session.user) {
    return [];
  }

  switch (session.user.primaryRole) {
    case "administrator": {
      const artists = await prisma.artist.findMany({ select: { id: true } });
      return artists.map((artist) => artist.id);
    }
    case "coach": {
      const assignments = await prisma.coachArtistAssignment.findMany({
        where: { coach_user_id: session.user.id, status: "ACTIVE" },
        select: { artist_id: true },
      });
      return [...new Set(assignments.map((assignment) => assignment.artist_id))];
    }
    case "parent": {
      const links = await prisma.artistGuardian.findMany({
        where: { guardian_user_id: session.user.id, status: "ACTIVE" },
        select: { artist_id: true },
      });
      return [...new Set(links.map((link) => link.artist_id))];
    }
    case "artist": {
      const artist = await prisma.artist.findFirst({
        where: { user_id: session.user.id },
        select: { id: true },
      });
      return artist ? [artist.id] : [];
    }
    default:
      return [];
  }
}

function renderTablePage({
  title,
  description,
  primaryAction,
  filters,
  columns,
  rows,
  emptyTitle,
  emptyDescription,
  pagination,
}: {
  title: string;
  description: string;
  primaryAction?: ReactNode;
  filters?: ReactNode;
  columns: string[];
  rows: ReactNode[][];
  emptyTitle: string;
  emptyDescription: string;
  pagination?: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <PageHeader title={title} description={description} primaryAction={primaryAction} />
      {filters ? (
        <Card>
          <CardContent className="p-4">{filters}</CardContent>
        </Card>
      ) : null}
      <Card>
        <CardContent className="p-0">
          {rows.length > 0 ? (
            <Table>
              <thead>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </thead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={`${title}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={`${title}-${rowIndex}-${cellIndex}`}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                description={emptyDescription}
                fullScreen={false}
                title={emptyTitle}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {pagination}
    </section>
  );
}

type SearchResultItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  meta?: string;
};

function renderSearchResultsCard({
  title,
  description,
  items,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  items: SearchResultItem[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="rounded-md border border-border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {item.href ? (
                    <Link
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      href={item.href}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <p className="font-medium">{item.title}</p>
                  )}
                  {item.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                {item.meta ? (
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            description={emptyDescription}
            fullScreen={false}
            title={emptyTitle}
          />
        )}
      </CardContent>
    </Card>
  );
}

function renderDetailFields(
  fields: Array<{ label: string; value: ReactNode }>,
  className?: string,
) {
  return (
    <dl className={cn("grid gap-4 md:grid-cols-2", className)}>
      {fields.map((field) => (
        <div key={field.label} className="space-y-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {field.label}
          </dt>
          <dd className="text-sm leading-6 text-foreground">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

async function renderDashboard(session: SessionContext) {
  const model = await dashboardService.getDashboard(session);
  return <DashboardView model={model} />;
}

async function renderUsers(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "users:read");

  const query = z
    .object({
      search: searchTextSchema(120),
      status: z.enum(["pending", "active", "suspended", "disabled", "archived"]).optional(),
      roleCode: z.enum(["administrator", "coach", "parent", "artist"]).optional(),
      page: pageSchema,
      pageSize: pageSizeSchema,
    })
    .parse({
      search: queryValue(searchParams, "search"),
      status: queryValue(searchParams, "status") || undefined,
      roleCode: queryValue(searchParams, "roleCode") || undefined,
      page: pageValue(searchParams, "page", 1),
      pageSize: pageValue(searchParams, "pageSize", 10),
    });

  const result = await userService.listUsers(session, query);

  return renderTablePage({
    title: "Users",
    description: "Manage academy accounts, roles, and account status.",
    primaryAction: (
      <ButtonPrimitive asChild>
        <Link href="/users/invitations">Invitations</Link>
      </ButtonPrimitive>
    ),
    filters: (
      <form className="grid gap-3 md:grid-cols-4" method="get">
        <Input name="search" placeholder="Search users" defaultValue={query.search ?? ""} />
        <Select name="status" defaultValue={query.status ?? ""}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="disabled">Disabled</option>
          <option value="archived">Archived</option>
        </Select>
        <Select name="roleCode" defaultValue={query.roleCode ?? ""}>
          <option value="">All roles</option>
          <option value="administrator">Administrator</option>
          <option value="coach">Coach</option>
          <option value="parent">Parent</option>
          <option value="artist">Artist</option>
        </Select>
        <ButtonPrimitive type="submit">Filter</ButtonPrimitive>
      </form>
    ),
    columns: ["Name", "Email", "Role", "Status", "Last login", "Updated"],
    rows: result.items.map((user) => [
      <Link
        key={user.id}
        className="font-medium text-primary underline-offset-4 hover:underline"
        href={`/users/${user.id}`}
      >
        {user.displayName}
      </Link>,
      user.email,
      user.primaryRole ?? "None",
      user.status,
      user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never",
      formatDateTime(user.updatedAt),
    ]),
    emptyTitle: "No users found",
    emptyDescription: "Adjust the filters or create a new account invitation.",
    pagination: (
      <Pagination
        hrefForPage={(page) => {
          const params = new URLSearchParams();
          if (query.search) params.set("search", query.search);
          if (query.status) params.set("status", query.status);
          if (query.roleCode) params.set("roleCode", query.roleCode);
          params.set("page", String(page));
          params.set("pageSize", String(query.pageSize));
          return `/users?${params.toString()}`;
        }}
        pageInfo={result.pageInfo}
      />
    ),
  });
}

async function renderUserDetail(session: SessionContext, userId: string) {
  requirePermission(session, "users:read");
  const user = await userService.getUserById(session, userId);

  return (
    <section className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Users", href: "/users" },
          { label: user.displayName },
        ]}
        description={user.email}
        title={user.displayName}
      />
      <UserProfileForm
        canArchive={session.user?.primaryRole === "administrator"}
        canEditStatus={session.user?.primaryRole === "administrator"}
        user={user}
      />
    </section>
  );
}

async function renderInvitations(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "users:read");
  const page = pageValue(searchParams, "page", 1);
  const pageSize = Math.min(pageValue(searchParams, "pageSize", 10), 50);
  const search = queryValue(searchParams, "search");

  const where = search
    ? {
        email: { contains: search, mode: "insensitive" as const },
      }
    : {};

  const invitations = await prisma.accountInvitation.findMany({
    where,
    orderBy: { created_at: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      email: true,
      status: true,
      expires_at: true,
      created_at: true,
      invited_role: { select: { name: true } },
      target_artist: {
        select: {
          stage_name: true,
          preferred_name: true,
          legal_first_name: true,
          legal_last_name: true,
        },
      },
    },
  });

  const total = await prisma.accountInvitation.count({ where });

  return renderTablePage({
    title: "Invitations",
    description: "Controlled onboarding records and their expiry states.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search invitations" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Email", "Role", "Target artist", "Status", "Expires", "Created"],
    rows: invitations.map((item) => [
      item.email,
      item.invited_role.name,
      item.target_artist
        ? item.target_artist.stage_name ??
          item.target_artist.preferred_name ??
          `${item.target_artist.legal_first_name} ${item.target_artist.legal_last_name}`
        : "Not linked",
      item.status,
      formatDate(item.expires_at),
      formatDate(item.created_at),
    ]),
    emptyTitle: "No invitations",
    emptyDescription: "Create controlled onboarding invitations for new users.",
    pagination: (
      <Pagination
        hrefForPage={(nextPage) => {
          const params = new URLSearchParams();
          if (search) params.set("search", search);
          params.set("page", String(nextPage));
          params.set("pageSize", String(pageSize));
          return `/users/invitations?${params.toString()}`;
        }}
        pageInfo={{
          page,
          pageSize,
          totalItems: total,
          totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        }}
      />
    ),
  });
}

async function renderAuditLog(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "audit:read");
  const page = pageValue(searchParams, "page", 1);
  const pageSize = Math.min(pageValue(searchParams, "pageSize", 10), 50);
  const result = await auditService.list(session, {
    page,
    pageSize,
    search: queryValue(searchParams, "search") || undefined,
    action: queryValue(searchParams, "action") || undefined,
    entityType: queryValue(searchParams, "entityType") || undefined,
    outcome: (queryValue(searchParams, "outcome") as "SUCCESS" | "FAILURE" | "DENIED" | "") || undefined,
  });

  return renderTablePage({
    title: "Audit log",
    description: "Immutable activity history with actor, request, and entity context.",
    filters: (
      <form className="grid gap-3 md:grid-cols-5" method="get">
        <Input name="search" placeholder="Search audit" defaultValue={queryValue(searchParams, "search")} />
        <Input name="action" placeholder="Action" defaultValue={queryValue(searchParams, "action")} />
        <Input name="entityType" placeholder="Entity type" defaultValue={queryValue(searchParams, "entityType")} />
        <Select name="outcome" defaultValue={queryValue(searchParams, "outcome")}>
          <option value="">All outcomes</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
          <option value="DENIED">Denied</option>
        </Select>
        <ButtonPrimitive type="submit">Filter</ButtonPrimitive>
      </form>
    ),
    columns: ["When", "Actor", "Action", "Entity", "Outcome"],
    rows: result.items.map((entry) => [
      formatDateTime(entry.occurredAt),
      entry.actorDisplayName ?? entry.actorUserEmail ?? "Anonymous",
      entry.action,
      `${entry.entityType} ${entry.entityId}`,
      entry.outcome,
    ]),
    emptyTitle: "No audit entries",
    emptyDescription: "Adjust the filters or perform a protected action to generate events.",
    pagination: (
      <Pagination
        hrefForPage={(nextPage) => {
          const params = new URLSearchParams();
          const search = queryValue(searchParams, "search");
          const action = queryValue(searchParams, "action");
          const entityType = queryValue(searchParams, "entityType");
          const outcome = queryValue(searchParams, "outcome");
          if (search) params.set("search", search);
          if (action) params.set("action", action);
          if (entityType) params.set("entityType", entityType);
          if (outcome) params.set("outcome", outcome);
          params.set("page", String(nextPage));
          params.set("pageSize", String(pageSize));
          return `/audit-log?${params.toString()}`;
        }}
        pageInfo={result.pageInfo}
      />
    ),
  });
}

async function renderProfile(session: SessionContext) {
  const user = await userService.getCurrentUser(session);

  return (
    <section className="space-y-6">
      <PageHeader
        description="Update your contact details and local preferences."
        title="Profile"
      />
      <UserProfileForm user={user} />
    </section>
  );
}

async function renderArtistDetail(session: SessionContext, artistId: string) {
  requirePermission(session, "artists:read");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const artist = await prisma.artist.findFirst({
    where: isAdministrator(session)
      ? { id: artistId }
      : { AND: [{ id: artistId }, { id: { in: accessibleArtistIds } }] },
    select: {
      id: true,
      legal_first_name: true,
      legal_last_name: true,
      preferred_name: true,
      stage_name: true,
      date_of_birth: true,
      status: true,
      notes: true,
      version: true,
      created_at: true,
      updated_at: true,
      user: { select: { display_name: true, email: true } },
      medical_profile: {
        select: {
          status: true,
          primary_physician_name: true,
          primary_physician_phone: true,
          medical_notes: true,
          emergency_instructions: true,
          updated_at: true,
          medical_allergies: {
            where: { status: "ACTIVE" },
            select: { allergen_name: true, reaction: true },
          },
          medical_conditions: {
            where: { status: "ACTIVE" },
            select: { condition_name: true, severity: true },
          },
          medical_medications: {
            where: { status: "ACTIVE" },
            select: { medication_name: true, dosage: true, schedule: true },
          },
        },
      },
      artist_guardians_artist: {
        where: { status: "ACTIVE" },
        select: {
          relationship_type: true,
          is_primary: true,
          guardian_user: { select: { display_name: true, email: true } },
        },
      },
      coach_artist_assignments_artist: {
        where: { status: "ACTIVE" },
        select: {
          is_primary: true,
          coach_user: { select: { display_name: true, email: true } },
        },
      },
      activity_enrollments_artist: {
        where: { status: { in: ["ENROLLED", "WAITLISTED"] } },
        orderBy: { enrolled_at: "desc" },
        take: 5,
        select: {
          status: true,
          is_primary: true,
          enrolled_at: true,
          activity: {
            select: {
              title: true,
              kind: true,
              starts_at: true,
              location: true,
              status: true,
            },
          },
        },
      },
      performance_records_artist: {
        orderBy: { performed_at: "desc" },
        take: 5,
        select: {
          kind: true,
          performed_at: true,
          score: true,
          activity: { select: { title: true } },
        },
      },
      injury_records_artist: {
        orderBy: { incident_at: "desc" },
        take: 5,
        select: {
          body_area: true,
          severity: true,
          status: true,
          incident_at: true,
          follow_up_due_at: true,
          activity: { select: { title: true } },
        },
      },
      emergency_contacts_artist: {
        orderBy: [{ priority_order: "asc" }],
        select: {
          contact_name: true,
          relationship_type: true,
          phone: true,
          email: true,
          is_primary: true,
          priority_order: true,
          status: true,
        },
      },
    },
  });

  if (!artist) {
    notFound();
  }

  const displayName = artistName(artist);

  return (
    <section className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Artists", href: "/artists" },
          { label: displayName },
        ]}
        description={artist.user?.email ?? "Protected artist profile"}
        title={displayName}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Identity, status, and audit metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderDetailFields([
              { label: "Legal name", value: `${artist.legal_first_name} ${artist.legal_last_name}` },
              { label: "Preferred name", value: artist.preferred_name ?? "Not set" },
              { label: "Stage name", value: artist.stage_name ?? "Not set" },
              { label: "Date of birth", value: formatDate(artist.date_of_birth) },
              { label: "Status", value: artist.status },
              { label: "Linked account", value: artist.user?.email ?? "Not linked" },
              { label: "Created", value: formatDateTime(artist.created_at) },
              { label: "Updated", value: formatDateTime(artist.updated_at) },
            ])}
            {artist.notes ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{artist.notes}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical profile</CardTitle>
            <CardDescription>Restricted medical summary and current care instructions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {artist.medical_profile ? (
              <>
                {renderDetailFields([
                  { label: "Status", value: artist.medical_profile.status },
                  { label: "Physician", value: artist.medical_profile.primary_physician_name ?? "Not set" },
                  { label: "Physician phone", value: artist.medical_profile.primary_physician_phone ?? "Not set" },
                  { label: "Updated", value: formatDateTime(artist.medical_profile.updated_at) },
                ])}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Allergies
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {artist.medical_profile.medical_allergies.length}
                    </p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Conditions
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {artist.medical_profile.medical_conditions.length}
                    </p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Medications
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {artist.medical_profile.medical_medications.length}
                    </p>
                  </div>
                </div>
                {artist.medical_profile.medical_notes ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {artist.medical_profile.medical_notes}
                  </p>
                ) : null}
                {artist.medical_profile.emergency_instructions ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {artist.medical_profile.emergency_instructions}
                  </p>
                ) : null}
              </>
            ) : (
              <EmptyState
                description="Medical profiles remain hidden until one is created."
                fullScreen={false}
                title="No medical profile"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Guardians</CardTitle>
            <CardDescription>Approved parent and guardian relationships.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artist.artist_guardians_artist.length > 0 ? (
              artist.artist_guardians_artist.map((link) => (
                <div key={`${link.guardian_user.email}-${link.relationship_type}`} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">{link.guardian_user.display_name}</p>
                      <p className="text-sm text-muted-foreground">{link.guardian_user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {link.relationship_type} - {link.is_primary ? "primary" : "secondary"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                description="No active guardian links are visible in this scope."
                fullScreen={false}
                title="No guardians"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coaches</CardTitle>
            <CardDescription>Active coach assignments for this artist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artist.coach_artist_assignments_artist.length > 0 ? (
              artist.coach_artist_assignments_artist.map((assignment) => (
                <div key={`${assignment.coach_user.email}-${assignment.is_primary}`} className="rounded-md border border-border p-3">
                  <p className="font-medium">{assignment.coach_user.display_name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.coach_user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.is_primary ? "Primary coach" : "Secondary coach"}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                description="No active coach assignments are visible in this scope."
                fullScreen={false}
                title="No coaches"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency contacts</CardTitle>
          <CardDescription>Protected contact details for urgent escalation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {artist.emergency_contacts_artist.length > 0 ? (
            artist.emergency_contacts_artist.map((contact) => (
              <div key={`${contact.contact_name}-${contact.priority_order}`} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium">{contact.contact_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.relationship_type} - {contact.phone}
                    </p>
                    {contact.email ? (
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    ) : null}
                  </div>
                  <Badge variant={contact.is_primary ? "secondary" : "outline"}>
                    {contact.is_primary ? "Primary" : "Secondary"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              description="No emergency contacts are visible in this scope."
              fullScreen={false}
              title="No contacts"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent enrollments</CardTitle>
            <CardDescription>Current and waitlisted activity links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artist.activity_enrollments_artist.length > 0 ? (
              artist.activity_enrollments_artist.map((enrollment) => (
                <div key={`${enrollment.activity.title}-${enrollment.enrolled_at.toISOString()}`} className="rounded-md border border-border p-3">
                  <p className="font-medium">{enrollment.activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.activity.kind.toLowerCase()} - {enrollment.status.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(enrollment.activity.starts_at)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                description="No active enrollments are available for this artist."
                fullScreen={false}
                title="No enrollments"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent performance</CardTitle>
            <CardDescription>Latest captured performance records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artist.performance_records_artist.length > 0 ? (
              artist.performance_records_artist.map((record) => (
                <div key={`${record.kind}-${record.performed_at.toISOString()}`} className="rounded-md border border-border p-3">
                  <p className="font-medium">{record.activity?.title ?? record.kind.toLowerCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.kind.toLowerCase()} - {record.score ? String(record.score) : "Not scored"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(record.performed_at)}</p>
                </div>
              ))
            ) : (
              <EmptyState
                description="No performance records are visible in this scope."
                fullScreen={false}
                title="No performance records"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent injuries</CardTitle>
            <CardDescription>Open and recent injury records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artist.injury_records_artist.length > 0 ? (
              artist.injury_records_artist.map((record) => (
                <div key={`${record.body_area}-${record.incident_at.toISOString()}`} className="rounded-md border border-border p-3">
                  <p className="font-medium">{record.body_area}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.severity.toLowerCase()} - {record.status.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(record.incident_at)}</p>
                </div>
              ))
            ) : (
              <EmptyState
                description="No injury records are visible in this scope."
                fullScreen={false}
                title="No injuries"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

async function renderActivityDetail(
  session: SessionContext,
  activityId: string,
  mode: "activity" | "attendance" = "activity",
) {
  requirePermission(session, "activities:read");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const activity = await prisma.activity.findFirst({
    where: isAdministrator(session)
      ? { id: activityId }
      : {
          AND: [
            { id: activityId },
            {
              activity_enrollments: {
                some: { artist_id: { in: accessibleArtistIds } },
              },
            },
          ],
        },
    select: {
      id: true,
      title: true,
      kind: true,
      description: true,
      location: true,
      timezone: true,
      starts_at: true,
      ends_at: true,
      capacity: true,
      status: true,
      created_at: true,
      updated_at: true,
      activity_enrollments: {
        orderBy: [{ is_primary: "desc" }, { enrolled_at: "desc" }],
        select: {
          status: true,
          is_primary: true,
          enrolled_at: true,
          withdrawn_at: true,
          completed_at: true,
          notes: true,
          artist: {
            select: {
              id: true,
              legal_first_name: true,
              legal_last_name: true,
              preferred_name: true,
              stage_name: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!activity) {
    notFound();
  }

  const [attendanceRecords, performanceRecords, injuryRecords] = await prisma.$transaction([
    prisma.attendanceRecord.findMany({
      where: {
        activity_id: activityId,
        ...(isAdministrator(session)
          ? {}
          : { artist_id: { in: accessibleArtistIds } }),
      },
      orderBy: { recorded_at: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        recorded_at: true,
        notes: true,
        enrollment: {
          select: {
            artist: {
              select: {
                legal_first_name: true,
                legal_last_name: true,
                preferred_name: true,
                stage_name: true,
              },
            },
          },
        },
        recorded_by_user: { select: { display_name: true } },
      },
    }),
    prisma.performanceRecord.findMany({
      where: {
        activity_id: activityId,
        ...(isAdministrator(session)
          ? {}
          : { artist_id: { in: accessibleArtistIds } }),
      },
      orderBy: { performed_at: "desc" },
      take: 10,
      select: {
        id: true,
        kind: true,
        score: true,
        performed_at: true,
        artist: {
          select: {
            legal_first_name: true,
            legal_last_name: true,
            preferred_name: true,
            stage_name: true,
          },
        },
      },
    }),
    prisma.injuryRecord.findMany({
      where: {
        activity_id: activityId,
        ...(isAdministrator(session)
          ? {}
          : { artist_id: { in: accessibleArtistIds } }),
      },
      orderBy: { incident_at: "desc" },
      take: 10,
      select: {
        id: true,
        body_area: true,
        severity: true,
        status: true,
        incident_at: true,
        artist: {
          select: {
            legal_first_name: true,
            legal_last_name: true,
            preferred_name: true,
            stage_name: true,
          },
        },
      },
    }),
  ]);

  const pageTitle = mode === "attendance" ? "Attendance" : activity.title;
  const pageDescription =
    mode === "attendance"
      ? `${activity.title} - attendance records and linked session context`
      : `${activity.kind.toLowerCase()} - ${activity.status.toLowerCase()}`;

  return (
    <section className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: mode === "attendance" ? "Attendance" : "Activities", href: mode === "attendance" ? "/attendance" : "/activities" },
          { label: activity.title },
        ]}
        description={pageDescription}
        title={pageTitle}
      />

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Schedule, capacity, and lifecycle status.</CardDescription>
        </CardHeader>
        <CardContent>{renderDetailFields([
          { label: "Kind", value: activity.kind },
          { label: "Status", value: activity.status },
          { label: "Starts", value: formatDateTime(activity.starts_at) },
          { label: "Ends", value: formatDateTime(activity.ends_at) },
          { label: "Location", value: activity.location ?? "Not set" },
          { label: "Capacity", value: activity.capacity != null ? String(activity.capacity) : "Unlimited" },
          { label: "Timezone", value: activity.timezone ?? "Not set" },
          { label: "Created", value: formatDateTime(activity.created_at) },
          { label: "Updated", value: formatDateTime(activity.updated_at) },
        ])}</CardContent>
      </Card>

      {activity.description ? (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Original activity description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{activity.description}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrolments</CardTitle>
            <CardDescription>Artists linked to this activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activity.activity_enrollments.length > 0 ? (
              activity.activity_enrollments.map((enrollment) => (
                <div key={`${enrollment.artist.stage_name ?? enrollment.artist.legal_last_name}-${enrollment.enrolled_at.toISOString()}`} className="rounded-md border border-border p-3">
                  <p className="font-medium">{artistName(enrollment.artist)}</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.status.toLowerCase()} - {enrollment.is_primary ? "primary" : "secondary"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(enrollment.enrolled_at)}</p>
                </div>
              ))
            ) : (
              <EmptyState
                description="No enrolment records are visible in this scope."
                fullScreen={false}
                title="No enrolments"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance records</CardTitle>
            <CardDescription>Latest attendance captures for this activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <div key={record.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">{artistName(record.enrollment.artist)}</p>
                      <p className="text-sm text-muted-foreground">{record.status.toLowerCase()}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(record.recorded_at)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {record.recorded_by_user?.display_name ?? "System"}
                    </span>
                  </div>
                  {record.notes ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{record.notes}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState
                description="Attendance records will appear after the activity is recorded."
                fullScreen={false}
                title="No attendance records"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance records</CardTitle>
            <CardDescription>Latest performance captures for this activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {performanceRecords.length > 0 ? (
              performanceRecords.map((record) => (
                <div key={record.id} className="rounded-md border border-border p-3">
                  <p className="font-medium">{artistName(record.artist)}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.kind.toLowerCase()} - {record.score ? String(record.score) : "Not scored"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(record.performed_at)}</p>
                </div>
              ))
            ) : (
              <EmptyState
                description="Performance records are shown after they are captured."
                fullScreen={false}
                title="No performance records"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Injury records</CardTitle>
            <CardDescription>Latest incidents linked to this activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {injuryRecords.length > 0 ? (
              injuryRecords.map((record) => (
                <div key={record.id} className="rounded-md border border-border p-3">
                  <p className="font-medium">{artistName(record.artist)}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.body_area} - {record.severity.toLowerCase()} - {record.status.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(record.incident_at)}</p>
                </div>
              ))
            ) : (
              <EmptyState
                description="Injury records will appear after incidents are logged."
                fullScreen={false}
                title="No injury records"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

async function renderAttendanceDetail(session: SessionContext, activityId: string) {
  return renderActivityDetail(session, activityId, "attendance");
}

async function renderSearch(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const query = searchTextSchema(120).parse(queryValue(searchParams, "q"));
  const isAdmin = isAdministrator(session);
  const accessibleArtistIds = await getAccessibleArtistIds(session);

  const [artists, activities, notifications, reports] = await prisma.$transaction([
    prisma.artist.findMany({
      where: {
        ...(isAdmin ? {} : { id: { in: accessibleArtistIds } }),
        ...(query
          ? {
              OR: [
                { legal_first_name: { contains: query, mode: "insensitive" as const } },
                { legal_last_name: { contains: query, mode: "insensitive" as const } },
                { preferred_name: { contains: query, mode: "insensitive" as const } },
                { stage_name: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: [{ legal_last_name: "asc" }, { legal_first_name: "asc" }],
      take: 5,
      select: {
        id: true,
        legal_first_name: true,
        legal_last_name: true,
        preferred_name: true,
        stage_name: true,
        status: true,
      },
    }),
    prisma.activity.findMany({
      where: {
        ...(hasOperationalScope(session)
          ? {}
          : {
              activity_enrollments: {
                some: { artist_id: { in: accessibleArtistIds } },
              },
            }),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" as const } },
                { location: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { starts_at: "desc" },
      take: 5,
      select: { id: true, title: true, kind: true, starts_at: true, status: true },
    }),
    prisma.notification.findMany({
      where: {
        recipient_user_id: session.user!.id,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" as const } },
                { body: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: "desc" },
      take: 5,
      select: { id: true, title: true, body: true, status: true, created_at: true },
    }),
    prisma.reportExport.findMany({
      where: {
        ...(isAdmin
          ? {}
          : { requested_by_user_id: session.user!.id }),
        ...(query
          ? {
              OR: [
                { report_type: { contains: query, mode: "insensitive" as const } },
                { file_name: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        id: true,
        report_type: true,
        format: true,
        file_name: true,
        status: true,
        created_at: true,
        completed_at: true,
      },
    }),
  ]);

  const users = isAdmin
    ? await prisma.user.findMany({
        where: query
          ? {
              OR: [
                { email: { contains: query, mode: "insensitive" as const } },
                { display_name: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {},
        orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
        take: 5,
        select: { id: true, display_name: true, email: true, status: true },
      })
    : [];

  return (
    <section className="space-y-6">
      <PageHeader title="Search" description="Search within the current account scope." />
      <Card>
        <CardContent className="p-4">
          <form className="flex gap-2" method="get">
            <Input
              name="q"
              placeholder="Search artists, activities, notifications, and reports"
              defaultValue={query}
            />
            <ButtonPrimitive type="submit">Search</ButtonPrimitive>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        {renderSearchResultsCard({
          title: "Users",
          description: isAdmin
            ? "Matching account results."
            : "User directory results are restricted to administrators.",
          items: users.map((item) => ({
            id: item.id,
            title: item.display_name,
            description: item.email,
            meta: item.status.toLowerCase(),
          })),
          emptyTitle: "No user matches",
          emptyDescription: isAdmin
            ? "Try a different query."
            : "Only administrators can search the user directory.",
        })}
        {renderSearchResultsCard({
          title: "Artists",
          description: "Matching artist profiles inside your permitted scope.",
          items: artists.map((item) => ({
            id: item.id,
            title:
              item.stage_name ?? item.preferred_name ?? `${item.legal_first_name} ${item.legal_last_name}`,
            description: `${item.legal_first_name} ${item.legal_last_name}`,
            href: `/artists/${item.id}`,
            meta: item.status,
          })),
          emptyTitle: "No artist matches",
          emptyDescription: "Try a different query.",
        })}
        {renderSearchResultsCard({
          title: "Activities",
          description: "Matching schedule results.",
          items: activities.map((item) => ({
            id: item.id,
            title: item.title,
            description: `${item.kind.toLowerCase()} - ${formatDateTime(item.starts_at)}`,
            href: `/activities/${item.id}`,
            meta: item.status,
          })),
          emptyTitle: "No activity matches",
          emptyDescription: "Try a different query.",
        })}
        {renderSearchResultsCard({
          title: "Notifications",
          description: "Matching message results.",
          items: notifications.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.body.slice(0, 90),
            meta: item.status.toLowerCase(),
          })),
          emptyTitle: "No notification matches",
          emptyDescription: "Try a different query.",
        })}
        {renderSearchResultsCard({
          title: "Reports",
          description: "Queued and completed exports you can access.",
          items: reports.map((item) => ({
            id: item.id,
            title: item.report_type,
            description: item.file_name ?? item.format,
            meta: item.status,
          })),
          emptyTitle: "No report matches",
          emptyDescription: "Try a different query.",
        })}
      </div>
    </section>
  );
}

async function renderNotifications(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "notifications:read");
  const query = queryValue(searchParams, "q");
  const items = await prisma.notification.findMany({
    where: {
      recipient_user_id: session.user!.id,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { body: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { created_at: "desc" },
    take: 20,
    select: { id: true, title: true, body: true, status: true, created_at: true, category: true },
  });

  return (
    <section className="space-y-6">
      <PageHeader title="Notifications" description="In-app messages inside your permitted scope." />
      <Card>
        <CardContent className="p-4">
          <form className="flex gap-2" method="get">
            <Input name="q" placeholder="Search notifications" defaultValue={query} />
            <ButtonPrimitive type="submit">Search</ButtonPrimitive>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 p-0">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="border-b border-border px-5 py-4 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                  <Badge variant={item.status === "READ" ? "outline" : "secondary"}>
                    {item.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.category} - {formatDateTime(item.created_at)}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6">
              <EmptyState
                description="Messages will appear here when they are issued."
                fullScreen={false}
                title="No notifications"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

async function renderSettings(session: SessionContext) {
  requireRole(session, ["administrator"]);
  const settings = await prisma.appSetting.findMany({
    orderBy: [{ scope: "asc" }, { setting_key: "asc" }],
    select: {
      scope: true,
      setting_key: true,
      setting_value: true,
      is_sensitive: true,
      version: true,
      updated_at: true,
    },
  });

  return (
    <section className="space-y-6">
      <PageHeader title="Settings" description="System and academy configuration values." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System settings</CardTitle>
            <CardDescription>Governance and retention settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {settings.filter((setting) => setting.scope === "SYSTEM").map((setting) => (
              <div key={`${setting.scope}-${setting.setting_key}`} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{setting.setting_key}</p>
                  <Badge variant={setting.is_sensitive ? "warning" : "outline"}>
                    {setting.is_sensitive ? "Sensitive" : "Public"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tableValue(setting.setting_value)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Updated {formatDateTime(setting.updated_at)} - v{setting.version}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Academy settings</CardTitle>
            <CardDescription>Academy profile and locale defaults.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {settings.filter((setting) => setting.scope === "ACADEMY").map((setting) => (
              <div key={`${setting.scope}-${setting.setting_key}`} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{setting.setting_key}</p>
                  <Badge variant={setting.is_sensitive ? "warning" : "outline"}>
                    {setting.is_sensitive ? "Sensitive" : "Public"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tableValue(setting.setting_value)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Updated {formatDateTime(setting.updated_at)} - v{setting.version}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

async function renderArtists(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "artists:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const where =
    session.user?.primaryRole === "administrator"
      ? search
        ? {
            OR: [
              { legal_first_name: { contains: search, mode: "insensitive" as const } },
              { legal_last_name: { contains: search, mode: "insensitive" as const } },
              { stage_name: { contains: search, mode: "insensitive" as const } },
              { preferred_name: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}
      : {
          id: { in: accessibleArtistIds },
          ...(search
            ? {
                OR: [
                  { legal_first_name: { contains: search, mode: "insensitive" as const } },
                  { legal_last_name: { contains: search, mode: "insensitive" as const } },
                  { stage_name: { contains: search, mode: "insensitive" as const } },
                  { preferred_name: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        };

  const artists = await prisma.artist.findMany({
    where,
    orderBy: [{ legal_last_name: "asc" }, { legal_first_name: "asc" }],
    take: 20,
    select: {
      id: true,
      legal_first_name: true,
      legal_last_name: true,
      preferred_name: true,
      stage_name: true,
      status: true,
      date_of_birth: true,
      medical_profile: { select: { status: true } },
      artist_guardians_artist: {
        where: { status: "ACTIVE" },
        select: { guardian_user_id: true },
      },
      coach_artist_assignments_artist: {
        where: { status: "ACTIVE" },
        select: { coach_user_id: true },
      },
    },
  });

  return renderTablePage({
    title: "Artists",
    description: "Artist profiles, safeguarding status, and assignment counts.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search artists" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Artist", "Status", "DOB", "Medical", "Guardians", "Coaches"],
    rows: artists.map((artist) => [
      <Link key={artist.id} className="font-medium text-primary underline-offset-4 hover:underline" href={`/artists/${artist.id}`}>
        {artistName(artist)}
      </Link>,
      artist.status,
      formatDate(artist.date_of_birth),
      artist.medical_profile?.status ?? "Not created",
      String(artist.artist_guardians_artist.length),
      String(artist.coach_artist_assignments_artist.length),
    ]),
    emptyTitle: "No artists found",
    emptyDescription: "Adjust the filters or create an artist profile.",
  });
}

async function renderActivities(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "activities:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const where =
    session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
      ? search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { location: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}
      : {
          activity_enrollments: { some: { artist_id: { in: accessibleArtistIds } } },
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" as const } },
                  { location: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        };

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { starts_at: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      kind: true,
      starts_at: true,
      ends_at: true,
      location: true,
      status: true,
    },
  });

  return renderTablePage({
    title: "Activities",
    description: "Classes, rehearsals, performances, and events.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search activities" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Title", "Kind", "Starts", "Ends", "Location", "Status"],
    rows: activities.map((activity) => [
      <Link key={activity.id} className="font-medium text-primary underline-offset-4 hover:underline" href={`/activities/${activity.id}`}>
        {activity.title}
      </Link>,
      activity.kind,
      formatDateTime(activity.starts_at),
      formatDateTime(activity.ends_at),
      activity.location ?? "Not set",
      activity.status,
    ]),
    emptyTitle: "No activities found",
    emptyDescription: "Create scheduled sessions to populate this list.",
  });
}

async function renderAttendance(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "attendance:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const records = await prisma.attendanceRecord.findMany({
    where: search
      ? {
          OR: [
            { notes: { contains: search, mode: "insensitive" as const } },
            { enrollment: { activity: { title: { contains: search, mode: "insensitive" as const } } } },
          ],
          ...(session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
            ? {}
            : { artist_id: { in: accessibleArtistIds } }),
        }
      : session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
        ? {}
        : { artist_id: { in: accessibleArtistIds } },
    orderBy: { recorded_at: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      recorded_at: true,
      notes: true,
      enrollment: {
        select: {
          activity: { select: { id: true, title: true, starts_at: true } },
          artist: {
            select: {
              id: true,
              stage_name: true,
              preferred_name: true,
              legal_first_name: true,
              legal_last_name: true,
            },
          },
        },
      },
      recorded_by_user: { select: { display_name: true } },
    },
  });

  return renderTablePage({
    title: "Attendance",
    description: "Recent attendance records captured by the academy.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search attendance" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Activity", "Artist", "Status", "Recorded", "Recorder"],
    rows: records.map((record) => [
      <Link key={record.id} className="font-medium text-primary underline-offset-4 hover:underline" href={`/attendance/${record.enrollment.activity.id}`}>
        {record.enrollment.activity.title}
      </Link>,
      artistName(record.enrollment.artist),
      record.status,
      formatDateTime(record.recorded_at),
      record.recorded_by_user?.display_name ?? "System",
    ]),
    emptyTitle: "No attendance records",
    emptyDescription: "Attendance will appear after sessions are recorded.",
  });
}

async function renderPerformances(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "performance:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const records = await prisma.performanceRecord.findMany({
    where: search
      ? {
          OR: [
            { notes: { contains: search, mode: "insensitive" as const } },
            { activity: { title: { contains: search, mode: "insensitive" as const } } },
          ],
          ...(session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
            ? {}
            : { artist_id: { in: accessibleArtistIds } }),
        }
      : session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
        ? {}
        : { artist_id: { in: accessibleArtistIds } },
    orderBy: { performed_at: "desc" },
    take: 20,
    select: {
      id: true,
      kind: true,
      performed_at: true,
      score: true,
      notes: true,
      artist: {
        select: {
          id: true,
          stage_name: true,
          preferred_name: true,
          legal_first_name: true,
          legal_last_name: true,
        },
      },
      activity: { select: { id: true, title: true } },
    },
  });

  return renderTablePage({
    title: "Performances",
    description: "Performance and assessment records by artist.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search performances" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Artist", "Kind", "Activity", "Score", "Performed"],
    rows: records.map((record) => [
      artistName(record.artist),
      record.kind,
      record.activity?.title ?? "Not linked",
      record.score ? String(record.score) : "Not scored",
      formatDateTime(record.performed_at),
    ]),
    emptyTitle: "No performances",
    emptyDescription: "Performance records appear once they are recorded.",
  });
}

async function renderInjuries(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "injuries:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const records = await prisma.injuryRecord.findMany({
    where: search
      ? {
          OR: [
            { body_area: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
          ...(session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
            ? {}
            : { artist_id: { in: accessibleArtistIds } }),
        }
      : session.user?.primaryRole === "administrator" || session.user?.primaryRole === "coach"
        ? {}
        : { artist_id: { in: accessibleArtistIds } },
    orderBy: { incident_at: "desc" },
    take: 20,
    select: {
      id: true,
      body_area: true,
      severity: true,
      status: true,
      incident_at: true,
      follow_up_due_at: true,
      artist: {
        select: {
          id: true,
          stage_name: true,
          preferred_name: true,
          legal_first_name: true,
          legal_last_name: true,
        },
      },
    },
  });

  return renderTablePage({
    title: "Injuries",
    description: "Injury incidents, severity, and follow-up status.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search injuries" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Artist", "Body area", "Severity", "Status", "Incident", "Follow-up"],
    rows: records.map((record) => [
      artistName(record.artist),
      record.body_area,
      record.severity,
      record.status,
      formatDateTime(record.incident_at),
      record.follow_up_due_at ? formatDateTime(record.follow_up_due_at) : "Not set",
    ]),
    emptyTitle: "No injuries",
    emptyDescription: "No injury records are available for the current scope.",
  });
}

async function renderMedical(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "medical:read");
  const search = queryValue(searchParams, "search");
  const accessibleArtistIds = await getAccessibleArtistIds(session);
  const canSeeAll = isAdministrator(session) || session.user?.primaryRole === "coach";
  const records = await prisma.medicalProfile.findMany({
    where: {
      ...(canSeeAll ? {} : { artist_id: { in: accessibleArtistIds } }),
      ...(search
        ? {
            artist: {
              OR: [
                { legal_first_name: { contains: search, mode: "insensitive" as const } },
                { legal_last_name: { contains: search, mode: "insensitive" as const } },
                { stage_name: { contains: search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    },
    orderBy: { updated_at: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      updated_at: true,
      primary_physician_name: true,
      artist: {
        select: {
          id: true,
          stage_name: true,
          preferred_name: true,
          legal_first_name: true,
          legal_last_name: true,
        },
      },
      medical_allergies: { where: { status: "ACTIVE" }, select: { id: true } },
      medical_conditions: { where: { status: "ACTIVE" }, select: { id: true } },
      medical_medications: { where: { status: "ACTIVE" }, select: { id: true } },
    },
  });

  return renderTablePage({
    title: "Medical",
    description: "Restricted medical profile summaries and active entries.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search medical profiles" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Artist", "Status", "Physician", "Allergies", "Conditions", "Medications"],
    rows: records.map((record) => [
      artistName(record.artist),
      record.status,
      record.primary_physician_name ?? "Not set",
      String(record.medical_allergies.length),
      String(record.medical_conditions.length),
      String(record.medical_medications.length),
    ]),
    emptyTitle: "No medical profiles",
    emptyDescription: "Medical profiles appear only when linked to artists.",
  });
}

async function renderReports(
  session: SessionContext,
  searchParams: Record<string, string | string[] | undefined>,
) {
  requirePermission(session, "reports:read");
  const search = queryValue(searchParams, "search");
  const where = search
    ? {
        OR: [
          { report_type: { contains: search, mode: "insensitive" as const } },
          { file_name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const records = await prisma.reportExport.findMany({
    where:
      session.user?.primaryRole === "administrator"
        ? where
        : { ...where, requested_by_user_id: session.user?.id },
    orderBy: { created_at: "desc" },
    take: 20,
    select: {
      id: true,
      report_type: true,
      format: true,
      status: true,
      row_count: true,
      created_at: true,
      completed_at: true,
    },
  });

  return renderTablePage({
    title: "Reports",
    description: "Queued and completed report exports.",
    filters: (
      <form className="grid gap-3 md:grid-cols-[1fr_auto]" method="get">
        <Input name="search" placeholder="Search reports" defaultValue={search} />
        <ButtonPrimitive type="submit">Search</ButtonPrimitive>
      </form>
    ),
    columns: ["Report", "Format", "Status", "Rows", "Created", "Completed"],
    rows: records.map((record) => [
      record.report_type,
      record.format,
      record.status,
      record.row_count != null ? String(record.row_count) : "Not ready",
      formatDateTime(record.created_at),
      record.completed_at ? formatDateTime(record.completed_at) : "Not ready",
    ]),
    emptyTitle: "No reports",
    emptyDescription: "Report exports will appear once generated.",
  });
}

async function renderParents(session: SessionContext) {
  requireRole(session, ["administrator", "parent"]);
  const links = await prisma.artistGuardian.findMany({
    where:
      session.user?.primaryRole === "administrator"
        ? {}
        : { guardian_user_id: session.user?.id },
    orderBy: { granted_at: "desc" },
    take: 20,
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
      guardian_user: { select: { display_name: true } },
      relationship_type: true,
      status: true,
      is_primary: true,
      granted_at: true,
    },
  });

  return renderTablePage({
    title: "Parents",
    description: "Guardian relationships and linked child artists.",
    columns: ["Child", "Relationship", "Primary", "Status", "Granted"],
    rows: links.map((link) => [
      artistName(link.artist),
      link.relationship_type,
      link.is_primary ? "Yes" : "No",
      link.status,
      formatDateTime(link.granted_at),
    ]),
    emptyTitle: "No guardian links",
    emptyDescription: "No approved parent relationships are visible in this scope.",
  });
}

async function renderCoaches(session: SessionContext) {
  requireRole(session, ["administrator", "coach"]);
  const assignments = await prisma.coachArtistAssignment.findMany({
    where:
      session.user?.primaryRole === "administrator"
        ? {}
        : { coach_user_id: session.user?.id },
    orderBy: { assigned_at: "desc" },
    take: 20,
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
      coach_user: { select: { display_name: true } },
      status: true,
      is_primary: true,
      assigned_at: true,
    },
  });

  return renderTablePage({
    title: "Coaches",
    description: "Coach assignments and current roster coverage.",
    columns: ["Coach", "Artist", "Primary", "Status", "Assigned"],
    rows: assignments.map((assignment) => [
      assignment.coach_user.display_name,
      artistName(assignment.artist),
      assignment.is_primary ? "Yes" : "No",
      assignment.status,
      formatDateTime(assignment.assigned_at),
    ]),
    emptyTitle: "No coach assignments",
    emptyDescription: "No assigned artists are visible in this scope.",
  });
}

export async function ProtectedScreen({
  session,
  slug,
  searchParams,
}: ProtectedScreenProps) {
  const section = slug[0] ?? "dashboard";
  const detail = slug[1] ?? null;

  switch (section) {
    case "dashboard":
      return renderDashboard(session);
    case "users":
      if (detail === "invitations") {
        return renderInvitations(session, searchParams);
      }

      if (detail) {
        return renderUserDetail(session, detail);
      }

      return renderUsers(session, searchParams);
    case "artists":
      if (detail) {
        return renderArtistDetail(session, detail);
      }

      return renderArtists(session, searchParams);
    case "activities":
      if (detail) {
        return renderActivityDetail(session, detail);
      }

      return renderActivities(session, searchParams);
    case "attendance":
      if (detail) {
        return renderAttendanceDetail(session, detail);
      }

      return renderAttendance(session, searchParams);
    case "performances":
      return renderPerformances(session, searchParams);
    case "injuries":
      return renderInjuries(session, searchParams);
    case "medical":
      return renderMedical(session, searchParams);
    case "audit-log":
      return renderAuditLog(session, searchParams);
    case "profile":
      return renderProfile(session);
    case "search":
      return renderSearch(session, searchParams);
    case "notifications":
      return renderNotifications(session, searchParams);
    case "reports":
      return renderReports(session, searchParams);
    case "parents":
      return renderParents(session);
    case "coaches":
      return renderCoaches(session);
    case "settings":
      return renderSettings(session);
    default:
      return notFound();
  }
}
