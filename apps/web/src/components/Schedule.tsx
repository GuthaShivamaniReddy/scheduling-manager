import { Result, useAtomValue } from "@effect-atom/atom-react";
import { preferencesAtom, profilesAtom } from "../lib/atoms";
import ErrorSchedule from "./ErrorSchedule";
import ScheduleRow from "./ScheduleRow";
import ScheduleSkeleton from "./ScheduleSkeleton";

const Schedule = () => {
  const profiles = useAtomValue(profilesAtom);
  const preferences = useAtomValue(preferencesAtom);

  if (Result.isInitial(profiles) || Result.isInitial(preferences))
    return <ScheduleSkeleton />;
  if (Result.isFailure(profiles) || Result.isFailure(preferences)) {
    return <ErrorSchedule />;
  }

  return (
    <div className="w-fit">
      {Object.values(profiles.value).map((profile) => (
        <ScheduleRow
          key={profile.id}
          profile={profile}
          profilePreferences={preferences.value[profile.id]}
        />
      ))}
    </div>
  );
};

export default Schedule;
