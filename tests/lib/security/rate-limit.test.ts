import {
  checkRateLimit,
  createRateLimitKey,
  enforceRateLimit,
} from "@/lib/security/rate-limit";
import { RateLimitError } from "@/lib/http/errors";

describe("rate limit helper", () => {
  it("builds stable keys", () => {
    expect(createRateLimitKey("Auth", "Login", "127.0.0.1")).toBe(
      "auth:login:127.0.0.1",
    );
  });

  it("tracks attempts within a window", () => {
    const key = `login:${Date.now()}`;
    const first = checkRateLimit(key, { limit: 2, windowMs: 60_000 });
    const second = checkRateLimit(key, { limit: 2, windowMs: 60_000 });
    const third = checkRateLimit(key, { limit: 2, windowMs: 60_000 });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
  });

  it("throws a rate limit error when the limit is exceeded", () => {
    const key = `enforce:${Date.now()}`;

    expect(() =>
      enforceRateLimit(key, { limit: 1, windowMs: 60_000 }),
    ).not.toThrow();
    expect(() =>
      enforceRateLimit(key, { limit: 1, windowMs: 60_000 }),
    ).toThrow(RateLimitError);
  });
});
