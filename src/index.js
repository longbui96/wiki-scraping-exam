import dayjs from "dayjs";

import WikipediaScraper from "./scraper/wikipedia.js";
import LineChart from "./chart/lineChart.js";
import Visualizer from "./visualizer/visualizer.js";

import { OUTPUT_FILE, TABLE_INDEX, WIKI_URL } from "./config.js";

async function main() {
  const scraper = new WikipediaScraper(WIKI_URL);
  await scraper.loadHtml();

  const pageTitle = scraper.getText("h1#firstHeading");
  console.log("Page title:", pageTitle);

  const allTablesData = scraper.getTable("table.wikitable");
  const { rows } = allTablesData[TABLE_INDEX];

  // If you want to use different fields for the chart, you can update the xAxis and yAxis values accordingly.
  const chart = new LineChart({
    title: pageTitle,
    data: rows,
    legend: {
      display: false,
    },
    xAxis: {
      key: "Date",
      label: "Date",
      format: (value) => dayjs(value).format("DD MMM YYYY"),
    },
    yAxis: {
      key: "Mark",
      label: "Mark (m)",
      format: (value) => `${value.toFixed(2)} m`,
    },
  });

  const outputPath = `./output/${OUTPUT_FILE}`;
  const visualizer = new Visualizer({}); // Can use { width: 1920, height: 1080 } for Full HD resolution

  await visualizer.export(chart, outputPath); // Output can use the datetime to split the output file in each runtime
  console.log(`✅ Chart saved to ${outputPath}`);
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
