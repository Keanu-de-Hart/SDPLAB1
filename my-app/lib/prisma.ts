import { PrismaClient } from "@prisma/client";

// In development Next.js re-evaluates modules on every file save (hot reload).
// A plain `new PrismaClient()` at module scope would therefore create a fresh
// client — and a fresh pool of database connections — on each save, until the
// database starts refusing them. Stashing the instance on `globalThis`, which
// survives hot reloads, keeps exactly one client alive.
//
// In production the module is evaluated once, so the global isn't needed.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
