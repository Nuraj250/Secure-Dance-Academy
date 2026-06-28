import { PrismaClient, type Prisma } from "@prisma/client";

type PrismaGlobal = typeof globalThis & {
  __secureDancePrisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

export const prisma =
  globalForPrisma.__secureDancePrisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__secureDancePrisma = prisma;
}

export async function withPrismaTransaction<T>(
  handler: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(handler);
}
