import { describe, it, expect } from "vitest";
import LineChart from "../lineChart.js";

describe("LineChart", () => {
  const sampleData = [
    { Date: "2023-01-01", Mark: 1.23 },
    { Date: "2023-01-02", Mark: 1.45 },
  ];

  const lineChartConfig = {
    title: "Sample Line Chart",
    data: sampleData,
    xAxis: {
      key: "Date",
      label: "Date",
      datasetLabel: "Mark by Date",
      format: (val) => `D:${val}`,
    },
    yAxis: {
      key: "Mark",
      label: "Mark (m)",
      format: (val) => `${val.toFixed(2)}m`,
    },
    legend: {
      display: false,
    },
  };

  it("should initialize LineChart with correct properties", () => {
    const chart = new LineChart(lineChartConfig);
    expect(chart.title).toBe("Sample Line Chart");
    expect(chart.data).toEqual(sampleData);
    expect(chart.xAxis.key).toBe("Date");
    expect(chart.yAxis.key).toBe("Mark");
    expect(chart.legend.display).toBe(false);
  });

  it("should generate correct chart config", () => {
    const chart = new LineChart(lineChartConfig);
    const config = chart.createChartConfig();

    expect(config.type).toBe("line");
    expect(config.data.labels).toEqual(["D:2023-01-01", "D:2023-01-02"]);
    expect(config.data.datasets[0].data).toEqual([1.23, 1.45]);
    expect(config.options.plugins.title.text).toBe("Sample Line Chart");
    expect(config.options.plugins.legend.display).toBe(false);
    expect(config.options.scales.x.title.text).toBe("Date");
    expect(config.options.scales.y.title.text).toBe("Mark (m)");

    // Kiểm tra plugin custom
    const bgPlugin = config.plugins.find((p) => p.id === "background-color");
    expect(bgPlugin).toBeDefined();
  });

  it("should fallback to default labels and format if not provided", () => {
    const fallbackConfig = {
      title: "Fallback Chart",
      data: sampleData,
      xAxis: {
        key: "Date",
        datasetLabel: "Marks",
      },
      yAxis: {
        key: "Mark",
      },
    };

    const chart = new LineChart(fallbackConfig);
    const config = chart.createChartConfig();

    expect(config.options.scales.x.title.text).toBe("Date");
    expect(config.options.scales.y.title.text).toBe("Mark");
    expect(config.options.scales.y.ticks.callback(1.23)).toBe(1.23); // default format
  });
});
