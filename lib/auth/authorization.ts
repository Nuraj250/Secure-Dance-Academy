import type { SessionContext } from "@/types/auth";
import type { AppRoleCode, PermissionCode } from "@/types/rbac";
import {
  AccountPendingError,
  AuthenticationError,
  AuthorizationError,
} from "@/lib/http/errors";
import { hasAnyRole, hasPermission } from "@/lib/auth/rbac";

function requireActiveUser(session: SessionContext): NonNullable<SessionContext["user"]> {
  if (!session.isAuthenticated || !session.user) {
    throw new AuthenticationError();
  }

  if (session.user.status === "pending") {
    throw new AccountPendingError(
      "The account is pending activation and cannot access protected routes.",
    );
  }

  if (session.user.status === "suspended" || session.user.status === "disabled" || session.user.status === "archived") {
    throw new AuthorizationError("The account is not allowed to access this resource.");
  }

  return session.user;
}

export function requireAuthenticatedSession(session: SessionContext) {
  return {
    ...session,
    user: requireActiveUser(session),
  };
}

export function requireRole(
  session: SessionContext,
  allowedRoles: readonly AppRoleCode[],
) {
  const activeSession = requireAuthenticatedSession(session);

  if (!hasAnyRole(activeSession.user.roles, allowedRoles)) {
    throw new AuthorizationError();
  }

  return activeSession;
}

export function requirePermission(
  session: SessionContext,
  permission: PermissionCode,
) {
  const activeSession = requireAuthenticatedSession(session);

  if (!hasPermission(activeSession.user.roles, permission)) {
    throw new AuthorizationError();
  }

  return activeSession;
}

export function requireOwnership(
  session: SessionContext,
  ownerUserId: string,
) {
  const activeSession = requireAuthenticatedSession(session);

  if (
    activeSession.user.primaryRole !== "administrator" &&
    activeSession.user.id !== ownerUserId
  ) {
    throw new AuthorizationError();
  }

  return activeSession;
}
