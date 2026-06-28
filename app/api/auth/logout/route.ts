import { successResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { AuthenticationService } from "@/features/authentication/services/auth.service";

const authenticationService = new AuthenticationService();

export const POST = withApiRoute(async (_request, context) => {
  const session = await authenticationService.signOut(context);

  return successResponse("Signed out successfully.", { session });
});
