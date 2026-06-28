export type AuditEvent = {
  actorId?: string;
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
};

export function createAuditEvent(event: Omit<AuditEvent, "occurredAt">): AuditEvent {
  return {
    ...event,
    occurredAt: new Date(),
  };
}
