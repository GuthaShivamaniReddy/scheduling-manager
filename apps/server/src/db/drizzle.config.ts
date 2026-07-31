import type { Config } from "drizzle-kit";

const url =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5433/vitalize-interview";

export default {
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./src/db/drizzle",
  dbCredentials: {
    url,
  },
  casing: "snake_case",
} satisfies Config;
