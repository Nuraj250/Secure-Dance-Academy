import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { SessionService } from "@/features/authentication/services/session.service";

const sessionService = new SessionService();

export const GET = withApiRoute(async (_request, context) => {
  const session = await sessionService.resolveSession(context);

  return successResponse("Session loaded.", { session });
});
