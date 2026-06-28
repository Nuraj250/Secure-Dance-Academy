import { Prisma, type PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPageInfo, buildPagination } from "@/repositories/base.repository";
import type {
  AuditEntry,
  AuditListFilter,
  AuditOutcome,
  AuditRecordInput,
} from "@/types/audit";

const auditSelect = {
  id: true,
  occurred_at: true,
  actor_user_id: true,
  actor_user_email: true,
  actor_display_name: true,
  actor_role_code: true,
  action: true,
  entity_type: true,
  entity_id: true,
  entity_version: true,
  outcome: true,
  request_id: true,
  ip_address: true,
  user_agent: true,
  before_data: true,
  after_data: true,
  metadata: true,
} as const;

export type AuditLogRecord = Prisma.AuditLogGetPayload<{
  select: typeof auditSelect;
}>;

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

function mapJsonValue<TValue>(value: unknown) {
  return (value ?? null) as TValue | null;
}

function mapOutcome(outcome: AuditOutcome | undefined): AuditOutcome {
  return outcome ?? "SUCCESS";
}

function toNullableJson(value: Record<string, unknown> | null | undefined) {
  return value ?? Prisma.DbNull;
}

function mapAuditFilter(filter: AuditListFilter): Prisma.AuditLogWhereInput {
  const search = filter.search?.trim() || null;

  return {
    ...(filter.actorUserId ? { actor_user_id: filter.actorUserId } : {}),
    ...(filter.entityType ? { entity_type: filter.entityType } : {}),
    ...(filter.action ? { action: filter.action } : {}),
    ...(filter.outcome ? { outcome: filter.outcome } : {}),
    ...(filter.from || filter.to
      ? {
          occurred_at: {
            ...(filter.from ? { gte: filter.from } : {}),
            ...(filter.to ? { lte: filter.to } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { entity_type: { contains: search, mode: "insensitive" } },
            { entity_id: { contains: search, mode: "insensitive" } },
            { actor_user_email: { contains: search, mode: "insensitive" } },
            { actor_display_name: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export class AuditRepository {
  async create(
    input: AuditRecordInput,
    db: DatabaseClient = prisma,
  ): Promise<AuditLogRecord> {
    return db.auditLog.create({
      data: {
        occurred_at: input.occurredAt ?? new Date(),
        actor_user_id: input.actor.userId,
        actor_user_email: input.actor.email,
        actor_display_name: input.actor.displayName,
        actor_role_code: input.actor.roleCode,
        action: input.action,
        entity_type: input.entity.type,
        entity_id: input.entity.id,
        entity_version: input.entity.version ?? null,
        outcome: mapOutcome(input.outcome),
        request_id: input.request.requestId,
        ip_address: input.request.ipAddress,
        user_agent: input.request.userAgent,
        before_data: toNullableJson(input.beforeData) as Prisma.InputJsonValue,
        after_data: toNullableJson(input.afterData) as Prisma.InputJsonValue,
        metadata: toNullableJson(input.metadata) as Prisma.InputJsonValue,
      },
      select: auditSelect,
    });
  }

  async list(
    filter: AuditListFilter,
    db: PrismaClient = prisma,
  ): Promise<{
    items: AuditLogRecord[];
    pageInfo: ReturnType<typeof buildPageInfo>;
  }> {
    const pagination = buildPagination({
      page: filter.page,
      pageSize: filter.pageSize,
    });

    const where = mapAuditFilter(filter);

    const [totalItems, items] = await db.$transaction([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        orderBy: { occurred_at: "desc" },
        skip: pagination.offset,
        take: pagination.limit,
        select: auditSelect,
      }),
    ]);

    return {
      items,
      pageInfo: buildPageInfo(totalItems, pagination),
    };
  }
}

export function mapAuditRecord(record: AuditLogRecord): AuditEntry {
  return {
    id: String(record.id),
    occurredAt: record.occurred_at.toISOString(),
    actorUserId: record.actor_user_id,
    actorUserEmail: record.actor_user_email,
    actorDisplayName: record.actor_display_name,
    actorRoleCode: record.actor_role_code,
    action: record.action,
    entityType: record.entity_type,
    entityId: record.entity_id,
    entityVersion: record.entity_version,
    outcome: record.outcome,
    requestId: record.request_id,
    ipAddress: record.ip_address,
    userAgent: record.user_agent,
    beforeData: mapJsonValue(record.before_data),
    afterData: mapJsonValue(record.after_data),
    metadata: mapJsonValue(record.metadata),
  };
}
