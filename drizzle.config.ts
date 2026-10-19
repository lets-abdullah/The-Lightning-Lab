import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile?.();
} catch {
  // Ignore missing .env in production/CI
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "",
  },
});
