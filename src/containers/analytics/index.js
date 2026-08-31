import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Slider from "react-slick";

// components
import Header from "../../components/header";
import SideBar from "../../components/side-bar";
import ChartLine from "../../components/chart";
import ChartBar from "../../components/bar-chart";
import AnalyticesFilter from "../../components/analytices-filter";
import Loader from "../../components/loader";

// css
import "../dash-board/dashBoard.css";
import "./analytics.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", zIndex: 9999 }}
      onClick={onClick}
      disabled={false}
    />
  );
}

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideBarShow: false,
      propertyTypeShow: "",
      analyticsChartCerdinetial: {},
      landRateData: [{}],
      sellableRateData: [{}],
      swapChart: "type1",
      chartData: [{}, {}],
      barChartData: [{}],
      landRateValue: [],
      sellRateValue: [],
      dataType: "",
      barFilterLoad: false,
      lineFilterLoad: false,
      chart2Loader: false,
      chart1Loader: false,
    };
  }

  showAnalytics(response) {
    this.setState({
      lineFilterLoad: false,
    });
    const { analyticsChartCerdinetial } = this.state;

    if (analyticsChartCerdinetial.city === true) {
      var landRate = [
        {
          zone: analyticsChartCerdinetial.cityName,
          landarea_rate: [
            {
              rate: response.data.landarea_rate.data,
              year: response.data.landarea_rate.year,
              locality: analyticsChartCerdinetial.cityName,
            },
          ],
          sellable_rate: [
            {
              rate: response.data.sellable_rate.data,
              year: response.data.sellable_rate.year,
              locality: analyticsChartCerdinetial.cityName,
            },
          ],
        },
      ];

      this.setState({
        chartData: landRate,
      });
    } else if (analyticsChartCerdinetial.city === false) {
      this.setState({
        chartData: response.data.data,
      });
    }
  }

  getBarAnalyticData(response) {
    this.setState({
      barFilterLoad: false,
    });
    var barChartRespone = response.data.data;
    var landRate = [];
    var sellRate = [];

    for (let list in barChartRespone) {
      if (barChartRespone[list].unit_type !== undefined) {
        var obj = {
          landRate: barChartRespone[list].landarea_rate,
          type: barChartRespone[list].unit_type,
        };
        var objSell = {
          landRate: barChartRespone[list].sellable_rate,
          type: barChartRespone[list].unit_type,
        };
        this.setState({
          dataType: "Unit Type",
        });
      } else {
        var obj = {
          landRate: barChartRespone[list].landarea_rate,
          type: barChartRespone[list].property_type,
        };
        var objSell = {
          landRate: barChartRespone[list].sellable_rate,
          type: barChartRespone[list].property_type,
        };
        this.setState({
          dataType: "Property Type",
        });
      }

      landRate.push(obj);
      sellRate.push(objSell);
    }

    this.setState({ landRateValue: landRate, sellRateValue: sellRate });
  }

  render() {
    const {
      sideBarShow,
      analyticsChartCerdinetial,
      swapChart,
      landRateData,
      sellableRateData,
      chartData,
      barChartData,
      sellRateValue,
      landRateValue,
      dataType,
      barFilterLoad,
      lineFilterLoad,
      chart2Loader,
      chart1Loader,
    } = this.state;

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };
    const {
      isFetchingBarChart,
      isFetchingAnalytics,
      isFetchingState,
      isFetchingCity,
      isFetchingZoneByCity,
      isFetchingLocalByCity,
      isFetchingPropertyByCity,
      isFetchingUnitTypeByCity,
      isFetchingZone,
      isFetchingLocal,
    } = this.props;

    return (
      <div className="dash-board-container">
        <Header
          sideBarCallBack={() => {
            this.setState({
              sideBarShow: !sideBarShow,
            });
          }}
        />
        <div className="row analytics-sec">
          <div className="col-sm-9 col-xl-9 col-lg-9 col-md-7 pad0">
            <div className="dash-board-sec">
              {sideBarShow ? (
                <div className="side-bar-container">
                  <SideBar />
                </div>
              ) : null}

              <div className="map-container ">
                {(() => {
                  if (swapChart === "type1") {
                    return (
                      <div className="slider">
                        <Slider {...settings}>
                          {chartData.map((data, key) => {
                            return (
                              <div className="chat-data-lay-out">
                                <div className="analytics-container rate-text mrg-btm-board">
                                  {/* {data.zone !== undefined ? ( */}
                                  <label> Land Rate: {data.zone} </label>
                                  {/* ) : null} */}

                                  <ChartLine
                                    linechartRate={landRateData}
                                    isFetchingAnalytics={isFetchingAnalytics}
                                    cityStatus={analyticsChartCerdinetial.city}
                                    dataChart={data.landarea_rate}
                                  />
                                </div>
                                <div className="analytics-container rate-text mrg-btm-board ">
                                  {/* {data.zone !== undefined ? ( */}
                                  <label> Sellable Rate: {data.zone}</label>
                                  {/* ) : null} */}

                                  <ChartLine
                                    linechartRate={sellableRateData}
                                    isFetchingAnalytics={isFetchingAnalytics}
                                    cityStatus={analyticsChartCerdinetial.city}
                                    dataChart={data.sellable_rate}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    );
                  } else {
                    return (
                      <div className="slider">
                        <div className="chat-data-lay-out">
                          <div className="analytics-container rate-text mrg-btm-board">
                            {/* {dataType !== "" ? ( */}
                            <label> Land Rate: {dataType} </label>
                            {/* ) : null} */}
                            <ChartBar
                              isFetchingBarChart={isFetchingBarChart}
                              chartBarData={landRateValue}
                              dataType={dataType}
                            />
                          </div>
                          <div className="analytics-container rate-text mrg-btm-board">
                            {/* {dataType !== "" ? ( */}
                            <label> Sellable Rate: {dataType} </label>
                            {/* ) : null} */}
                            <ChartBar
                              isFetchingBarChart={isFetchingBarChart}
                              chartBarData={sellRateValue}
                              dataType={dataType}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
          <div className="col-sm-3  col-xl-3 col-lg-3 col-md-5 pad0 ">
            <AnalyticesFilter
              selectedCategory={(propertyTypeValue) => {
                this.setState({
                  propertyTypeShow: propertyTypeValue,
                });
              }}
              onSuccesCallBackAnalytics={(response) => {
                this.showAnalytics(response);
              }}
              clearLoader={() => {
                this.setState({
                  lineFilterLoad: false,
                  barFilterLoad: false,
                });
              }}
              onFailureCallBackAnalytics={(response) => {
                this.setState({
                  lineFilterLoad: false,
                });
              }}
              analyticDataTypeFetch={(analyticDataType) => {
                this.setState({
                  analyticsChartCerdinetial: analyticDataType,
                });
              }}
              swapChart={swapChart}
              lineFilterLoad={lineFilterLoad}
              barFilterLoad={barFilterLoad}
              loadLineChart={() => {
                this.setState({
                  lineFilterLoad: true,
                });
              }}
              loadBarChart={() => {
                this.setState({
                  barFilterLoad: true,
                });
              }}
              onSuccessAnalyticts={(response) => {
                this.getBarAnalyticData(response);
              }}
              onFailureAnalytics={(response) => {
                this.setState({
                  barFilterLoad: false,
                });
              }}
              resetLineChart={() => {
                this.setState({
                  chartData: [{}],
                });
              }}
              resetBarChart={() => {
                this.setState({
                  landRateValue: [],
                  sellRateValue: [],
                });
              }}
              swapChartType1={() => {
                this.setState({
                  swapChart: "type1",
                });
              }}
              swapChartType2={() => {
                this.setState({
                  swapChart: "type2",
                });
              }}
              chart2LoaderCallBack={() => {
                this.setState({
                  chart2Loader: true,
                });
              }}
              chart2LoaderCloseCallBack={() => {
                this.setState({
                  chart2Loader: false,
                });
              }}
              chart1LoaderCallBack={() => {
                this.setState({
                  chart1Loader: true,
                });
              }}
              chart1LoaderCloseCallBack={() => {
                this.setState({
                  chart1Loader: false,
                });
              }}
            />
          </div>
          {/* {(() => {
            if (analyticLoader) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()}
          {(() => {
            if (analyticLoader2) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  landareaRate: state.getAnalytics.landareaRate,
  sellableRate: state.getAnalytics.sellableRate,
  isFetchingAnalytics: state.getAnalytics.isFetchingAnalytics,
  isFetchingBarChart: state.barAnalyitics.isFetchingBarChart,
  isFetchingState: state.getState.isFetchingState,
  isFetchingCity: state.getCityName.isFetchingCity,
  isFetchingZoneByCity: state.getZoneByCity.isFetchingZoneByCity,
  isFetchingLocalByCity: state.getLocalityByCity.isFetchingLocalByCity,
  isFetchingPropertyByCity: state.getPropertyByCity.isFetchingPropertyByCity,
  isFetchingUnitTypeByCity:
    state.getUnitByStateCityType.isFetchingUnitTypeByCity,
  isFetchingLocal: state.barByLocality.isFetchingLocal,
  isFetchingZone: state.barByzone.isFetchingZone,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
