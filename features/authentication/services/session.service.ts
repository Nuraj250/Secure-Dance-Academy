import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createRequestContext, type RequestContext } from "@/lib/http/request-context";
import { AuthenticationError } from "@/lib/http/errors";
import {
  getPermissionsForRoles,
  isRoleCode,
  pickPrimaryRole,
} from "@/lib/auth/rbac";
import { isDevelopmentSupabaseDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionContext, SessionUser } from "@/types/auth";
import type { AppRoleCode } from "@/types/rbac";
import { UserRepository, type UserRecordWithRoles } from "@/features/users/repositories/user.repository";

function mapSupabaseIdentity(user: SupabaseUser) {
  return {
    id: user.id,
    email: user.email ?? null,
    appMetadata: user.app_metadata ?? {},
    userMetadata: user.user_metadata ?? {},
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

function mapUserStatus(status: string): SessionUser["status"] {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "suspended";
    case "DISABLED":
      return "disabled";
    case "ARCHIVED":
      return "archived";
    default:
      return "anonymous";
  }
}

function mapUserRecordToSessionUser(
  record: UserRecordWithRoles,
): SessionUser {
  const roles = record.user_roles
    .map((userRole) => userRole.role.code)
    .filter((code): code is AppRoleCode => isRoleCode(code));

  return {
    id: record.id,
    supabaseUserId: record.supabase_user_id,
    email: record.email,
    firstName: record.first_name,
    lastName: record.last_name,
    displayName: record.display_name,
    phone: record.phone,
    status: mapUserStatus(record.status),
    locale: record.locale,
    timezone: record.timezone,
    roles,
    primaryRole: pickPrimaryRole(roles),
    permissions: getPermissionsForRoles(roles),
    lastLoginAt: record.last_login_at?.toISOString() ?? null,
    version: record.version,
  };
}

export class SessionService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async resolveSession(
    requestContext: RequestContext = createRequestContext(),
  ): Promise<SessionContext> {
    if (isDevelopmentSupabaseDemoMode()) {
      return {
        ...requestContext,
        supabaseIdentity: null,
        user: null,
        isAuthenticated: false,
      };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return {
        ...requestContext,
        supabaseIdentity: null,
        user: null,
        isAuthenticated: false,
      };
    }

    const localUser = await this.userRepository.findBySupabaseUserId(data.user.id);

    if (!localUser) {
      return {
        ...requestContext,
        supabaseIdentity: mapSupabaseIdentity(data.user),
        user: null,
        isAuthenticated: false,
      };
    }

    return {
      ...requestContext,
      supabaseIdentity: mapSupabaseIdentity(data.user),
      user: mapUserRecordToSessionUser(localUser),
      isAuthenticated: true,
    };
  }

  async requireSession(
    requestContext: RequestContext = createRequestContext(),
  ) {
    const session = await this.resolveSession(requestContext);
    if (!session.isAuthenticated || !session.user) {
      throw new AuthenticationError();
    }

    return session;
  }

  async getAuditContext(
    requestContext: RequestContext = createRequestContext(),
  ) {
    const session = await this.resolveSession(requestContext);

    return {
      actor: {
        userId: session.user?.id ?? null,
        email: session.user?.email ?? session.supabaseIdentity?.email ?? null,
        displayName: session.user?.displayName ?? null,
        roleCode: session.user?.primaryRole ?? "anonymous",
      },
      request: {
        requestId: session.requestId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        origin: session.origin,
      },
      session,
    };
  }
}
