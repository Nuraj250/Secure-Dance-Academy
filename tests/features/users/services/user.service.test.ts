import { AuthorizationError } from "@/lib/http/errors";
import { withPrismaTransaction } from "@/lib/prisma";
import { UserService } from "@/features/users/services/user.service";
import type { RequestContext } from "@/lib/http/request-context";
import type { SessionContext, SessionUser } from "@/types/auth";

jest.mock("@/lib/prisma", () => ({
  withPrismaTransaction: jest.fn(async (callback: (tx: object) => Promise<unknown>) =>
    callback({}),
  ),
}));

type UserRepositoryMock = {
  findById: jest.Mock;
  findBySupabaseUserId: jest.Mock;
  list: jest.Mock;
  updateById: jest.Mock;
  updateLastLoginAt: jest.Mock;
  archiveById: jest.Mock;
};

type AuditServiceMock = {
  recordSessionAction: jest.Mock;
};

function createSessionUser(
  overrides: Partial<SessionUser> = {},
): SessionUser {
  return {
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
    permissions: ["users:read", "users:write"],
    lastLoginAt: null,
    version: 1,
    ...overrides,
  };
}

function createSession(overrides: Partial<SessionContext> = {}): SessionContext {
  const baseUser = createSessionUser();

  const {
    requestId = "request-1",
    ipAddress = "127.0.0.1",
    userAgent = "jest",
    origin = "http://localhost:3000",
    supabaseIdentity = null,
    user = baseUser,
    isAuthenticated = true,
  } = overrides;

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

function createUserRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    supabase_user_id: "supabase-user-1",
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    display_name: "Admin User",
    phone: null,
    status: "ACTIVE",
    locale: null,
    timezone: null,
    last_login_at: new Date("2024-01-02T00:00:00.000Z"),
    created_at: new Date("2024-01-01T00:00:00.000Z"),
    updated_at: new Date("2024-01-03T00:00:00.000Z"),
    disabled_at: null,
    archived_at: null,
    version: 2,
    user_roles: [
      {
        role: { code: "administrator" },
      },
    ],
    ...overrides,
  };
}

describe("UserService", () => {
  const mockWithPrismaTransaction = jest.mocked(withPrismaTransaction);
  const userRepository = {
    findById: jest.fn(),
    findBySupabaseUserId: jest.fn(),
    list: jest.fn(),
    updateById: jest.fn(),
    updateLastLoginAt: jest.fn(),
    archiveById: jest.fn(),
  } as unknown as UserRepositoryMock;
  const auditService = {
    recordSessionAction: jest.fn(),
  } as unknown as AuditServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWithPrismaTransaction.mockImplementation(async (callback) => callback({} as never));
  });

  it("returns the current user profile", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(createUserRecord());

    const service = new UserService(userRepository as never, auditService as never);
    const result = await service.getCurrentUser(createSession());

    expect(result.id).toBe("user-1");
    expect(result.primaryRole).toBe("administrator");
    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
  });

  it("allows a user to view their own profile but blocks cross-user access", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(createUserRecord());

    const service = new UserService(userRepository as never, auditService as never);

    await expect(service.getUserById(createSession(), "user-1")).resolves.toMatchObject({
      id: "user-1",
    });
    await expect(
      service.getUserById(
        createSession({
          user: createSessionUser({
            id: "user-2",
            supabaseUserId: "supabase-user-2",
            email: "artist@example.com",
            displayName: "Art Ist",
            roles: ["artist"],
            primaryRole: "artist",
            permissions: ["profile:read"],
          }),
        }),
        "user-1",
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("lists users for admins", async () => {
    (userRepository.list as jest.Mock).mockResolvedValue({
      items: [createUserRecord()],
      pageInfo: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const service = new UserService(userRepository as never, auditService as never);
    const result = await service.listUsers(createSession(), {
      page: 1,
      pageSize: 20,
    } as never);

    expect(result.items).toHaveLength(1);
    expect(userRepository.list).toHaveBeenCalledTimes(1);
  });

  it("updates a user and records the audit trail", async () => {
    (userRepository.findById as jest.Mock)
      .mockResolvedValueOnce(createUserRecord())
      .mockResolvedValueOnce(createUserRecord());
    (userRepository.updateById as jest.Mock).mockResolvedValue(
      createUserRecord({
        display_name: "Admin Updated",
        version: 3,
      }),
    );

    const service = new UserService(userRepository as never, auditService as never);
    const result = await service.updateUser(
      createSession(),
      "user-1",
      { displayName: "Admin Updated" } as never,
      {
        requestId: "request-2",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
        origin: "http://localhost:3000",
      } as RequestContext,
    );

    expect(result.displayName).toBe("Admin Updated");
    expect(userRepository.updateById).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ displayName: "Admin Updated" }),
      expect.any(Object),
    );
    expect(auditService.recordSessionAction).toHaveBeenCalled();
  });

  it("archives users and looks them up by Supabase identity", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(createUserRecord());
    (userRepository.archiveById as jest.Mock).mockResolvedValue(
      createUserRecord({
        status: "ARCHIVED",
        archived_at: new Date("2024-01-04T00:00:00.000Z"),
        version: 3,
      }),
    );
    (userRepository.findBySupabaseUserId as jest.Mock).mockResolvedValue(
      createUserRecord(),
    );

    const service = new UserService(userRepository as never, auditService as never);
    const archived = await service.archiveUser(
      createSession(),
      "user-1",
      {
        requestId: "request-3",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
        origin: "http://localhost:3000",
      } as RequestContext,
    );
    const found = await service.findUserBySupabaseId(createSession());

    expect(archived.status).toBe("archived");
    expect(found.supabaseUserId).toBe("supabase-user-1");
  });
});
