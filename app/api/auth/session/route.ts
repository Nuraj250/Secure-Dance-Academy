import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { SessionService } from "@/features/authentication/services/session.service";
import { createRateLimitKey } from "@/lib/security/rate-limit";

const sessionService = new SessionService();

export const GET = withApiRoute(
  async (_request, context) => {
    const session = await sessionService.resolveSession(context);

    return successResponse("Session loaded.", { session });
  },
  {
    rateLimit: {
      key: (_request, context) =>
        createRateLimitKey("auth", "session", context.ipAddress ?? "unknown"),
      limit: 120,
      windowMs: 15 * 60 * 1000,
      message: "Too many session checks. Please try again later.",
    },
  },
);
