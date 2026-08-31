import React, { useEffect, useState } from "react";
// plugin
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
// Local Storage
import { getUserId } from "../../comman/localStorage";
// Actions
import { cityUser, resetcityUser } from "../../action/getCity";
import { stateUser } from "../../action/getState";
import { Form, Accordion, Card } from "react-bootstrap";
import {
  propertyPinCodeIndexUrl,
  resetPincodeUser,
  propertyTypeIndexUrl,
  resetPropertyTypeUser,
  unitTypeIndexUrl,
  resetUnitUser,
  ageRangeIndexUrl,
  resetAgeRangeUser,
  analyticsIndexUrl,
  resetAnalyticsUser,
} from "../../action/getPPI";
// Css
import "./ppi-filter.css";
const PpiFilter = (props) => {
  const [form, setForm] = useState({
    state: "",
    city: "",
    pinCode: "",
    propertyType: "",
    unitType: "",
    ageRange: "",
  });

  const [pinCode, setPinCode] = useState("");

  const [state, setState] = useState("");

  const [city, setCity] = useState("");

  useEffect(() => {
    const stateUrl = `${getUserId()}/ppi-state`;
    props.stateUser(stateUrl);
  }, []);

  const onChangeHandler = async (type, event) => {
    const { value } = event.target;
    if (type === "state") {
      props.resetcityUser();
      props.resetPincodeUser();
      props.resetPropertyTypeUser();
      props.resetUnitUser();
      props.resetAgeRangeUser();
      props.resetAnalyticsUser();
      props.setAnalyticsChart([]);
      setForm((prev) => {
        return {
          ...prev,
          state: value,
        };
      });
      const cityUrl = `${getUserId()}/state/${value}/ppi-get-fill-value?value=city`;
      await props.cityUser(cityUrl);
      setForm((prev) => {
        return {
          ...prev,
          city: "",
          propertyType: "",
          unitType: "",
          pinCode: "",
        };
      });
    } else if (type === "city") {
      props.resetPincodeUser();
      props.resetPropertyTypeUser();
      props.resetUnitUser();
      props.resetAgeRangeUser();
      props.resetAnalyticsUser();
      props.setAnalyticsChart([]);
      setForm((prev) => {
        return {
          ...prev,
          city: value,
        };
      });

      // const url = `${getUserId()}/state/${
      //   form.state
      // }/ppi-get-fill-value?city=${value}&value=zone`;
      // // await props.propertyPinCodeIndexUrl(url);

      // await  props.propertyTypeIndexUrl(url);

      const url = `${getUserId()}/state/${form.state}/ppi-get-fill-value?value=pincode&city=${value}`;
      props.propertyPinCodeIndexUrl(url);

      setForm((prev) => {
        return {
          ...prev,
          propertyType: "",
          unitType: "",
          pinCode: "",
        };
      });
    } else if (type === "propertyType") {
      //Zone

      props.resetUnitUser();
      props.resetAgeRangeUser();
      props.resetAnalyticsUser();
      props.setAnalyticsChart([]);
      setForm((prev) => {
        return {
          ...prev,
          propertyType: value,
        };
      });

      const url = `${getUserId()}/state/${form.state}/ppi-get-fill-value?&zone=${value}&value=region&city=${form.city}`;
      await props.unitTypeIndexUrl(url);
      setForm((prev) => {
        return {
          ...prev,
          unitType: "",
          pinCode: "",
        };
      });
    } else if (type === "unitType") {
      //region
      props.resetAgeRangeUser();
      props.resetAnalyticsUser();
      props.setAnalyticsChart([]);
      setForm((prev) => {
        return {
          ...prev,
          unitType: value,
        };
      });

      // const url = `${getUserId()}/state/${form.state}/ppi-get-fill-value?&zone=${
      //   form.propertyType
      // }&region=${event.target.value}&value=pincode&city=${form.city}`;
      // props.propertyPinCodeIndexUrl(url);

      // if (form.propertyType === "RESIDENTIAL" && value === "FLAT") {
      //   props.propertyPinCodeIndexUrl(url);
      // }
      setForm((prev) => {
        return {
          ...prev,
          pinCode: "",
        };
      });
    } else if (type === "pincode") {
      // props.resetPropertyTypeUser();
      // props.resetUnitUser();
      // props.resetAgeRangeUser();
      // props.resetAnalyticsUser();
      props.setAnalyticsChart([]);

      setForm((prev) => {
        return {
          ...prev,
          pinCode: value,
        };
      });

      // const url = `${getUserId()}/state/${form.state}/city/${
      //   form.city
      // }/ppi-get-fill-value?pincode=${value}`;
      // await props.propertyTypeIndexUrl(url);
      // setForm((prev) => {
      //   return {
      //     ...prev,
      //     propertyType: "",
      //     unitType: "",
      //     ageRange: "",
      //   };
      // });
    }
  };

  const resetPropertyIndexValue = () => {
    setForm({
      state: "",
      city: "",
      pinCode: "",
      propertyType: "",
      unitType: "",
      ageRange: "",
    });
    setPinCode("");
    setState("");
    setCity("");
    props.setAnalyticsChart([]);
    props.resetcityUser();
    props.resetPincodeUser();
    props.resetPropertyTypeUser();
    props.resetUnitUser();
    props.resetAgeRangeUser();
    props.resetAnalyticsUser();
  };

  // http://129.154.230.178:8787/skies/v1/user/f63beda1-7a5a-11eb-b3c6-000000000000/state/91013000000000/city/91013018000000/
  // ppi-analytics?property_type=RESIDENTIAL&unit_type=FLAT&pincode=560010&age_range=6-10
  const getPIData = async () => {
    if (form.state !== "" && form.city !== "" && form.pinCode !== "") {
      console.log("state", form);
      const analyticsUrl = `${getUserId()}/ppi-analytics?city=${form.city}&pincode=${form.pinCode}&stateId=${form.state}`;
      props.analyticsIndexUrl(
        analyticsUrl,
        successPpiAnalytics,
        failuerPpiAnalytics,
      );
    } else {
      toast.warning("Please Select All The Fields", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    // }
  };

  const getPIDataByPinCode = async () => {
    if (pinCode !== "" && pinCode.length === 6) {
      console.log("state", form);
      const analyticsUrl = `${getUserId()}/ppi-analytics?pincode_search=true&pincode=${pinCode}`;
      props.analyticsIndexUrl(
        analyticsUrl,
        successPpiAnalytics,
        failuerPpiAnalyticsPincode,
      );
    } else {
      toast.warning("Please enter the valid pincode", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    // }
  };

  const successPpiAnalytics = (response) => {
    var ppiAnalytics = response.data.entries;
    props.setAnalyticsChart(ppiAnalytics);
    if (!!pinCode && !!response.data?.location) {
      setCity(response.data?.location[0].city);
      setState(response.data?.location[0].state);
    }
    toast.success("Successfully", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  const failuerPpiAnalytics = (response) => {
    console.log("fail", response);
  };

  const failuerPpiAnalyticsPincode = (response) => {
    toast.warning(response.message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  return (
    <Accordion className="card-width">
      <Card>
        <div className="filter-collape">
          <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
            <div
              className="filter-collapse-heading"
              onClick={() => {
                resetPropertyIndexValue();
              }}
            >
              <h6> Search based on location </h6>
            </div>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <div className={`filter-collapse-Body `}>
              <div className="">
                <div className="ppi-filter-section">
                  <div className="">
                    <div className="search-element">
                      <label>
                        State <span className="manditary">*</span>
                      </label>
                      <div className="down-arrow">
                        <select
                          value={form.state}
                          name="state"
                          onChange={(e) => onChangeHandler("state", e)}
                        >
                          <option value="" label="Select" />
                          {props.stateData.map((data, key) => {
                            return (
                              <option
                                key={data.id}
                                value={data.id}
                                label={data.name}
                              />
                            );
                          })}
                        </select>
                        {props.isFetchingState ? (
                          <div className="loader-cate"></div>
                        ) : null}
                      </div>
                    </div>
                    <div className="search-element">
                      <label>
                        City <span className="manditary">*</span>
                      </label>
                      <div className="down-arrow">
                        <select
                          value={form.city}
                          onChange={(e) => onChangeHandler("city", e)}
                        >
                          <option value="" label="Select" />
                          {props?.cityNameData.length !== 0 &&
                            props?.cityNameData.map((data, key) => {
                              return (
                                <option
                                  key={data.id}
                                  value={data.name}
                                  label={data.name}
                                />
                              );
                            })}
                        </select>
                        {props.isFetchingCity ? (
                          <div className="loader-cate"></div>
                        ) : null}
                      </div>
                    </div>

                    {/* <div className="search-element">
          <label>
            Zone<span className="manditary">*</span>
          </label>
          <div className="down-arrow">
            <select
              value={form.propertyType}
              onChange={(e) => {
                onChangeHandler("propertyType", e);
              }}
            >
              <option value="" label="Select" />
              {props.ppiPropertyTypeData.map((data, key) => {
                return (
                  <option key={data.id} value={data.name} label={data.name} />
                );
              })}
            </select>
            {props.isFetchingPropertTy ? (
              <div className="loader-cate"></div>
            ) : null}
          </div>
        </div> */}
                    {/* <div className="search-element">
          <label>
            Region <span className="manditary">*</span>
          </label>
          <div className="down-arrow">
            <select
              value={form.unitType}
              onChange={(e) => {
                onChangeHandler("unitType", e);
              }}
            >
              <option value="" label="Select" />
              {props.ppiUnitTypeData.map((data, key) => {
                return (
                  <option key={data.id} value={data.name} label={data.name} />
                );
              })}
            </select>
            {props.isFetchingUnitType ? (
              <div className="loader-cate"></div>
            ) : null}
          </div>
        </div> */}
                    <div className="search-element">
                      <label>
                        Pincode <span className="manditary">*</span>
                      </label>
                      <div className="down-arrow">
                        <select
                          value={form.pinCode}
                          onChange={(e) => onChangeHandler("pincode", e)}
                        >
                          <option value="" label="Select" />
                          {props?.ppiPincodeData?.map((data, key) => {
                            return (
                              <option
                                key={data.id}
                                value={data.name}
                                label={data.name}
                              />
                            );
                          })}
                        </select>
                        {props.isFetchingPincode ? (
                          <div className="loader-cate"></div>
                        ) : null}
                      </div>
                    </div>
                    {/* <div className="search-element">
          <label>
            Age Range <span className="manditary">*</span>
          </label>
          <div className="down-arrow">
            <select
              disabled={
                form.propertyType === "RESIDENTIAL" && form.unitType === "FLAT"
                  ? false
                  : true
              }
              value={form.ageRange}
              onChange={(e) => {
                onChangeHandler("ageRage", e);
              }}
            >
              <option value="" label="Select" />
              {props.ppiAgeRange.map((data, key) => {
                return (
                  <option key={data.id} value={data.name} label={data.name} />
                );
              })}
            </select>
            {props.isFetchingAgeRange ? (
              <div className="loader-cate"></div>
            ) : null}
          </div>
        </div> */}
                    <div className="filter-Button">
                      <button
                        onClick={() => resetPropertyIndexValue()}
                        className="report"
                      >
                        Clear
                      </button>
                      <button onClick={getPIData}>Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        </div>
      </Card>

      <Card>
        <div className="filter-collape">
          <Accordion.Toggle as={Card.Header} variant="link" eventKey="1">
            <div
              className="filter-collapse-heading"
              onClick={() => {
                resetPropertyIndexValue();
              }}
            >
              <h6> Search based on pincode </h6>
            </div>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="1">
            <div className={`filter-collapse-Body `}>
              <div className="">
                <div className="ppi-filter-section">
                  <div className="">
                    <div className="search-element">
                      <label>
                        Pincode <span>*</span>
                      </label>
                      <Form.Control
                        value={pinCode}
                        onChange={(e) => {
                          const numberRegex = /^[+-]?[0-9]+$/;
                          if (
                            numberRegex.test(e.target.value) ||
                            e.target.value == ""
                          ) {
                            setPinCode(e.target.value);
                          }
                        }}
                        type="text"
                        placeholder="Pincode"
                        maxLength="6"
                      />
                    </div>
                    {!!state && !!city && (
                      <div style={{ justifyContent: "space-around" }}>
                        <div>
                          <label>{`State : `}</label>
                          <label style={{ paddingLeft: 5 }}>{state}</label>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <label>{`City : `}</label>
                          <label style={{ paddingLeft: 5 }}>{city}</label>
                        </div>
                      </div>
                    )}
                    <div className="filter-Button">
                      <button
                        onClick={() => resetPropertyIndexValue()}
                        className="report"
                      >
                        Clear
                      </button>
                      <button
                        style={{ opacity: pinCode.length < 6 ? 0.5 : 1 }}
                        disabled={pinCode.length < 6}
                        onClick={getPIDataByPinCode}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        </div>
      </Card>
    </Accordion>
    // </div>
    // </div>
    // </div>
  );
};
const mapStateToProps = (state) => ({
  stateData: state.getState.stateData,
  isFetchingState: state.getState.isFetchingState,
  cityNameData: state.getCityName.cityNameData,
  isFetchingCity: state.getCityName.isFetchingCity,
  ppiPincodeData: state.getPPIName.ppiPincodeData,
  isFetchingPincode: state.getPPIName.isFetchingPincode,
  ppiPropertyTypeData: state.getPPIName.ppiPropertyTypeData,
  isFetchingPropertTy: state.getPPIName.isFetchingPropertTy,
  ppiUnitTypeData: state.getPPIName.ppiUnitTypeData,
  isFetchingUnitType: state.getPPIName.isFetchingUnitType,
  ppiAgeRange: state.getPPIName.ppiAgeRange,
  isFetchingAgeRange: state.getPPIName.isFetchingAgeRange,
  ppiAnalytics: state.getPPIName.ppiAnalytics,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      stateUser: stateUser,
      cityUser: cityUser,
      resetcityUser: resetcityUser,
      propertyTypeIndexUrl: propertyTypeIndexUrl,
      resetPropertyTypeUser: resetPropertyTypeUser,
      resetPincodeUser: resetPincodeUser,
      propertyPinCodeIndexUrl: propertyPinCodeIndexUrl,
      unitTypeIndexUrl: unitTypeIndexUrl,
      resetUnitUser: resetUnitUser,
      ageRangeIndexUrl: ageRangeIndexUrl,
      resetAgeRangeUser: resetAgeRangeUser,
      analyticsIndexUrl: analyticsIndexUrl,
      resetAnalyticsUser: resetAnalyticsUser,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(PpiFilter);
