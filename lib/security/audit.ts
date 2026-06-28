import type {
  AuditActorSnapshot,
  AuditEntitySnapshot,
  AuditListFilter,
  AuditOutcome,
  AuditRecordInput,
  AuditRequestSnapshot,
} from "@/types/audit";

export type AuditEvent = {
  actor: AuditActorSnapshot;
  request: AuditRequestSnapshot;
  action: string;
  entity: AuditEntitySnapshot;
  outcome?: AuditOutcome;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  occurredAt: Date;
};

export function createAuditEvent(
  event: Omit<AuditEvent, "occurredAt">,
): AuditEvent {
  return {
    ...event,
    occurredAt: new Date(),
  };
}

export function toAuditRecordInput(event: AuditEvent): AuditRecordInput {
  return {
    occurredAt: event.occurredAt,
    actor: event.actor,
    request: event.request,
    action: event.action,
    entity: event.entity,
    outcome: event.outcome ?? "SUCCESS",
    beforeData: event.beforeData ?? null,
    afterData: event.afterData ?? null,
    metadata: event.metadata ?? null,
  };
}

export type { AuditListFilter };
