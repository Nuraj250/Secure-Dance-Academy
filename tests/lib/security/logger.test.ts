import { logSecurityEvent } from "@/lib/security/logger";

describe("security logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("redacts sensitive values before writing info logs", () => {
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => undefined);

    logSecurityEvent({
      level: "info",
      message: "Sensitive request received.",
      context: {
        email: "artist@example.com",
        password: "super-secret",
        nested: {
          refreshToken: "refresh-secret",
          metadata: {
            authorization: "Bearer abc123",
          },
        },
      },
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const payload = infoSpy.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(payload.message).toBe("Sensitive request received.");
    expect(payload.context).toMatchObject({
      email: "artist@example.com",
      password: "[REDACTED]",
      nested: {
        refreshToken: "[REDACTED]",
        metadata: {
          authorization: "[REDACTED]",
        },
      },
    });
    expect(typeof payload.timestamp).toBe("string");
  });

  it("routes warning and error logs to the expected console methods", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    logSecurityEvent({ level: "warn", message: "Warn" });
    logSecurityEvent({ level: "error", message: "Error" });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
