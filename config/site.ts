import { env } from "../lib/env";

export const siteConfig = {
  name: "Secure Dance Academy",
  description: "Secure Dance Academy Management System",
  appUrl: new URL(env.NEXT_PUBLIC_APP_URL).origin,
};
