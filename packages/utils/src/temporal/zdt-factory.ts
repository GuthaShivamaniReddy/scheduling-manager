import { Temporal } from "temporal-polyfill";
import "./zdt-extension";
import { zdtFormatters } from "./zdt-formats";

enum Timezone {
  AmericaNewYork = "America/New_York",
  AmericaLosAngeles = "America/Los_Angeles",
  UTC = "UTC",
}

export type ZDTFactoryConfig = {
  timeZone?: Timezone;
  timezone?: Timezone;
};

/**
 * Type that is acceptable for an arg into any of the utils.
 * Makes writing the utils a bit harder, but better API and still allows
 * some good performance by passing around existing instances if available.
 */
export type ZDTConfig = string | number | Temporal.ZonedDateTime | Date;

const UTC_OFFSET_OR_ISO_REGEX_PATTERN =
  /\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-](?:0[0-9]|1[0-4])(?::?[0-5][0-9])?)$/;

const ISO_DATETIME_WITHOUT_TZ_REGEX_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;

const US_DATE_REGEX_PATTERN =
  /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

const MM_DD_REGEX_PATTERN = /^(\d{1,2})[/-](\d{1,2})$/;

export class ZDTFactory {
  timeZone: Timezone;
  format = zdtFormatters;

  /**
   * Alias for Temporal.ZonedDateTime
   * Helpful for some of the built in methods that are not available on a ZDT instance, such as compare.
   */
  rawZDT = Temporal.ZonedDateTime;

  constructor({
    timeZone = Timezone.AmericaNewYork,
    timezone,
  }: ZDTFactoryConfig = {}) {
    this.timeZone = timezone || timeZone;
  }

  now = () => {
    return Temporal.Now.plainDateTimeISO(this.timeZone).toZonedDateTime(
      this.timeZone,
    );
  };

  zdt = (config?: ZDTConfig | null) => {
    if (!config) return this.now();
    if (config instanceof Temporal.ZonedDateTime) return config;
    if (config instanceof Date) {
      return Temporal.Instant.fromEpochMilliseconds(
        config.getTime(),
      ).toZonedDateTimeISO(this.timeZone);
    }

    if (typeof config === "number") {
      return Temporal.Instant.fromEpochMilliseconds(config).toZonedDateTimeISO(
        this.timeZone,
      );
    }

    if (UTC_OFFSET_OR_ISO_REGEX_PATTERN.test(config)) {
      return Temporal.Instant.from(config).toZonedDateTimeISO(this.timeZone);
    }

    // Handle ISO datetime without timezone (treat as local time)
    if (ISO_DATETIME_WITHOUT_TZ_REGEX_PATTERN.test(config)) {
      return Temporal.PlainDateTime.from(config).toZonedDateTime(this.timeZone);
    }

    // Handle MM/DD/YYYY HH:mm:ss (or HH:mm) format
    const dateTimeMatch = config.match(US_DATE_REGEX_PATTERN);
    if (dateTimeMatch) {
      const [, month, day, year, hour, minute, second] =
        dateTimeMatch.map(Number);

      // We assume everything is from the year 2000+ for ease.
      const fullYear = year < 100 ? year + 2000 : year;

      const plainDateTime = Temporal.PlainDateTime.from({
        year: fullYear,
        month,
        day,
        hour: hour || 0,
        minute: minute || 0,
        second: second || 0,
      });
      return plainDateTime.toZonedDateTime(this.timeZone);
    }

    // Handle MM/DD format (assumes current year)
    const mmDdMatch = config.match(MM_DD_REGEX_PATTERN);
    if (mmDdMatch) {
      const [, month, day] = mmDdMatch.map(Number);
      const currentYear = Temporal.Now.plainDateTimeISO(this.timeZone).year;

      const plainDateTime = Temporal.PlainDateTime.from({
        year: currentYear,
        month,
        day,
        hour: 0,
        minute: 0,
      });
      return plainDateTime.toZonedDateTime(this.timeZone);
    }

    return Temporal.ZonedDateTime.from(
      `${config.replace(" ", "T")}[${this.timeZone}]`,
    );
  };
}

export namespace ZDTFactory {
  export type ZDT = Temporal.ZonedDateTime;
  export type ZDTRange = {
    startTime: ZDTConfig;
    endTime: ZDTConfig;
  };
  export type Config = ZDTFactoryConfig;
}
