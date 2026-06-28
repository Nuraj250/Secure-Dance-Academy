type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
};

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "refreshToken",
  "accessToken",
  "clientSecret",
  "supabaseServiceRoleKey",
] as const;

function redactValue(value: unknown, keyPath: string[] = []): unknown {
  if (value == null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, keyPath));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => {
      const shouldRedact = SENSITIVE_KEYS.some(
        (sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey.toLowerCase()) ||
          keyPath.concat(key).join(".").toLowerCase().includes(sensitiveKey.toLowerCase()),
      );

      return [key, shouldRedact ? "[REDACTED]" : redactValue(item, [...keyPath, key])];
    }),
  );
}

export function logSecurityEvent(entry: LogEntry) {
  const payload = {
    ...entry,
    context: entry.context ? redactValue(entry.context) : undefined,
    timestamp: new Date().toISOString(),
  };

  if (entry.level === "error") {
    console.error(payload);
    return;
  }

  if (entry.level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}
