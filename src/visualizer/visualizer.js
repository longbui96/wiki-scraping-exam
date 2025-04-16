import fs from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export default class Visualizer {
  constructor({ width = 1280, height = 720 }) {
    this.canvas = new ChartJSNodeCanvas({ width, height });
  }

  async export(chartInstance, outputPath) {
    const config = chartInstance.createChartConfig();
    const image = await this.canvas.renderToBuffer(config);
    fs.writeFileSync(outputPath, image);
  }
}
