import { AuthenticationError } from "@/lib/http/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SessionService } from "@/features/authentication/services/session.service";
import type { SessionContext } from "@/types/auth";

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn(),
}));

type SupabaseMock = {
  auth: {
    getUser: jest.Mock;
  };
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type UserRepositoryMock = {
  findBySupabaseUserId: jest.Mock;
};

function createSupabaseUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "supabase-user-1",
    email: "artist@example.com",
    app_metadata: {},
    user_metadata: {},
    created_at: "2024-01-01T00:00:00.000Z",
    last_sign_in_at: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createUserRecord(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "user-1",
    supabase_user_id: "supabase-user-1",
    email: "artist@example.com",
    first_name: "Art",
    last_name: "Ist",
    display_name: "Art Ist",
    phone: null,
    status: "ACTIVE",
    locale: "en-SG",
    timezone: "Asia/Singapore",
    last_login_at: new Date("2024-01-02T00:00:00.000Z"),
    version: 3,
    user_roles: [
      {
        role: { code: "artist" },
      },
    ],
    ...overrides,
  };
}

describe("SessionService", () => {
  const mockCreateSupabaseServerClient = jest.mocked(createSupabaseServerClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns an unauthenticated session when Supabase rejects the request", async () => {
    const supabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("unauthorized"),
        }),
      },
    } as unknown as SupabaseMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );

    const userRepository = {
      findBySupabaseUserId: jest.fn(),
    } as unknown as UserRepositoryMock;

    const service = new SessionService(userRepository as never);
    const session = await service.resolveSession({
      requestId: "request-1",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: null,
      isAuthenticated: false,
    });

    expect(session.isAuthenticated).toBe(false);
    expect(session.user).toBeNull();
    expect(userRepository.findBySupabaseUserId).not.toHaveBeenCalled();
  });

  it("maps the local user record into an authenticated session", async () => {
    const supabaseUser = createSupabaseUser();
    const supabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: supabaseUser },
          error: null,
        }),
      },
    } as unknown as SupabaseMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );

    const userRepository = {
      findBySupabaseUserId: jest.fn().mockResolvedValue(createUserRecord()),
    } as unknown as UserRepositoryMock;

    const service = new SessionService(userRepository as never);
    const session = await service.resolveSession({
      requestId: "request-2",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: null,
      isAuthenticated: false,
    });

    expect(session.isAuthenticated).toBe(true);
    expect(session.supabaseIdentity?.email).toBe("artist@example.com");
    expect(session.user).toMatchObject({
      id: "user-1",
      supabaseUserId: "supabase-user-1",
      roles: ["artist"],
      primaryRole: "artist",
      permissions: expect.arrayContaining(["profile:read"]),
    });
  });

  it("throws when a session is required but missing", async () => {
    const supabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as unknown as SupabaseMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );

    const service = new SessionService({
      findBySupabaseUserId: jest.fn(),
    } as never);

    await expect(service.requireSession()).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });

  it("builds audit context from the resolved session", async () => {
    const service = new SessionService({
      findBySupabaseUserId: jest.fn(),
    } as never);
    const session: SessionContext = {
      requestId: "request-3",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: {
        id: "supabase-user-3",
        email: "parent@example.com",
        appMetadata: {},
        userMetadata: {},
        createdAt: "2024-01-01T00:00:00.000Z",
        lastSignInAt: null,
      },
      user: {
        id: "user-3",
        supabaseUserId: "supabase-user-3",
        email: "parent@example.com",
        firstName: "Pat",
        lastName: "Ron",
        displayName: "Pat Ron",
        phone: null,
        status: "active",
        locale: null,
        timezone: null,
        roles: ["parent"],
        primaryRole: "parent",
        permissions: ["profile:read"],
        lastLoginAt: null,
        version: 1,
      },
      isAuthenticated: true,
    };

    jest.spyOn(service, "resolveSession").mockResolvedValue(session);

    const auditContext = await service.getAuditContext({
      requestId: "request-3",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: null,
      isAuthenticated: false,
    });

    expect(auditContext.actor).toMatchObject({
      userId: "user-3",
      email: "parent@example.com",
      displayName: "Pat Ron",
      roleCode: "parent",
    });
    expect(auditContext.request).toMatchObject({
      requestId: "request-3",
      ipAddress: "127.0.0.1",
    });
  });
});
