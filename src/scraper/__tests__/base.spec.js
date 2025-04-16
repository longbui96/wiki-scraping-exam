import * as cheerio from "cheerio";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Scraper from "../base"; // đường dẫn tuỳ vào cấu trúc dự án

describe("Scraper", () => {
  let scraper;

  beforeEach(() => {
    scraper = new Scraper("https://example.com");
  });

  describe("Method loadHtml", () => {
    it("should fetch and load HTML content from the given URL", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve("<html><body><h1>Hello</h1></body></html>"),
        })
      );

      await scraper.loadHtml();
      expect(scraper.html).toContain("<h1>Hello</h1>");
      expect(scraper.instance("h1").text()).toBe("Hello");
    });

    it("should throw an error if the fetch fails", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
      );

      await expect(scraper.loadHtml()).rejects.toThrow(
        "Failed to fetch https://example.com: 500 Internal Server Error"
      );
    });
  });

  describe("Method getText", () => {
    beforeEach(() => {
      scraper.instance = cheerio.load(`
        <table>
          <tr><td>Sample Text</td></tr>
        </table>
      `);
    });

    it("should return text from matched element", () => {
      const text = scraper.getText("td:first-child");
      expect(text).toBe("Sample Text");
    });

    it("should return empty string if no match", () => {
      const text = scraper.getText(".not-found");
      expect(text).toBe("");
    });
  });

  describe("Method getHtml", () => {
    beforeEach(() => {
      scraper.instance = cheerio.load(`
        <table>
          <tr><td><strong>Bold Text</strong></td></tr>
        </table>
      `);
    });

    it("should return HTML content", () => {
      const html = scraper.getHtml("td:first-child");
      expect(html).toBe("<strong>Bold Text</strong>");
    });

    it("should return null if no match", () => {
      const html = scraper.getHtml(".not-found");
      expect(html).toBeNull();
    });
  });

  describe("Method getTable", () => {
    it("should parse headers and rows correctly", () => {
      scraper.instance = cheerio.load(`
        <table id="example-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Long Bui</td>
              <td>28</td>
            </tr>
            <tr>
              <td>Long Bui plus 2 ages</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>
      `);

      const result = scraper.getTable("#example-table");
      expect(result.headers).toEqual(["Name", "Age"]);
      expect(result.rows).toEqual([
        { Name: "Long Bui", Age: "28" },
        { Name: "Long Bui plus 2 ages", Age: "30" },
      ]);
      expect(result.total).toBe(2);
    });

    it("should auto-generate headers if missing", () => {
      scraper.instance = cheerio.load(`
        <table>
          <thead>
            <tr><th>Column 1</th><th>Column 2</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>2</td></tr>
            <tr><td>3</td><td>4</td></tr>
          </tbody>
        </table>
      `);

      const result = scraper.getTable("table");
      expect(result.headers).toEqual(["Column 1", "Column 2"]);
      expect(result.rows).toEqual([
        { "Column 1": "1", "Column 2": "2" },
        { "Column 1": "3", "Column 2": "4" },
      ]);
      expect(result.total).toBe(2);
    });

    it("should handle empty tables", () => {
      scraper.instance = cheerio.load("<table></table>");
      const result = scraper.getTable("table");
      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
