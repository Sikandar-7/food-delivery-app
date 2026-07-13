import { PrismaClient } from '@prisma/client';

// Single shared PrismaClient instance.
// Creating a new client per-route (or per-request) exhausts the DB connection
// pool — deadly on serverless. Reuse one instance across the whole app.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
