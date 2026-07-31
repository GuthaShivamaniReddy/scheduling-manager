import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

// Schedule Schemas
export const ProfileSchema = Schema.Struct({
  id: Schema.String,
  fullName: Schema.String,
});

export const ShiftWithProfileSchema = Schema.Struct({
  id: Schema.String,
  profileId: Schema.String,
  date: Schema.String,
  profile: ProfileSchema,
});

export const ScheduleSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Record({
    key: Schema.String,
    value: ShiftWithProfileSchema,
  }),
});

// Define a group of RPCs for Schedule
export class ScheduleRpcs extends RpcGroup.make(
  Rpc.make("getProfilesMap", {
    success: Schema.Record({ key: Schema.String, value: ProfileSchema }),
    error: Schema.Unknown,
  }),
  Rpc.make("prepareShiftsForScheduleV2", {
    success: ScheduleSchema,
    error: Schema.Unknown,
  }),
  Rpc.make("toggleShiftAssignment", {
    payload: {
      profileId: Schema.String,
      date: Schema.String,
    },
    success: Schema.NullOr(ShiftWithProfileSchema),
    error: Schema.Unknown,
  }),
) {}
