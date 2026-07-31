import { useAtomValue } from "@effect-atom/atom-react";
import { dateRangeAtom } from "../lib/atoms";
import { getDatesBetween } from "../lib/utils";

export default function DatesHeader() {
  const { start, end } = useAtomValue(dateRangeAtom);
  const dates = getDatesBetween(start, end);

  return (
    <div className="flex">
      <div className="w-56 flex-shrink-0 whitespace-nowrap border-b border-r py-2"></div>
      <div className="flex border-t">
        {dates.map((date) => (
          <div
            key={date.format.toMonthDay()}
            className="flex h-14 w-14 items-center justify-center border-b border-r py-2 text-center"
          >
            <div>
              <p className="text-sm">{date.format.toMonthDay()}</p>
              <p className="text-sm">
                {date.format.toDayOfWeek({ short: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
