import React, { useRef, useEffect, useMemo, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { PDFExport } from "@progress/kendo-react-pdf";
import { bindActionCreators } from "redux";
import { stateUser } from "../../action/getState";
import { cityUser } from "../../action/getCity";
import { _getStorageValue } from "../../comman/localStorage";
import { connect } from "react-redux";
import { getCalculatorCity, getCalculatorState, getCalculatorSuggested, getCalculatorTable } from "../../action/searchHistory";
import { ToWords } from 'to-words';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

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
}


let apiResData = {
  "ancillary_area_charges": Number("10"),
  "approving_authority": "MCGM",
  "architect_fees_other_approval_charges": Number("12"),
  "builder_profit": Number("20"),
  "contingencies": Number("5"),
  "cost_of_funds_interest_per_annum_3yrs": Number("10.5"),
  "crz": Number("75"),
  "development_charges_commercial_component": Number("8"),
  "development_charges_open_plot": Number("1"),
  "development_charges_residential_component": Number("4"),
  "edc_idc_charges": null,
  "environmental_clearance": Number("200"),
  "fungible_area_charges": Number("50"),
  "labour_cess": Number("1"),
  "marketing_expenses_legal_admin_charges": Number("5"),
  "paid_tdr_fsi_expenses": null,
  "premium_area_charges": Number("50"),
  "scrutiny_other_nocs": Number("300"),
  "staircase_area_charges": Number("25"),
  "state": "Maharastra",
  "tdr": Number("60")
}

const rateList = [{
  label: "Rate / Sq.Ft",
  value: "sqft"

}, {
  label: "Rate / Mtr",
  value: "mtr"
}]

const selectField = "selectField";
const inputField = "inputField"


const propertyinformationData = [
  { type: inputField, label: "Property Name", value: "" },
  { type: inputField, label: "Address", value: "" },
  { type: selectField, label: "Type of model", options: ["Sale", "Lease"], value: "" },
  { type: selectField, label: "Class", options: ["A", "B", "C", "D"], value: "" },
  { type: inputField, label: "Project Commencement", value: "" },
  { type: inputField, label: "Project Completion", value: "" },
  { type: inputField, label: "No of Blocks", value: "" },
  { type: inputField, label: "No of Units", value: "" },
  { type: selectField, label: "Type of Construction", options: ["Conventional", "Mivan/Aluminium"], value: "" },
  { type: inputField, label: "Total BUA(FSI + Non FSI)", value: "" },
  { type: inputField, label: "Leasable Area", value: "" },
  { type: inputField, label: "FSI", value: "" },
  { type: inputField, label: "Property scores", value: "" },
];

const financialAssesmentData = [
  { type: inputField, label: "Exit Cap Rate (TY)", value: "" },
  { type: inputField, label: "Debt Share", value: "" },
  { type: inputField, label: "Debt Rate", value: "" },
  { type: inputField, label: "Equity Share", value: "" },
  { type: inputField, label: "Equity Rate", value: "" },
  { type: inputField, label: "WACC", value: "", isDisabled: true },
  { type: inputField, label: "Terminal Year ", value: "" },
]


const salesAssumptionData = [
  { type: inputField, label: "Carpet Area/SBUA (Sold) - Residential", value: "" },
  { type: inputField, label: "Carpet Area/SBUA (Unsold) - Residential", value: "", isDisabled: true },
  { type: inputField, label: "Averge Sale Price (as on date) - Residentiale", value: "" },

  { type: inputField, label: "Carpet Area/SBUA(Sold) - Retail", value: "" },
  { type: inputField, label: "Carpet Area/SBUA (Unsold) - Retail", value: "", isDisabled: true },
  { type: inputField, label: "Averge Sale Price (as on date) - Retail", value: "" },

  { type: inputField, label: "Carpet Area/SBUA (Sold) - Office", value: "" },
  { type: inputField, label: "Carpet Area/SBUA(Unsold) - Office", value: "", isDisabled: true },
  { type: inputField, label: "Averge Sale Price (as on date) - Office", value: "" },
];

const leaseAssumptionData = [
  { type: "inputField", label: "Lease (or) Rent per sft - Retail", value: "" },
  { type: "inputField", label: "Lease (or) Rent Start Year - Retail", value: "" },
  { type: "inputField", label: "Lease (or) Rent per sft - Office", value: "" },
  { type: "inputField", label: "Lease (or) Rent Start Year - Office", value: "" },
  { type: "inputField", label: "No of Parkings", value: "" },
  { type: "inputField", label: "Rent per Car Park", value: "" },
  { type: "inputField", label: "Property Tax (in terms of revenue)", value: "" },
  { type: "inputField", label: "Occupancy Rate", value: "" },
  { type: "inputField", label: "CAM Charges (per sft)", value: "" },
  { type: "inputField", label: "Profit % on CAM", value: "" },
  { type: "inputField", label: "Rent Escalation - Retail", value: "" },
  { type: "inputField", label: "Rent Escalation - Office", value: "" },
  { type: "inputField", label: "Inflation", value: "" }
];


const expensesAssumptionData = [
  { type: inputField, label: "Construction Cost (per sft) - Residential", value: "" },
  { type: inputField, label: "Construction Cost (per sft) - Retail", value: "" },
  { type: inputField, label: "Construction Cost (per sft)-  Office", value: "" },
];



function generateEconomicYears() {
  // let 
  const currentYear = new Date().getFullYear() - 1; // Get the current year
  const results = [];

  for (let i = 1; i <= 20; i++) {
    for (let j = 0; j < 4; j++) {
      const fraction = (i + (j * 0.25)).toFixed(2); // quarter increments (0.00, 0.25, 0.50, 0.75)
      const economicYear = currentYear + Math.floor(i); // calculate year based on i
      // console.log("Math.floor(i)",fraction, i)
      results.push({
        actualyear: economicYear,
        year: "Y",
        quarter: `${j + 1}`,
        "Projected Sale (BUA) - Residential": "",
        "Initial (%) - Residential": "",
        "Unsold Area - Sale Projection (%)": "",
        "Unsold Area - Sale Projection": "",
        "Average sale rate": "",
        "Residential": "",
        "Projected Sale (BUA) - Retail": "",
        "Initial (%) - Retail": "",
        "Unsold Area - Sale Projection (%) - Retail": "",
        "Unsold Area - Sale Projection - Retail": "",
        "Average sale rate - Retail": "",
        "Retail": "",
        "Projected Sale (BUA) - Office": "",
        "Initial (%) - Office": "",
        "Unsold Area - Sale Projection (%) - Office": "",
        "Unsold Area - Sale Projection - Office": "",
        "Average sale rate - Office": "",
        "Office": ""
      });
    }
  }
  return results;
}

function generateEconomicYearsConstriction() {
  // let 
  const currentYear = new Date().getFullYear() - 1; // Get the current year
  const results = [];

  for (let i = 1; i <= 20; i++) {
    for (let j = 0; j < 4; j++) {
      const fraction = (j * 0.25).toFixed(2); // quarter increments (0.00, 0.25, 0.50, 0.75)
      const economicYear = currentYear + Math.floor(i); // calculate year based on i
      results.push({
        actualyear: economicYear,
        year: "Y",
        quarter: `${j + 1}`,
        "Residential": "",
        "Residential %": "",

        "Commercial": "",
        "Commercial %": "",

        "Office": "",
        "Office %": "",

        "Approval Charges": "",
        "Approval Charges %": "",

        "TDR & Other Charges": "",
        "TDR & Other Charges %": "",

        "Marketing expense, legal & admin charges": "",
        "Marketing expense, legal & admin charges %": "",

        "EDC/IDC Charges": "",
        "EDC/IDC Charges %": "",

        "Scrutiny & Other NOC": "",
        "Scrutiny & Other NOC %": "",

        "Development Charges on Open Plot": "",
        "Development Charges on Open Plot %": "",

        "Development Charges on Residential component": "",
        "Development Charges on Residential component %": "",

        "Development Charges on Commercial component": "",
        "Development Charges on Commercial component %": "",

        "Premium FSI": "",
        "Premium FSI %": "",

        "Labour cess": "",
        "Labour cess %": "",

        "Non FSI construction": "",
        "Non FSI construction %": "",

        "Environmental Clearance": "",
        "Environmental Clearance %": "",

        "CRZ": "",
        "CRZ %": "",

        "Ancillary area charges": "",
        "Ancillary area charges %": "",

        "Fungible area charges": "",
        "Fungible area charges %": "",

      });
    }
  }
  return results;
}

const comparekeys = {
  "Ancillary area charges": "ancillary_area_charges",
  "Premium FSI": "premium_area_charges",
  "Approval Charges": "architect_fees_other_approval_charges",
  "TDR & Other Charges": "tdr",
  "Marketing expense, legal & admin charges": "marketing_expenses_legal_admin_charges",
  "EDC/IDC Charges": "edc_idc_charges",
  "Scrutiny & Other NOC": "scrutiny_other_nocs",
  "Development Charges on Open Plot": "development_charges_open_plot",
  "Development Charges on Residential component": "development_charges_residential_component",
  "Development Charges on Commercial component": "development_charges_commercial_component",
  "Labour cess": "labour_cess",
  "Non FSI construction": "",
  "Environmental Clearance": "environmental_clearance",
  "CRZ": "crz",
  "Fungible area charges": "fungible_area_charges",
}


function generateLeaseData() {
  // let 
  const currentYear = new Date().getFullYear() - 1; // Get the current year
  const results = [];

  for (let i = 1; i <= 20; i++) {
    for (let j = 0; j < 4; j++) {
      const fraction = (j * 0.25).toFixed(2); // quarter increments (0.00, 0.25, 0.50, 0.75)
      const economicYear = currentYear + Math.floor(i); // calculate year based on i
      results.push({
        actualyear: economicYear,
        year: "Y",
        quarter: `${j + 1}`,
        "Average Lease - Retail": "",
        "Phasing - Retail": "",
        "Average Lease - Office": "",
        "Phasing - Office": "",
        "Rental Income - Retail": "",
        "Rental Income - Office": "",
        "Revenue on Car Parking": "",
        "Profit on CAM": "",
        "Property Tax": "",
        "Total Income": "",
      });
    }
  }
  return results;
}



const economicYearData = generateEconomicYears();

const constructionData = generateEconomicYearsConstriction();

const leaseData = generateLeaseData();

const inputArr = [
  { label: "Year", value: "Year" },
  { label: "Projected Sale (BUA) - Residential", value: "Projected Sale (BUA) - Residential" },
  { label: "Initial (%)", value: "Initial (%) - Residential" },
  { label: "Unsold Area - Sale Projection (%)", value: "Unsold Area - Sale Projection (%)" },
  { label: "Unsold Area - Sale Projection", value: "Unsold Area - Sale Projection" },
  { label: "Average sale rate", value: "Average sale rate" },
  { label: "Residential", value: "Residential" },

  { label: "Projected Sale (BUA) - Retail", value: "Projected Sale (BUA) - Retail" },
  { label: "Initial (%)", value: "Initial (%) - Retail" },
  { label: "Unsold Area - Sale Projection (%)", value: "Unsold Area - Sale Projection (%) - Retail" },
  { label: "Unsold Area - Sale Projection", value: "Unsold Area - Sale Projection - Retail" },
  { label: "Average sale rate", value: "Average sale rate - Retail" },
  { label: "Retail", value: "Retail" },

  { label: "Projected Sale (BUA) - Office", value: "Projected Sale (BUA) - Office" },
  { label: "Initial (%)", value: "Initial (%) - Office" },
  { label: "Unsold Area - Sale Projection (%)", value: "Unsold Area - Sale Projection (%) - Office" },
  { label: "Unsold Area - Sale Projection", value: "Unsold Area - Sale Projection - Office" },
  { label: "Average sale rate", value: "Average sale rate - Office" },
  { label: "Office", value: "Office" },
];

const constructionInputArr = [
  { label: "Year", value: "Year" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Office", value: "Office" },
  { label: "Approval Charges", value: "Approval Charges" },
  { label: "TDR & Other Charges", value: "TDR & Other Charges" },
  { label: "Marketing expense, legal & admin charges", value: "Marketing expense, legal & admin charges" },
  { label: "EDC/IDC Charges", value: "EDC/IDC Charges" },
  { label: "Scrutiny & Other NOC", value: "Scrutiny & Other NOC" },
  { label: "Development Charges on Open Plot", value: "Development Charges on Open Plot" },
  { label: "Development Charges on Residential component", value: "Development Charges on Residential component" },
  { label: "Development Charges on Commercial component", value: "Development Charges on Commercial component" },
  { label: "Premium FSI", value: "Premium FSI" },
  { label: "Labour cess", value: "Labour cess" },
  { label: "Non FSI construction", value: "Non FSI construction" },
  { label: "Environmental Clearance", value: "Environmental Clearance" },
  { label: "CRZ", value: "CRZ" },
  { label: "Ancillary area charges", value: "Ancillary area charges" },
  { label: "Fungible area charges", value: "Fungible area charges" },
];

const IncomeInputArr = [
  { label: "Year", value: "Year" },
  { label: "Income from sales - Residential", value: "Income from sales - Residential" },
  { label: "Income from sales - Retail", value: "Income from sales - Retail" },
  { label: "Income from sales - Office", value: "Income from sales - Office" },
  { label: "Total Income", value: "Total Income" },
];

const ExpensesInputArr = [
  { label: "Year", value: "Year" },
  { label: "Construction Cost - Residential", value: "Construction Cost - Residential" },
  { label: "Construction Cost - Retail", value: "Construction Cost - Retail" },
  { label: "Construction Cost - Office", value: "Construction Cost - Office" },
  { label: "Approval Charges", value: "Approval Charges" },
  { label: "TDR & Other Charges", value: "TDR & Other Charges" },
  { label: "Marketing expense, legal & admin charges", value: "Marketing expense, legal & admin charges" },
  { label: "EDC/IDC Charges", value: "EDC/IDC Charges" },
  { label: "Scrutiny & Other NOC", value: "Scrutiny & Other NOC" },
  { label: "Development Charges on Open Plot", value: "Development Charges on Open Plot" },
  { label: "Development Charges on Residential component", value: "Development Charges on Residential component" },
  { label: "Development Charges on Commercial component", value: "Development Charges on Commercial component" },
  { label: "Premium FSI", value: "Premium FSI" },
  { label: "Labour cess", value: "Labour cess" },
  { label: "Non FSI construction", value: "Non FSI construction" },
  { label: "Environmental Clearance", value: "Environmental Clearance" },
  { label: "CRZ", value: "CRZ" },
  { label: "Ancillary area charges", value: "Ancillary area charges" },
  { label: "Fungible area charges", value: "Fungible area charges" },
  { label: "Total Expenses", value: "Total Expenses" },
  { label: "Net Operating Income", value: "Net Operating Income" },
  { label: "Net Cash Flows", value: "Net Cash Flows" },
  { label: "Project Cash Flows", value: "Project Cash Flows" },
  { label: "Discount Factor", value: "Discount Factor" },
  { label: "Present Rate", value: "Present Rate" }
];

const cashflowInputArr = [
  { label: "Year", value: "Year" },
  { label: "Construction Cost - Residential", value: "Construction Cost - Residential" },
  { label: "Construction Cost - Retail", value: "Construction Cost - Retail" },
  { label: "Construction Cost - Office", value: "Construction Cost - Office" },
  { label: "Approval Charges", value: "Approval Charges" },
  { label: "TDR & Other Charges", value: "TDR & Other Charges" },
  { label: "Marketing expense, legal & admin charges", value: "Marketing expense, legal & admin charges" },
  { label: "EDC/IDC Charges", value: "EDC/IDC Charges" },
  { label: "Scrutiny & Other NOC", value: "Scrutiny & Other NOC" },
  { label: "Development Charges on Open Plot", value: "Development Charges on Open Plot" },
  { label: "Development Charges on Residential component", value: "Development Charges on Residential component" },
  { label: "Development Charges on Commercial component", value: "Development Charges on Commercial component" },
  { label: "Premium FSI", value: "Premium FSI" },
  { label: "Labour cess", value: "Labour cess" },
  { label: "Non FSI construction", value: "Non FSI construction" },
  { label: "Environmental Clearance", value: "Environmental Clearance" },
  { label: "CRZ", value: "CRZ" },
  { label: "Ancillary area charges", value: "Ancillary area charges" },
  { label: "Fungible area charges", value: "Fungible area charges" },
  { label: "Total Expenses", value: "Total Expenses" },
  { label: "Net Operating Income", value: "Net Operating Income" },
  { label: "Net Cash Flows", value: "Net Cash Flows" },
  { label: "Project Cash Flows", value: "Project Cash Flows" },
  // { label: "Terminal Value", value: "Terminal Value" },
  { label: "Project Cash Flows inc TV", value: "Project Cash Flows inc TV" },
  { label: "Discount Factor", value: "Discount Factor" },
  { label: "Present Rate", value: "Present Rate" }
];


const IncomeCashflowArr = [
  { label: "Year", value: "Year" },
  { label: "Average Lease - Retail", value: "Average Lease - Retail" },
  { label: "Phasing - Retail", value: "Phasing - Retail" },
  { label: "Average Lease - Office", value: "Average Lease - Office" },
  { label: "Phasing - Office", value: "Phasing - Office" },
  { label: "Rental Income - Retail", value: "Rental Income - Retail" },
  { label: "Rental Income - Office", value: "Rental Income - Office" },
  { label: "Revenue on Car Parking", value: "Revenue on Car Parking" },
  { label: "Profit on CAM", value: "Profit on CAM" },
  { label: "Property Tax", value: "Property Tax" },
  { label: "Total Income", value: "Total Income" },
];


const DCF = (props) => {

  const [input, setInput] = useState(inputData);

  const [propertyinformation, setPropertyInformation] = useState(propertyinformationData);

  const [financial, setFinancial] = useState(financialAssesmentData);



  const [stateVale, selectedStateVale] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [cityList, setCityList] = useState([]);
  const [show, setShow] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [authorityValue, setAuthorityValue] = useState([]);
  const [authorityList, setAuthorityList] = useState([]);
  const [TypeOfCashFlow, setTypeOfCashFlow] = useState("Sale");

  const [apiRes, setApiRes] = useState(apiResData);
  const [isDisabled, setDisabled] = useState(true);
  const [suggestedData, setSuggestedData] = useState({});
  const [rateUnit, setRateUnit] = useState("sqft");
  const [pdfDisabled, setPdfDisabled] = useState(false);
  const [residentials, setResidentials] = useState([{ label: "Block1", value: "" }]);
  const [retails, setRetails] = useState([{ label: "Block1", value: "" }]);
  const [office, setOffice] = useState([{ label: "Block1", value: "" }]);
  const [leasableOffice, setLeasableOffice] = useState(0);
  const [leasableRetail, setLeasableRetail] = useState(0);

  const [areaStatements, setAreaStatments] = useState(false);

  const [salesAssumption, setSaleAssumption] = useState(salesAssumptionData);
  // leaseAssumptionData

  const [leaseAssumption, setLeaseAssemption] = useState(leaseAssumptionData);

  const [expensesAssumption, setExpensesssumption] = useState(expensesAssumptionData);

  const [incomePhasing, setIncomeFacing] = useState(economicYearData);

  const [constructionExpenses, setConstructionExpenses] = useState(constructionData);

  const [cashflowIncomeData, setCashflowIncomeData] = useState(leaseData);


  const incomePhasingTotal = useMemo(() => {

    let incomeSale = incomePhasing.map((md) => {
      return ({
        year: md.year, quarter: md.quarter,
        "Income from sales - Residential": md["Residential"],
        "Income from sales - Retail": md["Retail"],
        "Income from sales - Office": md["Office"],
        "Total Income": (Number(md["Residential"]) + Number(md["Retail"]) + Number(md["Office"])).toFixed(2)
      })
    });

    return incomeSale;

  }, [incomePhasing])


  const expensesTotal = useMemo(() => {
    let expenseSale = constructionExpenses.map((md, index) => {
      let toltalExpenses = (Number(md["Residential"] ?? 0) + Number(md["Retail"] ?? 0) + Number(md["Office"] ?? 0) + Number(md["Approval Charges"] ?? 0) +
        Number(md["TDR & Other Charges"] ?? 0) +
        + Number(md["Marketing expense, legal & admin charges"] ?? 0)
        + Number(md["EDC/IDC Charges"] ?? 0)
        + Number(md["Scrutiny & Other NOC"] ?? 0)
        + Number(md["Development Charges on Open Plot"] ?? 0)
        + Number(md["Development Charges on Residential component"] ?? 0)
        + Number(md["Development Charges on Commercial component"] ?? 0)
        + Number(md["Premium FSI"] ?? 0)
        + Number(md["Labour cess"] ?? 0)
        + Number(md["Non FSI construction"] ?? 0)
        + Number(md["Environmental Clearance"] ?? 0)
        + Number(md["CRZ"] ?? 0)
        + Number(md["Ancillary area charges"] ?? 0)
        + Number(md["Fungible area charges"] ?? 0))

      let netopertaionIncome = incomePhasingTotal.filter((_, i) => i == index)[0]["Total Income"] - toltalExpenses;
      let discountFacotr = ((1 / (1 + financial[5].value)) / md["quarter"]).toFixed(2);
      let presentRate = (netopertaionIncome - discountFacotr).toFixed(2);;

      return ({
        year: md.year, quarter: md.quarter,
        "Construction Cost - Residential": md["Residential"],
        "Construction Cost - Retail": md["Retail"],
        "Construction Cost - Office": md["Office"],
        "Approval Charges": md["Approval Charges"],
        "TDR & Other Charges": md["TDR & Other Charges"],
        "Marketing expense, legal & admin charges": md["Marketing expense, legal & admin charges"],
        "EDC/IDC Charges": md["EDC/IDC Charges"],
        "Scrutiny & Other NOC": md["Scrutiny & Other NOC"],
        "Development Charges on Open Plot": md["Development Charges on Open Plot"],
        "Development Charges on Residential component": md["Development Charges on Residential component"],
        "Development Charges on Commercial component": md["Development Charges on Commercial component"],
        "Premium FSI": md["Premium FSI"],
        "Labour cess": md["Labour cess"],
        "Non FSI construction": md["Non FSI construction"],
        "Environmental Clearance": md["Environmental Clearance"],
        "CRZ": md["CRZ"],
        "Ancillary area charges": md["Ancillary area charges"],
        "Fungible area charges": md["Fungible area charges"],
        "Total Expenses": toltalExpenses,
        "Net Operating Income": netopertaionIncome,
        "Net Cash Flows": netopertaionIncome,
        "Project Cash Flows": netopertaionIncome,
        "Discount Factor": discountFacotr,
        "Present Rate": presentRate
      })
    });
    return expenseSale;

  }, [constructionExpenses, incomePhasingTotal])


  const incomeLeaseTotal = useMemo(() => {

    let expenseSale = cashflowIncomeData.map((md, index) => {
      if (!!leaseAssumption[3].value && (leaseAssumption[3].value * 4 < index)) {
        let rentalIcomeRetail = (Number(leaseAssumption[0].value)) + ((1 + (Number(leaseAssumption[10].value) / 100)) / 4) * leasableRetail / 1000000;
        let rentalIcomeOffice = ((Number(leaseAssumption[3].value)) * 90 / 100 * leasableOffice / 1000000).toFixed(2);
        let revenueCarParking = (((Number(leaseAssumption[4].value)) * Number(leaseAssumption[5].value) * (Number(leaseAssumption[2].value)) + (1 + (Number(leaseAssumption[11].value) / 100)) / 4) / 1000000).toFixed(2);
        let profitOnCam = ((leasableOffice + leasableRetail * (Number(leaseAssumption[8].value) * Number(leaseAssumption[9].value))) / 1000000).toFixed(2);
        let propertyTax = (((Number(leaseAssumption[0].value)) + ((1 + (Number(leaseAssumption[10].value) / 100)) / 4) * leasableRetail / 1000000) + ((Number(leaseAssumption[3].value)) * 90 / 100 * leasableOffice / 1000000) * leaseAssumption[6].value).toFixed(2);
        let totalIncome = (rentalIcomeRetail + rentalIcomeOffice + revenueCarParking + profitOnCam - propertyTax).toFixed(2);
        return ({
          year: md.year, quarter: md.quarter,
          "Average Lease - Retail": (Number(leaseAssumption[0].value)) + ((1 + (Number(leaseAssumption[10].value) / 100)) / 4),
          "Phasing - Retail": (Number(leaseAssumption[1].value)) * 90 / 100,
          "Average Lease - Office": (Number(leaseAssumption[2].value)) + (1 + (Number(leaseAssumption[11].value) / 100)) / 4,
          "Phasing - Office": (Number(leaseAssumption[3].value)) * 90 / 100,

          "Rental Income - Retail": rentalIcomeRetail,
          "Rental Income - Office": rentalIcomeOffice,
          "Revenue on Car Parking": revenueCarParking,
          "Profit on CAM": profitOnCam,
          "Property Tax": propertyTax,
          "Total Income": totalIncome,
        })
      } else {
        return ({
          year: md.year, quarter: md.quarter,
          "Average Lease - Retail": 0,
          "Phasing - Retail": 0,
          "Average Lease - Office": 0,
          "Phasing - Office": 0,
          "Rental Income - Retail": 0,
          "Rental Income - Office": 0,
          "Revenue on Car Parking": 0,
          "Profit on CAM": 0,
          "Property Tax": 0,
          "Total Income": 0,
        })
      }


    });
    return expenseSale;

  }, [leaseAssumption])

  const cashFlowExpensesTotal = useMemo(() => {
    let expenseSale = constructionExpenses.map((md, index) => {
      let toltalExpenses = (Number(md["Residential"] ?? 0) + Number(md["Retail"] ?? 0) + Number(md["Office"] ?? 0) + Number(md["Approval Charges"] ?? 0) +
        Number(md["TDR & Other Charges"] ?? 0) +
        + Number(md["Marketing expense, legal & admin charges"] ?? 0)
        + Number(md["EDC/IDC Charges"] ?? 0)
        + Number(md["Scrutiny & Other NOC"] ?? 0)
        + Number(md["Development Charges on Open Plot"] ?? 0)
        + Number(md["Development Charges on Residential component"] ?? 0)
        + Number(md["Development Charges on Commercial component"] ?? 0)
        + Number(md["Premium FSI"] ?? 0)
        + Number(md["Labour cess"] ?? 0)
        + Number(md["Non FSI construction"] ?? 0)
        + Number(md["Environmental Clearance"] ?? 0)
        + Number(md["CRZ"] ?? 0)
        + Number(md["Ancillary area charges"] ?? 0)
        + Number(md["Fungible area charges"] ?? 0))

      let netopertaionIncome = incomeLeaseTotal.filter((_, i) => i == index)[0]["Total Income"] - toltalExpenses;
      let discountFacotr = ((1 / (1 + financial[5].value)) / md["quarter"]).toFixed(2);
      let presentRate = (netopertaionIncome - discountFacotr).toFixed(2);;

      return ({
        year: md.year, quarter: md.quarter,
        "Construction Cost - Residential": md["Residential"],
        "Construction Cost - Retail": md["Retail"],
        "Construction Cost - Office": md["Office"],
        "Approval Charges": md["Approval Charges"],
        "TDR & Other Charges": md["TDR & Other Charges"],
        "Marketing expense, legal & admin charges": md["Marketing expense, legal & admin charges"],
        "EDC/IDC Charges": md["EDC/IDC Charges"],
        "Scrutiny & Other NOC": md["Scrutiny & Other NOC"],
        "Development Charges on Open Plot": md["Development Charges on Open Plot"],
        "Development Charges on Residential component": md["Development Charges on Residential component"],
        "Development Charges on Commercial component": md["Development Charges on Commercial component"],
        "Premium FSI": md["Premium FSI"],
        "Labour cess": md["Labour cess"],
        "Non FSI construction": md["Non FSI construction"],
        "Environmental Clearance": md["Environmental Clearance"],
        "CRZ": md["CRZ"],
        "Ancillary area charges": md["Ancillary area charges"],
        "Fungible area charges": md["Fungible area charges"],
        "Total Expenses": toltalExpenses,
        "Net Operating Income": netopertaionIncome,
        "Net Cash Flows": netopertaionIncome,
        "Project Cash Flows": netopertaionIncome,
        "Project Cash Flows inc TV": netopertaionIncome,
        "Discount Factor": discountFacotr,
        "Present Rate": presentRate
      })
    });
    return expenseSale;

  }, [constructionExpenses, incomePhasingTotal])



  useEffect(() => {
    //Tocalculate first column of phase income 
    let checkList = ["Carpet Area/SBUA (Sold) - Office", "Carpet Area/SBUA(Sold) - Retail", "Carpet Area/SBUA (Sold) - Residential"];
    let hasValue = salesAssumption.filter(fd => checkList.includes(fd.label) && fd.value > 0);
    if (hasValue.length > 0) {
      let firstElement = {
        ...incomePhasing[0],
        "Projected Sale (BUA) - Residential": salesAssumption[0].value,
        "Initial (%) - Residential": Math.round((Number(salesAssumption[0].value) / Number(residentialTotal)) * 100),
        "Unsold Area - Sale Projection (%)": "",
        "Unsold Area - Sale Projection": "",
        "Average sale rate": salesAssumption[2].value,
        "Residential": (salesAssumption[0].value * salesAssumption[2].value) / 1000000,
        "Projected Sale (BUA) - Retail": salesAssumption[3].value,
        "Initial (%) - Retail": Math.round((Number(salesAssumption[3].value) / Number(retailTotal)) * 100),
        "Unsold Area - Sale Projection (%) - Retail": "",
        "Unsold Area - Sale Projection - Retail": "",
        "Average sale rate - Retail": salesAssumption[5].value,
        "Retail": (salesAssumption[3].value * salesAssumption[5].value) / 1000000,
        "Projected Sale (BUA) - Office": salesAssumption[6].value,
        "Initial (%) - Office": Math.round((Number(salesAssumption[6].value) / Number(officeTotal)) * 100),
        "Unsold Area - Sale Projection (%) - Office": "",
        "Unsold Area - Sale Projection - Office": "",
        "Average sale rate - Office": salesAssumption[8].value,
        "Office": (salesAssumption[6].value * salesAssumption[8].value) / 1000000,
        "avg": (Math.round((Number(salesAssumption[0].value) / Number(residentialTotal)) * 100) + Math.round((Number(salesAssumption[3].value) / Number(retailTotal)) * 100) + Math.round((Number(salesAssumption[6].value) / Number(officeTotal)) * 100)) / 3
      };

      let updatedincomingPhase = incomePhasing.map((md, index) => {
        if (index == 0) {
          return firstElement;
        } else return md
      })
      let initComparision = updatedincomingPhase[0].actualyear;
      let tempAvgResident = updatedincomingPhase[0]["Average sale rate"];
      let tempAvgRetail = updatedincomingPhase[0]["Average sale rate - Retail"];
      let tempAvgOffice = updatedincomingPhase[0]["Average sale rate - Office"];
      updatedincomingPhase = updatedincomingPhase.map((mData) => {
        let updatedValue = mData;
        if (initComparision !== mData.actualyear) {
          initComparision = mData.actualyear;
          tempAvgResident = Math.round(tempAvgResident * 1.15);
          tempAvgRetail = Math.round(tempAvgRetail * 1.2);
          tempAvgOffice = Math.round(tempAvgOffice * 1.15);
          updatedValue = { ...updatedValue, "Average sale rate": tempAvgResident, "Average sale rate - Retail": tempAvgRetail, "Average sale rate - Office": tempAvgOffice, }
        } else {
          updatedValue = { ...updatedValue, "Average sale rate": tempAvgResident, "Average sale rate - Retail": tempAvgRetail, "Average sale rate - Office": tempAvgOffice, }
        }
        return updatedValue
      })
      setIncomeFacing(updatedincomingPhase)
    }
  }, [salesAssumption])



  useEffect(() => {
    _getStorageValue("USER_ID").then((userId) => {
      props.getCalculatorState(userId, "", onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      let states = response.data.map(md => ({ name: md.state }))
      setStateList(states)
    };
    const onFailure = (response) => {
      setStateList([])
    };
  }, []);

  useEffect(() => {
    _getStorageValue("USER_ID").then((userId) => {
      props.getCalculatorCity(userId, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      let states = response.data.map(md => ({ name: md.city }))
      setCityList(states)
    };
    const onFailure = (response) => {
      setCityList([])
    };
  }, []);

  const onStateSelect = (e) => {
    selectedStateVale(e.target.value);
    let value = e.target.value;
    if (!!value) {
      _getStorageValue("USER_ID").then((userId) => {
        props.getCalculatorState(userId, `state=${value}`, onSuccess, onFailure);
      });
      const onSuccess = (response) => {
        let authorityListdata = response.data.map(md => ({ name: md.approving_authority })).filter(fd => fd.name !== null);

        setAuthorityList(authorityListdata);
      };
      const onFailure = (response) => {
        setAuthorityList([])
      };
    }
  }

  const getTableValue = () => {
    _getStorageValue("USER_ID").then((userId) => {
      let urlValues = `state=${stateVale}`
      if (authorityList.length && !!authorityValue) {
        urlValues = `approving_authority=${authorityValue}&state=${stateVale}`
      }
      props.getCalculatorTable(userId, `${urlValues}`, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      setApiRes(response.data[0])
      setDisabled(false)
    };
    const onFailure = () => {
      setApiRes(apiResData)
      setDisabled(false)
    };
  }

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
    setInput(inputData)
    setApiRes(apiResData);
  }

  const onCitySelect = (e) => {
    setCityValue(e.target.value);
    let value = e.target.value
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
  }

  const reSetConstruction = () => {
    let data = { ...input, "construction area Commercial": "", "construction area Residential": "", "construction area Retail": "", "construction area Non FSI Area": "" }
    setInput(data)
  }

  const pdfExportComponent = useRef(null);

  const exportPDFWithComponent = () => {
    props.onDownload("DCF");
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


  const onChangeInput = (e, key) => {
    let inputValue = e.target.value;
    let outputData = propertyinformation.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setPropertyInformation(outputData);
  };


  const onChangeFinancialData = (e, key) => {
    let inputValue = e.target.value;
    let outputData = financial.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    outputData = outputData.map((md, index) => {
      if (md.label === "WACC") {
        return { ...md, value: (((outputData[1].value * outputData[2].value) + (outputData[3].value * outputData[4].value)) / 100).toFixed(2) };
      } else {
        return md;
      }
    });
    console.log("outputData", outputData);

    setFinancial(outputData);
  };

  const onChangeResidential = (e, key) => {
    let inputValue = e.target.value;
    let outputData = residentials.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setResidentials(outputData);
  };

  const onChangeRetail = (e, key) => {
    let inputValue = e.target.value;
    let outputData = retails.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setRetails(outputData);
  };

  const onChangeOffice = (e, key) => {
    let inputValue = e.target.value;
    let outputData = office.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setOffice(outputData);
  };

  const residentialTotal = useMemo(() => {
    let total = residentials.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue.value || "0"),
      0,
    );
    return total || 0;
  }, [residentials])

  const retailTotal = useMemo(() => {
    let total = retails.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue.value || "0"),
      0,
    );
    return total || 0;
  }, [retails])


  const officeTotal = useMemo(() => {
    let total = office.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue.value || "0"),
      0,
    );
    return total || 0;
  }, [office])

  const onChangeSalesAssumption = (e, key) => {
    let inputValue = e.target.value;

    let outputData = salesAssumption.map((md, index) => {
      if (md.label === "Carpet Area/SBUA (Unsold) - Residential" && key === "Carpet Area/SBUA (Sold) - Residential") {
        return ({ ...md, value: residentialTotal - inputValue })
      } else if (md.label === "Carpet Area/SBUA (Unsold) - Retail" && key == "Carpet Area/SBUA(Sold) - Retail") {
        return ({ ...md, value: retailTotal - inputValue })
      } else if (md.label === "Carpet Area/SBUA(Unsold) - Office" && key == "Carpet Area/SBUA (Sold) - Office") {
        return ({ ...md, value: officeTotal - inputValue })
      } else if (md.label === key) {
        return { ...md, value: inputValue };
      } return md
    });
    setSaleAssumption(outputData);
  };

  const onChangeLeaseAssumption = (e, key) => {
    let inputValue = e.target.value;
    let outputData = leaseAssumption.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } return md
    });
    setLeaseAssemption(outputData);
  };

  const onChangeExpensesAssumption = (e, key) => {
    let inputValue = e.target.value;
    let outputData = expensesAssumption.map((md, index) => {
      if (md.label === key) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setExpensesssumption(outputData);
  };


  useEffect(() => {
    let updatedSales = salesAssumption.map(md => {
      if (md.label === "Carpet Area/SBUA (Unsold) - Residential") {
        return ({ ...md, value: residentialTotal - salesAssumption[0].value })
      } else if (md.label === "Carpet Area/SBUA (Unsold) - Retail") {
        return ({ ...md, value: retailTotal - salesAssumption[3].value })
      } else if (md.label === "Carpet Area/SBUA(Unsold) - Office") {
        return ({ ...md, value: officeTotal - salesAssumption[6].value })
      } else return md
    })
    setSaleAssumption(updatedSales);

  }, [residentialTotal, retailTotal, officeTotal])


  useEffect(() => {
  }, [salesAssumption])

  console.log("retailTotal", retailTotal);
  const onChangeIncome = (e, key, index) => {
    if (key === "Unsold Area - Sale Projection (%)") {
      let updatedValue = incomePhasing.map((md, i) => {
        if (i === index) {
          console.log("unable", md["Average sale rate"])
          return ({ ...md, "Unsold Area - Sale Projection (%)": e, "Unsold Area - Sale Projection": (residentialTotal * Number(e)) / 100, "Residential": (md["Average sale rate"] * (residentialTotal * e / 100)) / 1000000 })
        } else {
          return md;
        }
      });
      setIncomeFacing(updatedValue);
    } else if (key == "Unsold Area - Sale Projection (%) - Retail") {
      let updatedValue = incomePhasing.map((md, i) => {
        if (i === index) {
          // Average sale rate - Retail
          console.log("Retail.....", (retailTotal * Number(e)) / 100)
          return ({ ...md, "Unsold Area - Sale Projection (%) - Retail": e, "Unsold Area - Sale Projection - Retail": (retailTotal * Number(e)) / 100, "Retail": (md["Average sale rate - Retail"] * Math.round((retailTotal * e) / 100)) / 1000000 })
        } else {
          return md;
        }
      });
      setIncomeFacing(updatedValue);
    } else if (key == "Unsold Area - Sale Projection (%) - Office") {
      let updatedValue = incomePhasing.map((md, i) => {
        if (i === index) {
          // Average sale rate - Office
          return ({ ...md, "Unsold Area - Sale Projection (%) - Office": e, "Unsold Area - Sale Projection - Office": Math.round((officeTotal * e) / 100), "Office": (md["Average sale rate - Office"] * Math.round((officeTotal * e) / 100)) / 1000000 });
        } else {
          return md;
        }
      });
      setIncomeFacing(updatedValue);
    }
  }

  const outputData = (key) => {
    let outputValue = incomePhasing.reduce((acc, data) => {
      let value = 0
      if (data[key] == "") {
        value = 0;
      } else {
        value = data[key];
      }
      return (Number(acc) + Number(value))
    }, 0);
    return outputValue
  }


  const onChangeConstruction = (e, key, index) => {
    if (key === "Residential %") {
      let updatedValue = constructionExpenses.map((md, i) => {
        if (i === index) {
          console.log("residentialTotal", (residentialTotal * e * Number(expensesAssumption[0].value) / 100000000))
          return ({ ...md, "Residential %": e, "Residential": (residentialTotal * e * Number(expensesAssumption[0].value) / 100000000).toFixed(1) });
        }
        else return md;
      }
      );
      setConstructionExpenses(updatedValue);
    } else if (key == "Commercial %") {
      let updatedValue = constructionExpenses.map((md, i) => {
        if (i === index) {
          return ({ ...md, "Commercial %": e, "Commercial": (retailTotal * e * Number(expensesAssumption[1].value) / 100000000).toFixed(1) })
        } else {
          return md;
        }
      });
      setConstructionExpenses(updatedValue);
    } else if (key == "Office %") {
      let updatedValue = constructionExpenses.map((md, i) => {
        if (i === index) {
          return ({ ...md, "Office %": e, "Office": (officeTotal * e * Number(expensesAssumption[2].value) / 100000000).toFixed(1) })
        } else {
          return md;
        }
      });
      setConstructionExpenses(updatedValue);
    }
    else {
      let removePercentage = key.replace("%", "").trim();
      console.log("removePercentage", removePercentage);
      let updatedValue = constructionExpenses.map((md, i) => {
        if (i === index) {
          return ({ ...md, [key]: e, [removePercentage]: ((retailTotal + retailTotal + officeTotal) * e * Number(apiRes[comparekeys[removePercentage]] || 0) / 100000000).toFixed(1) })
        } else {
          return md;
        }
      });
      setConstructionExpenses(updatedValue);
    }
  }


  const outputConstruction = (key) => {
    let outputValue = constructionExpenses.reduce((acc, data) => {
      let value = 0
      if (data[key] == "" || !!data[key] == false) {
        value = 0;
      } else {
        value = data[key];
      }

      return (Number(acc) + Number(value))
    }, 0);

    return isNaN(outputValue) ? 0 : outputValue
  }


  const npvValue = useMemo(() => {

    let totaNpv = 0;
    if (TypeOfCashFlow === "Sale") {
      totaNpv = expensesTotal.reduce((acc, data) => data["Total Expenses"] + acc, 0)
    } else {
      totaNpv = cashFlowExpensesTotal.reduce((acc, data) => data["Total Expenses"] + acc, 0)
    }
    console.log("totaNpv", totaNpv);
    return totaNpv;

  }, [cashFlowExpensesTotal, expensesTotal, TypeOfCashFlow])



  return (
    <>
      <PDFExport ref={pdfExportComponent} paperSize="A4" fileName="Residual_Calculator.pdf" scale={0.8}>
        <div className={pdfDisabled ? "pdf_full_page" : "calculations-container"}>
          <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
            <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
              <h3> Property Details </h3>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"State"}</label>
              <div className="down-arrow " style={{ width: "45%" }}>
                <select
                  value={stateVale}
                  onChange={(e) => {
                    onStateSelect(e);
                  }}
                  className="customer-desc"
                  style={{
                    width: "100%", backgroundColor: !isDisabled ? "lightgrey" : "transparent",
                    opacity: !isDisabled ? "0.5" : "1",
                  }}
                  disabled={!isDisabled}
                >
                  <option value="NaN" label="Select" />
                  {stateList.map((data, key) => {
                    return (
                      <option
                        key={key}
                        value={data.name}
                        label={data.name}
                      />
                    );
                  })}
                </select>
              </div>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Approving Authority"}</label>
              <div className="down-arrow" style={{ width: "45%" }}>
                <select
                  value={authorityValue}
                  onChange={(e) => {
                    setAuthorityValue(e.target.value)
                  }}
                  className="customer-desc"
                  style={{
                    width: "100%", backgroundColor: authorityList.length == 0 || !isDisabled ? "lightgrey" : "transparent",
                    opacity: (authorityList.length == 0 || !isDisabled) ? "0.5" : "1"
                  }}
                  disabled={authorityList.length == 0 || !isDisabled}
                >
                  <option value="NaN" label="Select" />
                  {authorityList.map((data, key) => {
                    return (
                      <option
                        key={key}
                        value={data.name}
                        label={data.name}
                      />
                    );
                  })}
                </select>
              </div>
            </div>
            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">{"Type of Property Cash Flow"}</label>
              <div className="down-arrow" style={{ width: "45%" }}>
                <select
                  value={TypeOfCashFlow}
                  onChange={(e) => {
                    setTypeOfCashFlow(e.target.value)
                  }}
                  className="customer-desc"
                  style={{
                    width: "100%",
                  }}
                >
                  <option value="NaN" label="Select" />
                  <option value="Sale" label="Sale" />
                  <option value="Lease" label="Lease" />
                </select>
              </div>
            </div>
            <div className="customer-details-sec ">
              <div className="add-Button"> <button onClick={() => {
                getTableValue()
              }}>{"Submit"}</button> </div>
              <div className="add-Button">
                <button onClick={() => {
                  onClear();
                }}>{"Clear"}</button>
              </div>
            </div>

            <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
              <h3> Property Information </h3>
            </div>
            {propertyinformation.map((data) => {
              return (<>
                {data.type === inputField ? <div style={{ width: "100%" }} className="customer-details-sec">

                  <label className="customer-title">{data.label}</label>
                  <input
                    type="text"
                    value={data.value}
                    onChange={(e) => onChangeInput(e, data.label)}
                    className="customer-desc"
                    style={{
                      backgroundColor: isDisabled ? "lightgrey" : "transparent",
                      opacity: isDisabled ? "0.5" : "1", textAlign: 'right'
                    }}
                    disabled={isDisabled}
                  />
                </div> :
                  <div style={{ width: "100%" }} className="customer-details-sec">
                    <label className="customer-title">{data.label}</label>
                    <div className="down-arrow" style={{ width: "45%" }}>
                      <select
                        value={data.value}
                        onChange={(e) => onChangeInput(e, data.label)}
                        className="customer-desc"
                        style={{ width: "100%" }}
                      >
                        <option value="NaN" label="Select" />
                        {data.options.map((value, key) => {
                          return (
                            <option
                              key={value}
                              value={value}
                              label={value}
                            />
                          );
                        })}
                      </select>
                    </div>
                  </div>
                }
              </>)
            })}
            <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
              <h3> Financial Assumptions </h3>
            </div>
            {financial.map((data) => {
              return (<>
                {data.type === inputField && <div style={{ width: "100%" }} className="customer-details-sec">
                  <label className="customer-title">{data.label}</label>
                  <input
                    type="text"
                    value={data.value}
                    onChange={(e) => onChangeFinancialData(e, data.label)}
                    className="customer-desc"
                    style={{
                      backgroundColor: (data.isDisabled || isDisabled) ? "lightgrey" : "transparent",
                      opacity: (data.isDisabled || isDisabled) ? "0.5" : "1", textAlign: 'right'
                    }}
                    disabled={data.isDisabled || isDisabled}
                  />
                </div>}
              </>)
            })}
          </div>




















          <div style={{ flexBasis: pdfDisabled ? "100%" : "45%" }}>
            <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
              <h3> Area Statement </h3>
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Residential</label>
              <input
                type="text"
                style={{ textAlign: "right", backgroundColor: "lightgrey", }}
                className="customer-desc"
                value={residentialTotal}
                disabled={true}
              />
            </div>
            {residentials.map((md, index) => (<>
              <div
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="customer-details-sec"
              >
                <label
                  style={{
                    alignItems: "start",
                    width: "50%",
                  }}
                  className="customer-title"
                >
                  {md.label}
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <input
                      style={{
                        width: "85%",
                        textAlign: 'right'
                      }}
                      type="text"
                      value={md.value}
                      onChange={(e) => {
                        onChangeResidential(e, md.label);
                      }}
                      className="customer-desc"
                    />
                    {index === residentials.length - 1 && (
                      <FontAwesomeIcon
                        onClick={() => {
                          setResidentials([...residentials, { label: `Black${residentials.length + 1}`, value: "" }]);
                        }}
                        style={{ width: "10%", marginLeft: "5%" }}
                        icon={faPlusCircle}
                        rotate={45}
                        color="green"
                        size="lg"
                      />
                    )}
                  </div>
                </div>
              </div>

            </>))}






            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Retail</label>
              <input
                type="text"
                style={{ textAlign: "right", backgroundColor: "lightgrey", }}
                className="customer-desc"
                value={retailTotal}
                disabled={true}
              />
            </div>
            {retails.map((md, index) => (<>
              <div
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="customer-details-sec"
              >
                <label
                  style={{
                    alignItems: "start",
                    width: "50%",
                  }}
                  className="customer-title"
                >
                  {md.label}
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <input
                      style={{
                        width: "85%",
                        textAlign: 'right'
                      }}
                      type="text"
                      value={md.value}
                      onChange={(e) => {
                        onChangeRetail(e, md.label);
                      }}
                      className="customer-desc"
                    />
                    {index === retails.length - 1 && (
                      <FontAwesomeIcon
                        onClick={() => {
                          setRetails([...retails, { label: `Black${retails.length + 1}` }]);
                        }}
                        style={{ width: "10%", marginLeft: "5%" }}
                        icon={faPlusCircle}
                        rotate={45}
                        color="green"
                        size="lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>))}


            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Office</label>
              <input
                type="text"
                style={{ textAlign: "right", backgroundColor: "lightgrey", }}
                className="customer-desc"
                value={officeTotal}
                disabled={true}
              />
            </div>
            {office.map((md, index) => (<>
              <div
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                className="customer-details-sec"
              >
                <label
                  style={{
                    alignItems: "start",
                    width: "50%",
                  }}
                  className="customer-title"
                >
                  {md.label}
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <input
                      style={{
                        width: "85%",
                        textAlign: 'right'
                      }}
                      type="text"
                      value={md.value}
                      onChange={(e) => {
                        onChangeOffice(e, md.label);
                      }}
                      className="customer-desc"
                    />
                    {index === office.length - 1 && (
                      <FontAwesomeIcon
                        onClick={() => {
                          setOffice([...office, { label: `Black${office.length + 1}` }]);
                        }}
                        style={{ width: "10%", marginLeft: "5%" }}
                        icon={faPlusCircle}
                        rotate={45}
                        color="green"
                        size="lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>))}

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Total - BUA</label>
              <input
                type="text"
                style={{ textAlign: "right", backgroundColor: "lightgrey" }}
                className="customer-desc"
                value={officeTotal + residentialTotal + retailTotal}
                disabled={true}
              />
            </div>


            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Leasable Area - Retail
              </label>
              <input
                type="text"
                style={{ textAlign: "right" }}
                className="customer-desc"
                value={leasableRetail}
                onChange={(e) => setLeasableRetail(Number(e.target.value))}
              />
            </div>


            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Leasable Area - Office
              </label>
              <input
                type="text"
                style={{ textAlign: "right" }}
                className="customer-desc"
                value={leasableOffice}
                onChange={(e) => setLeasableOffice(Number(e.target.value))}
              />
            </div>

            <div style={{ width: "100%" }} className="customer-details-sec">
              <label className="customer-title">Total - BUA</label>
              <input
                type="text"
                style={{ textAlign: "right" }}
                className="customer-desc"
                value={leasableRetail + leasableOffice}
                disabled={true}
              />
            </div>

            {TypeOfCashFlow === "Sale" ? <>
              <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
                <h3> Sale Assumptions </h3>
              </div>
              {salesAssumption.map((data) => {
                return (<>
                  {data.type === inputField && <div style={{ width: "100%" }} className="customer-details-sec">
                    <label className="customer-title">{data.label}</label>
                    <input
                      type="text"
                      value={data.value}
                      onChange={(e) => onChangeSalesAssumption(e, data.label)}
                      className="customer-desc"
                      style={{
                        backgroundColor: (data.isDisabled || isDisabled) ? "lightgrey" : "transparent",
                        opacity: (data.isDisabled || isDisabled) ? "0.5" : "1", textAlign: 'right'
                      }}
                      disabled={data.isDisabled}
                    />
                  </div>}
                </>)
              })}
            </> : <>
              <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
                <h3> Lease Assumptions </h3>
              </div>
              {leaseAssumption.map((data) => {
                return (<>
                  {data.type === inputField && <div style={{ width: "100%" }} className="customer-details-sec">
                    <label className="customer-title">{data.label}</label>
                    <input
                      type="text"
                      value={data.value}
                      onChange={(e) => onChangeLeaseAssumption(e, data.label)}
                      className="customer-desc"
                      style={{
                        backgroundColor: (data.isDisabled || isDisabled) ? "lightgrey" : "transparent",
                        opacity: (data.isDisabled || isDisabled) ? "0.5" : "1", textAlign: 'right'
                      }}
                      disabled={data.isDisabled}
                    />
                  </div>}
                </>)
              })}
            </>}
            <div style={{ height: 30 }} className="site-vist sitrepot branch-container">
              <h3> Expenses Assumptions </h3>
            </div>
            {expensesAssumption.map((data) => {
              return (<>
                {data.type === inputField && <div style={{ width: "100%" }} className="customer-details-sec">
                  <label className="customer-title">{data.label}</label>
                  <input
                    type="text"
                    value={data.value}
                    onChange={(e) => onChangeExpensesAssumption(e, data.label)}
                    className="customer-desc"
                    style={{
                      backgroundColor: isDisabled ? "lightgrey" : "transparent",
                      opacity: isDisabled ? "0.5" : "1", textAlign: 'right'
                    }}
                    disabled={isDisabled}
                  />
                </div>}
              </>)
            })}
          </div>
        </div>
        <div style={{ marginLeft: 30, marginRight: 30 }}>
          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Income - Phasing(Sale) </h3>
          </div>
        </div>

        <div className="phasing-sale">
          {inputArr.map((data, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "space-evenly",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "100%", alignItems: "center" }}>
                  <div
                    style={{
                      // width: "100%",
                      // justifyContent: "space-between",
                      alignItems: "center",
                      gap: 5,
                    }}
                    className="customer-details-sec"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`${data.label}`}</div>

                    </div>
                    {index === 0 ? <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`Total (In Mn)`}</div>
                    </div> : <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`${outputData(data.value)}`}</div>
                    </div>}

                    {incomePhasing.map((item, index) => {
                      let keys = Object.keys(item);
                      if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                        return <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "100px",
                          }}
                        >
                          <div
                            style={{ width: "90%" }}
                            className="customer-title"
                          >{`${item.year} (${item.quarter})`}</div>
                        </div>
                      } else {
                        return (<input
                          type="text"
                          style={{ textAlign: "right", width: "100px" }}
                          className="customer-desc"
                          value={item[data.value]}
                          onChange={(e) => {
                            let value = e.target.value;
                            onChangeIncome(value, data.value, index);

                          }}
                        />)
                      }
                    })

                    }



                  </div>
                </div>
              </div>
            );
          })}

        </div>

        <div style={{ marginLeft: 30, marginRight: 30 }}>
          <div
            style={{ height: 30 }}
            className="site-vist sitrepot branch-container"
          >
            <h3> Construction Expenses </h3>
          </div>
        </div>


        <div className="phasing-sale">
          {constructionInputArr.map((data, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "space-evenly",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "100%", alignItems: "center" }}>
                  <div
                    style={{
                      // width: "100%",
                      // justifyContent: "space-between",
                      alignItems: "center",
                      gap: 5,
                    }}
                    className="customer-details-sec"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`${data.label}`}</div>

                    </div>
                    {index === 0 ? <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`Total (In Mn)`}</div>
                    </div> : <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "300px",
                      }}
                    >
                      <div
                        style={{ width: "90%" }}
                        className="customer-title"
                      >{`${outputConstruction(data.value)}`}</div>
                    </div>}

                    {constructionExpenses.map((item, index) => {
                      let keys = Object.keys(item);
                      if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                        return <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "100px",
                          }}
                        >
                          <div
                            style={{ width: "90%" }}
                            className="customer-title"
                          >{`${item.year} (${item.quarter})`}</div>
                        </div>
                      } else {
                        return (<div style={{ display: "flex", width: 100, alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: "50px", color: "#053c6d", fontSize: 12 }}>{item[`${data.value}`]}</div>
                          <input
                            type="text"
                            style={{ textAlign: "right", width: "50px" }}
                            className="customer-desc"
                            value={item[`${data.value} %`]}
                            // placeholder="%"
                            onChange={(e) => {
                              let value = e.target.value;
                              onChangeConstruction(value, `${data.value} %`, index);
                            }}
                          />
                        </div>)
                      }
                    })
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {TypeOfCashFlow === "Sale" ? <>
          <div style={{ marginLeft: 30, marginRight: 30 }}>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Property Cash Flow Sale </h3>
            </div>
          </div>
          <div className="phasing-sale">
            {IncomeInputArr.map((data, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", alignItems: "center" }}>
                    <div
                      style={{
                        // width: "100%",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5,
                      }}
                      className="customer-details-sec"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "300px",
                        }}
                      >
                        {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                        <div
                          style={{ width: "90%" }}
                          className="customer-title"
                        >{`${data.label}`}</div>
                      </div>

                      {incomePhasingTotal.map((item, index) => {
                        let keys = Object.keys(item);
                        if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                          return <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: "100px",
                            }}
                          >
                            <div
                              style={{ width: "90%" }}
                              className="customer-title"
                            >{`${item.year} (${item.quarter})`}</div>
                          </div>
                        } else {
                          return (<div style={{ minWidth: "100px", textAlign: "right", fontSize: 12 }}>{item[data.value]}</div>)
                        }
                      })
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="phasing-sale">
            {ExpensesInputArr.map((data, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", alignItems: "center" }}>
                    <div
                      style={{
                        // width: "100%",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5,
                      }}
                      className="customer-details-sec"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "300px",
                        }}
                      >
                        {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                        <div
                          style={{ width: "90%" }}
                          className="customer-title"
                        >{`${data.label}`}</div>
                      </div>

                      {expensesTotal.map((item, index) => {
                        let keys = Object.keys(item);
                        if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                          return <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: "100px",
                            }}
                          >
                            <div
                              style={{ width: "90%" }}
                              className="customer-title"
                            >{`${item.year} (${item.quarter})`}</div>
                          </div>
                        } else {
                          return (<div style={{ minWidth: "100px", textAlign: "right", fontSize: 12 }}>{item[data.value]}</div>)
                        }
                      })
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </> : <>
          <div style={{ marginLeft: 30, marginRight: 30 }}>
            <div
              style={{ height: 30 }}
              className="site-vist sitrepot branch-container"
            >
              <h3> Property Cash Flow Lease </h3>
            </div>
          </div>
          <div className="phasing-sale">
            {IncomeCashflowArr.map((data, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", alignItems: "center" }}>
                    <div
                      style={{
                        // width: "100%",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5,
                      }}
                      className="customer-details-sec"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "300px",
                        }}
                      >
                        {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                        <div
                          style={{ width: "90%" }}
                          className="customer-title"
                        >{`${data.label}`}</div>
                      </div>

                      {incomeLeaseTotal.map((item, index) => {
                        let keys = Object.keys(item);
                        if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                          return <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: "100px",
                            }}
                          >
                            <div
                              style={{ width: "90%" }}
                              className="customer-title"
                            >{`${item.year} (${item.quarter})`}</div>
                          </div>
                        } else {
                          return (<div style={{ minWidth: "100px", textAlign: "right", fontSize: 12 }}>{item[data.value]}</div>)
                        }
                      })
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="phasing-sale">
            {cashflowInputArr.map((data, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", alignItems: "center" }}>
                    <div
                      style={{
                        // width: "100%",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5,
                      }}
                      className="customer-details-sec"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "300px",
                        }}
                      >
                        {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                        <div
                          style={{ width: "90%" }}
                          className="customer-title"
                        >{`${data.label}`}</div>
                      </div>

                      {cashFlowExpensesTotal.map((item, index) => {
                        let keys = Object.keys(item);
                        if (data.label.toLocaleLowerCase() == "year" && keys[0].toLocaleLowerCase() == "year") {
                          return <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: "100px",
                            }}
                          >
                            <div
                              style={{ width: "90%" }}
                              className="customer-title"
                            >{`${item.year} (${item.quarter})`}</div>
                          </div>
                        } else {
                          return (<div style={{ minWidth: "100px", textAlign: "right", fontSize: 12 }}>{item[data.value]}</div>)
                        }
                      })
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>}
                <div
              style={{
                display: "flex",
                flexDirection: "row",
                // justifyContent: "space-evenly",
                width: "100%",
                alignItems: "flex-start",
                marginLeft:25
              }}
            >
              <div style={{ width: "100%", alignItems: "center" }}>
                <div
                  style={{
                    // width: "100%",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    gap: 5,
                  }}
                  className="customer-details-sec"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: "300px",
                    }}
                  >
                    {/* <label style={{ fontSize: 10, alignSelf: 'flex-start' }}>&#160;</label> */}
                    <div
                      style={{ width: "90%" }}
                      className="customer-title"
                    >{`Net Present Value(In Mn) :  ${npvValue}`}</div>
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
    </>)
}

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
      getCalculatorSuggested: getCalculatorSuggested
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DCF);
