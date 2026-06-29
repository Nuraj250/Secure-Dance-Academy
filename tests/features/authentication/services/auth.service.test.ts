import {
  AccountPendingError,
  AuthenticationError,
  ServiceUnavailableError,
} from "@/lib/http/errors";
import { isDevelopmentSupabaseDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { withPrismaTransaction } from "@/lib/prisma";
import { AuthenticationService } from "@/features/authentication/services/auth.service";
import type { RequestContext } from "@/lib/http/request-context";
import type { SessionContext } from "@/types/auth";

jest.mock("@/lib/env", () => ({
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  },
  isDevelopmentSupabaseDemoMode: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  withPrismaTransaction: jest.fn(async (callback: (tx: object) => Promise<unknown>) =>
    callback({}),
  ),
}));

type SupabaseClientMock = {
  auth: {
    signInWithPassword: jest.Mock;
    signOut: jest.Mock;
    resetPasswordForEmail: jest.Mock;
    updateUser: jest.Mock;
  };
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function createRequestContext(overrides: Partial<RequestContext> = {}): RequestContext {
  return {
    requestId: "request-1",
    ipAddress: "127.0.0.1",
    userAgent: "jest",
    origin: "http://localhost:3000",
    supabaseIdentity: null,
    user: null,
    isAuthenticated: false,
    ...overrides,
  };
}

function createSession(overrides: Partial<SessionContext> = {}): SessionContext {
  const baseUser = {
    id: "user-1",
    supabaseUserId: "supabase-user-1",
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
    permissions: ["profile:read", "profile:write"],
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
  } as SessionContext;
}

function createUserRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    supabase_user_id: "supabase-user-1",
    email: "artist@example.com",
    first_name: "Art",
    last_name: "Ist",
    display_name: "Art Ist",
    phone: null,
    status: "ACTIVE",
    locale: null,
    timezone: null,
    last_login_at: new Date("2024-01-02T00:00:00.000Z"),
    version: 2,
    user_roles: [
      {
        role: { code: "artist" },
      },
    ],
    ...overrides,
  };
}

describe("AuthenticationService", () => {
  const mockCreateSupabaseServerClient = jest.mocked(createSupabaseServerClient);
  const mockWithPrismaTransaction = jest.mocked(withPrismaTransaction);
  const mockIsDevelopmentSupabaseDemoMode = jest.mocked(
    isDevelopmentSupabaseDemoMode,
  );

  const sessionService = {
    resolveSession: jest.fn(),
  };
  const userRepository = {
    findBySupabaseUserId: jest.fn(),
    updateLastLoginAt: jest.fn(),
  };
  const auditService = {
    record: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsDevelopmentSupabaseDemoMode.mockReturnValue(false);
    mockWithPrismaTransaction.mockImplementation(async (callback) => callback({} as never));
  });

  it("signs in an active user and updates the login timestamp", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );
    (sessionService.resolveSession as jest.Mock).mockResolvedValue(
      createSession({
        user: createSession().user,
      }),
    );
    (userRepository.updateLastLoginAt as jest.Mock).mockResolvedValue(
      createUserRecord({ last_login_at: new Date("2024-02-01T00:00:00.000Z") }),
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );
    const result = await service.signIn(
      { email: "artist@example.com", password: "StrongPass123!" },
      createRequestContext(),
    );

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    expect(userRepository.updateLastLoginAt).toHaveBeenCalledWith(
      "user-1",
      expect.any(Date),
      expect.any(Object),
    );
    expect(auditService.record).toHaveBeenCalled();
    expect(result.user?.lastLoginAt).toBe("2024-02-01T00:00:00.000Z");
  });

  it("blocks sign-in in development demo mode without creating a Supabase client", async () => {
    mockIsDevelopmentSupabaseDemoMode.mockReturnValue(true);

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );

    await expect(
      service.signIn(
        { email: "artist@example.com", password: "StrongPass123!" },
        createRequestContext({ requestId: "request-demo" }),
      ),
    ).rejects.toBeInstanceOf(ServiceUnavailableError);
    expect(mockCreateSupabaseServerClient).not.toHaveBeenCalled();
  });

  it("rejects sign-in when the session has no active application user", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );
    (sessionService.resolveSession as jest.Mock).mockResolvedValue(
      createSession({
        user: null,
        supabaseIdentity: {
          id: "supabase-user-2",
          email: "pending@example.com",
          appMetadata: {},
          userMetadata: {},
          createdAt: "2024-01-01T00:00:00.000Z",
          lastSignInAt: null,
        },
        isAuthenticated: false,
      }),
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );

    await expect(
      service.signIn(
        { email: "pending@example.com", password: "StrongPass123!" },
        createRequestContext({ requestId: "request-2" }),
      ),
    ).rejects.toBeInstanceOf(AccountPendingError);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it("starts password recovery with a generic success response", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
        updateUser: jest.fn(),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );
    (sessionService.resolveSession as jest.Mock).mockResolvedValue(
      createSession({ user: null, isAuthenticated: false }),
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );
    const result = await service.requestPasswordReset(
      { email: "  Artist@Example.com  " },
      createRequestContext({ requestId: "request-3" }),
    );

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      "artist@example.com",
      expect.objectContaining({
        redirectTo: expect.stringContaining("/reset-password"),
      }),
    );
    expect(auditService.record).toHaveBeenCalled();
    expect(result.message).toContain("If the account exists");
  });

  it("completes password reset for a verified reset session", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn().mockResolvedValue({ error: null }),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );
    (sessionService.resolveSession as jest.Mock).mockResolvedValue(
      createSession({
        user: {
          ...createSession().user!,
          supabaseUserId: "supabase-user-1",
        },
      }),
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );
    const result = await service.resetPassword(
      {
        password: "NewStrongPass123!",
        confirmPassword: "NewStrongPass123!",
      },
      createRequestContext({ requestId: "request-4" }),
    );

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: "NewStrongPass123!",
    });
    expect(auditService.record).toHaveBeenCalled();
    expect(result.message).toBe("The password has been updated.");
  });

  it("signs out the current session and records the action", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );
    (sessionService.resolveSession as jest.Mock).mockResolvedValue(
      createSession(),
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );
    const result = await service.signOut(createRequestContext({ requestId: "request-5" }));

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalled();
    expect(result.user?.id).toBe("user-1");
  });

  it("throws when sign-in credentials are invalid", async () => {
    const supabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: new Error("invalid") }),
        signOut: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
      },
    } as unknown as SupabaseClientMock;
    mockCreateSupabaseServerClient.mockResolvedValue(
      supabase as unknown as SupabaseServerClient,
    );

    const service = new AuthenticationService(
      sessionService as never,
      userRepository as never,
      auditService as never,
    );

    await expect(
      service.signIn(
        { email: "invalid@example.com", password: "wrong" },
        createRequestContext({ requestId: "request-6" }),
      ),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });
});
