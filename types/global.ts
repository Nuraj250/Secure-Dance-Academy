export type RoleName = "administrator" | "coach" | "parent" | "artist";

export type PaginatedResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
};

declare global {
  var __secureDancePrisma: import("@prisma/client").PrismaClient | undefined;
}
