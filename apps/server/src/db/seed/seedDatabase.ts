import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BunRuntime } from "@effect/platform-bun";
import { sql } from "drizzle-orm";
import { Effect } from "effect";
import { DB, DatabaseLive } from "../drizzle";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The shift_assignment.sql fixture was authored against a fixed week starting
// on 2024-09-15 (Sunday). To keep the seeded schedule "forward looking from
// today", we shift every date in the fixture by the number of days between
// this anchor and the Sunday of the current week.
const FIXTURE_ANCHOR_SUNDAY = "2024-09-15";
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DATE_LITERAL_REGEX = /'(\d{4}-\d{2}-\d{2})'/g;

const parseIsoDateUTC = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

const formatIsoDateUTC = (date: Date): string =>
  date.toISOString().slice(0, 10);

// Returns the Sunday (UTC) of the week containing `date`.
const startOfWeekUTC = (date: Date): Date => {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  result.setUTCDate(result.getUTCDate() - result.getUTCDay());
  return result;
};

const computeOffsetDays = (): number => {
  const anchor = parseIsoDateUTC(FIXTURE_ANCHOR_SUNDAY);
  const currentWeekStart = startOfWeekUTC(new Date());
  return Math.round((currentWeekStart.getTime() - anchor.getTime()) / MS_PER_DAY);
};

const shiftDate = (iso: string, offsetDays: number): string => {
  const d = parseIsoDateUTC(iso);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return formatIsoDateUTC(d);
};

// Rewrites every 'YYYY-MM-DD' literal in the fixture SQL, leaving other
// literals (e.g. timestamps like '2024-12-05 10:00:16.183066+00') untouched
// because the regex requires the entire quoted value to be exactly a date.
const shiftFixtureDates = (rawSql: string, offsetDays: number): string => {
  if (offsetDays === 0) return rawSql;
  return rawSql.replace(
    DATE_LITERAL_REGEX,
    (_match, date: string) => `'${shiftDate(date, offsetDays)}'`,
  );
};

export const clearDatabase = Effect.gen(function* () {
  const db = yield* DB;
  yield* db.execute(sql`TRUNCATE TABLE profile, shift_assignment CASCADE;`);
});

export const seedDatabase = Effect.gen(function* () {
  yield* clearDatabase;

  const db = yield* DB;

  const profileSqlPath = resolve(__dirname, "./profile.sql");
  const shiftAssignmentSqlPath = resolve(__dirname, "./shift_assignment.sql");
  const profileSql = readFileSync(profileSqlPath, "utf-8");
  const shiftAssignmentSql = readFileSync(shiftAssignmentSqlPath, "utf-8");

  const offsetDays = computeOffsetDays();
  const shiftedShiftAssignmentSql = shiftFixtureDates(
    shiftAssignmentSql,
    offsetDays,
  );

  yield* db.execute(sql.raw(profileSql));
  yield* db.execute(sql.raw(shiftedShiftAssignmentSql));
});

// Direct execution only (`bun seed`); imports must not re-run the seed.
if (import.meta.main) {
  BunRuntime.runMain(Effect.provide(seedDatabase, DatabaseLive));
}
