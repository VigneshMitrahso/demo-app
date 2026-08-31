import React, { Component } from "react";

// plugins
import { Line } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import windowSize from "react-window-size";

// compnent
import Loader from "../loader";

// css

var options = {
  plugins: {
    datalabels: {
      anchor: function (context) {
        var value = context.dataset.data[context.dataIndex];
        return value.x < 1000 ? "start" : "end";
      },
      align: function (context) {
        var value = context.dataset.data[context.dataIndex];
        return value.x < 1000 ? "start" : "end";
      },
      display: true,
      offset: 2,
      padding: 0,
      color: "#053c6d",
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
  legend: {
    position: "bottom",
    display: true,
    labels: {
      boxWidth: 5,
    },
  },
  scales: {
    xAxes: [
      {
        ticks: { display: true },
      },
    ],
    yAxes: [
      {
        stacked: true,
        ticks: {
          display: true,
          scaleLabel: {
            show: true,
          },
        },
      },
    ],
  },
};

class ChartLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataChart, isFetchingAnalytics } = this.props;
    var years = [];

    var dataSet = [];

    for (let list in dataChart) {
      years = [...dataChart[list].year];
      var obj = {
        label: dataChart[list].locality,
        fill: true,
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        borderWidth: 3,
        pointRadius: 5,
        data: dataChart[list].rate,
        lineTension: 0,
        pointColor: "#E77817",
        pointHoverRadius: 8,
        pointBackgroundColor: "#E77817",
        duration: "100ms",
      };
      dataSet.push(obj);
    }
    var lineChartData = {
      labels: years,
      datasets: dataSet,
    };

    if (this.props.windowWidth > 1400) {
      var heightChart = 55;
    } else if (this.props.windowWidth > 1200) {
      var heightChart = 60;
    } else if (this.props.windowWidth > 1100) {
      var heightChart = 80;
    } else if (this.props.windowWidth > 991) {
      var heightChart = 85;
    } else if (this.props.windowWidth > 767) {
      var heightChart = 100;
    }

    return (
      <div>
        {(() => {
          if (isFetchingAnalytics) {
            return <Loader />;
          } else {
            return (
              <div>
                <Line
                  height={heightChart}
                  data={lineChartData}
                  options={options}
                />
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
export default windowSize(ChartLine);
