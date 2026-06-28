import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { parseJsonBody, assertValidInput } from "@/lib/validation/request";
import { createRateLimitKey } from "@/lib/security/rate-limit";
import { AuthenticationService } from "@/features/authentication/services/auth.service";
import { passwordResetSchema } from "@/features/authentication/schemas/auth.schema";

const authenticationService = new AuthenticationService();

export const POST = withApiRoute(
  async (request, context) => {
    const body = await parseJsonBody(request);
    const input = assertValidInput(passwordResetSchema, body);
    const result = await authenticationService.resetPassword(input, context);

    return successResponse(result.message, result);
  },
  {
    rateLimit: {
      key: (_request, context) =>
        createRateLimitKey(
          "auth",
          "reset-password",
          context.ipAddress ?? "unknown",
        ),
      limit: 10,
      windowMs: 15 * 60 * 1000,
      message: "Too many password reset attempts. Please try again later.",
    },
  },
);
