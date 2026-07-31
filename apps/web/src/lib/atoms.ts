import { FetchHttpClient } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Atom } from "@effect-atom/atom";
import { AtomRpc, Result } from "@effect-atom/atom-react";
import { ScheduleRpcs } from "@vitalize-interview/server/src/request";
import type { ShiftWithProfile } from "@vitalize-interview/shared-types";
import { zdtFactory } from "@vitalize-interview/utils/temporal";
import { Layer } from "effect";

// Rpc Client

const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/rpc",
}).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

class ScheduleClient extends AtomRpc.Tag<ScheduleClient>()("ScheduleClient", {
  group: ScheduleRpcs,
  protocol: ProtocolLive,
}) {}

// Atoms

// The schedule view shows a single week (Sunday-Saturday). Default to the
// week that contains today so the app loads on the current week. The seed
// script shifts fixture dates relative to today, so shifts are visible on
// load. Users can navigate between weeks via the WeekNavigator UI.
const currentWeekStart = zdtFactory.now().startOf("week");
const currentWeekEnd = currentWeekStart.add({ days: 6 });

export const dateRangeAtom = Atom.make({
  start: currentWeekStart.format.toDateYear({ iso: true }),
  end: currentWeekEnd.format.toDateYear({ iso: true }),
});

export const profilesAtom = ScheduleClient.query("getProfilesMap", void 0, {
  reactivityKeys: ["profiles"],
});

export const preferencesAtom = ScheduleClient.query(
  "prepareShiftsForScheduleV2",
  void 0,
  {
    reactivityKeys: ["preferences"],
  },
);

export const toggleShiftAssignmentAtom = ScheduleClient.mutation(
  "toggleShiftAssignment",
);

export const assignmentsAtom = Atom.make<
  Record<string, Record<string, ShiftWithProfile>>
>({});

export const profileAssignmentsAtom = Atom.family((profileId: string) =>
  Atom.writable<
    Record<string, ShiftWithProfile>,
    Record<string, ShiftWithProfile>
  >(
    (get) => {
      const assignments = get(assignmentsAtom)[profileId];
      if (assignments) return assignments;
      const prefs = get(preferencesAtom);
      return Result.isSuccess(prefs) ? prefs.value[profileId] : {};
    },
    (ctx, next) => {
      ctx.set(assignmentsAtom, {
        ...ctx.get(assignmentsAtom),
        [profileId]: next,
      });
    },
  ),
);
