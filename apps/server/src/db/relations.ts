import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  shiftAssignment: {
    profile: r.one.profile({
      from: r.shiftAssignment.profileId,
      to: r.profile.id,
    }),
  },
  profile: {
    shiftAssignments: r.many.shiftAssignment(),
  },
}));
