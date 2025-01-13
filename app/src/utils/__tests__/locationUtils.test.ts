import { describe, it, expect } from "vitest";
import { isUSLocation } from "../locationUtils";

describe("isUSLocation", () => {
  it("returns true for United States", () => {
    expect(isUSLocation("United States")).toBe(true);
  });

  it("returns true for united states (case insensitive)", () => {
    expect(isUSLocation("united states")).toBe(true);
  });

  it("returns false for non-US countries", () => {
    expect(isUSLocation("Canada")).toBe(false);
    expect(isUSLocation("Mexico")).toBe(false);
    expect(isUSLocation("UK")).toBe(false);
    expect(isUSLocation("France")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isUSLocation("")).toBe(false);
  });
});
