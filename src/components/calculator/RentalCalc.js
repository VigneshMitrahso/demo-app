import React, { useRef, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { bindActionCreators } from "redux";
import { _getStorageValue, getUserId } from "../../comman/localStorage";
import { connect } from "react-redux";
import { USER_ID } from "../../comman/constants";
import { ToWords } from "to-words";

const toWords = new ToWords();

const inputData = {
  "Leasable Area Retail": 0,
  "Leasable Area Office": 0,
  "Leasable Area Others": 0,
  "Leased Area Retail": 0,
  "Leased Area Office": 0,
  "Leased Area Others": 0,
  "Weighted Average Rental Retail": 0,
  "Weighted Average Rental Office": 0,
  "Weighted Average Rental Others": 0,
  "No of Parkings": 0,
  "Rent/Parking": 0,
  "Monthly CAM Charges": 0,
  "City Classification": 0,
  "Age of the Property": 0,
  "Grade of the Property": 0,
  "Green Building Rating": 0,
  "Maintainenace of the Property": 0,
  "State of the Property": 0,
  "Loction Demographics": 0,
};

const gradeOfTheProperty = [
  { label: "Select", value: 0, cal: 0 },
  { label: "Grade A", value: 10 / 100, cal: 3 },
  { label: "Grade B", value: 5 / 100, cal: 2 },
  { label: "Grade C", value: 2 / 100, cal: 1 },
  { label: "Others", value: 0, cal: 0 },
];

const locationDemographics = [
  { label: "Select", value: 0, cal: 0 },
  { label: "City Center", value: 25 / 100, cal: 5 },
  { label: "Pheriperal", value: 15 / 100, cal: 10 },
  { label: "Outer Business District", value: 10 / 100, cal: 15 },
];

const buildingRatingData = [
  { label: "Select", value: 0, cal: 0 },
  { label: "Platinum", value: 10 / 100, cal: 5 },
  { label: "Gold", value: 5 / 100, cal: 10 },
  { label: "Silver", value: 2 / 100, cal: 15 },
  { label: "Others", value: 0, cal: 0 },
];

const propertAge = [
  { label: "Select", value: 0, cal: 0 },
  { label: "<5 Years", value: 15 / 100, cal: 1 },
  { label: "5 to 10 Years", value: 10 / 100, cal: 2 },
  { label: ">10 Years", value: 5 / 100, cal: 3 },
];

const propertyState = [
  { label: "Select", value: 0, cal: 0 },
  { label: "Bare Shell", value: 2 / 100, cal: 1 },
  { label: "Warm Shell", value: 5 / 100, cal: 2 },
  { label: "Fitout ", value: 10 / 100, cal: 3 },
];

const securityDeposit = {
  "No of Months": 6,
};

const rateOfIntrest = {
  Interest: 1 / 100,
};

const cityData = [
  { label: "Select", value: 0 },
  { label: "Delhi NCR", value: 20 / 100 },
  { label: "Mumbai", value: 20 / 100 },
  { label: "Banglore", value: 20 / 100 },
  { label: "Hyderabad", value: 20 / 100 },
  { label: "Chennai", value: 20 / 100 },
  { label: "Kolkata", value: 20 / 100 },
  { label: "Ahmedabad", value: 20 / 100 },
  { label: "Pune", value: 20 / 100 },
  { label: "Surat", value: 20 / 100 },
  { label: "Indore", value: 20 / 100 },
  { label: "Chandigarh", value: 20 / 100 },
  { label: "Tier 2", value: 10 / 100 },
  { label: "Tier 3", value: 5 / 100 },
];

const maintainenaceData = [
  { label: "Select", value: 0, cal: 0 },
  { label: "Good", value: 10 / 100, cal: 3 },
  { label: "Average", value: 5 / 100, cal: 2 },
  { label: "Poor", value: 2 / 100, cal: 1 },
];

const RentalCalc = (props) => {
  const [input, setInput] = useState(inputData);
  const [selectedGrade, setSelectedGrade] = useState(gradeOfTheProperty[0]);
  const [demographics, setDemographics] = useState(locationDemographics[0]);
  const [buildingRating, setbuildingRate] = useState(buildingRatingData[0]);
  const [ageProperty, setAgeProperty] = useState(propertAge[0]);
  const [stateProperty, setStateProperty] = useState(propertyState[0]);
  const [city, setCity] = useState(cityData[0]);
  const [maintainenace, setMaintainenace] = useState(maintainenaceData[0]);
  const [pdfDisabled, setPdfDisabled] = useState(false);

  const grossIncome = () => {
    const d1 =
      Number(input["Leased Area Retail"]) *
      Number(input["Weighted Average Rental Retail"]);
    const d2 =
      Number(input["Leased Area Office"]) *
      Number(input["Weighted Average Rental Office"]);
    const d3 =
      Number(input["Leased Area Others"]) *
      Number(input["Weighted Average Rental Others"]);
    const d4 =
      Number(input["Leasable Area Retail"]) -
      Number(input["Leased Area Retail"]);
    const d5 =
      Number(input["Weighted Average Rental Retail"]) * (5 / 100) +
      Number(input["Weighted Average Rental Retail"]);
    const d45 = d4 * d5;
    const d6 =
      Number(input["Leasable Area Others"]) -
      Number(input["Leased Area Others"]);
    const d7 =
      Number(input["Weighted Average Rental Office"]) * (5 / 100) +
      Number(input["Weighted Average Rental Office"]);
    const d67 = d6 * d7;
    const d8 =
      Number(input["Leasable Area Others"]) -
      Number(input["Leased Area Others"]);
    const d9 =
      Number(input["Weighted Average Rental Others"]) * (5 / 100) +
      Number(input["Weighted Average Rental Others"]);
    const d89 = d8 * d9;

    const data = d1 + d2 + d3 + d45 + d67 + d89;

    return data;
  };

  const grossCAMRecievablesD = () => {
    const dd =
      Number(input["Leased Area Retail"]) +
      Number(input["Leased Area Office"]) +
      Number(input["Leased Area Others"]);
    const d = Number(input["Monthly CAM Charges"]) * dd;

    return d;
  };

  const netMarginRevenuefromCAMChargesMonthly = () => {
    const grossCAMReciev = grossCAMRecievablesD();
    const selecGrade = selectedGrade ? selectedGrade.cal / 100 : 0;

    return grossCAMReciev * selecGrade;
  };

  const totalSecurityDeposit = () => {
    const grossInc = grossIncome();
    const noofMonths = securityDeposit["No of Months"];

    return grossInc * noofMonths;
  };

  const incomefromSecurityDeposit = () => {
    const totalSecurityDep = totalSecurityDeposit();
    return totalSecurityDep * rateOfIntrest["Interest"];
  };

  const grossPotentialAnnualRevenue = () => {
    const grossInc = grossIncome();
    const netMarginRevenuefromCAMChargesMonth =
      netMarginRevenuefromCAMChargesMonthly();
    const incomefromSecurityDep = incomefromSecurityDeposit();
    const grossRentalfromParking =
      Number(input["No of Parkings"]) * Number(input["Rent/Parking"]);

    const d1 =
      (grossInc +
        grossRentalfromParking +
        netMarginRevenuefromCAMChargesMonth) *
      12;

    const d = d1 + incomefromSecurityDep;

    return d;
  };

  const effectiveAnnualRevenue = () => {
    const grossPotentialAnnualRev = grossPotentialAnnualRevenue();
    const demograp = demographics ? Number(demographics.cal) / 100 : 0;

    return grossPotentialAnnualRev * (1 - demograp);
  };

  const operationandMaintenanceCharge = () => {
    const effectiveAnnualRev = effectiveAnnualRevenue();
    const maint = maintainenace ? Number(maintainenace.cal) / 100 : 0;
    const d = effectiveAnnualRev * maint;

    return d;
  };

  const propertyTaxInsurance = () => {
    const effectiveAnnualRev = effectiveAnnualRevenue();
    const ageprop = ageProperty ? Number(ageProperty.cal) / 100 : 0;
    const d = effectiveAnnualRev * ageprop;

    return d;
  };

  const repairandRetroit = () => {
    const effectiveAnnualRev = effectiveAnnualRevenue();
    const stateProp = stateProperty ? Number(stateProperty.cal) / 100 : 0;

    return effectiveAnnualRev * stateProp;
  };

  const totalOperatingExpenditure = () => {
    const operationandMaintenanceCh = operationandMaintenanceCharge();
    const propertyTaxIns = propertyTaxInsurance();
    const repairandRet = repairandRetroit();

    return operationandMaintenanceCh + propertyTaxIns + repairandRet;
  };

  const netCashflowfromOperations = () => {
    const effectiveAnnualRev = effectiveAnnualRevenue();
    const totalOperatingExpe = totalOperatingExpenditure();
    return effectiveAnnualRev - totalOperatingExpe;
  };

  const totalPercentage = () => {
    const d =
      Number(city.value) +
      Number(ageProperty.value) +
      Number(selectedGrade.value) +
      Number(buildingRating.value) +
      Number(maintainenace.value) +
      Number(stateProperty.value) +
      Number(demographics.value);
    return d;
  };

  const capitalizedAt = () => {
    const totalPer = totalPercentage();
    let percent = 0;
    if (totalPer >= 95 / 100) {
      return (percent = 6.5);
    } else if (totalPer >= 90 / 100) {
      return (percent = 6.75);
    } else if (totalPer >= 85 / 100) {
      return (percent = 7);
    } else if (totalPer >= 80 / 100) {
      return (percent = 7.5);
    } else if (totalPer >= 75 / 100) {
      return (percent = 8);
    } else if (totalPer >= 70 / 100) {
      return (percent = 8.5);
    } else if (totalPer >= 65 / 100) {
      return (percent = 9);
    } else if (totalPer >= 50 / 100) {
      return (percent = 9.5);
    } else if (totalPer <= 50 / 100) {
      return (percent = 10);
    }
    return percent;
  };

  const capitalizedRate = () => {
    const netCashflowfromOpe = netCashflowfromOperations();
    const capitalAt = capitalizedAt();
    return netCashflowfromOpe / (capitalAt / 100);
  };

  const output = {
    "Appraised Rate/Sft":
      capitalizedRate() /
      (Number(input["Leasable Area Others"]) +
        Number(input["Leasable Area Office"]) +
        Number(input["Leasable Area Retail"])),
    "Property Value in INR": capitalizedRate(),
  };

  const onInputChange = (e, label, defaultNumber = true) => {
    let rawValue = e.target.value.replace(/,/g, "");
    if (
      (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(rawValue) && defaultNumber) ||
      rawValue === ""
    ) {
      let value = rawValue;
      let updatedInput = { ...input, [label]: value };
      setInput(updatedInput);
    } else if (!defaultNumber) {
      let value = rawValue;
      let updatedInput = { ...input, [label]: value };
      setInput(updatedInput);
    }
  };

  const pdfExportComponent = useRef(null);
  const exportPDFWithComponent = () => {
    props.onDownload("Rental");
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
    <PDFExport
      ref={pdfExportComponent}
      paperSize="A4"
      landscape={true}
      fileName="Rental_Calculator.pdf"
      scale={0.8}
    >
      <div className={pdfDisabled ? "pdf_full_page" : "calculations-container"}>
        <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Total Leasable Area </h3>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Retail (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leasable Area Retail"]
                  ? Number(input["Leasable Area Retail"]).toLocaleString(
                      "en-US",
                    )
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leasable Area Retail");
              }}
              className="customer-desc"
              style={{
                textAlign: "right",
              }}
            />
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Office (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leasable Area Office"]
                  ? Number(input["Leasable Area Office"]).toLocaleString(
                      "en-US",
                    )
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leasable Area Office");
              }}
              className="customer-desc"
              style={{
                textAlign: "right",
              }}
            />
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Others (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leasable Area Others"]
                  ? Number(input["Leasable Area Others"]).toLocaleString(
                      "en-US",
                    )
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leasable Area Others");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>
          <div>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Total Leased Area</h3>
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Retail (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leased Area Retail"]
                  ? Number(input["Leased Area Retail"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leased Area Retail");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Office (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leased Area Office"]
                  ? Number(input["Leased Area Office"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leased Area Office");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Others (Sft)"}</label>
            <input
              type="text"
              value={
                input["Leased Area Others"]
                  ? Number(input["Leased Area Others"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Leased Area Others");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>

          <div>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Weighted Average Rental </h3>
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Retail (INR/Sft/Month)"}</label>
            <input
              type="text"
              value={
                input["Weighted Average Rental Retail"]
                  ? Number(
                      input["Weighted Average Rental Retail"],
                    ).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Weighted Average Rental Retail");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Office (INR/Sft/Month)"}</label>
            <input
              type="text"
              value={
                input["Weighted Average Rental Office"]
                  ? Number(
                      input["Weighted Average Rental Office"],
                    ).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Weighted Average Rental Office");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Others (INR/Sft/Month)"}</label>
            <input
              type="text"
              value={
                input["Weighted Average Rental Others"]
                  ? Number(
                      input["Weighted Average Rental Others"],
                    ).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Weighted Average Rental Others");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>

          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Parking Area Details </h3>
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"No of Parkings (Count)"}</label>
            <input
              type="text"
              value={
                input["No of Parkings"]
                  ? Number(input["No of Parkings"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "No of Parkings");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">
              {"Rent/Parking (INR/Lot/Month)"}
            </label>
            <input
              type="text"
              value={
                input["Rent/Parking"]
                  ? Number(input["Rent/Parking"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Rent/Parking");
              }}
              style={{
                textAlign: "right",
              }}
              className="customer-desc"
            />
          </div>
        </div>

        <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
          <div>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> CAM Charges </h3>
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">
              {"Monthly CAM Charges (INR/Sft/Month)"}
            </label>
            <input
              type="text"
              value={
                input["Monthly CAM Charges"]
                  ? Number(input["Monthly CAM Charges"]).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                onInputChange(e, "Monthly CAM Charges");
              }}
              className="customer-desc"
              style={{
                textAlign: "right",
              }}
              //disabled={isDisabled}
            />
          </div>

          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Property Features </h3>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"City Classification"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["City Classification"]}
                </div>
              ) : (
                <select
                  value={input["City Classification"]}
                  onChange={(e) => {
                    onInputChange(e, "City Classification", false);
                    let filterData = cityData.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setCity(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {cityData.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Age of the Property"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["Age of the Property"]}
                </div>
              ) : (
                <select
                  value={input["Age of the Property"]}
                  onChange={(e) => {
                    onInputChange(e, "Age of the Property", false);
                    let filterData = propertAge.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setAgeProperty(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {propertAge.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Grade of the Property"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["Grade of the Property"]}
                </div>
              ) : (
                <select
                  value={input["Grade of the Property"]}
                  onChange={(e) => {
                    onInputChange(e, "Grade of the Property", false);
                    let filterData = gradeOfTheProperty.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setSelectedGrade(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {gradeOfTheProperty.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Green Building Rating"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["Green Building Rating"]}
                </div>
              ) : (
                <select
                  value={input["Green Building Rating"]}
                  onChange={(e) => {
                    onInputChange(e, "Green Building Rating", false);
                    let filterData = buildingRatingData.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setbuildingRate(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {buildingRatingData.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">
              {"Maintainenace of the Property"}
            </label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["Maintainenace of the Property"]}
                </div>
              ) : (
                <select
                  value={input["Maintainenace of the Property"]}
                  onChange={(e) => {
                    onInputChange(e, "Maintainenace of the Property", false);
                    let filterData = maintainenaceData.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setMaintainenace(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {maintainenaceData.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"State of the Property"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["State of the Property"]}
                </div>
              ) : (
                <select
                  value={input["State of the Property"]}
                  onChange={(e) => {
                    onInputChange(e, "State of the Property", false);
                    let filterData = propertyState.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setStateProperty(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {propertyState.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Loction Demographics"}</label>
            <div className="down-arrow " style={{ width: "45%" }}>
              {pdfDisabled ? (
                <div
                  style={{ width: "100%", height: "32px", textAlign: "right" }}
                  className="customer-desc"
                >
                  {input["Loction Demographics"]}
                </div>
              ) : (
                <select
                  value={input["Loction Demographics"]}
                  onChange={(e) => {
                    onInputChange(e, "Loction Demographics", false);
                    let filterData = locationDemographics.filter(
                      (fd) => fd.label == e.target.value,
                    )[0];
                    setDemographics(filterData);
                  }}
                  className="customer-desc"
                  style={{ width: "100%" }}
                >
                  {locationDemographics.map((data, key) => {
                    return (
                      <option key={key} value={data.label} label={data.label} />
                    );
                  })}
                </select>
              )}
            </div>
          </div>

          <div>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Output </h3>
            </div>
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Appraised Rate/Sft"}</label>
            <input
              type="text"
              value={output["Appraised Rate/Sft"].toLocaleString("en-US")}
              className="customer-desc"
              style={{
                backgroundColor: "lightgrey",
              }}
              disabled={true}
            />
          </div>
          <div style={{ width: "100%" }} className="customer-details-sec">
            <label className="customer-title">{"Property Value in INR"}</label>
            <input
              type="text"
              value={
                isNaN(output["Property Value in INR"].toFixed(2))
                  ? "0.00"
                  : Number(output["Property Value in INR"]).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )
              }
              className="customer-desc"
              style={{
                backgroundColor: "lightgrey",
              }}
              disabled={true}
            />
          </div>

          <div style={{ width: "100%" }} className="customer-details-sec">
            <div className="">
              {toWords.convert(
                String(output["Property Value in INR"]).includes("Infinity")
                  ? "0"
                  : output["Property Value in INR"],
              )}
            </div>
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
  );
};

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RentalCalc);
