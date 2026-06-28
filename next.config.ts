import type { NextConfig } from "next";
import { responseSecurityHeaders } from "./config/security";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: Object.entries(responseSecurityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ];
  },
};

export default nextConfig;
