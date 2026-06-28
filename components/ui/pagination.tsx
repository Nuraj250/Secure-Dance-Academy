import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { PageInfo } from "@/types/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  pageInfo: PageInfo;
  hrefForPage: (page: number) => string;
  className?: string;
};

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return disabled ? (
    <Button variant="outline" size="sm" disabled>
      {children}
    </Button>
  ) : (
    <Button variant="outline" size="sm" asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export function Pagination({
  pageInfo,
  hrefForPage,
  className,
}: PaginationProps) {
  const totalPages = pageInfo.totalPages ?? 1;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const compactPages = (
    pages.length > 7
      ? [
          1,
          pageInfo.page > 3 ? null : 2,
          pageInfo.page > 4 ? null : 3,
          pageInfo.page > 5 ? null : 4,
          pageInfo.page,
          pageInfo.page < totalPages - 4 ? null : totalPages - 3,
          pageInfo.page < totalPages - 3 ? null : totalPages - 2,
          pageInfo.page < totalPages - 2 ? null : totalPages - 1,
          totalPages,
        ].filter((value, index, array) => {
          if (value == null) {
            return false;
          }
          return array.indexOf(value) === index;
        })
      : pages
  ) as Array<number | null>;
  const visiblePages = compactPages.filter((page): page is number => typeof page === "number");

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-between gap-3", className)}
    >
      <p className="text-sm text-muted-foreground">
        Page {pageInfo.page} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PageLink href={hrefForPage(pageInfo.page - 1)} disabled={!pageInfo.hasPreviousPage}>
          <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Previous
        </PageLink>
        {visiblePages.length > 1
          ? visiblePages.map((page, index, array) => {
              const previous = array[index - 1];
              const showEllipsis = typeof previous === "number" && page - previous > 1;

              return (
                <span key={page}>
                  {showEllipsis ? (
                    <span className="inline-flex h-10 items-center px-1 text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : null}
                  <Button
                    asChild
                    size="sm"
                    variant={page === pageInfo.page ? "secondary" : "outline"}
                  >
                    <Link href={hrefForPage(page)} aria-current={page === pageInfo.page ? "page" : undefined}>
                      {page}
                    </Link>
                  </Button>
                </span>
              );
            })
          : null}
        <PageLink href={hrefForPage(pageInfo.page + 1)} disabled={!pageInfo.hasNextPage}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </PageLink>
      </div>
    </nav>
  );
}
