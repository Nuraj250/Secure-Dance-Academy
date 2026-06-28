import { withPrismaTransaction } from "@/lib/prisma";
import { requirePermission, requireAuthenticatedSession } from "@/lib/auth/authorization";
import type { RequestContext } from "@/lib/http/request-context";
import { NotFoundError, AuthorizationError } from "@/lib/http/errors";
import { AuditService } from "@/features/audit/services/audit.service";
import {
  UserRepository,
  type UserRecordWithRoles,
} from "@/features/users/repositories/user.repository";
import type {
  UserListFilter,
  UserUpdateInput,
  UserSummary,
} from "@/features/users/types/user.types";
import type { SessionContext } from "@/types/auth";
import { getPermissionsForRoles, isRoleCode, pickPrimaryRole } from "@/lib/auth/rbac";
import type { AppRoleCode } from "@/types/rbac";

function mapUserRecordToSummary(record: UserRecordWithRoles): UserSummary {
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
    status:
      record.status === "PENDING"
        ? "pending"
        : record.status === "ACTIVE"
          ? "active"
          : record.status === "SUSPENDED"
            ? "suspended"
            : record.status === "DISABLED"
              ? "disabled"
              : record.status === "ARCHIVED"
                ? "archived"
                : "anonymous",
    locale: record.locale,
    timezone: record.timezone,
    roles,
    primaryRole: pickPrimaryRole(roles),
    permissions: getPermissionsForRoles(roles),
    lastLoginAt: record.last_login_at?.toISOString() ?? null,
    version: record.version,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString(),
    disabledAt: record.disabled_at?.toISOString() ?? null,
    archivedAt: record.archived_at?.toISOString() ?? null,
  };
}

function ensureSelfOrAdmin(session: SessionContext, userId: string) {
  requireAuthenticatedSession(session);
  if (session.user?.primaryRole === "administrator") {
    return;
  }

  if (session.user?.id !== userId) {
    throw new AuthorizationError();
  }
}

function canAdminister(session: SessionContext) {
  requirePermission(session, "users:read");
}

export class UserService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly auditService = new AuditService(),
  ) {}

  async getCurrentUser(session: SessionContext) {
    const activeSession = requireAuthenticatedSession(session);
    if (!activeSession.user) {
      throw new NotFoundError();
    }

    const record = await this.userRepository.findById(activeSession.user.id);
    if (!record) {
      throw new NotFoundError();
    }

    return mapUserRecordToSummary(record);
  }

  async getUserById(session: SessionContext, userId: string) {
    ensureSelfOrAdmin(session, userId);

    const record = await this.userRepository.findById(userId);
    if (!record) {
      throw new NotFoundError();
    }

    return mapUserRecordToSummary(record);
  }

  async listUsers(session: SessionContext, filter: UserListFilter) {
    canAdminister(session);
    const result = await this.userRepository.list(filter);

    return {
      items: result.items.map(mapUserRecordToSummary),
      pageInfo: result.pageInfo,
    };
  }

  async updateUser(
    session: SessionContext,
    userId: string,
    input: UserUpdateInput,
    requestContext: RequestContext,
  ) {
    ensureSelfOrAdmin(session, userId);

    if (session.user?.primaryRole !== "administrator" && input.status) {
      throw new AuthorizationError(
        "Only administrators can change account status.",
      );
    }

    const beforeRecord = await this.userRepository.findById(userId);
    if (!beforeRecord) {
      throw new NotFoundError();
    }

    const updatedRecord = await withPrismaTransaction(async (tx) => {
      const user = await this.userRepository.updateById(userId, input, tx);

      await this.auditService.recordSessionAction(
        {
          session,
          requestContext,
          action: "users.update",
          entity: {
            type: "user",
            id: user.id,
            version: user.version,
            label: user.display_name,
          },
          outcome: "SUCCESS",
          beforeData: {
            email: beforeRecord.email,
            displayName: beforeRecord.display_name,
            status: beforeRecord.status,
          },
          afterData: {
            email: user.email,
            displayName: user.display_name,
            status: user.status,
          },
        },
        tx,
      );

      return user;
    });

    return mapUserRecordToSummary(updatedRecord);
  }

  async archiveUser(
    session: SessionContext,
    userId: string,
    requestContext: RequestContext,
  ) {
    requirePermission(session, "users:write");
    const beforeRecord = await this.userRepository.findById(userId);
    if (!beforeRecord) {
      throw new NotFoundError();
    }

    const archivedRecord = await withPrismaTransaction(async (tx) => {
      const user = await this.userRepository.archiveById(userId, tx);

      await this.auditService.recordSessionAction(
        {
          session,
          requestContext,
          action: "users.archive",
          entity: {
            type: "user",
            id: user.id,
            version: user.version,
            label: user.display_name,
          },
          outcome: "SUCCESS",
          beforeData: {
            email: beforeRecord.email,
            displayName: beforeRecord.display_name,
            status: beforeRecord.status,
          },
          afterData: {
            email: user.email,
            displayName: user.display_name,
            status: user.status,
          },
        },
        tx,
      );

      return user;
    });

    return mapUserRecordToSummary(archivedRecord);
  }

  async findUserBySupabaseId(session: SessionContext) {
    const activeSession = requireAuthenticatedSession(session);
    const record = await this.userRepository.findBySupabaseUserId(
      activeSession.user.supabaseUserId,
    );

    if (!record) {
      throw new NotFoundError();
    }

    return mapUserRecordToSummary(record);
  }
}
