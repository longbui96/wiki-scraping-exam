export default class Chart {
  constructor(title, data) {
    this.title = title;
    this.data = data;
  }

  createChartConfig() {
    throw new Error("createChartConfig must be implemented by subclass");
  }
}
