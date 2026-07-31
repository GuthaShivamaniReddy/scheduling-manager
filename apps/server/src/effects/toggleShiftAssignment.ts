import type { ShiftWithProfile } from "@vitalize-interview/shared-types";
import { and, eq, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { DB } from "../db/drizzle";
import { profile, shiftAssignment } from "../db/schema";

export const toggleShiftAssignment = Effect.fn("toggleShiftAssignment")(
  function* (payload: { profileId: string; date: string }) {
    const { profileId, date } = payload;
    const db = yield* DB;

    const existing = yield* db
      .select({ id: shiftAssignment.id })
      .from(shiftAssignment)
      .where(
        and(
          eq(shiftAssignment.profileId, profileId),
          eq(shiftAssignment.date, date),
        ),
      );

    if (existing.length > 0) {
      yield* db
        .delete(shiftAssignment)
        .where(
          and(
            eq(shiftAssignment.profileId, profileId),
            eq(shiftAssignment.date, date),
          ),
        );
      return null;
    }

    const inserted = yield* db
      .insert(shiftAssignment)
      .values({ profileId, date })
      .returning({
        id: shiftAssignment.id,
        profileId: shiftAssignment.profileId,
        date: sql<string>`${shiftAssignment.date}::text`,
      });

    const insertedRow = inserted[0];
    if (!insertedRow) return null;

    const profileRows = yield* db
      .select({ id: profile.id, fullName: profile.fullName })
      .from(profile)
      .where(eq(profile.id, profileId));

    const profileRow = profileRows[0];
    if (!profileRow) return null;

    return {
      ...insertedRow,
      profile: profileRow,
    } satisfies ShiftWithProfile;
  },
);
