import type { Profile } from "@vitalize-interview/shared-types";
import * as Effect from "effect/Effect";
import { getAllProfiles } from "./getAllProfiles";

export const getProfilesMap = Effect.fn("getProfilesMap")(function* () {
  const profiles = yield* getAllProfiles();

  const profileMap = profiles.reduce(
    (acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    },
    {} as Record<string, Profile>,
  );

  return profileMap;
});
