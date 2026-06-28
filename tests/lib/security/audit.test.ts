import { createAuditEvent, toAuditRecordInput } from "@/lib/security/audit";

describe("audit helpers", () => {
  it("creates a timestamped audit event", () => {
    const before = new Date();
    const event = createAuditEvent({
      actor: {
        userId: "user-1",
        email: "admin@example.com",
        displayName: "Admin User",
        roleCode: "administrator",
      },
      request: {
        requestId: "request-1",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
        origin: "http://localhost:3000",
      },
      action: "auth.login",
      entity: {
        type: "session",
        id: "session-1",
        label: "Admin User",
      },
      metadata: {
        source: "unit-test",
      },
    });
    const after = new Date();

    expect(event.occurredAt).toBeInstanceOf(Date);
    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("maps missing outcomes and null fields to the record input shape", () => {
    const event = createAuditEvent({
      actor: {
        userId: "user-1",
        email: "artist@example.com",
        displayName: "Art Ist",
        roleCode: "artist",
      },
      request: {
        requestId: "request-2",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
        origin: "http://localhost:3000",
      },
      action: "profile.update",
      entity: {
        type: "profile",
        id: "user-1",
        label: "Art Ist",
      },
      beforeData: null,
      afterData: null,
      metadata: null,
    });

    expect(toAuditRecordInput(event)).toMatchObject({
      action: "profile.update",
      outcome: "SUCCESS",
      beforeData: null,
      afterData: null,
      metadata: null,
    });
  });
});
