import { Temporal } from "temporal-polyfill";
import { zdtFormatters } from "./zdt-formats";

/**
 * This file adds common methods to the Temporal.ZonedDateTime interface.
 * If you are wanting to add a method, add it to the interface, then the prototype as shown below.
 * Always make sure you have extensive test coverage for the new method, as these are the foundations of our app's date math!
 */
declare module "temporal-polyfill" {
  namespace Temporal {
    interface ZonedDateTime {
      /**
       * @returns {Temporal.ZonedDateTime} The ZonedDateTime in UTC
       */
      toUTC(): Temporal.ZonedDateTime;
      /**
       * @returns {string} The ISO string of the ZonedDateTime.
       */
      toISOString(): string;
      /**
       * @returns {string} Returns a human-readable relative time string from now (e.g. "2 hours ago" or "in 2 hours")
       */
      fromNow(): string;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to. (Should be at a later time than this ZonedDateTime)
       * @param unit {Temporal.DateTimeUnit} The unit to compare by.
       * @returns {number} The difference between the two ZonedDateTimes.
       */
      diff(
        comparisonZDT: Temporal.ZonedDateTime,
        unit: Temporal.DateTimeUnit,
        options?: Omit<
          Temporal.DifferenceOptions<Temporal.DateTimeUnit>,
          "smallestUnit" | "largestUnit"
        >,
      ): number;
      /**
       * @param unit {Temporal.DateUnit} The unit to start of.
       * @returns {Temporal.ZonedDateTime} The ZonedDateTime with the start of the unit.
       */
      startOf(unit: Temporal.DateUnit): Temporal.ZonedDateTime;
      /**
       * @param unit {Temporal.DateUnit} The unit to end of.
       * @returns {Temporal.ZonedDateTime} The ZonedDateTime with the end of the unit.
       */
      endOf(unit: Temporal.DateUnit): Temporal.ZonedDateTime;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to.
       * @param unit {Temporal.DateTimeUnit} The unit to compare by.
       * @returns {boolean} Whether the ZonedDateTime is the same as the comparison ZonedDateTime.
       */
      isSame(
        comparisonZDT: Temporal.ZonedDateTime,
        unit: Temporal.DateTimeUnit,
      ): boolean;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to.
       * @returns {boolean} Whether the ZonedDateTime is before the comparison ZonedDateTime.
       */
      isBefore(comparisonZDT: Temporal.ZonedDateTime): boolean;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to.
       * @returns {boolean} Whether the ZonedDateTime is the same as or before the comparison ZonedDateTime.
       */
      isSameOrBefore(comparisonZDT: Temporal.ZonedDateTime): boolean;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to.
       * @returns {boolean} Whether the ZonedDateTime is after the comparison ZonedDateTime.
       */
      isAfter(comparisonZDT: Temporal.ZonedDateTime): boolean;
      /**
       * @param comparisonZDT {Temporal.ZonedDateTime} The ZonedDateTime to compare to.
       * @returns {boolean} Whether the ZonedDateTime is the same as or after the comparison ZonedDateTime.
       */
      isSameOrAfter(comparisonZDT: Temporal.ZonedDateTime): boolean;
      /**
       * @returns {Date} Javascript Date object with the same date and time as the ZonedDateTime.
       */
      toDate(): Date;

      /**
       * @returns {number} The UTC offset in hours.
       */
      getUtcOffsetHours(): number;

      format: {
        /**
         * @param opts {Parameters<typeof zdtFormatters.toTwelveHourTime>[1]} The options to pass to the formatter.
         * @deprecated Use `toTwentyFourHourTime` instead
         * @returns {string} The time as hh:mma
         */
        toTwelveHourTime(
          opts?: Parameters<typeof zdtFormatters.toTwelveHourTime>[1],
        ): string;
        /**
         * @returns {string} The time as HH:MM
         */
        toTwentyFourHourTime(): string;
        /**
         * @returns {string} The time as HH:MM:SS
         */
        toTwentyFourHourTimeWithSeconds(): string;
        /**
         * @param opts {Parameters<typeof zdtFormatters.toWeekDay>[1]} The options to pass to the formatter.
         * @returns {string} The day of the week as a short or long string.
         */
        toWeekDay(opts?: Parameters<typeof zdtFormatters.toWeekDay>[1]): string;
        /**
         * @returns {string} The date and time as MM/DD/YYYY HH:MM
         * @param opts {Parameters<typeof zdtFormatters.toDateTime>[1]} The options to pass to the formatter.
         */
        toDateTime(
          opts?: Parameters<typeof zdtFormatters.toDateTime>[1],
        ): string;
        /**
         * @param opts {Parameters<typeof zdtFormatters.toDateYear>[1]} The options to pass to the formatter.
         * @returns {string} The date as YYYY-MM-DD if iso, otherwise MM/DD/YY
         */
        toDateYear(
          opts?: Parameters<typeof zdtFormatters.toDateYear>[1],
        ): string;
        /**
         * @returns {string} The month and year as MMMM YYYY
         */
        toMonthYear(): string;
        /**
         * @param opts {Parameters<typeof zdtFormatters.toMonthDay>[1]} The options to pass to the formatter.
         * @returns {string} The date as MM/DD
         */
        toMonthDay(
          opts?: Parameters<typeof zdtFormatters.toMonthDay>[1],
        ): string;
        /**
         * @returns {string} The date as ddd MM/DD
         */
        toWeekDayMonthDay(): string;
        /**
         * @param opts {Parameters<typeof zdtFormatters.toMonthDayYear>[1]} The options to pass to the formatter.
         * @returns {string} The date as [Weekday], [Month] [Day], [Year]
         */
        toMonthDayYear(
          opts?: Parameters<typeof zdtFormatters.toMonthDayYear>[1],
        ): string;

        /**
         * @returns {string} The date as "Sunday", "Monday", etc., or "Sun", "Mon", etc. if short is true
         */
        toDayOfWeek(
          opts?: Parameters<typeof zdtFormatters.toDayOfWeek>[1],
        ): string;

        /**
         * @returns {string} The date as "Sunday, January 1, 2024"
         */
        toDayOfWeekMonthDayYear(): string;
        /**
         * @returns {string} The date as M/DD/YYYY at HH:MM
         */
        toMDDYYYYatHHMMa(): string;
        /**
         * @returns {string} The date and time in ISO-like format (YYYY-MM-DDTHH:mm:ss)
         */
        toISOLikeString(): string;
        /**
         * @param endZDT {Temporal.ZonedDateTime} The end date (will have 1 day subtracted before formatting unless inclusive is true)
         * @param opts {Parameters<typeof zdtFormatters.toDateRange>[2]} Options for formatting
         * @returns {string} The date range as "MMM DD - MMM DD" or "MM/DD/YY - MM/DD/YY"
         */
        toDateRange(
          endZDT: Parameters<typeof zdtFormatters.toDateRange>[1],
          opts?: Parameters<typeof zdtFormatters.toDateRange>[2],
        ): string;
        /**
         * @param endZDT {Temporal.ZonedDateTime} The end time as ZonedDateTime
         * @param opts {Parameters<typeof zdtFormatters.toTimeRange>[2]} Options for formatting
         * @returns {string} Formatted time range string (e.g., "9a-5p", "09:00-17:00")
         */
        toTimeRange(
          endZDT: Parameters<typeof zdtFormatters.toTimeRange>[1],
          opts?: Parameters<typeof zdtFormatters.toTimeRange>[2],
        ): string;
      };
    }
  }
}

Temporal.ZonedDateTime.prototype.toUTC = function (
  this: Temporal.ZonedDateTime,
) {
  return this.withTimeZone("UTC");
};

Temporal.ZonedDateTime.prototype.toISOString = function (
  this: Temporal.ZonedDateTime,
) {
  return this.toInstant().toString();
};

Temporal.ZonedDateTime.prototype.diff = function (
  this,
  comparisonZDT,
  unit,
  options,
) {
  const pluralUnit: Temporal.PluralUnit<typeof unit> = `${unit}s` as const;

  // Use since to get positive duration when this is after comparisonZDT
  // Use until to get positive duration when this is before comparisonZDT
  const duration = this.isAfter(comparisonZDT)
    ? this.since(comparisonZDT, {
        smallestUnit: unit,
        largestUnit: unit,
        ...options,
      })
    : this.until(comparisonZDT, {
        smallestUnit: unit,
        largestUnit: unit,
        ...options,
      });

  return duration[pluralUnit];
};

Temporal.ZonedDateTime.prototype.startOf = function (this, unit) {
  // console.log(this.day, this.dayOfWeek - 1, this.toISOString())
  switch (unit) {
    case "year":
      return this.with({ month: 1, day: 1 }).startOfDay();
    case "month":
      return this.with({ day: 1 }).startOfDay();
    case "week":
      if (this.dayOfWeek === 7) {
        return this.startOfDay();
      }
      return this.subtract({ days: this.dayOfWeek }).startOfDay();
    case "day":
      return this.startOfDay();
    default:
      throw new Error(`Invalid unit: ${unit}`);
  }
};

const END_OF_DAY_VALUES = {
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999,
  microsecond: 999,
  nanosecond: 999,
};
Temporal.ZonedDateTime.prototype.endOf = function (this, unit) {
  switch (unit) {
    case "year": {
      return this.with({ month: 12, day: 31, ...END_OF_DAY_VALUES });
    }
    case "month":
      return this.with({
        day: this.daysInMonth,
        ...END_OF_DAY_VALUES,
      });
    case "week":
      if (this.dayOfWeek === 7) {
        return this.add({ days: 6 }).with({
          ...END_OF_DAY_VALUES,
        });
      }
      return this.add({ days: 6 - this.dayOfWeek }).with({
        ...END_OF_DAY_VALUES,
      });
    case "day":
      return this.with(END_OF_DAY_VALUES);
    default:
      throw new Error(`Invalid unit: ${unit}`);
  }
};

const unitFields: Record<string, (keyof Temporal.ZonedDateTime)[]> = {
  year: ["year"],
  month: ["year", "month"],
  week: ["year", "weekOfYear"],
  day: ["year", "month", "day"],
  hour: ["year", "month", "day", "hour"],
  minute: ["year", "month", "day", "hour", "minute"],
  second: ["year", "month", "day", "hour", "minute", "second"],
};
Temporal.ZonedDateTime.prototype.isSame = function (this, comparisonZDT, unit) {
  return unitFields[unit].every((unit) => {
    return this[unit] === comparisonZDT[unit];
  });
};

Temporal.ZonedDateTime.prototype.isBefore = function (this, comparisonZDT) {
  return (
    this.toInstant().epochMilliseconds <
    comparisonZDT.toInstant().epochMilliseconds
  );
};

Temporal.ZonedDateTime.prototype.isSameOrBefore = function (
  this,
  comparisonZDT,
) {
  return (
    this.toInstant().epochMilliseconds <=
    comparisonZDT.toInstant().epochMilliseconds
  );
};

Temporal.ZonedDateTime.prototype.isAfter = function (this, comparisonZDT) {
  return (
    this.toInstant().epochMilliseconds >
    comparisonZDT.toInstant().epochMilliseconds
  );
};

Temporal.ZonedDateTime.prototype.isSameOrAfter = function (
  this,
  comparisonZDT,
) {
  return (
    this.toInstant().epochMilliseconds >=
    comparisonZDT.toInstant().epochMilliseconds
  );
};

Temporal.ZonedDateTime.prototype.toDate = function (this) {
  return new Date(this.epochMilliseconds);
};

// Define format as a getter so we can pass this to the formatters
Object.defineProperty(Temporal.ZonedDateTime.prototype, "format", {
  get(this: Temporal.ZonedDateTime) {
    const formatters: typeof Temporal.ZonedDateTime.prototype.format = {
      /**
       * @deprecated Use `toTwentyFourHourTime` instead
       */
      toTwelveHourTime: (opts) => zdtFormatters.toTwelveHourTime(this, opts),
      toTwentyFourHourTime: () => zdtFormatters.toTwentyFourHourTime(this),
      toTwentyFourHourTimeWithSeconds: () =>
        zdtFormatters.toTwentyFourHourTimeWithSeconds(this),
      toWeekDay: (opts) => zdtFormatters.toWeekDay(this, opts),
      toDateTime: (opts) => zdtFormatters.toDateTime(this, opts),
      toDateYear: (opts) => zdtFormatters.toDateYear(this, opts),
      toMonthYear: () => zdtFormatters.toMonthYear(this),
      toMonthDay: (opts) => zdtFormatters.toMonthDay(this, opts),
      toWeekDayMonthDay: () => zdtFormatters.toWeekDayMonthDay(this),
      toMonthDayYear: (opts) => zdtFormatters.toMonthDayYear(this, opts),
      toDayOfWeek: (opts) => zdtFormatters.toDayOfWeek(this, opts),
      toDayOfWeekMonthDayYear: () =>
        zdtFormatters.toDayOfWeekMonthDayYear(this),
      toMDDYYYYatHHMMa: () => zdtFormatters.toMDDYYYYatHHMMa(this),
      toISOLikeString: () => zdtFormatters.toISOLikeString(this),
      toDateRange: (endZDT, opts) =>
        zdtFormatters.toDateRange(this, endZDT, opts),
      toTimeRange: (endZDT, opts) =>
        zdtFormatters.toTimeRange(this, endZDT, opts),
    };
    return formatters;
  },
  enumerable: true,
  configurable: true,
});

Temporal.ZonedDateTime.prototype.fromNow = function (
  this: Temporal.ZonedDateTime,
) {
  const now = Temporal.Now.zonedDateTimeISO(this.timeZoneId);
  const duration = this.until(now, { largestUnit: "year" });

  if (duration.years > 0) {
    return `${duration.years} year${duration.years === 1 ? "" : "s"} ago`;
  }
  if (duration.months > 0) {
    return `${duration.months} month${duration.months === 1 ? "" : "s"} ago`;
  }

  // Calculate weeks separately and only show if it's more than 1 week
  const weeks = Math.floor(duration.days / 7);
  if (weeks > 0 && weeks > 1) {
    return `${weeks} weeks ago`;
  }
  if (duration.days > 0) {
    return `${duration.days} day${duration.days === 1 ? "" : "s"} ago`;
  }
  if (duration.hours > 0) {
    return `${duration.hours} hour${duration.hours === 1 ? "" : "s"} ago`;
  }
  if (duration.minutes > 0) {
    return `${duration.minutes} minute${duration.minutes === 1 ? "" : "s"} ago`;
  }
  return "just now";
};

Temporal.ZonedDateTime.prototype.getUtcOffsetHours = function (this) {
  return Math.round(this.offsetNanoseconds / 1e9 / 60 / 60);
};
