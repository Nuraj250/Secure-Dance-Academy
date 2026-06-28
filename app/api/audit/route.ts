import { paginatedSuccessResponse } from "@/lib/api/responses";
import { withApiRoute } from "@/lib/http/route-handler";
import { assertValidInput } from "@/lib/validation/request";
import { SessionService } from "@/features/authentication/services/session.service";
import { AuditService } from "@/features/audit/services/audit.service";
import { auditListQuerySchema } from "@/features/audit/schemas/audit.schema";

const sessionService = new SessionService();
const auditService = new AuditService();

export const GET = withApiRoute(async (request, context) => {
  const session = await sessionService.resolveSession(context);
  const query = assertValidInput(
    auditListQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  const result = await auditService.list(session, {
    ...query,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  });

  return paginatedSuccessResponse("Audit trail loaded.", result);
});
