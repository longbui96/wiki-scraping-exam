import * as cheerio from "cheerio";

/**
 * This file defines the `Scraper` class, which provides utility methods
 * for scraping and extracting data from HTML content fetched from a given URL.
 * It includes methods to load HTML, extract text, HTML content, and parse tables
 * from the DOM using CSS selectors.
 */
export default class Scraper {
  instance;
  html;
  url;

  constructor(url) {
    this.url = url;
  }

  async loadHtml() {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${this.url}: ${response.status} ${response.statusText}`
      );
    }
    this.html = await response.text();
    this.instance = cheerio.load(this.html);
    return this.instance;
  }

  getElement(selector) {
    return this.instance(selector);
  }

  getText(selector) {
    return this.instance(selector).text().trim();
  }

  getHtml(selector) {
    return this.instance(selector).html();
  }

  getTable(selector) {
    const table = this.instance(selector);
    const headers = [];

    // Get headers
    table.find("thead tr th").each((_, th) => {
      headers.push(this.instance(th).text().trim());
    });

    if (headers.length === 0) {
      table
        .find("tr")
        .first()
        .find("th, td")
        .each((_, cell) => {
          headers.push(this.instance(cell).text().trim());
        });
    }

    // Get rows
    const rows = [];
    table.find("tbody tr").each((_, tr) => {
      const row = {};
      this.instance(tr)
        .find("td")
        .each((i, td) => {
          const value = this.instance(td).text().trim();
          const header = headers[i] ?? `Column ${i + 1}`;
          row[header] = value;
        });

      // Skip empty rows
      if (Object.keys(row).length > 0) {
        rows.push(row);
      }
    });

    return {
      headers,
      rows,
      total: rows.length,
    };
  }
}
