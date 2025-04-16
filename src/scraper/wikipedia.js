import { formatValue } from "../utils/formatValue.js";
import Scraper from "./base.js";

/**
 * A scraper class for extracting data from Wikipedia pages.
 * Extends the base `Scraper` class and provides functionality
 * to validate Wikipedia URLs, clean the document, and extract
 * table data from the page.
 */
export default class WikipediaScraper extends Scraper {
  constructor(url) {
    super(url);
    this.#validateWikipediaUrl();
  }

  #validateWikipediaUrl() {
    // Regex base on this url: https://en.wikipedia.org/wiki
    const wikipediaRegex = /^https?:\/\/(.*\.)?wikipedia\.org\/wiki\/.+$/;
    if (!wikipediaRegex.test(this.url)) {
      throw new Error(
        "Invalid URL: This scraper only supports Wikipedia pages."
      );
    }
  }

  #cleanDocument() {
    const elementsToRemove = ["style", "script", ".sr-only", "sup", "img"];
    elementsToRemove.forEach((selector) => this.instance(selector).remove());
  }

  // TODO: Just allow for Top Header only, need to add Left Header later
  getTable(selector) {
    this.#cleanDocument();
    const tables = this.instance(selector);
    const allTablesData = [];

    tables.each((tableIndex, table) => {
      const tableIntance = this.instance(table);

      const headers = tableIntance
        .find("th")
        .map((_, el) => this.instance(el).text().trim())
        .get();

      if (!headers.length) {
        return;
      }

      const grid = [];
      const rowspans = [];

      tableIntance.find("tr").each((_, tr) => {
        const row = [];
        let colIndex = 0;

        this.instance(tr)
          .find("td")
          .each((_, cell) => {
            while (rowspans[colIndex]?.rowsLeft > 0) {
              row.push(rowspans[colIndex].value);
              rowspans[colIndex].rowsLeft--;
              colIndex++;
            }

            const cellElement = this.instance(cell);
            const formattedValue = formatValue(cellElement.text().trim());
            const rowspan = parseInt(cellElement.attr("rowspan") || "1", 10);
            const colspan = parseInt(cellElement.attr("colspan") || "1", 10);

            for (let c = 0; c < colspan; c++) {
              row.push(formattedValue);
              if (rowspan > 1) {
                rowspans[colIndex] = {
                  value: formattedValue,
                  rowsLeft: rowspan - 1,
                };
              }
              colIndex++;
            }
          });

        while (rowspans[colIndex]?.rowsLeft > 0) {
          row.push(rowspans[colIndex].value);
          rowspans[colIndex].rowsLeft--;
          colIndex++;
        }

        if (row.length) grid.push(row);
      });

      const rows = grid.map((cols) =>
        headers.reduce((rowObj, header, i) => {
          rowObj[header] = cols[i] ?? null;
          return rowObj;
        }, {})
      );

      // Add the table index to differentiate between multiple tables
      allTablesData.push({
        tableIndex,
        headers,
        rows,
        total: rows.length,
      });
    });

    return allTablesData;
  }
}
