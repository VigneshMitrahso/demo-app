import React, { useRef, useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { PDFExport } from "@progress/kendo-react-pdf";
import { bindActionCreators } from "redux";
import { stateUser } from "../../action/getState";
import { cityUser } from "../../action/getCity";
import { _getStorageValue } from "../../comman/localStorage";
import { connect } from "react-redux";
import {
  getCalculatorCity,
  getCalculatorState,
  getCalculatorSuggested,
  getCalculatorTable,
} from "../../action/searchHistory";
import { ToWords } from "to-words";

const toWords = new ToWords();

const inputData = {
  "Area Details Net Land Area": "",
  "Area Details Base FSI": "",
  "Area Details Premium FSI": "",
  "Area Details TDR area": "",
  "Area Details Fungible FSI area": "",
  "Area Details Ancillary FSI area": "",
  "Area Details Staircase Area": "",
  "Area Details Extra Area (Incentive area/Amenity area)": "",
  "Gov Construction Rate as per Gov": "",
  "Gov Ready Reckoner Rate (Guj-Mah)": "",
  "Gov EDC IDC Charges (NCR)": "",
  "Gov Extra Charges towards TDR and other expenses": "",
  "Area Statement Residential Saleable area (CA-SBA)": "",
  "Area Statement Commercial Saleable area": "",
  "Area Statement Retail Saleable area": "",
  "Area Statement Ploted Development Area": "",
  "Sales Rate Residential": "",
  "Sales Rate Commercial": "",
  "Sales Rate Retail": "",
  "Sales Rate Ploted Development": "",
  "construction area Residential": "",
  "construction area Commercial": "",
  "construction area Retail": "",
  "construction area Ploted Development": "",
  "construction area Non FSI Area": "",
  "Construction Cost Residential": "",
  "Construction Cost Commercial": "",
  "Construction Cost Retail": "",
  "Construction Cost Ploted Development": "",
  "Construction cost Non FSI Rate (Common)": "",
};

const sqft = 10.7639;

let apiResData = {
  ancillary_area_charges: Number("10"),
  approving_authority: "MCGM",
  architect_fees_other_approval_charges: Number("12"),
  builder_profit: Number("20"),
  contingencies: Number("5"),
  cost_of_funds_interest_per_annum_3yrs: Number("10.5"),
  crz: Number("75"),
  development_charges_commercial_component: Number("8"),
  development_charges_open_plot: Number("1"),
  development_charges_residential_component: Number("4"),
  edc_idc_charges: null,
  environmental_clearance: Number("200"),
  fungible_area_charges: Number("50"),
  labour_cess: Number("1"),
  marketing_expenses_legal_admin_charges: Number("5"),
  paid_tdr_fsi_expenses: null,
  premium_area_charges: Number("50"),
  scrutiny_other_nocs: Number("300"),
  staircase_area_charges: Number("25"),
  state: "Maharastra",
  tdr: Number("60"),
};

const rateList = [
  {
    label: "Rate / Sq.Ft",
    value: "sqft",
  },
  {
    label: "Rate / Mtr",
    value: "mtr",
  },
];

const Calcultor = (props) => {
  const [input, setInput] = useState(inputData);
  const [stateVale, selectedStateVale] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [cityList, setCityList] = useState([]);
  const [show, setShow] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [authorityValue, setAuthorityValue] = useState([]);
  const [authorityList, setAuthorityList] = useState([]);
  const [apiRes, setApiRes] = useState(apiResData);
  const [isDisabled, setDisabled] = useState(true);
  const [suggestedData, setSuggestedData] = useState({});
  const [rateUnit, setRateUnit] = useState("sqft");
  const [pdfDisabled, setPdfDisabled] = useState(false);

  let backend = {
    "Base FSI area":
      input["Area Details Net Land Area"] * input["Area Details Base FSI"],
    "Premium FSI area":
      input["Area Details Net Land Area"] * input["Area Details Premium FSI"],
    "FSI Area": function () {
      return (
        Number(this["Base FSI area"]) +
        Number(this["Premium FSI area"]) +
        Number(input["Area Details TDR area"]) +
        Number(input["Area Details Fungible FSI area"]) +
        Number(input["Area Details Ancillary FSI area"]) +
        Number(input["Area Details Staircase Area"]) +
        Number(input["Area Details Extra Area (Incentive area/Amenity area)"])
      );
    },
    "Non FSI Area": input["construction area Non FSI Area"],
    "Total BUA Area (FSI + Non FSI)": function () {
      return Number(this["FSI Area"]()) + Number(this["Non FSI Area"]);
    },
  };

  let incomeOFProject = {
    "Income from Residential Saleable area":
      input["Area Statement Residential Saleable area (CA-SBA)"] *
      input["Sales Rate Residential"],
    "Income from Commercial Saleable area":
      input["Area Statement Commercial Saleable area"] *
      input["Sales Rate Commercial"],
    "Income from Retail":
      input["Area Statement Retail Saleable area"] * input["Sales Rate Retail"],
    "Income from Ploted Development":
      input["Area Statement Ploted Development Area"] *
      input["Sales Rate Ploted Development"],
    "Total income of project on sales": function () {
      return (
        Number(this["Income from Residential Saleable area"]) +
        Number(this["Income from Commercial Saleable area"]) +
        Number(this["Income from Retail"]) +
        Number(this["Income from Ploted Development"])
      );
    },
  };

  let expenses = {
    "Total construction cost - Residential":
      input["construction area Residential"] *
      input["Construction Cost Residential"],
    "Total construction cost - Commercial":
      input["construction area Commercial"] *
      input["Construction Cost Commercial"],
    "Total construction cost - Retail":
      input["construction area Retail"] * input["Construction Cost Retail"],
    "Total construction cost - Ploted Development":
      input["construction area Ploted Development"] *
      input["Construction Cost Ploted Development"],
    "Total construction cost - Non FSI area":
      input["construction area Non FSI Area"] *
      input["Construction cost Non FSI Rate (Common)"],
    "TDR Charges": Number(
      input["Gov Extra Charges towards TDR and other expenses"],
    ),
    Total: function () {
      return (
        this["Total construction cost - Residential"] +
        this["Total construction cost - Commercial"] +
        this["Total construction cost - Retail"] +
        this["Total construction cost - Ploted Development"] +
        this["Total construction cost - Non FSI area"] +
        this["TDR Charges"]
      );
    },
  };

  let expenseBe = {
    contingencies: expenses["Total"]() * (apiRes["contingencies"] / 100),
    architect_fees_other_approval_charges:
      expenses["Total"]() *
      (apiRes["architect_fees_other_approval_charges"] / 100),
      paid_tdr_fsi_expenses: stateVale === "Gujarat" ?
      (input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      (backend["Premium FSI area"]) * (40/100) ): 0,
    marketing_expenses_legal_admin_charges:
      incomeOFProject["Total income of project on sales"]() *
      (apiRes["marketing_expenses_legal_admin_charges"] / 100),
    builder_profit:
      incomeOFProject["Total income of project on sales"]() *
      (apiRes["builder_profit"] / 100),
    cost_of_funds_interest_per_annum_3yrs:
      expenses["Total"]() *
      (apiRes["cost_of_funds_interest_per_annum_3yrs"] / 100) *
      (2 / 3) *
      0.5 *
      3,
    edc_idc_charges: Number(input["Gov EDC IDC Charges (NCR)"]),
    scrutiny_other_nocs: backend["FSI Area"]() * apiRes["scrutiny_other_nocs"],
    development_charges_open_plot:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      input["Area Details Net Land Area"] *
      (apiRes["development_charges_open_plot"] / 100),
    development_charges_residential_component:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      input["construction area Residential"] *
      (apiRes["development_charges_residential_component"] / 100),
    development_charges_commercial_component:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      input["construction area Commercial"] *
      (apiRes["development_charges_commercial_component"] / 100),
    premium_area_charges:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      backend["Premium FSI area"] *
      (apiRes["premium_area_charges"] / 100),
    labour_cess:
      (rateUnit === "mtr"
        ? input["Gov Construction Rate as per Gov"] * sqft
        : input["Gov Construction Rate as per Gov"]) *
      backend["FSI Area"]() *
      (apiRes["labour_cess"] / 100),
    staircase_area_charges:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      input["Area Details Staircase Area"] *
      (apiRes["staircase_area_charges"] / 100),
    environmental_clearance:
      (backend["Total BUA Area (FSI + Non FSI)"]() / 10.764) *
      apiRes["environmental_clearance"],
    crz: (backend["Total BUA Area (FSI + Non FSI)"]() / 10.764) * apiRes["crz"],
    ancillary_area_charges: function () {
      return (
        input["Gov Ready Reckoner Rate (Guj-Mah)"] *
        (apiRes["ancillary_area_charges"] / 100) *
        (input["construction area Residential"] * (60 / 100) +
          input["construction area Commercial"] * (80 / 100))
      );
    },
    fungible_area_charges:
      input["Gov Ready Reckoner Rate (Guj-Mah)"] *
      input["Area Details Fungible FSI area"] *
      (apiRes["fungible_area_charges"] / 100),
    tdr:
      Number(input["Gov Ready Reckoner Rate (Guj-Mah)"]) *
      Number(input["Area Details TDR area"]) *
      (Number(apiRes["tdr"]) / 100),
    TotalConstructionCost: function () {
      return (
        this.contingencies +
        this.architect_fees_other_approval_charges +
        this.paid_tdr_fsi_expenses +
        this.marketing_expenses_legal_admin_charges +
        this.builder_profit +
        this.cost_of_funds_interest_per_annum_3yrs +
        this.edc_idc_charges +
        this.scrutiny_other_nocs +
        this.development_charges_open_plot +
        this.development_charges_residential_component +
        this.development_charges_commercial_component +
        this.premium_area_charges +
        this.labour_cess +
        this.staircase_area_charges +
        this.environmental_clearance +
        this.crz +
        this.ancillary_area_charges() +
        this.fungible_area_charges +
        this.tdr
      );
    },
  };

  console.log("expenseBe",expenseBe);


  let output = {
    "Income from the project": Math.round(
      incomeOFProject["Total income of project on sales"](),
    ),
    "Expenses incurred incl Profit": Math.round(
      expenses["Total"]() + expenseBe["TotalConstructionCost"](),
    ),
    "Residual value": function () {
      return Math.round(
        Number(this["Income from the project"]) -
          Number(this["Expenses incurred incl Profit"]),
      );
    },
    "Land Rate per sft": function () {
      return Math.round(
        Number(this["Residual value"]()) /
          Number(input["Area Details Net Land Area"]),
      );
    },
    "Land Rate per acre": function () {
      return Math.round(Number(this["Land Rate per sft"]()) * 43560);
    },
    "FSI Rate per sqft": function () {
      return Math.round(
        Number(this["Residual value"]()) / backend["FSI Area"](),
      );
    },
    "Total Value of the Project": function () {
      return Math.round(Number(this["Residual value"]()) + expenses["Total"]());
    },
  };

  console.log("output", output);

  useEffect(() => {
    _getStorageValue("USER_ID").then((userId) => {
      props.getCalculatorState(userId, "", onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      let states = response.data.map((md) => ({ name: md.state }));
      setStateList(states);
    };
    const onFailure = (response) => {
      setStateList([]);
    };
  }, []);

  useEffect(() => {
    _getStorageValue("USER_ID").then((userId) => {
      props.getCalculatorCity(userId, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      let states = response.data.map((md) => ({ name: md.city }));
      setCityList(states);
    };
    const onFailure = (response) => {
      setCityList([]);
    };
  }, []);

  const onStateSelect = (e) => {
    selectedStateVale(e.target.value);
    let value = e.target.value;
    if (!!value) {
      _getStorageValue("USER_ID").then((userId) => {
        props.getCalculatorState(
          userId,
          `state=${value}`,
          onSuccess,
          onFailure,
        );
      });
      const onSuccess = (response) => {
        let authorityListdata = response.data
          .map((md) => ({ name: md.approving_authority }))
          .filter((fd) => fd.name !== null);

        setAuthorityList(authorityListdata);
      };
      const onFailure = (response) => {
        setAuthorityList([]);
      };
    }
  };

  const getTableValue = () => {
    _getStorageValue("USER_ID").then((userId) => {
      let urlValues = `state=${stateVale}`;
      if (authorityList.length && !!authorityValue) {
        urlValues = `approving_authority=${authorityValue}&state=${stateVale}`;
      }
      props.getCalculatorTable(userId, `${urlValues}`, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      setApiRes(response.data[0]);
      setDisabled(false);
    };
    const onFailure = () => {
      setApiRes(apiResData);
      setDisabled(false);
    };
  };

  const onInputChange = (e, label) => {
    let rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "") {
      setInput({ ...input, [label]: "" });
      return;
    }

    if (/^[+-]?(\d+(\.\d*)?|\.\d+)?$/.test(rawValue)) {
      setInput({ ...input, [label]: rawValue });
    }
  };

  const onClear = () => {
    setDisabled(true);
    // setStateList([]);
    selectedStateVale("");
    setAuthorityValue("");
    setInput(inputData);
    setApiRes(apiResData);
  };

  const onCitySelect = (e) => {
    setCityValue(e.target.value);
    let value = e.target.value;
    if (value !== "NaN") {
      _getStorageValue("USER_ID").then((userId) => {
        props.getCalculatorSuggested(userId, value, onSuccess, onFailure);
      });
      const onSuccess = (response) => {
        setSuggestedData(response.data[0]);
      };
      const onFailure = (response) => {
        setSuggestedData({});
      };
    } else {
      setSuggestedData({});
    }
  };

  const reSetConstruction = () => {
    let data = {
      ...input,
      "construction area Commercial": "",
      "construction area Residential": "",
      "construction area Retail": "",
      "construction area Non FSI Area": "",
    };
    setInput(data);
  };

  useMemo(() => {
    let sum =
      Number(input["construction area Commercial"]) +
      Number(input["construction area Residential"]) +
      Number(input["construction area Retail"]) +
      Number(input["construction area Non FSI Area"]);
    if (sum > backend["Total BUA Area (FSI + Non FSI)"]() && !show) {
      setShow(true);
      reSetConstruction();
    }
  }, [input, backend["Total BUA Area (FSI + Non FSI)"]]);

  const pdfExportComponent = useRef(null);

  const exportPDFWithComponent = () => {
    props.onDownload("Residual");
    setPdfDisabled(true);
    setTimeout(() => {
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
      }
    }, 200);
    setTimeout(() => {
      setPdfDisabled(false);
    }, 1000);
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alert </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Construction area should not exceed FSI+NON FSI area</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <PDFExport
        ref={pdfExportComponent}
        paperSize="A4"
        landscape={true}
        fileName="Residual_Calculator.pdf"
        scale={0.8}
      >
        <div
          className={pdfDisabled ? "pdf_full_page" : "calculations-container"}
        >
          <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Property Details </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"State"}</label>
              <div className="down-arrow " style={{ width: "45%" }}>
                {pdfDisabled ? (
                  <div
                    style={{
                      width: "100%",
                      height: "32px",
                      textAlign: "right",
                    }}
                    className="customer-desc"
                  >
                    {stateVale}
                  </div>
                ) : (
                  <select
                    value={stateVale}
                    onChange={(e) => {
                      onStateSelect(e);
                    }}
                    className="customer-desc"
                    style={{
                      width: "100%",
                      backgroundColor: !isDisabled
                        ? "lightgrey"
                        : "transparent",
                      opacity: !isDisabled ? "0.5" : "1",
                    }}
                    disabled={!isDisabled}
                  >
                    <option value="NaN" label="Select" />
                    {stateList.map((data, key) => {
                      return (
                        <option key={key} value={data.name} label={data.name} />
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Approving Authority"}</label>
              <div className="down-arrow" style={{ width: "45%" }}>
                {pdfDisabled ? (
                  <div
                    style={{
                      width: "100%",
                      height: "32px",
                      textAlign: "right",
                    }}
                    className="customer-desc"
                  >
                    {authorityValue}
                  </div>
                ) : (
                  <select
                    value={authorityValue}
                    onChange={(e) => {
                      setAuthorityValue(e.target.value);
                    }}
                    className="customer-desc"
                    style={{
                      width: "100%",
                      backgroundColor:
                        authorityList.length == 0 || !isDisabled
                          ? "lightgrey"
                          : "transparent",
                      opacity:
                        authorityList.length == 0 || !isDisabled ? "0.5" : "1",
                    }}
                    disabled={authorityList.length == 0 || !isDisabled}
                  >
                    <option value="NaN" label="Select" />
                    {authorityList.map((data, key) => {
                      return (
                        <option key={key} value={data.name} label={data.name} />
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
            <div className="customer-details-sec ">
              <div className="add-Button">
                {" "}
                <button
                  onClick={() => {
                    getTableValue();
                  }}
                >
                  {"Submit"}
                </button>{" "}
              </div>
              <div className="add-Button">
                <button
                  onClick={() => {
                    onClear();
                  }}
                >
                  {"Clear"}
                </button>
              </div>
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Area Details </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Net Land Area (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Details Net Land Area"] !== ""
                    ? input["Area Details Net Land Area"]
                    : ""
                }
                onChange={(e) => onInputChange(e, "Area Details Net Land Area")}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Base FSI (Index)"}</label>
              <input
                type="text"
                value={
                  input["Area Details Base FSI"] !== ""
                    ? input["Area Details Base FSI"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details Base FSI");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Premium FSI (Index)"}</label>
              <input
                type="text"
                value={
                  input["Area Details Premium FSI"]
                    ? input["Area Details Premium FSI"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details Premium FSI");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"TDR area (Sq.Ft)"}</label>
              <input
                type="text"
                value={
                  input["Area Details TDR area"]
                    ? input["Area Details TDR area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details TDR area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Fungible FSI area (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Details Fungible FSI area"]
                    ? input["Area Details Fungible FSI area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details Fungible FSI area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ancillary FSI area (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Details Ancillary FSI area"]
                    ? input["Area Details Ancillary FSI area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details Ancillary FSI area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Staircase Area (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Details Staircase Area"]
                    ? input["Area Details Staircase Area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Details Staircase Area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Extra Area (Incentive area/Amenity area) (Sq ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Details Extra Area (Incentive area/Amenity area)"]
                    ? input[
                        "Area Details Extra Area (Incentive area/Amenity area)"
                      ]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(
                    e,
                    "Area Details Extra Area (Incentive area/Amenity area)",
                  );
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Government Rates and Charges </h3>
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <div className="customer-title" style={{ width: "25%" }}>
                {"Construction Rate as per Gov"}
              </div>
              <div className="down-arrow " style={{ width: "20%" }}>
                {pdfDisabled ? (
                  <div
                    style={{
                      width: "100%",
                      height: "32px",
                      textAlign: "right",
                    }}
                    className="customer-desc"
                  >
                    {rateUnit}
                  </div>
                ) : (
                  <select
                    value={rateUnit}
                    onChange={(e) => {
                      // onStateSelect(e);
                      setRateUnit(e.target.value);
                    }}
                    className="customer-desc"
                    style={{
                      width: "100%",
                      backgroundColor: isDisabled ? "lightgrey" : "transparent",
                      opacity: isDisabled ? "0.5" : "1",
                    }}
                    disabled={isDisabled}
                  >
                    <option value="NaN" label="Select" />
                    {rateList.map((data, key) => {
                      return (
                        <option
                          key={key}
                          value={data.value}
                          label={data.label}
                        />
                      );
                    })}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={
                  input["Gov Construction Rate as per Gov"]
                    ? input["Gov Construction Rate as per Gov"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Gov Construction Rate as per Gov");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ready Reckoner Rate (Guj-Mah) (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Gov Ready Reckoner Rate (Guj-Mah)"]
                    ? input["Gov Ready Reckoner Rate (Guj-Mah)"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Gov Ready Reckoner Rate (Guj-Mah)");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"EDC IDC Charges* (NCR) (INR)"}
              </label>
              <input
                type="text"
                value={
                  input["Gov EDC IDC Charges (NCR)"]
                    ? input["Gov EDC IDC Charges (NCR)"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Gov EDC IDC Charges (NCR)");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Extra Charges towards TDR and other expenses (INR)"}
              </label>
              <input
                type="text"
                value={
                  input["Gov Extra Charges towards TDR and other expenses"]
                    ? input["Gov Extra Charges towards TDR and other expenses"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(
                    e,
                    "Gov Extra Charges towards TDR and other expenses",
                  );
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Area Statement </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential Saleable area (CA-SBA) (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Statement Residential Saleable area (CA-SBA)"]
                    ? input["Area Statement Residential Saleable area (CA-SBA)"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(
                    e,
                    "Area Statement Residential Saleable area (CA-SBA)",
                  );
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Commercial Saleable area (CA-SBA) (sq.ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Statement Commercial Saleable area"]
                    ? input["Area Statement Commercial Saleable area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Statement Commercial Saleable area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Retail Saleable area (CA-SBA) (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Statement Retail Saleable area"]
                    ? input["Area Statement Retail Saleable area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Statement Retail Saleable area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ploted Development Area (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Area Statement Ploted Development Area"]
                    ? input["Area Statement Ploted Development Area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Area Statement Ploted Development Area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Sales Rate </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Sales Rate Residential"]
                    ? input["Sales Rate Residential"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Sales Rate Residential");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Commercial (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Sales Rate Commercial"]
                    ? input["Sales Rate Commercial"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Sales Rate Commercial");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Retail (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Sales Rate Retail"] ? input["Sales Rate Retail"] : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Sales Rate Retail");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ploted Development (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Sales Rate Ploted Development"]
                    ? input["Sales Rate Ploted Development"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Sales Rate Ploted Development");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3>Suggested Cost of Construction (INR / Sq. Ft)</h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"City"}</label>
              <div className="down-arrow " style={{ width: "45%" }}>
                {pdfDisabled ? (
                  <div
                    style={{
                      width: "100%",
                      height: "32px",
                      textAlign: "right",
                    }}
                    className="customer-desc"
                  >
                    {cityValue}
                  </div>
                ) : (
                  <select
                    value={cityValue}
                    onChange={(e) => {
                      onCitySelect(e);
                    }}
                    style={{ width: "100%" }}
                    className="customer-desc"
                  >
                    <option value="NaN" label="Select" />
                    {cityList.map((data, key) => {
                      return (
                        <option key={key} value={data.name} label={data.name} />
                      );
                    })}
                  </select>
                )}
              </div>
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential Floors (30+)"}
              </label>
              <input
                type="text"
                value={
                  suggestedData["residential_floors_30_plus"]
                    ? input["residential_floors_30_plus"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Sales Rate Commercial");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential Floors (15+)"}
              </label>
              <input
                type="text"
                value={suggestedData["residential_floors_15_plus"]}
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential Floors (5 to 15)"}
              </label>
              <input
                type="text"
                value={suggestedData["residential_floors_5_to_12"]}
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Commercial Floors (12+)"}
              </label>
              <input
                type="text"
                value={suggestedData["commercial_floors_12_plus"]}
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Commercial Floors (8 to 12)"}
              </label>
              <input
                type="text"
                value={suggestedData["commercial_floors_8_to_12"]}
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Construction Area </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Residential (Sq.Ft)"}</label>
              <input
                type="text"
                value={
                  input["construction area Residential"]
                    ? input["construction area Residential"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "construction area Residential");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Commercial (Sq.Ft)"}</label>
              <input
                type="text"
                value={
                  input["construction area Commercial"]
                    ? input["construction area Commercial"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "construction area Commercial");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Retail (Sq.Ft)"}</label>
              <input
                type="text"
                value={
                  input["construction area Retail"]
                    ? input["construction area Retail"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "construction area Retail");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ploted Development (Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["construction area Ploted Development"]
                    ? input["construction area Ploted Development"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "construction area Ploted Development");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Non FSI area (Sq.Ft)"}</label>
              <input
                type="text"
                value={
                  input["construction area Non FSI Area"]
                    ? input["construction area Non FSI Area"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "construction area Non FSI Area");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Construction Cost </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Residential (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Construction Cost Residential"]
                    ? input["Construction Cost Residential"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Construction Cost Residential");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Commercial (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Construction Cost Commercial"]
                    ? input["Construction Cost Commercial"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Construction Cost Commercial");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Retail (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Construction Cost Retail"]
                    ? input["Construction Cost Retail"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Construction Cost Retail");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Ploted Development (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Construction Cost Ploted Development"]
                    ? input["Construction Cost Ploted Development"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Construction Cost Ploted Development");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Non FSI area (Rate / Sq.Ft)"}
              </label>
              <input
                type="text"
                value={
                  input["Construction cost Non FSI Rate (Common)"]
                    ? input["Construction cost Non FSI Rate (Common)"]
                    : ""
                }
                onChange={(e) => {
                  onInputChange(e, "Construction cost Non FSI Rate (Common)");
                }}
                className="customer-desc"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "transparent",
                  opacity: isDisabled ? "0.5" : "1",
                  textAlign: "right",
                }}
                disabled={isDisabled}
              />
            </div>

            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Output </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Income from the project (INR)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["Income from the project"])
                    ? "0"
                    : output["Income from the project"].toLocaleString("en-US")
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Expenses incurred incl Profit (INR)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["Expenses incurred incl Profit"])
                    ? "0"
                    : output["Expenses incurred incl Profit"].toLocaleString(
                        "en-US",
                      )
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Residual value (INR)"}</label>
              <input
                type="text"
                value={
                  isNaN(output["Residual value"]())
                    ? "0"
                    : output["Residual value"]().toLocaleString("en-US")
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Land Rate per sft (rate / sqft)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["Land Rate per sft"]())
                    ? "0"
                    : output["Land Rate per sft"]().toLocaleString("en-US")
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Land Rate per acre (rate / sqft)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["Land Rate per acre"]())
                    ? "0"
                    : output["Land Rate per acre"]().toLocaleString("en-US")
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"FSI Rate per sqft (rate / sqft)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["FSI Rate per sqft"]())
                    ? "0"
                    : output["FSI Rate per sqft"]().toLocaleString("en-US")
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Total Value of the Project (INR)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(output["Total Value of the Project"]())
                    ? "0"
                    : String(output["Total Value of the Project"]()).includes(
                          "Infinity",
                        )
                      ? "0"
                      : output["Total Value of the Project"]().toLocaleString(
                          "en-US",
                        )
                }
                className="customer-desc"
                style={{
                  backgroundColor: "lightgrey",
                  textAlign: "right",
                }}
                disabled={true}
              />
            </div>

            <div
              style={{ width: "100%", justifyContent: "right" }}
              className="customer-details-sec"
            >
              {toWords.convert(
                isNaN(output["Total Value of the Project"]())
                  ? "0"
                  : String(output["Total Value of the Project"]()).includes(
                        "Infinity",
                      )
                    ? "0"
                    : output["Total Value of the Project"](),
              )}
            </div>
          </div>
        </div>

        <button
          className="pdf_btn"
          style={{ display: pdfDisabled ? "none" : "block" }}
          onClick={exportPDFWithComponent}
        >
          Download PDF
        </button>
      </PDFExport>
    </>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.users.isFetching,
  userData: state.users.userData,
  stateData: state.getState.stateData,
  cityNameData: state.getCityName.cityNameData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      stateUser: stateUser,
      cityUser: cityUser,
      getCalculatorState: getCalculatorState,
      getCalculatorTable: getCalculatorTable,
      getCalculatorCity: getCalculatorCity,
      getCalculatorSuggested: getCalculatorSuggested,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Calcultor);
