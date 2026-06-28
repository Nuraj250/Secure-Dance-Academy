describe("security headers", () => {
  it("includes production hardening directives", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const mutableEnv = process.env as {
      -readonly [K in keyof NodeJS.ProcessEnv]: NodeJS.ProcessEnv[K];
    };

    try {
      mutableEnv.NODE_ENV = "production";
      mutableEnv.NEXT_PUBLIC_APP_URL = "https://academy.example.com";
      mutableEnv.NEXT_PUBLIC_SUPABASE_URL = "https://secure-dance.supabase.co";

      jest.resetModules();
      const { responseSecurityHeaders } = await import("@/config/security");

      expect(responseSecurityHeaders["Strict-Transport-Security"]).toBe(
        "max-age=31536000; includeSubDomains",
      );
      expect(responseSecurityHeaders["Content-Security-Policy"]).toContain(
        "object-src 'none';",
      );
      expect(responseSecurityHeaders["Content-Security-Policy"]).toContain(
        "connect-src 'self' https://secure-dance.supabase.co https://*.supabase.co;",
      );
    } finally {
      mutableEnv.NODE_ENV = originalNodeEnv;
      mutableEnv.NEXT_PUBLIC_APP_URL = originalAppUrl;
      mutableEnv.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
      jest.resetModules();
    }
  });
});
