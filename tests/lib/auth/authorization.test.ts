import {
  AccountPendingError,
  AuthenticationError,
  AuthorizationError,
} from "@/lib/http/errors";
import {
  requireAuthenticatedSession,
  requireOwnership,
  requirePermission,
  requireRole,
} from "@/lib/auth/authorization";
import type { SessionContext, SessionUser } from "@/types/auth";

type SessionOverrides = Omit<Partial<SessionContext>, "user"> & {
  user?: Partial<SessionUser> | null;
};

function createSession(
  overrides: SessionOverrides = {},
): SessionContext {
  const user: SessionUser = {
    id: "user-1",
    supabaseUserId: "supabase-1",
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
  };

  const { user: userOverrides, ...sessionOverrides } = overrides;

  return {
    requestId: "request-1",
    ipAddress: "127.0.0.1",
    userAgent: "jest",
    origin: "http://localhost:3000",
    supabaseIdentity: null,
    isAuthenticated: true,
    ...sessionOverrides,
    user: userOverrides === null ? null : { ...user, ...userOverrides },
  };
}

describe("authorization helpers", () => {
  it("rejects unauthenticated and inactive sessions", () => {
    expect(() => requireAuthenticatedSession(createSession({ isAuthenticated: false, user: null }))).toThrow(
      AuthenticationError,
    );
    expect(() =>
      requireAuthenticatedSession(
        createSession({ user: { status: "pending" }, isAuthenticated: true }),
      ),
    ).toThrow(AccountPendingError);
    expect(() =>
      requireAuthenticatedSession(
        createSession({ user: { status: "suspended" }, isAuthenticated: true }),
      ),
    ).toThrow(AuthorizationError);
  });

  it("enforces permissions and role membership", () => {
    expect(() => requirePermission(createSession(), "profile:read")).not.toThrow();
    expect(() => requireRole(createSession(), ["artist"])).not.toThrow();
    expect(() => requireRole(createSession(), ["administrator"])).toThrow(
      AuthorizationError,
    );
  });

  it("allows ownership or administrator access only", () => {
    expect(() => requireOwnership(createSession(), "user-1")).not.toThrow();
    expect(() =>
      requireOwnership(createSession({ user: { primaryRole: "administrator" } }), "someone-else"),
    ).not.toThrow();
    expect(() => requireOwnership(createSession(), "someone-else")).toThrow(
      AuthorizationError,
    );
  });
});
