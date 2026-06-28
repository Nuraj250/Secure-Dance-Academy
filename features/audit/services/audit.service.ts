import type { PrismaClient, Prisma } from "@prisma/client";
import { createAuditEvent, toAuditRecordInput, type AuditEvent } from "@/lib/security/audit";
import type { RequestContext } from "@/lib/http/request-context";
import { requirePermission } from "@/lib/auth/authorization";
import type {
  AuditEntry,
  AuditOutcome,
  AuditEntitySnapshot,
} from "@/types/audit";
import { AuditRepository, mapAuditRecord } from "@/features/audit/repositories/audit.repository";
import type { SessionContext } from "@/types/auth";

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export class AuditService {
  constructor(private readonly auditRepository = new AuditRepository()) {}

  async record(
    event: AuditEvent,
    db?: DatabaseClient,
  ): Promise<AuditEntry> {
    const record = await this.auditRepository.create(
      toAuditRecordInput(event),
      db,
    );
    return mapAuditRecord(record);
  }

  async recordSessionAction(
    params: {
      session: SessionContext;
      requestContext: RequestContext;
      action: string;
      entity: AuditEntitySnapshot;
      outcome?: AuditOutcome;
      beforeData?: Record<string, unknown> | null;
      afterData?: Record<string, unknown> | null;
      metadata?: Record<string, unknown> | null;
    },
    db?: DatabaseClient,
  ) {
    const record = await this.record(
      createAuditEvent({
        actor: {
          userId: params.session.user?.id ?? null,
          email: params.session.user?.email ?? params.session.supabaseIdentity?.email ?? null,
          displayName: params.session.user?.displayName ?? null,
          roleCode: params.session.user?.primaryRole ?? "anonymous",
        },
        request: {
          requestId: params.requestContext.requestId,
          ipAddress: params.requestContext.ipAddress,
          userAgent: params.requestContext.userAgent,
          origin: params.requestContext.origin,
        },
        action: params.action,
        entity: params.entity,
        outcome: params.outcome,
        beforeData: params.beforeData,
        afterData: params.afterData,
        metadata: params.metadata,
      }),
      db,
    );

    return record;
  }

  async list(session: SessionContext, filter: Parameters<AuditRepository["list"]>[0]) {
    requirePermission(session, "audit:read");
    const result = await this.auditRepository.list(filter);

    return {
      items: result.items.map(mapAuditRecord),
      pageInfo: result.pageInfo,
    };
  }
}
