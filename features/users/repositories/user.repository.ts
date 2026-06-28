import { Prisma, UserStatus, type PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPageInfo, buildPagination } from "@/repositories/base.repository";
import { sanitizeSearchText } from "@/lib/security/sanitize";
import type { UserListFilter, UserStatusFilter, UserUpdateInput } from "@/features/users/types/user.types";

const userRoleInclude = {
  user_roles: {
    where: { status: "ACTIVE" as const },
    include: {
      role: true,
    },
    orderBy: {
      granted_at: "asc" as const,
    },
  },
} as const;

export type UserRecordWithRoles = Prisma.UserGetPayload<{
  include: typeof userRoleInclude;
}>;

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

function mapStatusFilter(status?: UserStatusFilter): UserStatus | undefined {
  if (!status) {
    return undefined;
  }

  return status.toUpperCase() as UserStatus;
}

function mapUserUpdateInput(input: UserUpdateInput) {
  return {
    ...(input.firstName !== undefined ? { first_name: input.firstName } : {}),
    ...(input.lastName !== undefined ? { last_name: input.lastName } : {}),
    ...(input.displayName !== undefined
      ? { display_name: input.displayName }
      : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.locale !== undefined ? { locale: input.locale } : {}),
    ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
    ...(input.status !== undefined
      ? { status: input.status.toUpperCase() as UserStatus }
      : {}),
    version: { increment: 1 },
  } satisfies Prisma.UserUpdateInput;
}

export class UserRepository {
  async findById(
    id: string,
    db: DatabaseClient = prisma,
  ): Promise<UserRecordWithRoles | null> {
    return db.user.findUnique({
      where: { id },
      include: userRoleInclude,
    });
  }

  async findBySupabaseUserId(
    supabaseUserId: string,
    db: DatabaseClient = prisma,
  ): Promise<UserRecordWithRoles | null> {
    return db.user.findUnique({
      where: { supabase_user_id: supabaseUserId },
      include: userRoleInclude,
    });
  }

  async list(
    filter: UserListFilter,
    db: PrismaClient = prisma,
  ): Promise<{
    items: UserRecordWithRoles[];
    pageInfo: ReturnType<typeof buildPageInfo>;
  }> {
    const pagination = buildPagination({
      page: filter.page,
      pageSize: filter.pageSize,
    });
    const search = filter.search ? sanitizeSearchText(filter.search) : null;

    const where: Prisma.UserWhereInput = {
      ...(filter.status ? { status: mapStatusFilter(filter.status) } : {}),
      ...(filter.roleCode
        ? {
            user_roles: {
              some: {
                status: "ACTIVE",
                role: {
                  code: filter.roleCode,
                },
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { first_name: { contains: search, mode: "insensitive" } },
              { last_name: { contains: search, mode: "insensitive" } },
              { display_name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [totalItems, items] = await db.$transaction([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: [
          { last_name: "asc" },
          { first_name: "asc" },
          { created_at: "desc" },
        ],
        skip: pagination.offset,
        take: pagination.limit,
        include: userRoleInclude,
      }),
    ]);

    return {
      items,
      pageInfo: buildPageInfo(totalItems, pagination),
    };
  }

  async create(
    data: {
      supabaseUserId: string;
      email: string;
      firstName: string;
      lastName: string;
      displayName: string;
      phone?: string | null;
      locale?: string | null;
      timezone?: string | null;
      status?: UserStatusFilter;
    },
    db: DatabaseClient = prisma,
  ) {
    return db.user.create({
      data: {
        supabase_user_id: data.supabaseUserId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        display_name: data.displayName,
        phone: data.phone ?? null,
        locale: data.locale ?? null,
        timezone: data.timezone ?? null,
        status: mapStatusFilter(data.status) ?? UserStatus.PENDING,
      },
      include: userRoleInclude,
    });
  }

  async updateById(
    id: string,
    input: UserUpdateInput,
    db: DatabaseClient = prisma,
  ) {
    return db.user.update({
      where: { id },
      data: mapUserUpdateInput(input),
      include: userRoleInclude,
    });
  }

  async updateLastLoginAt(
    id: string,
    lastLoginAt: Date,
    db: DatabaseClient = prisma,
  ) {
    return db.user.update({
      where: { id },
      data: {
        last_login_at: lastLoginAt,
        version: { increment: 1 },
      },
      include: userRoleInclude,
    });
  }

  async archiveById(id: string, db: DatabaseClient = prisma) {
    return db.user.update({
      where: { id },
      data: {
        status: UserStatus.ARCHIVED,
        archived_at: new Date(),
        version: { increment: 1 },
      },
      include: userRoleInclude,
    });
  }
}
