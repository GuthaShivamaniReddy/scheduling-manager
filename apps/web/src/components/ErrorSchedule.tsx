import { useAtomRefresh } from "@effect-atom/atom-react";
import { preferencesAtom } from "../lib/atoms";
import { Button } from "./ui/button";

export const ErrorSchedule = () => {
  const refreshPreferences = useAtomRefresh(preferencesAtom);

  return (
    <div className="w-[1350px] h-[300px] flex flex-col items-center justify-center gap-4">
      <p>Error loading schedule.</p>
      <Button onClick={refreshPreferences}>Refetch</Button>
    </div>
  );
};

export default ErrorSchedule;
