import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The requested page is not available."
      action={<Link href="/">Return to project home</Link>}
    />
  );
}
