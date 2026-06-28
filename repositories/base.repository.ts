import type { QueryPagination } from "@/types/api";
import { pageSchema, pageSizeSchema } from "@/lib/validation/primitives";

export function buildPagination(input?: {
  page?: number;
  pageSize?: number;
}): QueryPagination {
  const page = pageSchema.parse(input?.page);
  const pageSize = pageSizeSchema.parse(input?.pageSize);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}

export function buildPageInfo(totalItems: number, pagination: QueryPagination) {
  const totalPages =
    totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.pageSize);

  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };
}
