import "dotenv/config";
import { defineConfig } from "prisma/config";

// `migrate deploy` needs datasource.url to actually run, but `prisma
// generate` (which only reads schema.prisma, no DB connection) doesn't —
// and `generate` runs unconditionally in postinstall, before a
// freshly-provisioned database URL may be available in CI/deploy
// environments. Reading process.env directly (rather than prisma/config's
// `env()` helper) means a missing DATABASE_URL resolves to `undefined`
// instead of throwing, so `generate` still succeeds; `migrate deploy` will
// still fail with its own clear error if it's genuinely missing when a
// database operation is attempted.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
