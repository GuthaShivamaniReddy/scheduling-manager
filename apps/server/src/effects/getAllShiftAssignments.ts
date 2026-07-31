import type { Shift } from "@vitalize-interview/shared-types";
import { sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { DB } from "../db/drizzle";
import { shiftAssignment } from "../db/schema";

export const getAllShiftAssignments = Effect.fn("getAllShiftAssignments")(
  function* () {
    const db = yield* DB;

    const shiftAssignments = yield* db
      .select({
        id: shiftAssignment.id,
        profileId: shiftAssignment.profileId,
        date: sql<string>`${shiftAssignment.date}::text`,
      })
      .from(shiftAssignment);

    return shiftAssignments as Shift[];
  },
);
