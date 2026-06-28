import { RateLimitError } from "@/lib/http/errors";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

function cleanupExpiredEntries(now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
) {
  const now = Date.now();
  cleanupExpiredEntries(now);
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: options.limit - 1, resetAt };
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: options.limit - current.count,
    resetAt: current.resetAt,
  };
}

function toRetryAfterSeconds(result: RateLimitResult) {
  return Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
}

export function createRateLimitError(
  result: RateLimitResult,
  message?: string,
) {
  return new RateLimitError(message, {
    retryAfterSeconds: toRetryAfterSeconds(result),
    remaining: result.remaining,
  });
}

export function enforceRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
  message?: string,
) {
  const result = checkRateLimit(key, options);

  if (!result.allowed) {
    throw createRateLimitError(result, message);
  }

  return result;
}

export function createRateLimitKey(...segments: Array<string | number | null | undefined>) {
  return segments
    .filter((segment): segment is string | number => segment != null)
    .map((segment) => String(segment).trim().toLowerCase())
    .filter((segment) => segment.length > 0)
    .join(":");
}
