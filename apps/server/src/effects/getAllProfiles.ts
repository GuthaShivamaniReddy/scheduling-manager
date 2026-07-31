import type { Profile } from "@vitalize-interview/shared-types";
import { desc } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { DB } from "../db/drizzle";
import { profile } from "../db/schema";

export const getAllProfiles = Effect.fn("getAllProfiles")(function* () {
  const db = yield* DB;

  const profiles = yield* db
    .select({
      id: profile.id,
      fullName: profile.fullName,
    })
    .from(profile)
    .orderBy(desc(profile.fullName));

  return profiles as Profile[];
});
