import { describe, expect, test } from "bun:test";
import { ZDTFactory } from "./zdt-factory";

// Pure unit test (no I/O). Demonstrates the `*.unit.test.ts` pattern from
// SETUP.md and serves as a passing example for the test framework.

describe("ZDTFactory", () => {
  const factory = new ZDTFactory();

  test("parses an ISO date string into a ZonedDateTime", () => {
    const zdt = factory.zdt("2024-09-15");
    expect(zdt.year).toBe(2024);
    expect(zdt.month).toBe(9);
    expect(zdt.day).toBe(15);
  });

  test("formats a date with `toDateYear` using the ISO option", () => {
    const zdt = factory.zdt("2024-09-15");
    expect(zdt.format.toDateYear({ iso: true })).toBe("2024-09-15");
  });

  test("adds days and crosses month boundaries correctly", () => {
    const start = factory.zdt("2024-09-30");
    const next = start.add({ days: 1 });
    expect(next.format.toDateYear({ iso: true })).toBe("2024-10-01");
  });
});
