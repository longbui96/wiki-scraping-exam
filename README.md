# Wikipedia Scraping Tool

A simple CLI tool that scrapes data from a Wikipedia table and generates a line chart image using Chart.js.

## 🧠 Features

- Scrapes table data from a given Wikipedia page
- Visualizes data as a line chart
- Exports the chart as a PNG image

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/longbui96/wiki-scraping-exam.git
cd wiki-scraping-exam
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the tool

```bash
npm run start
```

This will fetch data from the default Wikipedia URL (you can change it in `src/config.js`) and output a `chart.png` file in the `/output` directory.

## ⚙️ Configuration

To change the Wikipedia URL or the column index to extract, edit `src/config.js`:

```js
export const WIKI_URL =
  "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression";
export const OUTPUT_FILE = "chart.png";
export const TABLE_INDEX = 0;
```

## 🧪 Running Tests

```bash
npm run test
```

## 🖼 Example Output

![Chart Example](/output/chart.png)

## 📦 Dependencies

- [cheerio](https://www.npmjs.com/package/cheerio) – for HTML parsing
- [chartjs-node-canvas](https://www.npmjs.com/package/chartjs-node-canvas) – for rendering Chart.js on the server
- [dayjs](https://www.npmjs.com/package/dayjs) – for date parsing
- [vitest](https://www.npmjs.com/package/vitest) – for unit testing

## 👨‍💻 Author

Made by [Long Bui](https://www.linkedin.com/in/long-bui/)
