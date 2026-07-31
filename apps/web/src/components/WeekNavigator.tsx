import { useAtom } from "@effect-atom/atom-react";
import { zdtFactory } from "@vitalize-interview/utils/temporal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateRangeAtom } from "../lib/atoms";
import { Button } from "./ui/button";

const WEEK_LENGTH_DAYS = 7;

const toIsoDate = (zdt: ReturnType<typeof zdtFactory.zdt>) =>
  zdt.format.toDateYear({ iso: true });

// Returns the Sunday-Saturday week that contains the given date.
const weekRangeContaining = (date: string) => {
  const start = zdtFactory.zdt(date).startOf("week");
  const end = start.add({ days: WEEK_LENGTH_DAYS - 1 });
  return { start: toIsoDate(start), end: toIsoDate(end) };
};

export default function WeekNavigator() {
  const [range, setRange] = useAtom(dateRangeAtom);

  const startZDT = zdtFactory.zdt(range.start);
  const endZDT = zdtFactory.zdt(range.end);

  const shiftWeeks = (weeks: number) => {
    const nextStart = startZDT.add({ days: weeks * WEEK_LENGTH_DAYS });
    const nextEnd = nextStart.add({ days: WEEK_LENGTH_DAYS - 1 });
    setRange({ start: toIsoDate(nextStart), end: toIsoDate(nextEnd) });
  };

  const goToCurrentWeek = () => {
    setRange(weekRangeContaining(toIsoDate(zdtFactory.now())));
  };

  const rangeLabel = startZDT.format.toDateRange(endZDT, { inclusive: true });

  return (
    <div className="mb-3 flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => shiftWeeks(-1)}
        aria-label="Previous week"
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={goToCurrentWeek}
      >
        Today
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => shiftWeeks(1)}
        aria-label="Next week"
      >
        <ChevronRight />
      </Button>
      <p className="ml-2 text-sm font-medium text-muted-foreground">
        {rangeLabel}
      </p>
    </div>
  );
}
