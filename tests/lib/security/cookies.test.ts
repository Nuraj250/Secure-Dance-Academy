import {
  hasSupabaseSessionCookie,
} from "@/lib/security/cookies";

type MutableProcessEnv = {
  -readonly [K in keyof NodeJS.ProcessEnv]: NodeJS.ProcessEnv[K];
};

describe("secure cookie helpers", () => {
  it("detects Supabase session cookies by prefix", () => {
    expect(hasSupabaseSessionCookie([{ name: "sb-access-token" }])).toBe(true);
    expect(hasSupabaseSessionCookie([{ name: "session" }])).toBe(false);
  });

  it("forces secure cookie defaults and ignores unsafe overrides", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const mutableEnv = process.env as MutableProcessEnv;
    try {
      mutableEnv.NODE_ENV = "production";

      jest.resetModules();
      const { normalizeSecureCookieOptions: normalizeCookieOptions } =
        await import("@/lib/security/cookies");

      const result = normalizeCookieOptions({
        httpOnly: false,
        sameSite: "none",
        secure: false,
        path: "/admin",
        domain: "example.com",
        maxAge: 60,
      });

      expect(result).toMatchObject({
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60,
      });
      expect(result).not.toHaveProperty("domain");
    } finally {
      mutableEnv.NODE_ENV = originalNodeEnv;
      jest.resetModules();
    }
  });
});
