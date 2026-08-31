import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import { Multiselect } from "multiselect-react-dropdown";

// function
import { _getStorageValue } from "../../comman/localStorage";
import { stateUser, resetStateUser } from "../../action/getState";
import { cityUser, resetcityUser } from "../../action/getCity";
import { categoryTypeStateCityUser } from "../../action/categoryTypeStateCity";
import {
  propertyByCityUser,
  resetpropertyByCityUser,
} from "../../action/getPropertyByCity";
import {
  unitTypeByStateCityUser,
  resetunitTypeByStateCityUser,
} from "../../action/getUnitTypeByStateCity";
import { analyticsUser, resetanalyticsUser } from "../../action/getAnalytics";
import { zoneByCityUser, resetzoneByCityUser } from "../../action/zoneByCity";
import {
  localityByCityUser,
  resetlocalityByCityUser,
} from "../../action/localityByCity";
import { barByZoneUser, resetbarByZoneUser } from "../../action/barByzone";
import {
  barByLocalityUser,
  resetbarByLocalityUser,
} from "../../action/barByLocality";
import {
  barAnalyiticsUser,
  resetbarAnalyiticsUser,
} from "../../action/barChartAnalyitics";

// constant
import { USER_ID } from "../../comman/constants";
import { getUserId } from "../../comman/localStorage";
// css
import "../filter/filter.css";

// const multipleSelectRef = useRef();

const categoryType = [
  {
    id: 1,
    name: "INDIVIDUAL",
  },
];

class AnalyticesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateId: "",
      cityId: "",
      categoryId: [],
      propertTypeBar: [],
      unitTypeBar: [],
      zoneValue: [],
      localityValue: [],
      citylevel: false,
      barStateId: "",
      barCityId: "",
      barZoneId: "",
      barLocalityId: "",
    };
    this.zone = React.createRef();
    this.locality = React.createRef();
    this.categoryTypeValue = React.createRef();
    this.propertyType = React.createRef();
    this.unitType = React.createRef();
  }

  componentDidMount() {
    const stateUrl = `${getUserId()}/state`;
    this.props.stateUser(stateUrl);
  }

  getStateId(e) {
    var stateValue = e.target.value;
    const { zoneValue, localityValue } = this.state;

    this.props.resetLineChart();
    if (zoneValue.length !== 0) {
      this.zone.current.resetSelectedValues();
    }
    if (localityValue.length !== 0) {
      this.locality.current.resetSelectedValues();
    }
    this.setState({
      stateId: stateValue,
      zoneValue: [],
      localityValue: [],
    });
    var userId = getUserId();
    const cityUrl = `${userId}/state/${stateValue}/city`;
    this.props.cityUser(cityUrl);
  }

  getCityId(e) {
    var cityValue = parseInt(e.target.value);
    const { zoneValue, localityValue } = this.state;

    this.props.resetLineChart();
    if (zoneValue.length !== 0) {
      this.zone.current.resetSelectedValues();
    }
    if (localityValue.length !== 0) {
      this.locality.current.resetSelectedValues();
    }
    const { cityNameData } = this.props;

    var selectObject = cityNameData.find((obj) => obj.id === cityValue);

    this.setState({
      cityId: cityValue,
      citylevel: true,
      cityNameValue: selectObject.name,
      zoneValue: [],
      localityValue: [],
    });

    // _getStorageValue(USER_ID).then((userId) => {
    //   this.props.chart1LoaderCallBack();
    //   this.props.zoneByCityUser(
    //     userId,
    //     stateId,
    //     cityValue,
    //     successZoneCallBack
    //   );
    // });

    // const successZoneCallBack = () => {
    //   this.props.chart1LoaderCloseCallBack();
    // setTimeout(() => {
    //   _getStorageValue(USER_ID).then((userId) => {
    //     this.props.propertyByCityUser(userId, stateId, cityValue, successCallBackProperty);
    //   });
    // }, 500);
    // };

    // const successCallBackProperty = () => {
    //   _getStorageValue(USER_ID).then((userId) => {
    //     setTimeout(() => {
    //       this.props.unitTypeByStateCityUser(userId, stateId, cityValue, successCallBackUnit);
    //     }, 500);
    //   });
    // }

    // const successCallBackUnit = () => {
    //   this.props.chart2LoaderCloseCallBack();
    // }

    // var userId = getUserId();
    // _getStorageValue(USER_ID).then((userId) => {
    // this.props.propertyByCityUser(userId, stateId, cityValue, successCallBackProperty);
    // });

    // const successCallBackProperty = () => {
    // setTimeout(() => {
    //   _getStorageValue(USER_ID).then((userId) => {
    // this.props.unitTypeByStateCityUser(userId, stateId, cityValue, successCallBackUnit);
    //   });
    // }, 500);
    // }

    // const successCallBackUnit = () => {
    //   setTimeout(() => {
    // _getStorageValue(USER_ID).then((userId) => {
    //   this.props.zoneByCityUser(userId, stateId, cityValue, successZoneCallBack);
    // });
    //   }, 500);
    // }

    // const successZoneCallBack = () => {
    //   // setTimeout(() => {
    //     // _getStorageValue(USER_ID).then((userId) => {
    //     //   this.props.localityByCityUser(userId, stateId, cityValue);
    //     // });
    //   // }, 500)
    // }
  }

  zoneSelect(e) {
    const { zoneByCityData } = this.props;
    const { stateId, cityId, localityValue } = this.state;
    if (localityValue.length !== 0) {
      this.locality.current.resetSelectedValues();
    }

    this.props.resetLineChart();
    for (let list in e) {
      if (e[list].name === "All Zone") {
        var data = zoneByCityData;
        data.pop({ id: 1, name: "All Zone" });
        this.setState({ zoneValue: data, citylevel: false });

        zoneByCityData.push({ id: 1, name: "All Zone" });
      } else {
        this.setState({
          zoneValue: e,
          citylevel: false,
        });
        this.props.resetLineChart();
      }
    }

    var localityArr = [];
    for (let list in e) {
      localityArr.push(e[list].name);
    }
    var localitystr = localityArr.toString().replace(/,/g, "%2C");
    _getStorageValue(USER_ID).then((userId) => {
      this.props.localityByCityUser(userId, stateId, cityId, localitystr);
    });
  }

  zoneRemove(e) {
    const { zoneByCityData } = this.props;
    const { stateId, cityId, localityValue } = this.state;
    if (localityValue.length !== 0) {
      this.locality.current.resetSelectedValues();
    }
    this.props.resetLineChart();
    if (e.length !== 0) {
      for (let list in e) {
        if (e[list].name === "All Zone") {
          var data = zoneByCityData;
          data.pop({ id: 1, name: "All Zone" });
          this.setState({ zoneValue: data, citylevel: false });
          zoneByCityData.push({ id: 1, name: "All Zone" });
        } else {
          this.setState({
            zoneValue: e,
            citylevel: false,
          });
        }
      }
    } else {
      this.setState({
        citylevel: true,
      });
      this.props.resetLineChart();
    }

    var localityArr = [];
    for (let list in e) {
      localityArr.push(e[list].name);
    }
    var localitystr = localityArr.toString().replace(/,/g, "%2C");
    _getStorageValue(USER_ID).then((userId) => {
      this.props.localityByCityUser(userId, stateId, cityId, localitystr);
    });
  }

  localitySelect(e) {
    const { localityByCityData } = this.props;
    this.props.resetLineChart();

    if (e.length !== 0) {
      for (let list in e) {
        if (e[list].name === "All Locality") {
          var data = localityByCityData;
          data.pop({ id: 1, name: "All Locality" });
          this.setState({ localityValue: data });
        } else {
          this.setState({
            localityValue: e,
          });
        }
      }
    } else if (e.length === 0) {
      this.setState({
        citylevel: true,
      });
    }
  }

  localityRemove(e) {
    const { localityByCityData } = this.props;
    this.props.resetLineChart();
    if (e.length !== 0) {
      for (let list in e) {
        if (e[list].name === "All Locality") {
          var data = localityByCityData;
          data.pop({ id: 1, name: "All Locality" });
          this.setState({ localityValue: data });
          localityByCityData.push({ id: 1, name: "All Locality" });
        } else {
          this.setState({
            localityValue: e,
          });
          this.props.resetLineChart();
        }
      }
    }
  }

  getAnalyticsData() {
    this.props.loadLineChart();
    const {
      stateId,
      cityId,
      zoneValue,
      localityValue,
      citylevel,
      cityNameValue,
    } = this.state;

    var analyticDataType = {
      city: true,
    };

    var analyticsFetchUrl = ``;

    if (zoneValue.length !== 0) {
      var zoneArr = [];
      for (let list in zoneValue) {
        zoneArr.push(zoneValue[list].name);
      }
      var zonestr = zoneArr.toString();

      var zoneUrl = `?zone=` + zonestr.replace(/,/g, "%2C");

      analyticsFetchUrl += zoneUrl;
      analyticDataType = Object.assign({ city: false, zoneData: zoneUrl });
    }

    if (localityValue.length !== 0) {
      var localityArr = [];
      for (let list in localityValue) {
        localityArr.push(localityValue[list].name);
      }
      var localitystr = localityArr.toString();

      var localityUrl = `&locality=` + localitystr.replace(/,/g, "%2C");

      analyticsFetchUrl += localityUrl;
      analyticDataType = Object.assign({
        city: false,
        localityData: localityUrl,
      });
    } else {
      const { localityByCityData } = this.props;
      let index = localityByCityData.findIndex(
        (obj) => obj.name === "All Locality",
      );
      localityByCityData.splice(index, 1);
      var localityArr = [];

      for (let list in localityByCityData) {
        localityArr.push(localityByCityData[list].name);
      }

      var localitystr = localityArr.toString();

      var localityUrl = `&locality=` + localitystr.replace(/,/g, "%2C");

      analyticsFetchUrl += localityUrl;
      analyticDataType = Object.assign({
        city: false,
        localityData: localityUrl,
      });
    }

    if (citylevel) {
      this.props.analyticDataTypeFetch({ city: true, cityName: cityNameValue });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.analyticsUser(
          userId,
          stateId,
          cityId,
          "",
          this.props.onSuccesCallBackAnalytics,
          this.props.onFailureCallBackAnalytics,
        );
      });
    } else {
      this.props.analyticDataTypeFetch(analyticDataType);
      _getStorageValue(USER_ID).then((userId) => {
        this.props.analyticsUser(
          userId,
          stateId,
          cityId,
          analyticsFetchUrl,
          this.props.onSuccesCallBackAnalytics,
          this.props.onFailureCallBackAnalytics,
        );
      });
    }
  }
  // Type -II
  getBarState(e) {
    var barStateValue = e.target.value;

    this.setState({
      barStateId: barStateValue,
      barLocalityId: "",
      barZoneId: "",
    });
    this.props.resetBarChart();
    this.categoryTypeValue.current.resetSelectedValues();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();
    var userId = getUserId();
    const cityUrl = `${userId}/state/${barStateValue}/city`;
    this.props.cityUser(cityUrl);
  }

  getBarCityId(e) {
    var barCityValue = parseInt(e.target.value);

    const { barStateId } = this.state;

    this.setState({
      barCityId: barCityValue,
      barLocalityId: "",
      barZoneId: "",
    });
    this.props.resetBarChart();
    this.categoryTypeValue.current.resetSelectedValues();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();

    _getStorageValue(USER_ID).then((userId) => {
      this.props.chart2LoaderCallBack();
      this.props.barByZoneUser(
        userId,
        barStateId,
        barCityValue,
        successZoneCallBack,
      );
    });

    const successZoneCallBack = (response) => {
      setTimeout(() => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.propertyByCityUser(
            userId,
            barStateId,
            barCityValue,
            "INDIVIDUAL",
            successCallBackProperty,
          );
        });
      }, 500);
    };

    const successCallBackProperty = () => {
      setTimeout(() => {
        this.props.chart2LoaderCloseCallBack();
      }, 500);

      // const successCallBackUnit = () => {
      //   this.props.chart2LoaderCloseCallBack();
      // };
    };
  }

  getBarZone(e) {
    var barZoneValue = e.target.value;

    const { barCityId, barStateId } = this.state;

    this.setState({
      barZoneId: barZoneValue,
      barLocalityId: "",
    });
    this.props.resetBarChart();
    this.categoryTypeValue.current.resetSelectedValues();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();

    _getStorageValue(USER_ID).then((userId) => {
      this.props.barByLocalityUser(
        userId,
        barStateId,
        barCityId,
        function () {},
      );
    });
  }

  getBarLocality(e) {
    var barLocalityIdValue = e.target.value;

    this.setState({
      barLocalityId: barLocalityIdValue,
    });
    this.props.resetBarChart();
    this.categoryTypeValue.current.resetSelectedValues();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();
  }

  categorySelect(e) {
    this.setState({
      categoryId: e,
    });
    this.props.resetBarChart();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();
  }

  categoryRemove(e) {
    this.setState({
      categoryId: e,
    });
    this.props.resetBarChart();
    this.propertyType.current.resetSelectedValues();
    this.unitType.current.resetSelectedValues();
  }

  propertyTypeSelect(e) {
    this.props.resetunitTypeByStateCityUser();
    this.setState({
      propertTypeBar: e,
    });
    this.props.resetBarChart();
    this.unitType.current.resetSelectedValues();
    if (e.length > 1) {
      this.setState({
        unitTypeBar: [],
      });
      this.unitType.current.resetSelectedValues();
    }

    var unitTypeArr = [];
    for (let listCat in e) {
      unitTypeArr.push(e[listCat].name);
    }

    const { barStateId, barCityId } = this.state;
    var unitType =
      "INDIVIDUAL" +
      "&property_type=" +
      unitTypeArr.toString().replace(/,/g, "%2C");
    _getStorageValue(USER_ID).then((userId) => {
      this.props.unitTypeByStateCityUser(
        userId,
        barStateId,
        barCityId,
        unitType,
        function () {},
      );
    });
  }

  propertyTypeRemove(e) {
    this.props.resetunitTypeByStateCityUser();
    this.setState({
      propertTypeBar: e,
    });
    this.props.resetBarChart();
    this.unitType.current.resetSelectedValues();

    var unitTypeArr = [];
    for (let listCat in e) {
      unitTypeArr.push(e[listCat].name);
    }

    const { barStateId, barCityId } = this.state;
    var unitType =
      "INDIVIDUAL" +
      "&property_type=" +
      unitTypeArr.toString().replace(/,/g, "%2C");
    _getStorageValue(USER_ID).then((userId) => {
      this.props.unitTypeByStateCityUser(
        userId,
        barStateId,
        barCityId,
        unitType,
        function () {},
      );
    });

    if (e.length > 1) {
      this.setState({
        unitTypeBar: [],
      });
      this.props.resetBarChart();
      this.unitType.current.resetSelectedValues();
    }
  }

  unitTypeSelect(e) {
    this.setState({
      unitTypeBar: e,
    });
    this.props.resetBarChart();
  }

  unitTypeRemove(e) {
    this.setState({
      unitTypeBar: e,
    });
    this.props.resetBarChart();
  }

  getBarchartdata() {
    this.props.loadBarChart();
    const {
      barStateId,
      barCityId,
      barLocalityId,
      barZoneId,
      categoryId,
      propertTypeBar,
      unitTypeBar,
    } = this.state;

    var stateValid = barStateId !== "";
    var cityValid = barCityId !== "";
    var localValid = barLocalityId !== "";
    var zoneValid = barZoneId !== "";
    var cateValid = categoryId.length !== 0;

    var validation =
      stateValid && cityValid && localValid && zoneValid && cateValid;

    var barChartUrl = `?zone=${barZoneId}&locality=${barLocalityId}`;

    if (propertTypeBar.length !== 0) {
      var propertyTypeArr = [];
      for (let list in propertTypeBar) {
        propertyTypeArr.push(propertTypeBar[list].name);
      }
      var propertyArr = propertyTypeArr.toString();

      var propertyUrl = `&property_type=` + propertyArr.replace(/,/g, "%2C");

      barChartUrl += propertyUrl;
    }

    if (unitTypeBar.length !== 0) {
      var unitTypeArr = [];
      for (let list in unitTypeBar) {
        unitTypeArr.push(unitTypeBar[list].name);
      }
      var unitArr = unitTypeArr.toString();

      var unitTypeUrl = `&unit_type=` + unitArr.replace(/,/g, "%2C");

      barChartUrl += unitTypeUrl;
    }

    if (validation) {
      var testValid = propertTypeBar.length > 1;
      if (testValid) {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.barAnalyiticsUser(
            userId,
            barStateId,
            barCityId,
            barChartUrl,
            this.props.onSuccessAnalyticts,
            this.props.onFailureAnalytics,
          );
        });
      } else {
        var unitValid = unitTypeBar.length !== 0;
        if (unitValid) {
          _getStorageValue(USER_ID).then((userId) => {
            this.props.barAnalyiticsUser(
              userId,
              barStateId,
              barCityId,
              barChartUrl,
              this.props.onSuccessAnalyticts,
              this.props.onFailureAnalytics,
            );
          });
        } else {
          toast.warning("Please Select the Values", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          this.props.clearLoader();
        }
      }
    } else {
      toast.warning("Please Select the Values", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.props.clearLoader();
    }
  }

  resetValue() {
    this.props.resetbarAnalyiticsUser();
    this.props.clearLoader();
    // this.props.resetStateUser();
    this.props.resetbarByZoneUser();
    this.props.resetzoneByCityUser();
    this.props.resetcityUser();
    this.props.resetbarByLocalityUser();
    this.props.resetlocalityByCityUser();
    this.props.resetanalyticsUser();
    this.props.resetunitTypeByStateCityUser();
    this.props.resetpropertyByCityUser();
    this.setState({
      stateId: "",
      cityId: "",
    });

    const { zoneValue, localityValue } = this.state;

    if (zoneValue.length !== 0) {
      this.zone.current.resetSelectedValues();
    }

    if (localityValue.length !== 0) {
      this.locality.current.resetSelectedValues();
    }
    this.props.resetLineChart();
  }

  resetBarValue() {
    this.props.clearLoader();
    const { categoryId, propertTypeBar, unitTypeBar } = this.state;
    this.setState({
      barStateId: "",
      barCityId: "",
      barZoneId: "",
      barLocalityId: "",
    });
    if (categoryId.length !== 0) {
      this.categoryTypeValue.current.resetSelectedValues();
    }
    if (propertTypeBar.length !== 0) {
      this.propertyType.current.resetSelectedValues();
    }
    if (categoryId.length !== 0) {
      this.unitType.current.resetSelectedValues();
    }
    this.props.resetBarChart();
    // this.resetValue();
  }

  render() {
    const {
      stateId,
      cityId,
      categoryId,
      propertTypeBar,
      unitTypeBar,
      zoneValue,
      localityValue,
      barCityId,
      barStateId,
      barLocalityId,
      barZoneId,
    } = this.state;
    const {
      stateData,
      cityNameData,
      unitTypeByCityData,
      propertyByCityData,
      zoneByCityData,
      localityByCityData,
      swapChart,
      zoneByCityBarData,
      barData,
      barChartData,
      barFilterLoad,
      lineFilterLoad,
      isFetchingState,
      isFetchingCity,
      isFetchingZoneByCity,
      isFetchingLocalByCity,
      isFetchingZone,
      isFetchingLocal,
      isFetchingPropertyByCity,
      isFetchingUnitTypeByCity,
    } = this.props;

    var unitStatus = propertTypeBar.length > 1;

    return (
      <div>
        <div className="filter-sec pad0">
          <div className="swap-chart">
            <label
              className={`${swapChart === "type1" ? "active-chart" : null}`}
              onClick={() => {
                this.props.swapChartType1();
              }}
            >
              Type I
            </label>

            <label
              className={`${swapChart === "type2" ? "active-chart" : null}`}
              onClick={() => {
                this.props.swapChartType2();
              }}
            >
              Type II
            </label>
          </div>

          {(() => {
            if (swapChart === "type1") {
              return (
                <div className="filter-collape hideScroll ">
                  <div className="filter-collapse-heading">
                    <h6 className="cursor">Analytics </h6>
                  </div>
                  <div className="filter-collapse-Body">
                    <div className="filter-body">
                      <div className="search-element">
                        <label>
                          State <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={stateId}
                            onChange={(e) => {
                              this.getStateId(e);
                            }}
                          >
                            <option value="NaN" label="Select" />
                            {stateData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.id}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                          {isFetchingState ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>
                          City <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={cityId}
                            onChange={(e) => {
                              this.getCityId(e);
                            }}
                          >
                            <option value="NaN" label="Select" />
                            {cityNameData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.id}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                          {isFetchingCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>Zone</label>
                        <div className="down-arrow">
                          <Multiselect
                            options={zoneByCityData}
                            onSelect={(e) => {
                              this.zoneSelect(e);
                            }}
                            onRemove={(e) => {
                              this.zoneRemove(e);
                            }}
                            value={zoneValue}
                            displayValue="name"
                            ref={this.zone}
                            singleSelect={true}
                          />
                          {isFetchingZoneByCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element drop-up">
                        <label>Locality</label>
                        <div className="down-arrow">
                          <Multiselect
                            options={localityByCityData}
                            onSelect={(e) => {
                              this.localitySelect(e);
                            }}
                            onRemove={(e) => {
                              this.localityRemove(e);
                            }}
                            value={localityValue}
                            displayValue="name"
                            ref={this.locality}
                          />

                          {isFetchingLocalByCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="filter-Button">
                        <button
                          onClick={() => {
                            this.resetValue();
                          }}
                          className="report"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            this.getAnalyticsData();
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="filter-collape hideScroll ">
                  <div className="filter-collapse-heading">
                    <h6 className="cursor">Analytics </h6>
                  </div>
                  <div className="filter-collapse-Body">
                    <div className="filter-body">
                      <div className="search-element">
                        <label>
                          State <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={barStateId}
                            onChange={(e) => {
                              this.getBarState(e);
                            }}
                          >
                            <option value="NaN" label="Select" />
                            {stateData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.id}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                          {isFetchingState ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>
                      <div className="search-element">
                        <label>
                          City <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={barCityId}
                            onChange={(e) => {
                              this.getBarCityId(e);
                            }}
                          >
                            <option value="NaN" label="Select " />
                            {cityNameData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.id}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>
                          {isFetchingCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>
                          Zone <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={barZoneId}
                            onChange={(e) => {
                              this.getBarZone(e);
                            }}
                          >
                            <option value="" label="Select " />
                            {zoneByCityBarData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.name}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>

                          {isFetchingZone ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>
                          Locality <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <select
                            value={barLocalityId}
                            onChange={(e) => {
                              this.getBarLocality(e);
                            }}
                          >
                            <option value="" label="Select" />
                            {barData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.name}
                                  label={data.name}
                                />
                              );
                            })}
                          </select>

                          {isFetchingLocal ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>
                          Category Type <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <Multiselect
                            options={categoryType}
                            onSelect={(e) => {
                              this.categorySelect(e);
                            }}
                            onRemove={(e) => {
                              this.categoryRemove(e);
                            }}
                            value={categoryId}
                            displayValue="name"
                            ref={this.categoryTypeValue}
                          />
                          <img
                            src={require("../../assets/images/down-arrow.png")}
                            alt="down-arroe"
                          />

                          {/* { ? (
                              <div className="loader-cate"></div>
                            ) : null} */}
                        </div>
                      </div>

                      <div className="search-element">
                        <label>
                          Property Type <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <Multiselect
                            options={propertyByCityData}
                            onSelect={(e) => {
                              this.propertyTypeSelect(e);
                            }}
                            onRemove={(e) => {
                              this.propertyTypeRemove(e);
                            }}
                            value={propertTypeBar}
                            displayValue="name"
                            ref={this.propertyType}
                          />
                          <img
                            src={require("../../assets/images/down-arrow.png")}
                            alt="down-arroe"
                          />
                          {isFetchingPropertyByCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="search-element drop-up">
                        <label>
                          Unit Type <span>*</span>
                        </label>
                        <div className="down-arrow">
                          <Multiselect
                            options={unitTypeByCityData}
                            onSelect={(e) => {
                              this.unitTypeSelect(e);
                            }}
                            onRemove={(e) => {
                              this.unitTypeRemove(e);
                            }}
                            value={unitTypeBar}
                            displayValue="name"
                            ref={this.unitType}
                            disable={unitStatus}
                          />
                          <img
                            src={require("../../assets/images/down-arrow.png")}
                            alt="down-arroe"
                          />

                          {isFetchingUnitTypeByCity ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      </div>

                      <div className="filter-Button">
                        <button
                          onClick={() => {
                            this.resetBarValue();
                          }}
                          className="report"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            this.getBarchartdata();
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetchingState: state.getState.isFetchingState,
  isFetchingCity: state.getCityName.isFetchingCity,
  isFetchingZone: state.barByzone.isFetchingZone,
  isFetchingLocal: state.barByLocality.isFetchingLocal,
  isFetchingZoneByCity: state.getZoneByCity.isFetchingZoneByCity,
  isFetchingLocalByCity: state.getLocalityByCity.isFetchingLocalByCity,
  isFetchingPropertyByCity: state.getPropertyByCity.isFetchingPropertyByCity,
  isFetchingUnitTypeByCity:
    state.getUnitByStateCityType.isFetchingUnitTypeByCity,
  cityNameData: state.getCityName.cityNameData,
  stateData: state.getState.stateData,
  propertyByCityData: state.getPropertyByCity.propertyByCityData,
  unitTypeByCityData: state.getUnitByStateCityType.unitTypeByCityData,
  barData: state.barByLocality.barData,
  zoneByCityBarData: state.barByzone.zoneByCityBarData,
  zoneByCityData: state.getZoneByCity.zoneByCityData,
  localityByCityData: state.getLocalityByCity.localityByCityData,
  barChartData: state.barAnalyitics.barChartData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      stateUser: stateUser,
      cityUser: cityUser,
      categoryTypeStateCityUser: categoryTypeStateCityUser,
      propertyByCityUser: propertyByCityUser,
      unitTypeByStateCityUser: unitTypeByStateCityUser,
      analyticsUser: analyticsUser,
      zoneByCityUser: zoneByCityUser,
      localityByCityUser: localityByCityUser,
      barByZoneUser: barByZoneUser,
      barByLocalityUser: barByLocalityUser,
      barAnalyiticsUser: barAnalyiticsUser,
      resetStateUser: resetStateUser,
      resetcityUser: resetcityUser,
      resetbarByLocalityUser: resetbarByLocalityUser,
      resetpropertyByCityUser: resetpropertyByCityUser,
      resetunitTypeByStateCityUser: resetunitTypeByStateCityUser,
      resetanalyticsUser: resetanalyticsUser,
      resetlocalityByCityUser: resetlocalityByCityUser,
      resetzoneByCityUser: resetzoneByCityUser,
      resetbarByZoneUser: resetbarByZoneUser,
      resetbarAnalyiticsUser: resetbarAnalyiticsUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticesFilter);
