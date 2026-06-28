import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { SessionService } from "@/features/authentication/services/session.service";
import { UserService } from "@/features/users/services/user.service";

const sessionService = new SessionService();
const userService = new UserService();

export const GET = withApiRoute(async (_request, context) => {
  const session = await sessionService.resolveSession(context);
  const user = await userService.getCurrentUser(session);

  return successResponse("Current profile loaded.", {
    user,
    permissions: session.user?.permissions ?? [],
    roles: session.user?.roles ?? [],
  });
});
