import React from "react";
import { Bar } from "react-chartjs-2";
//Css
import "./ppi-chart.css";
import windowSize from "react-window-size";

var options = {
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0,
          // max: 180,
          fontSize: 16,
          fontColor: "black",
          fontStyle: "bold",
          // stepSize: 40
        },
        scaleLabel: {
          display: true,
          labelString: "(Rate - INR)",
          fontColor: "#000000",
          fontStyle: "bold",
          fontSize: 18,
        },
      },
    ],
    xAxes: [
      {
        min: 0,
        ticks: {
          fontSize: 16,
          fontColor: "black",
          fontStyle: "bold",
        },
        scaleLabel: {
          display: true,
          labelString: "(Year)",
          fontColor: "#000000",
          fontStyle: "bold",
          fontSize: 18,
        },
      },
    ],
  },
  plugins: {
    datalabels: {
      anchor: function () {
        return "end";
      },
      align: function () {
        return "end";
      },
      display: true,
      // offset: 2,
      padding: 0,
      color: function (args) {
        console.log("args", args);
        if (args.dataset.label === "Minimum Price") {
          return "#e77817";
        } else if (args.dataset.label === "Maximum Price") {
          return "#053c6d";
        } else if (args.dataset.label === "Average Price") {
          return "#50C878";
        }
      },
      formatter: Math.round,
      font: {
        size: 14,
      },
    },
  },
  animation: {
    duration: 1000,
    easing: "easeInOutBack",
    lineTension: {
      from: 0,
      to: 1,
      duration: 500,
      loop: true,
    },
  },
};

const PpiChart = (props) => {
  const lineChartData = React.useMemo(() => {
    console.log("props.analyticsChart?.length", props.analyticsChart?.length);
    if (!!props.analyticsChart && props.analyticsChart?.length !== 0) {
      let landData = props.analyticsChart.filter(
        (fd) => fd.rate_type == "land",
      );
      console.log("landData", landData);
      let landDatas = [
        {
          type: "bar",
          label: "Minimum Price",
          fill: false,
          backgroundColor: "#e77817",
          barThickness: "40",
          indexAxis: "x",
          data: landData.map((map) => map.minimum_rate),
        },
        {
          type: "line",
          label: "Average Price",
          fill: false,
          borderColor: "#50C878",

          data: landData.map((map) => map.average_rate),
        },
        {
          type: "bar",
          label: "Maximum Price",
          fill: false,
          backgroundColor: "#053c6d",
          barThickness: "40",
          indexAxis: "x",
          data: landData.map((map) => map.maximum_rate),
        },
      ];
      landData = {
        labels: landData.map((map) => map.year).sort((a, b) => a - b),
        datasets: landDatas,
      };

      let salesData = props.analyticsChart.filter(
        (fd) => fd.rate_type == "sale",
      );

      let salesDatas = [
        {
          type: "bar",
          label: "Minimum Price",
          fill: false,
          backgroundColor: "#e77817",
          barThickness: "40",
          data: salesData.map((map) => map.minimum_rate),
        },
        {
          type: "line",
          label: "Average Price",
          fill: false,
          borderColor: "#50C878",
          data: salesData.map((map) => map.average_rate),
        },
        {
          type: "bar",
          label: "Maximum Price",
          fill: false,
          backgroundColor: "#053c6d",
          barThickness: "40",
          data: salesData.map((map) => map.maximum_rate),
        },
      ];

      salesData = {
        labels: salesData.map((map) => map.year).sort((a, b) => a - b),
        datasets: salesDatas,
      };
      console.log("salesData", salesData);
      return { land: landData, sale: salesData };
    } else {
      return {
        land: { labels: [""], datasets: [] },
        sale: { labels: [""], datasets: [] },
      };
    }
  }, [props.analyticsChart]);

  console.log("lineChartData?.land", lineChartData?.land);

  return (
    <div className="ppi-chart-section">
      <div className="ppi-chart-container">
        <div className="chat-data-lay-out">
          <div className="analytics-container rate-text ">
            <label> Land Rate:</label>
            <Bar height={100} data={lineChartData?.land} options={options} />
          </div>
          <div className="analytics-container rate-text  ">
            <label> Sale Rate: {}</label>
            <Bar height={100} data={lineChartData?.sale} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default windowSize(PpiChart);
