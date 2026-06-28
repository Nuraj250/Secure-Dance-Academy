import { redirect } from "next/navigation";
import { SessionService } from "@/features/authentication/services/session.service";

const sessionService = new SessionService();

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await sessionService.resolveSession();

  redirect(session.user ? "/dashboard" : "/login");
}
