import React, { useRef, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import { connect } from "react-redux";
import { USER_ID } from "../../comman/constants";
import "./style.css";
import {
  findZoning,
  findDistanceFromPriceRoad,
  findProximityToDevelopment,
  findDevelopmentPotential,
  findSizeOftheProperty,
  findShapeOftheProperty,
  findAbutingRoadWidth,
  findFrontageoftheproperty,
  findMaintenanceoftheProperty,
  findAvailabilityOfRevenue,
  findTypeOfTransaction,
  findRedevelopementCharges,
  findProfileofSurroundings,
  findRoadSpearingEffect,
  findCornerOrIntermittent,
  findAccesstoPublicTransport,
} from "./premiumUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ToWords } from "to-words";

const toWords = new ToWords();

const inputArr = [
  { label: "Land Extent (Sft)", input: "text", unit: "(INR/per sqft)" },
  {
    label: "Transacted/Negotiated Land value in",
    input: "text",
    unit: "Sq.ft.",
  },
  { label: "Type of Transaction", input: "Select", unit: "" },
  { label: "Zoning - Permissible Land Use", input: "Select", unit: "" },
  { label: "Distance from Principal Road", input: "Select", unit: "(Km)" },
  { label: "Proximity to developments", input: "Select", unit: "" },
  { label: "Development Potential", input: "Select", unit: "" },
  { label: "Shape of the property", input: "Select", unit: "" },
  { label: "Abutting Road width", input: "Select", unit: "(Ft)" },
  { label: "Frontage Ft", input: "text", unit: "(Ft)" },
  { label: "Maintenance of the Property", input: "Select", unit: "" },
  {
    label: "Availability of revenue documents/approvals",
    input: "Select",
    unit: "",
  },
  { label: "Redevelopement Charges", input: "Select", unit: "" },
  { label: "Profile of Surroundings", input: "Select", unit: "" },
  { label: "Road Spearing Effect", input: "Select", unit: "" },
  { label: "Corner/Intermittent Property", input: "Select", unit: "" },
  { label: "Access to Public Transport", input: "Select", unit: "(Km)" },
];

const inputDatas = {
  "Land Extent (Sft) Subject property": "",
  "Land Extent (Sft) Comparable 1": "",
  "Land Extent (Sft) Comparable 2": "",
  "Land Extent (Sft) Comparable 3": "",

  "Transacted/Negotiated Land value in Subject property": "",
  "Transacted/Negotiated Land value in Comparable 1": "",
  "Transacted/Negotiated Land value in Comparable 2": "",
  "Transacted/Negotiated Land value in Comparable 3": "",

  "Type of Transaction Subject property": "",
  "Type of Transaction Comparable 1": "",
  "Type of Transaction Comparable 2": "",
  "Type of Transaction Comparable 3": "",

  "Zoning - Permissible Land Use Subject property": "",
  "Zoning - Permissible Land Use Comparable 1": "",
  "Zoning - Permissible Land Use Comparable 2": "",
  "Zoning - Permissible Land Use Comparable 3": "",

  "Distance from Principal Road Subject property": "",
  "Distance from Principal Road Comparable 1": "",
  "Distance from Principal Road Comparable 2": "",
  "Distance from Principal Road Comparable 3": "",

  "Proximity to developments Subject property": "",
  "Proximity to developments Comparable 1": "",
  "Proximity to developments Comparable 2": "",
  "Proximity to developments Comparable 3": "",

  "Development Potential Subject property": "",
  "Development Potential Comparable 1": "",
  "Development Potential Comparable 2": "",
  "Development Potential Comparable 3": "",

  "Shape of the property Subject property": "",
  "Shape of the property Comparable 1": "",
  "Shape of the property Comparable 2": "",
  "Shape of the property Comparable 3": "",

  "Abutting Road width Subject property": "",
  "Abutting Road width Comparable 1": "",
  "Abutting Road width Comparable 2": "",
  "Abutting Road width Comparable 3": "",

  "Frontage Ft Subject property": "",
  "Frontage Ft Comparable 1": "",
  "Frontage Ft Comparable 2": "",
  "Frontage Ft Comparable 3": "",

  "Maintenance of the Property Subject property": "",
  "Maintenance of the Property Comparable 1": "",
  "Maintenance of the Property Comparable 2": "",
  "Maintenance of the Property Comparable 3": "",

  "Availability of revenue documents/approvals Subject property": "",
  "Availability of revenue documents/approvals Comparable 1": "",
  "Availability of revenue documents/approvals Comparable 2": "",
  "Availability of revenue documents/approvals Comparable 3": "",

  "Redevelopement Charges Subject property": "",
  "Redevelopement Charges Comparable 1": "",
  "Redevelopement Charges Comparable 2": "",
  "Redevelopement Charges Comparable 3": "",

  "Profile of Surroundings Subject property": 0,
  "Profile of Surroundings Comparable 1": 0,
  "Profile of Surroundings Comparable 2": 0,
  "Profile of Surroundings Comparable 3": 0,

  "Road Spearing Effect Subject property": 0,
  "Road Spearing Effect Comparable 1": 0,
  "Road Spearing Effect Comparable 2": 0,
  "Road Spearing Effect Comparable 3": 0,

  "Corner/Intermittent Property Subject property": 0,
  "Corner/Intermittent Property Comparable 1": 0,
  "Corner/Intermittent Property Comparable 2": 0,
  "Corner/Intermittent Property Comparable 3": 0,

  "Access to Public Transport Subject property": 0,
  "Access to Public Transport Comparable 1": 0,
  "Access to Public Transport Comparable 2": 0,
  "Access to Public Transport Comparable 3": 0,

  "Average cost per sft Subject property": 0,
  "Average cost per sft Comparable 1": 0,
  "Average cost per sft Comparable 2": 0,
  "Average cost per sft Comparable 3": 0,
};

const Type_of_Transaction_Data = [
  { label: "Select", value: 0 },
  { label: "Transaction", value: 1 },
  { label: "Quotation", value: 1 },
];

const Zone_And_Permissable_Landuse_Data = [
  { label: "Select", value: 0 },
  { label: "Residential", value: 1 },
  { label: "Commercial", value: 1 },
  { label: "Mixed", value: 1 },
  { label: "Industrial", value: 1 },
  { label: "Agricultural", value: 1 },
];

const Distance_from_Priciple_Road_Data = [
  { label: "Select", value: 0 },
  { label: ">2", value: 1 },
  { label: "1 to 2", value: 1 },
  { label: "0.5 to 1", value: 1 },
  { label: "<0.5", value: 1 },
];

const Abutting_Road_Width_Data = [
  { label: "Select", value: 0 },
  { label: "<30", value: 1 },
  { label: "30 to 60", value: 1 },
  { label: "60 to 80", value: 1 },
  { label: "80 to 100", value: 1 },
  { label: ">100", value: 1 },
];

const Shape_of_the_Property_Data = [
  { label: "Select", value: 0 },
  { label: "Regular", value: 1 },
  { label: "Irregular", value: 1 },
  { label: "Very Irregular", value: 1 },
];

const Development_Potential_Data = [
  { label: "Select", value: 0 },
  { label: "Developed (FSI utilised)", value: 1 },
  { label: "Partly Developed", value: 1 },
  { label: "NA", value: 1 },
];

const Availability_of_Revenue_Documents_Necessary_Approvals = [
  { label: "Select", value: 0 },
  { label: "Available", value: 1 },
  { label: "Partly available", value: 1 },
  { label: "Not Available", value: 1 },
  { label: "NA", value: 1 },
];

const Maintenance_of_the_Property_Data = [
  { label: "Select", value: 0 },
  { label: "Good", value: 1 },
  { label: "Average", value: 1 },
  { label: "Poor", value: 1 },
  { label: "NA", value: 1 },
];

const Redevelopement_Charges_Data = [
  { label: "Select", value: 0 },
  { label: "Applicable", value: 0 },
  { label: "Not Applicable", value: 0 },
];

const Profile_of_Surroundings_Data = [
  { label: "Select", value: 0 },
  { label: "Standard", value: "N/A" },
  { label: "Substandard", value: "N/A" },
  { label: "NA", value: 0 },
];

const Road_Spearing_Effect_Data = [
  { label: "Select", value: 0 },
  { label: "Yes", value: "Yes" },
  { label: "No", value: "N/A" },
  { label: "NA", value: 0 },
];

const Corner_Intermittent_Property_data = [
  { label: "Select", value: 0 },
  { label: "Corner", value: "Yes" },
  { label: "Intermittent", value: "N/A" },
  { label: "NA", value: 0 },
];

const Access_to_Public_Transport_data = [
  { label: "Select", value: 0 },
  { label: "<1", value: 0 },
  { label: "1 to 2", value: "Yes" },
  { label: "2 to 3", value: "N/A" },
  { label: ">3", value: 0 },
  { label: "NA", value: 0 },
];

const Proximity_to_Developments_Data = [
  { label: "Select", value: 0 },
  { label: "City Center", value: 1 },
  { label: "Developing Locality", value: 1 },
  { label: "No Development", value: 1 },
  { label: "NA", value: 1 },
];

const dataSource = {
  "Type of Transaction": [...Type_of_Transaction_Data],
  "Zoning - Permissible Land Use": [...Zone_And_Permissable_Landuse_Data],
  "Distance from Principal Road": [...Distance_from_Priciple_Road_Data],
  "Proximity to developments": [...Proximity_to_Developments_Data],
  "Development Potential": [...Development_Potential_Data],
  "Shape of the property": [...Shape_of_the_Property_Data],
  "Abutting Road width": [...Abutting_Road_Width_Data],
  "Maintenance of the Property": [...Maintenance_of_the_Property_Data],
  "Availability of revenue documents/approvals": [
    ...Availability_of_Revenue_Documents_Necessary_Approvals,
  ],
  "Redevelopement Charges": [...Redevelopement_Charges_Data],
  "Profile of Surroundings": [...Profile_of_Surroundings_Data],
  "Road Spearing Effect": [...Road_Spearing_Effect_Data],
  "Corner/Intermittent Property": [...Corner_Intermittent_Property_data],
  "Access to Public Transport": [...Access_to_Public_Transport_data],
};

const PremiumDiscount = (props) => {
  const [input, setInput] = useState({});
  const [isAdded, setAdd] = useState(false);
  const [pdfDisabled, setPdfDisabled] = useState(false);

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

  const datMemo = React.useMemo(() => {
    let inputData = input;
    const finalOutput = [
      {
        comparable1: findZoning(
          inputData["Zoning - Permissible Land Use Subject property"],
          inputData["Zoning - Permissible Land Use Comparable 1"],
        ),
        comparable2: findZoning(
          inputData["Zoning - Permissible Land Use Subject property"],
          inputData["Zoning - Permissible Land Use Comparable 2"],
        ),
        comparable3: findZoning(
          inputData["Zoning - Permissible Land Use Subject property"],
          inputData["Zoning - Permissible Land Use Comparable 3"],
        ),
      },
      {
        comparable1: findDistanceFromPriceRoad(
          inputData["Distance from Principal Road Subject property"],
          inputData["Distance from Principal Road Comparable 1"],
        ),
        comparable2: findDistanceFromPriceRoad(
          inputData["Distance from Principal Road Subject property"],
          inputData["Distance from Principal Road Comparable 2"],
        ),
        comparable3: findDistanceFromPriceRoad(
          inputData["Distance from Principal Road Subject property"],
          inputData["Distance from Principal Road Comparable 3"],
        ),
      },
      {
        comparable1: findProximityToDevelopment(
          inputData["Proximity to developments Subject property"],
          inputData["Proximity to developments Comparable 1"],
        ),
        comparable2: findProximityToDevelopment(
          inputData["Proximity to developments Subject property"],
          inputData["Proximity to developments Comparable 2"],
        ),
        comparable3: findProximityToDevelopment(
          inputData["Proximity to developments Subject property"],
          inputData["Proximity to developments Comparable 3"],
        ),
      },
      {
        comparable1: findDevelopmentPotential(
          inputData["Development Potential Subject property"],
          inputData["Development Potential Comparable 1"],
        ),
        comparable2: findDevelopmentPotential(
          inputData["Development Potential Subject property"],
          inputData["Development Potential Comparable 2"],
        ),
        comparable3: findDevelopmentPotential(
          inputData["Development Potential Subject property"],
          inputData["Development Potential Comparable 3"],
        ),
      },
      {
        comparable1: findSizeOftheProperty(
          inputData["Land Extent (Sft) Subject property"],
          inputData["Land Extent (Sft) Comparable 1"],
        ),
        comparable2: findSizeOftheProperty(
          inputData["Land Extent (Sft) Subject property"],
          inputData["Land Extent (Sft) Comparable 2"],
        ),
        comparable3: findSizeOftheProperty(
          inputData["Land Extent (Sft) Subject property"],
          inputData["Land Extent (Sft) Comparable 3"],
        ),
      },
      {
        comparable1: findShapeOftheProperty(
          inputData["Shape of the property Subject property"],
          inputData["Shape of the property Comparable 1"],
        ),
        comparable2: findShapeOftheProperty(
          inputData["Shape of the property Subject property"],
          inputData["Shape of the property Comparable 2"],
        ),
        comparable3: findShapeOftheProperty(
          inputData["Shape of the property Subject property"],
          inputData["Shape of the property Comparable 3"],
        ),
      },
      {
        comparable1: findAbutingRoadWidth(
          inputData["Abutting Road width Subject property"],
          inputData["Abutting Road width Comparable 1"],
        ),
        comparable2: findAbutingRoadWidth(
          inputData["Abutting Road width Subject property"],
          inputData["Abutting Road width Comparable 2"],
        ),
        comparable3: findAbutingRoadWidth(
          inputData["Abutting Road width Subject property"],
          inputData["Abutting Road width Comparable 3"],
        ),
      },
      {
        comparable1: findFrontageoftheproperty(
          inputData["Frontage Ft Subject property"],
          inputData["Frontage Ft Comparable 1"],
        ),
        comparable2: findFrontageoftheproperty(
          inputData["Frontage Ft Subject property"],
          inputData["Frontage Ft Comparable 2"],
        ),
        comparable3: findFrontageoftheproperty(
          inputData["Frontage Ft Subject property"],
          inputData["Frontage Ft Comparable 3"],
        ),
      },
      {
        comparable1: findMaintenanceoftheProperty(
          inputData["Maintenance of the Property Subject property"],
          inputData["Maintenance of the Property Comparable 1"],
        ),
        comparable2: findMaintenanceoftheProperty(
          inputData["Maintenance of the Property Subject property"],
          inputData["Maintenance of the Property Comparable 2"],
        ),
        comparable3: findMaintenanceoftheProperty(
          inputData["Maintenance of the Property Subject property"],
          inputData["Maintenance of the Property Comparable 3"],
        ),
      },

      {
        comparable1: findAvailabilityOfRevenue(
          inputData[
            "Availability of revenue documents/approvals Subject property"
          ],
          inputData["Availability of revenue documents/approvals Comparable 1"],
        ),
        comparable2: findAvailabilityOfRevenue(
          inputData[
            "Availability of revenue documents/approvals Subject property"
          ],
          inputData["Availability of revenue documents/approvals Comparable 2"],
        ),
        comparable3: findAvailabilityOfRevenue(
          inputData[
            "Availability of revenue documents/approvals Subject property"
          ],
          inputData["Availability of revenue documents/approvals Comparable 3"],
        ),
      },
      {
        comparable1: findTypeOfTransaction(
          inputData["Type of Transaction Subject property"],
          inputData["Type of Transaction Comparable 1"],
        ),
        comparable2: findTypeOfTransaction(
          inputData["Type of Transaction Subject property"],
          inputData["Type of Transaction Comparable 2"],
        ),
        comparable3: findTypeOfTransaction(
          inputData["Type of Transaction Subject property"],
          inputData["Type of Transaction Comparable 3"],
        ),
      },
      {
        comparable1: findRedevelopementCharges(
          inputData["Redevelopement Charges Subject property"],
          inputData["Redevelopement Charges Comparable 1"],
        ),
        comparable2: findRedevelopementCharges(
          inputData["Redevelopement Charges Subject property"],
          inputData["Redevelopement Charges Comparable 2"],
        ),
        comparable3: findRedevelopementCharges(
          inputData["Redevelopement Charges Subject property"],
          inputData["Redevelopement Charges Comparable 3"],
        ),
      },
      {
        comparable1: findProfileofSurroundings(
          inputData["Profile of Surroundings Subject property"],
          inputData["Profile of Surroundings Comparable 1"],
        ),
        comparable2: findProfileofSurroundings(
          inputData["Profile of Surroundings Subject property"],
          inputData["Profile of Surroundings Comparable 2"],
        ),
        comparable3: findProfileofSurroundings(
          inputData["Profile of Surroundings Subject property"],
          inputData["Profile of Surroundings Comparable 3"],
        ),
      },
      {
        comparable1: findRoadSpearingEffect(
          inputData["Road Spearing Effect Subject property"],
          inputData["Road Spearing Effect Comparable 1"],
        ),
        comparable2: findRoadSpearingEffect(
          inputData["Road Spearing Effect Subject property"],
          inputData["Road Spearing Effect Comparable 2"],
        ),
        comparable3: findRoadSpearingEffect(
          inputData["Road Spearing Effect Subject property"],
          inputData["Road Spearing Effect Comparable 3"],
        ),
      },
      {
        comparable1: findCornerOrIntermittent(
          inputData["Corner/Intermittent Property Subject property"],
          inputData["Corner/Intermittent Property Comparable 1"],
        ),
        comparable2: findCornerOrIntermittent(
          inputData["Corner/Intermittent Property Subject property"],
          inputData["Corner/Intermittent Property Comparable 2"],
        ),
        comparable3: findCornerOrIntermittent(
          inputData["Corner/Intermittent Property Subject property"],
          inputData["Corner/Intermittent Property Comparable 3"],
        ),
      },
      {
        comparable1: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 1"],
        ),
        comparable2: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 2"],
        ),
        comparable3: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 3"],
        ),
      },
      {
        comparable1: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 1"],
        ),
        comparable2: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 2"],
        ),
        comparable3: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 3"],
        ),
      },
      {
        comparable1: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 1"],
        ),
        comparable2: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 2"],
        ),
        comparable3: findAccesstoPublicTransport(
          inputData["Access to Public Transport Subject property"],
          inputData["Access to Public Transport Comparable 3"],
        ),
      },
      // {
      //   comparable1: findAccesstoPublicTransport(inputData["Access to Public Transport Subject property"], inputData["Access to Public Transport Comparable 1"]),
      //   comparable2: findAccesstoPublicTransport(inputData["Access to Public Transport Subject property"], inputData["Access to Public Transport Comparable 2"]),
      //   comparable3: findAccesstoPublicTransport(inputData["Access to Public Transport Subject property"], inputData["Access to Public Transport Comparable 3"]),
      // },
    ];

    let comparable1 = finalOutput.reduce(
      (accumulator, currentValue) => accumulator + currentValue.comparable1,
      0,
    );
    let comparable2 = finalOutput.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.comparable2 || 0,
      0,
    );
    let comparable3 = finalOutput.reduce(
      (accumulator, currentValue) => accumulator + currentValue.comparable3,
      0,
    );

    let discount_comparable1 = 100 + comparable1;
    let discount_comparable2 = 100 + comparable2;
    let discount_comparable3 = 100 + comparable3;

    let price_comparable1 =
      input["Transacted/Negotiated Land value in Comparable 1"] *
      (discount_comparable1 / 100);
    let price_comparable2 =
      input["Transacted/Negotiated Land value in Comparable 2"] *
      (discount_comparable2 / 100);
    let price_comparable3 =
      input["Transacted/Negotiated Land value in Comparable 3"] *
      (discount_comparable3 / 100);

    if (isAdded) {
      const AverageCost =
        (price_comparable1 + price_comparable2 + price_comparable3) / 3;
      const PropertyValue =
        input["Land Extent (Sft) Subject property"] * AverageCost;
      return {
        averageCost: AverageCost,
        propertyValue: PropertyValue,
        price_comparable1,
        price_comparable2,
        price_comparable3,
      };
    } else {
      const AverageCost = (price_comparable1 + price_comparable2) / 2;
      const PropertyValue =
        input["Land Extent (Sft) Subject property"] * AverageCost;
      return {
        averageCost: AverageCost,
        propertyValue: PropertyValue,
        price_comparable1,
        price_comparable2,
      };
    }
  }, [input, isAdded]);

  const pdfExportComponent = useRef(null);

  const exportPDFWithComponent = () => {
    props.onDownload("Premium_Discount");
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
      fileName="Premium_Discount_Calculator.pdf"
      scale={0.8}
    >
      <div style={{ marginRight: 50, marginLeft: 50 }}>
        <div className="site-vist sitrepot branch-container sticky">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", alignItems: "center" }}>
              <div
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 5,
                }}
                className="customer-details-sec"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20% ",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>{""}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20%",
                  }}
                >
                  <div>{"Subject property"}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20%",
                  }}
                >
                  <div>{"Comparable 1"}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "20%",
                  }}
                >
                  <div>{"Comparable 2"} </div>
                  {!isAdded && (
                    <div
                      onClick={() => {
                        setAdd(true);
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        rotate={45}
                        color="#fff"
                        size="lg"
                      />
                    </div>
                  )}
                </div>
                {isAdded && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "20%",
                    }}
                  >
                    <div>{"Comparable 3"}</div>
                    {isAdded && (
                      <div
                        onClick={() => {
                          setAdd(false);
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          rotate={45}
                          color="#fff"
                          size="lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {inputArr.map((data) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div style={{ width: "100%", alignItems: "center" }}>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 5,
                  }}
                  className="customer-details-sec"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "20%",
                    }}
                  >
                    {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                    <div
                      style={{ width: "90%" }}
                      className="customer-title"
                    >{`${data.label} ${data.unit}`}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "20%",
                    }}
                  >
                    {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>{"Subject property"}</label> */}
                    {data.input === "text" ? (
                      <input
                        style={{ width: "90%", textAlign: "right" }}
                        type="text"
                        value={
                          input[`${data.label} Subject property`]
                            ? Number(
                                input[`${data.label} Subject property`],
                              ).toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) => {
                          onInputChange(
                            e,
                            `${data.label} Subject property`,
                            true,
                          );
                        }}
                        className="customer-desc"
                      />
                    ) : (
                      <div className="down-arrow " style={{ width: "90%" }}>
                        {pdfDisabled ? (
                          <div
                            style={{
                              width: "100%",
                              height: "32px",
                              textAlign: "right",
                            }}
                            className="customer-desc"
                          >
                            {input[`${data.label} Subject property`]}
                          </div>
                        ) : (
                          <select
                            value={input[`${data.label} Subject property`]}
                            onChange={(e) => {
                              onInputChange(
                                e,
                                `${data.label} Subject property`,
                                false,
                              );
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            {!!dataSource[data.label] &&
                              dataSource[data.label].map((md) => {
                                return (
                                  <option value={md.label} label={md.label} />
                                );
                              })}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "20%",
                    }}
                  >
                    {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>{"Comparable 1"}</label> */}
                    {data.input === "text" ? (
                      <input
                        style={{ width: "90%", textAlign: "right" }}
                        type="text"
                        value={
                          input[`${data.label} Comparable 1`]
                            ? Number(
                                input[`${data.label} Comparable 1`],
                              ).toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) => {
                          onInputChange(e, `${data.label} Comparable 1`);
                        }}
                        className="customer-desc"
                      />
                    ) : (
                      <div className="down-arrow " style={{ width: "90%" }}>
                        {pdfDisabled ? (
                          <div
                            style={{
                              width: "100%",
                              height: "32px",
                              textAlign: "right",
                            }}
                            className="customer-desc"
                          >
                            {input[`${data.label} Comparable 1`]}
                          </div>
                        ) : (
                          <select
                            value={input[`${data.label} Comparable 1`]}
                            onChange={(e) => {
                              onInputChange(
                                e,
                                `${data.label} Comparable 1`,
                                false,
                              );
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            {!!dataSource[data.label] &&
                              dataSource[data.label].map((md) => {
                                return (
                                  <option value={md.label} label={md.label} />
                                );
                              })}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "20%",
                    }}
                  >
                    {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>{"Comparable 2"}</label> */}
                    {data.input === "text" ? (
                      <input
                        style={{ width: "90%", textAlign: "right" }}
                        type="text"
                        value={
                          input[`${data.label} Comparable 2`]
                            ? Number(
                                input[`${data.label} Comparable 2`],
                              ).toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) => {
                          onInputChange(e, `${data.label} Comparable 2`);
                        }}
                        className="customer-desc"
                      />
                    ) : (
                      <div className="down-arrow " style={{ width: "90%" }}>
                        {pdfDisabled ? (
                          <div
                            style={{
                              width: "100%",
                              height: "32px",
                              textAlign: "right",
                            }}
                            className="customer-desc"
                          >
                            {input[`${data.label} Comparable 2`]}
                          </div>
                        ) : (
                          <select
                            value={input[`${data.label} Comparable 2`]}
                            onChange={(e) => {
                              onInputChange(
                                e,
                                `${data.label} Comparable 2`,
                                false,
                              );
                            }}
                            className="customer-desc"
                            style={{ width: "100%" }}
                          >
                            {!!dataSource[data.label] &&
                              dataSource[data.label].map((md) => {
                                return (
                                  <option value={md.label} label={md.label} />
                                );
                              })}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                  {isAdded && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "20%",
                      }}
                    >
                      {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>{"Comparable 3"}</label> */}
                      {data.input === "text" ? (
                        <input
                          style={{ width: "90%", textAlign: "right" }}
                          type="text"
                          value={
                            input[`${data.label} Comparable 3`]
                              ? Number(
                                  input[`${data.label} Comparable 3`],
                                ).toLocaleString("en-US")
                              : ""
                          }
                          onChange={(e) => {
                            onInputChange(e, `${data.label} Comparable 3`);
                          }}
                          className="customer-desc"
                        />
                      ) : (
                        <div className="down-arrow " style={{ width: "90%" }}>
                          {pdfDisabled ? (
                            <div
                              style={{
                                width: "100%",
                                height: "32px",
                                textAlign: "right",
                              }}
                              className="customer-desc"
                            >
                              {input[`${data.label} Comparable 3`]}
                            </div>
                          ) : (
                            <select
                              value={input[`${data.label} Comparable 3`]}
                              onChange={(e) => {
                                onInputChange(
                                  e,
                                  `${data.label} Comparable 3`,
                                  false,
                                );
                              }}
                              className="customer-desc"
                              style={{ width: "100%" }}
                            >
                              {!!dataSource[data.label] &&
                                dataSource[data.label].map((md) => {
                                  return (
                                    <option value={md.label} label={md.label} />
                                  );
                                })}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ justifyContent: "center", display: "" }}>
          <div style={{ width: "45%" }}>
            <div>
              <div
                style={{ height: 30 }}
                className="site-vist sitrepot branch-container"
              >
                <h3> Comparables </h3>
              </div>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">
                {"Comparable 1 (INR per sqft)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(datMemo.price_comparable1.toFixed(2))
                    ? "0.00"
                    : Number(datMemo.price_comparable1).toLocaleString(
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
              <label className="customer-title">
                {"Comparable 2 (INR per sqft)"}
              </label>
              <input
                type="text"
                value={
                  isNaN(datMemo.price_comparable2.toFixed(2))
                    ? "0.00"
                    : Number(datMemo.price_comparable2).toLocaleString(
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
            {isAdded && (
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Comparable 3 (INR per sqft)"}
                </label>
                <input
                  type="text"
                  value={
                    isNaN(datMemo.price_comparable3.toFixed(2))
                      ? "0.00"
                      : Number(datMemo.price_comparable3).toLocaleString(
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
            )}
          </div>
          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Output </h3>
          </div>
          <div className="output_result">
            <div style={{ width: "35%" }}>
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Average cost per sft (INR)"}
                </label>
                <input
                  type="text"
                  value={
                    isNaN(datMemo.averageCost.toFixed(2))
                      ? "0.00"
                      : Number(datMemo.averageCost).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                  className="customer-desc"
                  style={{
                    backgroundColor: "lightgrey",
                  }}
                  disabled={true}
                />
              </div>
              <div style={{ width: "100%" }} className="customer-details-sec">
                <label className="customer-title">
                  {"Valuation of the property (INR)"}
                </label>
                <input
                  type="text"
                  value={
                    isNaN(datMemo.propertyValue.toFixed(2))
                      ? "0.00"
                      : Number(datMemo.propertyValue).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                  className="customer-desc"
                  style={{
                    backgroundColor: "lightgrey",
                  }}
                  disabled={true}
                />
              </div>
            </div>

            <div style={{ width: "60%" }}>
              <div
                style={{ width: "100%", justifyContent: "right" }}
                className="customer-details-sec"
              >
                {toWords.convert(
                  isNaN(Number(datMemo.averageCost)) ||
                    !isFinite(datMemo.averageCost)
                    ? "0"
                    : datMemo.averageCost,
                )}
              </div>
              <div
                style={{ width: "100%", justifyContent: "right" }}
                className="customer-details-sec"
              >
                {toWords.convert(
                  isNaN(Number(datMemo.propertyValue)) ||
                    !isFinite(datMemo.propertyValue)
                    ? "0"
                    : datMemo.propertyValue,
                )}
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PremiumDiscount);
