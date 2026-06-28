export type AuditOutcome = "SUCCESS" | "FAILURE" | "DENIED";

export type AuditMetadata = Record<string, unknown>;

export type AuditActorSnapshot = {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  roleCode: string;
};

export type AuditRequestSnapshot = {
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  origin: string | null;
};

export type AuditEntitySnapshot = {
  type: string;
  id: string;
  version?: number | null;
  label?: string | null;
};

export type AuditRecordInput = {
  occurredAt?: Date;
  actor: AuditActorSnapshot;
  request: AuditRequestSnapshot;
  action: string;
  entity: AuditEntitySnapshot;
  outcome?: AuditOutcome;
  beforeData?: AuditMetadata | null;
  afterData?: AuditMetadata | null;
  metadata?: AuditMetadata | null;
};

export type AuditListFilter = {
  page: number;
  pageSize: number;
  actorUserId?: string;
  entityType?: string;
  action?: string;
  outcome?: AuditOutcome;
  from?: Date;
  to?: Date;
  search?: string;
};

export type AuditEntry = {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actorUserEmail: string | null;
  actorDisplayName: string | null;
  actorRoleCode: string;
  action: string;
  entityType: string;
  entityId: string;
  entityVersion: number | null;
  outcome: AuditOutcome;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  beforeData: AuditMetadata | null;
  afterData: AuditMetadata | null;
  metadata: AuditMetadata | null;
};
