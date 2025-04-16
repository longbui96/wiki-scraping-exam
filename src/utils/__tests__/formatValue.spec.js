import { describe, it, expect } from "vitest";
import { formatValue } from "../formatValue";

describe("FormatValue", () => {
  // Height
  it("should extract height in meters from 'x m' format", () => {
    expect(formatValue("2.07 m (6 ft 9¼ in)")).toBe(2.07);
  });

  // Number
  it("should parse integers correctly", () => {
    expect(formatValue("42")).toBe(42);
  });

  it("should parse float numbers correctly", () => {
    expect(formatValue("  3.14 ")).toBe(3.14);
  });

  // Date
  it("should parse date strings correctly", () => {
    const result = formatValue("1961-04-15");
    expect(result.getFullYear()).toBe(1961);
    expect(result.getMonth()).toBe(3); // April
    expect(result.getDate()).toBe(15);
  });

  it("should parse historical dates correctly", () => {
    const result = formatValue("20 May 1922");
    expect(result.getFullYear()).toBe(1922);
    expect(result.getMonth()).toBe(4); // May
    expect(result.getDate()).toBe(20);
  });

  it("should parse dates with month names correctly", () => {
    const result = formatValue("July 20, 1984");
    expect(result.getFullYear()).toBe(1984);
    expect(result.getMonth()).toBe(6); // July
    expect(result.getDate()).toBe(20);
  });

  // Text
  it("should normalize white spaces in text", () => {
    expect(formatValue("By     Long   Bui")).toBe("By Long Bui");
  });

  // Empty
  it("should return empty string if the value is empty", () => {
    expect(formatValue("  ")).toBe("");
  });
});
