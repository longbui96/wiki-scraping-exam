import Chart from "./chart.js";

export default class LineChart extends Chart {
  constructor({ title, data, legend, xAxis, yAxis }) {
    super(title, data);
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.legend = legend ?? {};
  }

  createChartConfig() {
    const labels = this.data.map(
      (entry) =>
        this.xAxis.format?.(entry[this.xAxis.key]) ?? entry[this.xAxis.key]
    );
    const values = this.data.map((entry) => entry[this.yAxis.key]);

    return {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: this.xAxis.datasetLabel,
            data: values,
            borderColor: "rgba(255, 99, 132, 1)",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          legend: this.legend,
        },
        scales: {
          x: {
            title: { display: true, text: this.xAxis.label || this.xAxis.key },
          },
          y: {
            title: { display: true, text: this.yAxis.label || this.yAxis.key },
            ticks: {
              callback: this.yAxis.format ?? ((val) => val),
            },
          },
        },
      },
      plugins: [
        {
          id: "background-color",
          beforeDraw: (chart) => {
            const { ctx, width, height } = chart;
            ctx.save();
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          },
        },
      ],
    };
  }
}
