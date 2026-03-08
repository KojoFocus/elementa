import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

// ─────────────────────────────────────────────────────────────
//  Singleton — safe for Next.js dev hot reload
//  Uses the Neon HTTP adapter (recommended for Next.js serverless).
// ─────────────────────────────────────────────────────────────

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL environment variable is not set');
  // Second arg is optional at runtime but required in the type definition
  const adapter = new (PrismaNeonHttp as any)(connectionString) as PrismaNeonHttp;
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
