import { paginatedSuccessResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { assertValidInput } from "@/lib/validation/request";
import { SessionService } from "@/features/authentication/services/session.service";
import { UserService } from "@/features/users/services/user.service";
import { userListQuerySchema } from "@/features/users/schemas/user.schema";
import { createRateLimitKey } from "@/lib/security/rate-limit";

const sessionService = new SessionService();
const userService = new UserService();

export const GET = withApiRoute(
  async (request, context) => {
    const session = await sessionService.resolveSession(context);
    const query = assertValidInput(
      userListQuerySchema,
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const result = await userService.listUsers(session, {
      ...query,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    });

    return paginatedSuccessResponse("Users loaded.", result);
  },
  {
    rateLimit: {
      key: (_request, context) =>
        createRateLimitKey("users", "list", context.ipAddress ?? "unknown"),
      limit: 60,
      windowMs: 15 * 60 * 1000,
      message: "Too many user list requests. Please try again later.",
    },
  },
);
