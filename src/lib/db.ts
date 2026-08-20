import path from "path";
import { PrismaClient } from "@/generated/prisma/client";

// The Prisma CLI (migrate, etc.) resolves a relative `file:` SQLite URL
// relative to schema.prisma's directory (./prisma). The generated client
// does not use that same base at runtime, so we resolve it ourselves here,
// the same way, to guarantee both point at the exact same database file
// regardless of the process's cwd.
function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  if (url.startsWith("file:")) {
    const relativePath = url.slice("file:".length);
    if (!path.isAbsolute(relativePath)) {
      const schemaDir = path.join(/* turbopackIgnore: true */ process.cwd(), "prisma");
      return `file:${path.resolve(schemaDir, relativePath)}`;
    }
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
