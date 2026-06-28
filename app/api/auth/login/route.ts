import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { parseJsonBody, assertValidInput } from "@/lib/validation/request";
import { createRateLimitKey } from "@/lib/security/rate-limit";
import { AuthenticationService } from "@/features/authentication/services/auth.service";
import { signInSchema } from "@/features/authentication/schemas/auth.schema";

const authenticationService = new AuthenticationService();

export const POST = withApiRoute(
  async (request, context) => {
    const body = await parseJsonBody(request);
    const input = assertValidInput(signInSchema, body);
    const session = await authenticationService.signIn(input, context);

    return successResponse("Signed in successfully.", { session });
  },
  {
    rateLimit: {
      key: (_request, context) =>
        createRateLimitKey("auth", "login", context.ipAddress ?? "unknown"),
      limit: 10,
      windowMs: 15 * 60 * 1000,
      message: "Too many login attempts. Please try again later.",
    },
  },
);
