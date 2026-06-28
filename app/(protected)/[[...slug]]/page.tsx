import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProtectedScreen } from "@/features/screens/protected-screen";
import { SessionService } from "@/features/authentication/services/session.service";

export const metadata: Metadata = {
  title: "Secure Dance Academy",
};

const sessionService = new SessionService();

type ProtectedPageProps = {
  params?: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProtectedPage({
  params,
  searchParams,
}: ProtectedPageProps) {
  const session = await sessionService.resolveSession();

  if (!session.user || !session.isAuthenticated) {
    redirect("/login");
  }

  const routeParams = params ? await params : { slug: [] };
  const routeSearchParams = searchParams ? await searchParams : {};

  return (
    <ProtectedScreen
      searchParams={routeSearchParams}
      session={session}
      slug={routeParams.slug ?? []}
    />
  );
}
