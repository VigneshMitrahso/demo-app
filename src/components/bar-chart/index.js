import React, { Component } from "react";

// plugins
import { Bar } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";
import windowSize from "react-window-size";

// component
import Loader from "../loader";

Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 0;

  left = vm.x - vm.width / 2;
  right = vm.x + vm.width / 2;
  top = vm.y;
  bottom = vm.base;
  signX = 1;
  signY = bottom > top ? 1 : -1;
  borderSkipped = vm.borderSkipped || "bottom";

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom],
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  var width, height, x, y, nextCorner, nextCornerId;
  var x_tl, x_tr, y_tl, y_tr;
  var x_bl, x_br, y_bl, y_br;
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    nextCorner = cornerAt(nextCornerId);

    width = corners[2][0] - corners[1][0];
    height = corners[0][1] - corners[1][1];
    x = corners[1][0];
    y = corners[1][1];

    radius = cornerRadius;

    // Fix radius being too large
    if (radius > Math.abs(height) / 2) {
      radius = Math.floor(Math.abs(height) / 2);
    }
    if (radius > Math.abs(width) / 2) {
      radius = Math.floor(Math.abs(width) / 2);
    }

    if (height < 0) {
      // Negative values in a standard bar chart
      x_tl = x;
      x_tr = x + width;
      y_tl = y + height;
      y_tr = y + height;

      x_bl = x;
      x_br = x + width;
      y_bl = y;
      y_br = y;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);
      ctx.lineTo(x_br - radius, y_br);
      ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);
      ctx.lineTo(x_tr, y_tr + radius);
      ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);
      ctx.lineTo(x_tl + radius, y_tl);
      ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);
      ctx.lineTo(x_bl, y_bl - radius);
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);
    } else if (width < 0) {
      // Negative values in a horizontal bar chart
      x_tl = x + width;
      x_tr = x;
      y_tl = y;
      y_tr = y;

      x_bl = x + width;
      x_br = x;
      y_bl = y + height;
      y_br = y + height;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);
      ctx.lineTo(x_br - radius, y_br);
      ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);
      ctx.lineTo(x_tr, y_tr + radius);
      ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);
      ctx.lineTo(x_tl + radius, y_tl);
      ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);
      ctx.lineTo(x_bl, y_bl - radius);
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);
    } else {
      //Positive Value
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height);
      // ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x, y + height);
      // ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

class ChartBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { chartBarData, isFetchingBarChart } = this.props;

    var years = [];
    var dataSet = [];
    var rate = [];
    var color = "";
    var min = "";
    var max = "";

    for (let list in chartBarData) {
      var type = chartBarData[list].type;
      if (type === "COMMERCIAL") {
        var color = "#00c0f3";
      } else if (type === "RESIDENTIAL") {
        var color = "#e77817";
      } else if (type === "INDUSTRIAL") {
        var color = "#917bb9";
      } else if (type === "BUNGALOW") {
        var color = "#6ea561";
      } else if (type === "DUPLEX") {
        var color = "#11457f";
      } else if (type === "FLAT") {
        var color = "#981220";
      } else if (type === "FLOOR") {
        var color = "#735686";
      } else if (type === "GALA") {
        var color = "#66cdaa";
      } else if (type === "LAND") {
        var color = "#ea6875";
      } else if (type === "OFFICE") {
        var color = "#c37b7b";
      } else if (type === "PENT HOUSE") {
        var color = "#fa8072";
      } else if (type === "ROW HOUSE") {
        var color = "#215a30";
      } else if (type === "SHOP") {
        var color = "#554433";
      } else if (type === "TRIPLEX") {
        var color = "#11457f";
      }
      var dataChart = chartBarData[list].landRate;
      for (let listData in dataChart) {
        min = dataChart[listData].min[0];
        max = dataChart[listData].max[0];
        years = [...dataChart[listData].year];
        var obj = {
          data: dataChart[listData].rate,
          label: type,
          backgroundColor: color,
          borderColor: color,
        };
        dataSet.push(obj);
      }
    }
    var lineChartData = {
      labels: years,
      datasets: dataSet,
    };

    var option = {
      animation: {
        duration: 1000,
        easing: "easeInOutBack",
      },
      horizontal: false,
      cornerRadius: 10,
      scales: {
        xAxes: [
          {
            categoryPercentage: 0.9,
            barPercentage: 0.7,
          },
        ],
      },
      legend: {
        position: "bottom",
        display: true,
        labels: {
          boxWidth: 5,
        },
      },
      plugins: {
        datalabels: {
          color: "black",
          font: {
            weight: "bold",
          },
          formatter: Math.round,
        },
      },
      tooltips: {
        callbacks: {
          afterLabel: function (tooltipItem, data) {
            return `Min ${min} - Max ${max}`;
          },
        },
      },
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
          if (isFetchingBarChart) {
            return <Loader />;
          } else {
            return (
              <div>
                <Bar
                  height={heightChart}
                  data={lineChartData}
                  horizontal="true"
                  options={option}
                />
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

export default windowSize(ChartBar);
