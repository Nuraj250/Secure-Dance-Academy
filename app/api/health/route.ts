import { successResponse } from "@/lib/api/responses";

export function GET() {
  return successResponse("Service is healthy.", {
    status: "ok",
    service: "secure-dance-academy",
  });
}
