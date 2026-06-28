import { AuthorizationError } from "@/lib/http/errors";
import { AuditService } from "@/features/audit/services/audit.service";
import type { SessionContext } from "@/types/auth";

type AuditRepositoryMock = {
  create: jest.Mock;
  list: jest.Mock;
};

function createSession(overrides: Partial<SessionContext> = {}): SessionContext {
  const baseUser = {
    id: "user-1",
    supabaseUserId: "supabase-user-1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    displayName: "Admin User",
    phone: null,
    status: "active",
    locale: null,
    timezone: null,
    roles: ["administrator"],
    primaryRole: "administrator",
    permissions: ["audit:read", "users:read", "users:write"],
    lastLoginAt: null,
    version: 1,
  } as NonNullable<SessionContext["user"]>;

  const requestId: SessionContext["requestId"] =
    overrides.requestId ?? "request-1";
  const ipAddress: SessionContext["ipAddress"] =
    overrides.ipAddress ?? "127.0.0.1";
  const userAgent: SessionContext["userAgent"] =
    overrides.userAgent ?? "jest";
  const origin: SessionContext["origin"] = overrides.origin ?? "http://localhost:3000";
  const supabaseIdentity: SessionContext["supabaseIdentity"] =
    overrides.supabaseIdentity === undefined ? null : overrides.supabaseIdentity;
  const user: SessionContext["user"] =
    overrides.user === undefined ? baseUser : overrides.user;
  const isAuthenticated: SessionContext["isAuthenticated"] =
    overrides.isAuthenticated ?? true;

  return {
    requestId,
    ipAddress,
    userAgent,
    origin,
    supabaseIdentity,
    user,
    isAuthenticated,
  };
}

describe("AuditService", () => {
  it("creates an audit entry from the supplied event", async () => {
    const auditRepository = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        occurred_at: new Date("2024-01-01T00:00:00.000Z"),
        actor_user_id: "user-1",
        actor_user_email: "admin@example.com",
        actor_display_name: "Admin User",
        actor_role_code: "administrator",
        action: "auth.login",
        entity_type: "session",
        entity_id: "session-1",
        entity_version: 1,
        outcome: "SUCCESS",
        request_id: "request-1",
        ip_address: "127.0.0.1",
        user_agent: "jest",
        before_data: null,
        after_data: null,
        metadata: null,
      }),
      list: jest.fn(),
    } as unknown as AuditRepositoryMock;

    const service = new AuditService(auditRepository as never);
    const entry = await service.record({
      actor: {
        userId: "user-1",
        email: "admin@example.com",
        displayName: "Admin User",
        roleCode: "administrator",
      },
      request: {
        requestId: "request-1",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
        origin: "http://localhost:3000",
      },
      action: "auth.login",
      entity: {
        type: "session",
        id: "session-1",
        version: 1,
        label: "Admin User",
      },
      outcome: "SUCCESS",
      occurredAt: new Date("2024-01-01T00:00:00.000Z"),
    });

    expect(auditRepository.create).toHaveBeenCalledTimes(1);
    expect(entry).toMatchObject({
      id: "1",
      action: "auth.login",
      entityType: "session",
      outcome: "SUCCESS",
    });
  });

  it("lists audit entries for permitted users", async () => {
    const auditRepository = {
      create: jest.fn(),
      list: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            occurred_at: new Date("2024-01-01T00:00:00.000Z"),
            actor_user_id: "user-1",
            actor_user_email: "admin@example.com",
            actor_display_name: "Admin User",
            actor_role_code: "administrator",
            action: "users.update",
            entity_type: "user",
            entity_id: "user-2",
            entity_version: 2,
            outcome: "SUCCESS",
            request_id: "request-1",
            ip_address: "127.0.0.1",
            user_agent: "jest",
            before_data: null,
            after_data: null,
            metadata: null,
          },
        ],
        pageInfo: {
          page: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }),
    } as unknown as AuditRepositoryMock;

    const service = new AuditService(auditRepository as never);
    const result = await service.list(createSession(), {
      page: 1,
      pageSize: 20,
    });

    expect(auditRepository.list).toHaveBeenCalledTimes(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      action: "users.update",
      entityType: "user",
    });
  });

  it("rejects audit listing when the session lacks permission", async () => {
    const service = new AuditService({
      create: jest.fn(),
      list: jest.fn(),
    } as never);

    await expect(
      service.list(
        createSession({
          user: {
            id: "user-2",
            supabaseUserId: "supabase-user-2",
            email: "artist@example.com",
            firstName: "Art",
            lastName: "Ist",
            displayName: "Art Ist",
            phone: null,
            status: "active",
            locale: null,
            timezone: null,
            roles: ["artist"],
            primaryRole: "artist",
            permissions: ["profile:read"],
            lastLoginAt: null,
            version: 1,
          },
        }),
        { page: 1, pageSize: 20 },
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
