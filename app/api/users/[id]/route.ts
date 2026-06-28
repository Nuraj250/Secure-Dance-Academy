import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { parseJsonBody, assertValidInput } from "@/lib/validation/request";
import { SessionService } from "@/features/authentication/services/session.service";
import { UserService } from "@/features/users/services/user.service";
import { userUpdateSchema } from "@/features/users/schemas/user.schema";

type UserRouteContext = {
  params: Promise<{ id: string }>;
};

const sessionService = new SessionService();
const userService = new UserService();

export const GET = withApiRoute<UserRouteContext>(async (_request, context, routeContext) => {
  const session = await sessionService.resolveSession(context);
  if (!routeContext) {
    throw new Error("Route context is missing.");
  }

  const { id } = await routeContext.params;
  const user = await userService.getUserById(session, id);

  return successResponse("User loaded.", { user });
});

export const PATCH = withApiRoute<UserRouteContext>(async (request, context, routeContext) => {
  const session = await sessionService.resolveSession(context);
  if (!routeContext) {
    throw new Error("Route context is missing.");
  }

  const { id } = await routeContext.params;
  const body = await parseJsonBody(request);
  const input = assertValidInput(userUpdateSchema, body);
  const user = await userService.updateUser(session, id, input, context);

  return successResponse("User updated.", { user });
});

export const DELETE = withApiRoute<UserRouteContext>(async (_request, context, routeContext) => {
  const session = await sessionService.resolveSession(context);
  if (!routeContext) {
    throw new Error("Route context is missing.");
  }

  const { id } = await routeContext.params;
  const user = await userService.archiveUser(session, id, context);

  return successResponse("User archived.", { user });
});
