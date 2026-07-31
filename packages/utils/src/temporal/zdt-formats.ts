import type { Temporal } from "temporal-polyfill";

/**
 * Formatters for ZDT.
 * These formatters are all redeclared in zdt-extension with a wrapper to pass the current instant to these functions.
 * If you add a function in here, please add it to zdt-extension file as well.
 */

/**
 * @deprecated use `toTwentyFourHourTime` instead
 */
export const toTwelveHourTime = (
  zdt: Temporal.ZonedDateTime,
  opts?: { short?: boolean },
) => {
  if (opts?.short) {
    const meridiem = zdt.hour >= 12 ? "p" : "a";
    const hours = zdt.hour % 12 || 12;
    const minutes = zdt.minute;

    if (!minutes) return `${hours}${meridiem}`;
    return `${hours}:${minutes.toString().padStart(2, "0")}${meridiem}`;
  }

  return zdt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const toTwentyFourHourTime = (zdt: Temporal.ZonedDateTime) => {
  return zdt.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const toTwentyFourHourTimeWithSeconds = (
  zdt: Temporal.ZonedDateTime,
) => {
  return zdt.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    second: "2-digit",
  });
};

export const toWeekDay = (
  zdt: Temporal.ZonedDateTime,
  opts?: { short?: boolean },
) => {
  return zdt.toLocaleString("en-US", {
    weekday: opts?.short ? "short" : "long",
  });
};

export const toDateTime = (
  zdt: Temporal.ZonedDateTime,
  opts?: { militaryTime?: boolean },
) => {
  const datePart = zdt.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  const timePart = zdt.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !opts?.militaryTime,
  });

  return `${datePart} ${timePart}`;
};

export const toDateYear = (
  zdt: Temporal.ZonedDateTime,
  opts?: { iso?: boolean; fullYear?: boolean },
) => {
  // Canada follows ISO format so just use their locale
  return zdt.toLocaleString(opts?.iso ? "en-CA" : "en-US", {
    month: "2-digit",
    day: "2-digit",
    year: opts?.iso ? "numeric" : opts?.fullYear ? "numeric" : "2-digit",
  });
};

export const toMonthYear = (zdt: Temporal.ZonedDateTime) => {
  return zdt.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const toMonthDay = (
  zdt: Temporal.ZonedDateTime,
  opts?: { fullMonth?: boolean; longMonth?: boolean },
) => {
  return zdt.toLocaleString("en-US", {
    month: opts?.fullMonth ? (opts?.longMonth ? "long" : "short") : "numeric",
    day: "numeric",
  });
};

export const toMonthDayYear = (
  zdt: Temporal.ZonedDateTime,
  opts?: {
    includeWeekDay?: boolean;
    shortWeekDay?: boolean;
    shortMonth?: boolean;
  },
) => {
  const weekDay = opts?.includeWeekDay
    ? toWeekDay(zdt, { short: !!opts?.shortWeekDay })
    : "";

  const monthDayYear = zdt.toLocaleString("en-US", {
    month: opts?.shortMonth ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });

  if (weekDay) {
    return `${weekDay}, ${monthDayYear}`;
  }

  return monthDayYear;
};

// e.g. Mon 5/25
export const toWeekDayMonthDay = (zdt: Temporal.ZonedDateTime) => {
  const weekDay = toWeekDay(zdt, { short: true });
  const monthDay = toMonthDay(zdt, {});
  return `${weekDay} ${monthDay}`;
};

export const toDayOfWeek = (
  zdt: Temporal.ZonedDateTime,
  opts?: { short?: boolean },
) => {
  return zdt.toLocaleString("en-US", {
    weekday: opts?.short ? "short" : "long",
  });
};

export const toDayOfWeekMonthDayYear = (zdt: Temporal.ZonedDateTime) => {
  const weekDay = toDayOfWeek(zdt);

  const monthDayYear = zdt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (weekDay) {
    return `${weekDay}, ${monthDayYear}`;
  }

  return monthDayYear;
};

export const toMDDYYYYatHHMMa = (zdt: Temporal.ZonedDateTime) => {
  const monthDayYear = toDateYear(zdt);
  const time = toTwelveHourTime(zdt);
  return `${monthDayYear.startsWith("0") ? monthDayYear.slice(1) : monthDayYear} at ${time}`;
};

export const toISOLikeString = (zdt: Temporal.ZonedDateTime) => {
  return zdt
    .toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(", ", "T");
};

/**
 * this very likely has little utility outside the mobile version of the staff callout page.
 * @param startDate
 * @param endDate
 * @param period
 * @returns string representing the span of a set of callouts.
 */
export const generateCalloutSpanString = (
  startZDT: Temporal.ZonedDateTime,
  endZDT: Temporal.ZonedDateTime,
) => {
  if (startZDT.isSame(endZDT, "month")) {
    const endDay = endZDT.toLocaleString("en-US", {
      day: "numeric",
    });
    return `${startZDT.format.toMonthDay({ fullMonth: true })} - ${endDay}`;
  }
  return `${startZDT.format.toMonthDay({ fullMonth: true })} - ${endZDT.format.toMonthDay()}`;
};

/**
 * Creates a date range string in the format "MMM DD - MMM DD", "MM/DD/YY - MM/DD/YY", or "Sunday, January 1, 2024 - Monday, January 2, 2024"
 * @param startZDT The start date
 * @param endZDT The end date (will have 1 day subtracted before formatting unless inclusive is true)
 * @param opts Options for formatting
 * @returns string representing the date range
 */
export const toDateRange = (
  startZDT: Temporal.ZonedDateTime,
  endZDT: Temporal.ZonedDateTime,
  opts?: { numeric?: boolean; inclusive?: boolean; long?: boolean },
) => {
  const endDateToFormat = opts?.inclusive
    ? endZDT
    : endZDT.subtract({ days: 1 });

  if (opts?.long) {
    const startFormatted = toDayOfWeekMonthDayYear(startZDT);
    const endFormatted = toDayOfWeekMonthDayYear(endDateToFormat);

    return `${startFormatted} - ${endFormatted}`;
  }

  if (opts?.numeric) {
    const startFormatted = toDateYear(startZDT);
    const endFormatted = toDateYear(endDateToFormat);

    return `${startFormatted} - ${endFormatted}`;
  }

  // For default format, use toLocaleString to get zero-padded days like "Jan 15"
  const startFormatted = startZDT.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
  });

  const endFormatted = endDateToFormat.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Format time range for display
 *
 * @param startZdt - Start time as ZonedDateTime
 * @param endZdt - End time as ZonedDateTime
 * @param options - Formatting options
 * @param options.format - '12h' for 12-hour format, '24h' for 24-hour format (default: '12h')
 * @param options.short - Use short format (1p vs 1:00 PM) (default: true)
 * @param options.separator - Custom separator between times (default: ' - ')
 *                           Note: For short format, separators are automatically trimmed (spaces removed)
 * @returns Formatted time range string (e.g., "9a-5p", "09:00-17:00")
 *
 * @example
 * ```typescript
 * // 12-hour short format (default) - separator is trimmed
 * toTimeRange(startZdt, endZdt);
 * // Returns: "9a-5p"
 *
 * // 12-hour long format - separator keeps spaces
 * toTimeRange(startZdt, endZdt, { short: false });
 * // Returns: "9:00 AM - 5:00 PM"
 *
 * // 24-hour format - separator is trimmed for consistency
 * toTimeRange(startZdt, endZdt, { format: '24h' });
 * // Returns: "09:00-17:00"
 *
 * // 24-hour short format (removes minutes when zero)
 * toTimeRange(startZdt, endZdt, { format: '24h', short: true });
 * // Returns: "9-17"
 *
 * // Custom separator - trimmed for short format
 * toTimeRange(startZdt, endZdt, { separator: ' to ' });
 * // Returns: "9ato5p" (trimmed)
 *
 * // Custom separator - preserved for long format
 * toTimeRange(startZdt, endZdt, { separator: ' until ', short: false });
 * // Returns: "9:00 AM until 5:00 PM"
 *
 * // Empty separator
 * toTimeRange(startZdt, endZdt, { separator: '' });
 * // Returns: "9a5p"
 *
 * // Cross-day time ranges
 * toTimeRange(eveningZdt, nextMorningZdt);
 * // Returns: "11p-1a"
 *
 * // Same time (edge case)
 * toTimeRange(noonZdt, noonZdt);
 * // Returns: "12p-12p"
 * ```
 */
export const toTimeRange = (
  startZdt: Temporal.ZonedDateTime,
  endZdt: Temporal.ZonedDateTime,
  options: {
    format?: "12h" | "24h";
    short?: boolean;
    separator?: string;
  } = {},
): string => {
  const { format = "12h", short = true, separator = " - " } = options;

  let startTimeStr: string;
  let endTimeStr: string;

  if (format === "24h") {
    startTimeStr = toTwentyFourHourTime(startZdt);
    endTimeStr = toTwentyFourHourTime(endZdt);

    if (endZdt.dayOfYear !== startZdt.dayOfYear) {
      const endTimeHour = endZdt.hour + 24;
      endTimeStr = `${endTimeHour.toString().padStart(2, "0")}:${endZdt.minute.toString().padStart(2, "0")}`;
    }
  } else {
    // 12-hour format
    startTimeStr = toTwelveHourTime(startZdt, { short });
    endTimeStr = toTwelveHourTime(endZdt, { short });
  }

  return `${startTimeStr}${short ? separator.trim() : separator}${endTimeStr}`;
};

export const zdtFormatters = {
  /**
   * @deprecated use `toTwentyFourHourTime` instead
   */
  toTwelveHourTime,
  toTwentyFourHourTime,
  toTwentyFourHourTimeWithSeconds,
  toWeekDay,
  toMonthDay,
  toWeekDayMonthDay,
  toMonthYear,
  toMonthDayYear,
  toDateTime,
  toDateYear,
  toDayOfWeek,
  toDayOfWeekMonthDayYear,
  toMDDYYYYatHHMMa,
  toISOLikeString,
  generateCalloutSpanString,
  toDateRange,
  toTimeRange,
};
