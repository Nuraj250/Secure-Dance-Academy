describe("site config", () => {
  it("normalizes the application URL to its origin", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const mutableEnv = process.env as {
      -readonly [K in keyof NodeJS.ProcessEnv]: NodeJS.ProcessEnv[K];
    };

    try {
      mutableEnv.NODE_ENV = "test";
      mutableEnv.NEXT_PUBLIC_APP_URL = "https://academy.example.com/dashboard";

      jest.resetModules();
      const { siteConfig } = await import("@/config/site");

      expect(siteConfig.appUrl).toBe("https://academy.example.com");
    } finally {
      mutableEnv.NODE_ENV = originalNodeEnv;
      mutableEnv.NEXT_PUBLIC_APP_URL = originalAppUrl;
      jest.resetModules();
    }
  });
});
