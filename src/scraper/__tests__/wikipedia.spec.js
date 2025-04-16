import { describe, it, expect, beforeEach } from "vitest";

import * as cheerio from "cheerio";

import WikipediaScraper from "../wikipedia";

describe("WikipediaScraper", () => {
  let scraper;

  beforeEach(() => {
    scraper = new WikipediaScraper("https://en.wikipedia.org/wiki/Example");
    scraper.instance = cheerio.load(`
      <table id="sample-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Long Bui</td>
            <td>100</td>
          </tr>
          <tr>
            <td rowspan="2">LB Duplicated</td>
            <td>90</td>
          </tr>
          <tr>
            <td>95</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  describe("constructor", () => {
    it("should throw error for non-Wikipedia URL", () => {
      expect(() => new WikipediaScraper("https://example.com")).toThrow(
        "Invalid URL: This scraper only supports Wikipedia pages."
      );
    });

    it("should accept a valid Wikipedia URL", () => {
      expect(
        () => new WikipediaScraper("https://en.wikipedia.org/wiki/Example")
      ).not.toThrow();
    });
  });

  describe("method getTable", () => {
    it("should return headers, rows, and total row count", () => {
      const [table] = scraper.getTable("#sample-table");

      expect(table.headers).toEqual(["Name", "Score"]);
      expect(table.rows).toEqual([
        { Name: "Long Bui", Score: 100 },
        { Name: "LB Duplicated", Score: 90 },
        { Name: "LB Duplicated", Score: 95 },
      ]);
      expect(table.total).toBe(3);
    });

    it("should return empty array", () => {
      scraper.instance = cheerio.load("<html><body></body></html>");
      const output = scraper.getTable("#non-existent");

      expect(output).toEqual([]);
    });

    it("should return empty array for empty table", () => {
      scraper.instance = cheerio.load(`
        <table id="empty-table">
          <thead><tr></tr></thead>
          <tbody></tbody>
        </table>
      `);
      const output = scraper.getTable("#empty-table");

      expect(output).toEqual([]);
    });
  });
});
