import { describe, it, expect } from "vitest";
import Chart from "../chart.js";

describe("Chart", () => {
  const dummyTitle = "Sample Chart";
  const dummyData = [{ x: 1, y: 2 }];

  it("should initialize with title and data", () => {
    const chart = new Chart(dummyTitle, dummyData);
    expect(chart.title).toBe(dummyTitle);
    expect(chart.data).toEqual(dummyData);
  });

  it("should throw error if createChartConfig is not implemented", () => {
    const chart = new Chart(dummyTitle, dummyData);
    expect(() => chart.createChartConfig()).toThrow(
      "createChartConfig must be implemented by subclass"
    );
  });
});
