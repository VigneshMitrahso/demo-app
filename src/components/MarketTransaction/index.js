import React, { useEffect, useState } from "react";
import Header from "../header";
import moment from "moment";
import { connect } from "react-redux";
import { stateUser } from "../../action/getState";
import { cityUser } from "../../action/getCity";
import { bindActionCreators } from "redux";
import { _getStorageValue, getUserId } from "../../comman/localStorage";
import { USER_ADMIN, USER_ID } from "../../comman/constants";
import { marketTransactionUpdate } from "../../action/reportUser";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import ExportMarketTransaction from "./exportMarketTransaction";

const inputData = {
  state: "",
  city: "",
  location: "",
  transaction_or_quote: "",
  transaction_type: "",
  type_of_property: "",
  type_of_unit: "",
  land_area: "",
  // "carpetarea_squba": "",
  // "rate_sqft": "",
  source_of_information: "",
  contact_number: "",
  image_urls: "",
  manual_longitude: "",
  manual_latitude: "",
  building_or_projectname: "",
  street_name: "",
  pincode: "",
  land_area: "",
  land_rate: "",
  type: "",
  area: "",
  rate: "",
  date_of_transaction_per_quote: null,
};

const MarketTransaction = (props) => {
  const [input, setInput] = useState(inputData);
  const [cat, setCat] = useState("");

  const [isDisabled, setDisabled] = useState(false);
  const [tQItem, setTqItem] = useState([
    { label: "Transaction", value: "Transaction" },
    { label: "Quote", value: "Quote" },
  ]);

  const [transactionTypeItem, setTransactionTypeItem] = useState([
    { label: "Rental", value: "Rental" },
    { label: "Sale", value: "Sale" },
  ]);

  const [propertyTypeItem, setPropertyitem] = useState([
    { label: "Residential", value: "Residential" },
    { label: "Commercial", value: "Commercial" },
    { label: "Industrial", value: "Industrial" },
    { label: "Specialized", value: "Specialized" },
  ]);

  const [sourceIFItem, setSourceIFItem] = useState([
    { label: "Broker", value: "Broker" },
    { label: "Owner", value: "Owner" },
    { label: "Neighbors", value: "Neighbors" },
    { label: "Others", value: "Others" },
  ]);

  const [unitTypeitem, setUnitTypeitem] = useState([]);

  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const stateUrl = `${getUserId()}/state`;
    props.stateUser(stateUrl);
  }, []);

  _getStorageValue(USER_ADMIN).then((adminValue) => {
    setAdmin(adminValue);
  });

  const onInputchange = (e, label, defaultNumber = false) => {
    if (label == "date_of_transaction_per_quote") {
      let value = e;
      let updatedInput = { ...input, [label]: value == "" ? null : value };

      setInput(updatedInput);
    } else if (
      (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(e.target.value) && defaultNumber) ||
      e.target.value === ""
    ) {
      let value = e.target.value;
      let updatedInput = { ...input, [label]: value };
      setInput(updatedInput);
    } else if (!defaultNumber) {
      let value = e.target.value;
      let updatedInput = { ...input, [label]: value };
      setInput(updatedInput);
    }
  };

  useEffect(() => {
    if (input.type_of_property !== "") {
      let unitType = [];
      if (input.type_of_property === "Residential") {
        unitType = [
          { label: "Flat", value: "Flat", category: "Carpet/SBUA" },
          { label: "Land", value: "Land", category: "Land" },
          {
            label: "Independent House",
            value: "Independent House",
            category: "Land,Bua",
          },
        ];
      } else if (input.type_of_property === "Commercial") {
        unitType = [
          { label: "Office", value: "Office", category: "Carpet/SBUA" },
          { label: "Retail", value: "Retail", category: "Carpet/SBUA" },
          { label: "Land", value: "Land", category: "Land" },
          {
            label: "Independent Building",
            value: "Independent Building",
            category: "Land,Bua",
          },
        ];
      } else if (input.type_of_property === "Industrial") {
        unitType = [
          { label: "Land", value: "Land", category: "Land" },
          { label: "Unit", value: "Unit", category: "Land,Carpet/SBUA" },
        ];
      } else if (input.type_of_property === "Specialized") {
        unitType = [
          {
            label: "Cinema Halls",
            value: "Cinema Halls",
            category: "Land,Bua",
          },
          {
            label: "Educational Institute",
            value: "Educational Institute",
            category: "Land,Bua",
          },
          {
            label: "Functional Hall / Marriage Garden",
            value: "Functional Hall / Marriage Garden",
            category: "Land,Bua",
          },
          { label: "Hospital", value: "Hospital", category: "Land,Bua" },
          { label: "Hotels", value: "Hotels", category: "Land,Bua" },
          { label: "Malls", value: "Malls", category: "Land,Bua" },
          { label: "Warehouse", value: "Warehouse", category: "Land,Bua" },
        ];
      }
      setUnitTypeitem(unitType);
    }
  }, [input.type_of_property]);

  const replaceEmptyStrings = (obj) => {
    for (let key in obj) {
      if (obj[key] === "") {
        obj[key] = null;
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        replaceEmptyStrings(obj[key]); // Recursive call for nested objects
      }
    }
    return obj;
  };

  const submit = () => {
    if (!!input.state == false || !!input.city == false) {
      toast.error("Please select state and city", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (
      !!input.manual_latitude == false ||
      !!input.manual_longitude == false
    ) {
      toast.error("Please enter valide latitude and longitude", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      setDisabled(true);

      let payloadData = input;

      const { area, land_rate, land_area, rate, ...rest } = payloadData;
      let data = {
        ...rest,
        land_rate: !!land_rate ? parseInt(land_rate) : "",
        land_area: !!land_area ? parseInt(land_area) : "",
      };
      if (input.type === "carpet") {
        data = {
          ...data,
          carpet_area: parseInt(area),
          carpet_rate: parseInt(rate),
        };
      } else if (input.type === "SBUA") {
        data = {
          ...data,
          sbua_area: parseInt(area),
          sbua_rate: parseInt(rate),
        };
      } else if (input.type === "BUA") {
        data = { ...data, bua_area: parseInt(area), bua_rate: parseInt(rate) };
      }
      let updatedPayload = replaceEmptyStrings(data);
      _getStorageValue(USER_ID).then((userId) => {
        props.saveMarketTransaction(
          userId,
          updatedPayload,
          successApi,
          failiur,
        );
      });
      const successApi = (res) => {
        setInput(inputData);
        toast.success("Market transaction submitted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setDisabled(false);
      };
      const failiur = (data) => {
        toast.error(data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setDisabled(false);
      };
    }
  };

  return (
    <div className="dashboard-container">
      <Header link="/landingPage" />
      <div className="report-parent-container">
        <div style={{ paddingTop: 100 }} className="report-container ">
          <div className="site-vist sitrepot branch-container  ">
            <h3> Market Transaction </h3>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "45%" }}>
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"State"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.state}
                    onChange={(e) => {
                      // updateFields(md,e);
                      let stateId = props.stateData.filter(
                        (fd) => fd.name == e.target.value,
                      );
                      _getStorageValue(USER_ID).then((userId) => {
                        const cityUrl = `${userId}/state/${stateId[0].id}/city`;
                        props.cityUser(cityUrl);
                      });
                      setInput({ ...input, state: e.target.value, city: "" });
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {props.stateData.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.name}
                          label={data.name}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"City"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.city}
                    onChange={(e) => {
                      onInputchange(e, "city");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {props.cityNameData.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.name}
                          label={data.name}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Street Name"}</label>
                <input
                  type="text"
                  value={input.street_name}
                  onChange={(e) => {
                    onInputchange(e, "street_name");
                  }}
                  className="customer-desc"
                />
              </div>
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Building or Project"}
                </label>
                <input
                  type="text"
                  value={input.building_or_projectname}
                  onChange={(e) => {
                    onInputchange(e, "building_or_projectname");
                  }}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Pincode"}</label>
                <input
                  type="text"
                  value={input.pincode}
                  onChange={(e) => {
                    onInputchange(e, "pincode", true);
                  }}
                  maxLength={"6"}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Location"}</label>
                <input
                  type="text"
                  value={input.location}
                  onChange={(e) => {
                    onInputchange(e, "location");
                  }}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Transaction / Quote"}
                </label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.transaction_or_quote}
                    onChange={(e) => {
                      onInputchange(e, "transaction_or_quote");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {tQItem.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.label}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Transaction Type"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.transaction_type}
                    onChange={(e) => {
                      onInputchange(e, "transaction_type");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {transactionTypeItem.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.label}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Property Type"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.type_of_property}
                    onChange={(e) => {
                      onInputchange(e, "type_of_property");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {propertyTypeItem.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.label}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Unit Type"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.type_of_unit}
                    onChange={(e) => {
                      let catType = unitTypeitem.filter(
                        (fd) => fd.label === e.target.value,
                      )[0];
                      setCat(catType?.category);
                      onInputchange(e, "type_of_unit");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {unitTypeitem.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.label}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Land Area (in sqft)"}
                </label>
                <input
                  type="text"
                  className="customer-desc"
                  value={input.land_area}
                  onChange={(e) => {
                    onInputchange(e, "land_area", true);
                  }}
                  style={{
                    backgroundColor: !cat.includes("Land")
                      ? "lightGrey"
                      : "white",
                  }}
                  disabled={!cat.includes("Land")}
                />
              </div>

              {/* <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Carpet Area/SBUA (In Sqft)"}</label>
                <input
                  type="text"
                  className="customer-desc"
                  value={input.carpetarea_squba}
                  onChange={(e) => {
                    onInputchange(e, "carpetarea_squba", true);
                  }}
                />
              </div> */}

              <div className="customer-details-sec width45">
                <div className="add-Button">
                  <button
                    disabled={isDisabled}
                    onClick={() => {
                      submit();
                    }}
                  >
                    {"Submit"}
                  </button>
                </div>
              </div>
            </div>
            <div style={{ width: "45%" }}>
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Land Rate (in INR / sqft)"}
                </label>
                <input
                  type="text"
                  className="customer-desc"
                  value={input.land_rate}
                  style={{
                    backgroundColor: !cat.includes("Land")
                      ? "lightGrey"
                      : "white",
                  }}
                  onChange={(e) => {
                    onInputchange(e, "land_rate", true);
                  }}
                  disabled={!cat.includes("Land")}
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Area Type"}</label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.type}
                    onChange={(e) => {
                      onInputchange(e, "type");
                    }}
                    className="customer-desc"
                    style={{
                      width: "100%",
                      backgroundColor:
                        !cat.includes("Carpet") &&
                        !cat.toLowerCase().includes("bua")
                          ? "lightGrey"
                          : "white",
                    }}
                    disabled={
                      !cat.includes("Carpet") &&
                      !cat.toLowerCase().includes("bua")
                    }
                  >
                    <option value="NaN" label="Select" />
                    {cat.includes("Carpet") && (
                      <option
                        key={"carpet"}
                        value={"carpet"}
                        label={"CARPET"}
                      />
                    )}
                    {cat.includes("Carpet/SBUA") && (
                      <option key={"SBUA"} value={"SBUA"} label={"SBUA"} />
                    )}
                    {cat.includes("Land,Bua") && (
                      <option key={"BUA"} value={"BUA"} label={"BUA"} />
                    )}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Area (in sqft)"}</label>
                <input
                  type="text"
                  className="customer-desc"
                  value={input.area}
                  style={{
                    backgroundColor:
                      !cat.includes("Carpet") &&
                      !cat.toLowerCase().includes("bua")
                        ? "lightGrey"
                        : "white",
                  }}
                  onChange={(e) => {
                    onInputchange(e, "area", true);
                  }}
                  disabled={
                    !cat.includes("Carpet") &&
                    !cat.toLowerCase().includes("bua")
                  }
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Rate (in INR / sqft)"}
                </label>
                <input
                  type="text"
                  className="customer-desc"
                  value={input.rate}
                  style={{
                    backgroundColor:
                      !cat.includes("Carpet") &&
                      !cat.toLowerCase().includes("bua")
                        ? "lightGrey"
                        : "white",
                  }}
                  onChange={(e) => {
                    onInputchange(e, "rate", true);
                  }}
                  disabled={
                    !cat.includes("Carpet") &&
                    !cat.toLowerCase().includes("bua")
                  }
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Date of Transaction / Quote"}
                </label>
                <div className="down-arrow" style={{ width: "45%" }}>
                  <ReactDatePicker
                    className="customer-desc-date"
                    value={input.date_of_transaction_per_quote}
                    onChange={(date) => {
                      let newDateFormat = moment(new Date(date)).format(
                        "YYYY-MM-DD",
                      );
                      onInputchange(
                        newDateFormat,
                        "date_of_transaction_per_quote",
                        false,
                      );
                    }}
                  />
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Source of Information"}
                </label>
                <div className="down-arrow " style={{ width: "45%" }}>
                  <select
                    value={input.source_of_information}
                    onChange={(e) => {
                      onInputchange(e, "source_of_information");
                    }}
                    className="customer-desc"
                    style={{ width: "100%" }}
                  >
                    <option value="NaN" label="Select" />
                    {sourceIFItem.map((data, key) => {
                      return (
                        <option
                          key={data.id}
                          value={data.label}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Contact Number"}</label>
                <input
                  type="text"
                  value={input.contact_number}
                  onChange={(e) => {
                    onInputchange(e, "contact_number", true);
                  }}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Latitude"}</label>
                <input
                  type="text"
                  value={input.manual_latitude}
                  onChange={(e) => {
                    const formattedText = e.target.value.replace(/[^\d]/g, "");
                    if (formattedText.length > 2) {
                      const value = {
                        target: {
                          value:
                            formattedText.substring(0, 2) +
                            "." +
                            formattedText.substring(2),
                        },
                      };
                      onInputchange(value, "manual_latitude", true);
                    } else {
                      const value = { target: { value: formattedText } };
                      onInputchange(value, "manual_latitude", true);
                    }
                  }}
                  maxLength={"9"}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Longitude"}</label>
                <input
                  type="text"
                  value={input.manual_longitude}
                  maxLength={"9"}
                  onChange={(e) => {
                    const formattedText = e.target.value.replace(/[^\d]/g, "");
                    if (formattedText.length > 2) {
                      const value = {
                        target: {
                          value:
                            formattedText.substring(0, 2) +
                            "." +
                            formattedText.substring(2),
                        },
                      };

                      onInputchange(value, "manual_longitude", true);
                    } else {
                      const value = { target: { value: formattedText } };

                      onInputchange(value, "manual_longitude", true);
                    }
                  }}
                  className="customer-desc"
                />
              </div>

              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">{"Date of Entry"}</label>
                <input
                  type="text"
                  value={moment
                    .parseZone()
                    .local()
                    .format("YYYY-MM-DD hh:mm A")}
                  className="customer-desc"
                  style={{}}
                  disabled={true}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                className="customer-details-sec "
              >
                {isAdmin && <ExportMarketTransaction />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.users.isFetching,
  stateData: state.getState.stateData,
  cityNameData: state.getCityName.cityNameData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      stateUser: stateUser,
      cityUser: cityUser,
      saveMarketTransaction: marketTransactionUpdate,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketTransaction);
