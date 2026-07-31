import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

export const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5433/vitalize-interview";
const client = new SQL(databaseUrl);
export const db = drizzle({ client, schema, casing: "snake_case" });
