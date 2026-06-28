type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
};

export function logSecurityEvent(entry: LogEntry) {
  const payload = {
    ...entry,
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
