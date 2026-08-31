import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { _getStorageValue } from "../../comman/localStorage";
import { AES_KEY, USER_ID } from "../../comman/constants";
import ImageContainer from "../../components/pdf/ImageConatainer";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  getBranchContactData,
  getAgencyContactData,
} from "../../action/reportAnalytics";
import { getBranchCities } from "../../action/getBranchCities";
import { getBranchStates } from "../../action/getBranchStates";
import { getBranchNames } from "../../action/getBranchNames";
import { getBranchReport } from "../../action/getBranchReport";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getBranchAgencyDates } from "../../action/getBranchAgencyDates";

import { getAgencyCities } from "../../action/getAgencyCity";
import { getAgencyStates } from "../../action/getAgencyState";
import { getAgencyNames } from "../../action/getAgencyNames";
import { getAgencyReport } from "../../action/getAgencyReport";
import { getAgencyZone } from "../../action/getAgencyZone";
import Pathbox from "../path-box";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const Reports = (props) => {
  const history = useHistory();
  const fromLocation = useLocation();
  const [agencySelect, setAgencySelect] = useState(false);
  const [branchSelect, setBranchSelect] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [reportType, setReportType] = useState([
    "Selected",
    "Branch Connect",
    "Agency Connect",
  ]);
  const [reportTypeSelected, setReportTypeSelected] = useState("");
  const [typeReport, setTypeReport] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [stateValues, setStateValues] = useState([]);
  const [stateSelected, setStateSelected] = useState("");
  const [cityValues, setCityValues] = useState([]);
  const [citySelected, setCitySelected] = useState("");
  const [branchValues, setBranchValues] = useState([]);
  const [branchSelected, setBranchSelected] = useState("");
  const [branch, setBranch] = useState("");
  const [agency, setAgency] = useState("");

  const [agencyValues, setAgencyValues] = useState([]);
  const [agencySelected, setAgencySelected] = useState("");
  const [reportDateValues, setReportDateValues] = useState([]);
  const [reportDateSelected, setReportDateSelected] = useState("");
  //branch connect hooks
  const [empMet, setEmpMet] = useState([]);
  const [personMetBranch, setPersonMetBranch] = useState([]);
  const [pointsDiscussed, setPointsDiscussed] = useState("");
  const [Suggestions, setSuggestions] = useState("");
  const [mortgageDisb, setMortgageDisb] = useState("");
  const [businessDisb, setBusinessDisb] = useState("");
  const [branchVisitedOn, setBranchVisitedOn] = useState("");
  const [branchVisitedBy, setBranchVisitedBy] = useState("");
  const [branchUpdateOn, setBranchUpdateOn] = useState("");
  const [branchUpdateBy, setBranchUpdateBy] = useState("");
  const [downloadImgUrlBranch, setDownloadImgUrlBranch] = useState([{}]);

  //agency connect hooks
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [personMetAgency, setPersonMetAgency] = useState("");
  const [staffStrength, setStaffStrength] = useState("");
  const [paramsDiscussed, setParamsDiscussed] = useState("");
  const [agencyFeedback, setAgencyFeedback] = useState("");
  const [AgencyVisitedOn, setAgencyVisitedOn] = useState("");
  const [AgencyVisitedBy, setAgencyVisitedBy] = useState("");
  const [AgencyUpdatedOn, setAgencyUpdatedOn] = useState("");
  const [AgencyUpdatedBy, setAgencyUpdatedBy] = useState("");
  const [downloadImgUrlAgency, setDownloadImgUrlAgency] = useState([{}]);
  const [dressCode, setDressCode] = useState("");
  const [dueDiligence, setDueDiligence] = useState("");
  const [bcp, setBcp] = useState("");
  const [infrastructure, setInfrastructure] = useState("");
  const [storageArea, setStorageArea] = useState("");
  const [antiVirus, setAntiVirus] = useState("");
  const [zoneValues, setZoneValues] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [frequencyTraining, setFrequencyTraining] = useState("");
  const [availableOfBM, setAvailableOfBM] = useState("");
  const [subContract, setSubContract] = useState("");
  const [dataDownload, setDataDownload] = useState("");
  const [dateOfAggrement, setDateOfAggrement] = useState(null);
  const [aggrementImgS3Urls, setaAggrementImgS3Urls] = useState([]);
  const [selfAssesmentS3Image, setSelfAssesmentS3Image] = useState([]);

  useEffect(() => {
    setStateValues(props.branchStatesNameData);
  }, [props.branchStatesNameData]);

  useEffect(() => {
    setStateValues(props.agencyStatesNameData);
  }, [props.agencyStatesNameData]);

  useEffect(() => {
    setCityValues(props.branchCitiesNameData);
  }, [props.branchCitiesNameData]);

  useEffect(() => {
    setCityValues(props.agencyCitiesNameData);
  }, [props.agencyCitiesNameData]);

  useEffect(() => {
    setBranchValues(props.branchNamesData);
  }, [props.branchNamesData]);

  useEffect(() => {
    setAgencyValues(props.agencyNamesData);
  }, [props.agencyNamesData]);

  useEffect(() => {
    setReportDateValues(props.branchAgencyDates);
  }, [props.branchAgencyDates]);

  useEffect(() => {
    setZoneValues(props.agencyZoneData);
  }, [props.agencyZoneData]);

  const {
    branchReportData,
    agencyReportData,
    initialBranchReport,
    initialAgencyReport,
  } = props;

  useEffect(() => {
    _getStorageValue(AES_KEY).then((key) => {
      setAesKey(key);
    });
  }, []);

  useEffect(() => {
    recallBranchData();
  }, []);

  useEffect(() => {
    recallAgencyData();
  }, []);

  useEffect(() => {
    if (initialBranchReport) {
      setBranchSelect(true);
      let initialData = initialBranchReport; // changed to initial branch data
      setDownloadImgUrlBranch(initialData?.download_urls ?? []);
      setBranchVisitedBy(initialData?.visited_by ?? "");
      setBranchVisitedOn(
        initialData?.visited_on ? dateFormat(initialData?.visited_on) : "",
      );
      setBusinessDisb(initialData?.business_disb_in_mn ?? "");
      setMortgageDisb(initialData?.mortage_disb_in_mn ?? "");
      setPointsDiscussed(initialData?.points_discussed ?? "");
      setPersonMetBranch(initialData?.branch_emp_met_id ?? []);
      setEmpMet(initialData?.branch_emp_met ?? []);
      setBranchUpdateBy(initialData?.updated_by ?? "");
      setSuggestions(initialData?.suggestions_received ?? "");
      setBranchUpdateOn(
        initialData?.updated_on ? dateFormat(initialData?.updated_on) : "",
      );
    }
  }, [initialBranchReport]);

  useEffect(() => {
    let agencyDetails = Object.keys(initialAgencyReport);
    if (agencyDetails.length > 0) {
      setBranchSelect(false);
      let initialData = initialAgencyReport.agency_connect_data; // changed to initial branch data
      setDownloadImgUrlAgency(initialData?.download_urls ?? "");
      setAddress(initialData?.address ?? "");
      setAgencyFeedback(initialData?.agency_feedback ?? "");
      setAgencyVisitedBy(initialData?.visited_by ?? "");
      setAgencyVisitedOn(dateFormat(initialData?.visited_on ?? ""));
      setParamsDiscussed(initialData?.parameters_discussed ?? "");
      setStaffStrength(initialData?.staff_strength ?? "");
      setPersonMetAgency(initialData?.agency_person_met ?? "");
      setLocation(initialData?.location ?? "");
      setBcp(initialData?.bcp_in_place_check ?? "");
      setDressCode(initialData?.vendor_employee_check ?? "");
      setInfrastructure(initialData?.infrastructure_check ?? "");
      setStorageArea(initialData?.storage_area_check ?? "");
      setDueDiligence(initialData?.agency_staff_diligence_check ?? "");
      setAntiVirus(initialData?.anti_virus_check ?? "");
      setAgencyUpdatedBy(initialData?.updated_by ?? "");
      setAgencyUpdatedOn(
        initialData?.updated_on ? dateFormat(initialData?.updated_on) : "",
      );
      setaAggrementImgS3Urls(
        initialData.first_page_of_agreement_image_download_urls,
      );
      setSelfAssesmentS3Image(
        initialData.self_assessment_image_urls_download_urls,
      );
      setFrequencyTraining(initialData.frequency_of_training_given_to_emp);
      setAvailableOfBM(initialData.availabilty_of_bio_metric);
      setSubContract(initialData.subcontracting_of_activity);
      setDataDownload(initialData.data_download_and_storage_purging);
      setDateOfAggrement(initialData.date_of_aggrement_with_icici);
    }
  }, [initialAgencyReport]);

  const recallBranchData = () => {
    let timeLineYear = fromLocation.state && fromLocation.state.timeLineYear;
    let ifsc_code = fromLocation.state && fromLocation.state.ifsc_code;
    if (timeLineYear && ifsc_code) {
      _getStorageValue(USER_ID).then((userId) => {
        props.getBranchContactData(
          userId,
          ifsc_code,
          timeLineYear[0],
          timeLineYear[1],
        );
      });
    }
  };
  const recallAgencyData = () => {
    let timeLineYear = fromLocation.state && fromLocation.state.timeLineYear;
    let agency_id = fromLocation.state && fromLocation.state.agency_id;
    if (timeLineYear && agency_id) {
      _getStorageValue(USER_ID).then((userId) => {
        props.getAgencyContactData(
          userId,
          agency_id,
          timeLineYear[0],
          timeLineYear[1],
        );
      });
    }
  };
  const getAgencyReportCall = (branch, reportDateSelected) => {
    _getStorageValue(USER_ID).then((userId) => {
      props.getAgencyReport(userId, branch, reportDateSelected);
    });
  };

  const dateFormat = (vistitedon) => {
    let date = new Date(vistitedon);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const branchValueSelected = (e) => {
    setBranch(e);
    if (typeReport === "Branch") {
      _getStorageValue(USER_ID).then((userId) => {
        props.getBranchAgencyDates(userId, typeReport, e);
      });
    } else if (typeReport === "Agency") {
      _getStorageValue(USER_ID).then((userId) => {
        props.getBranchAgencyDates(userId, typeReport, e);
      });
    }
  };

  const agencyValueSelected = (e) => {
    setAgency(e);
    if (typeReport === "Agency") {
      _getStorageValue(USER_ID).then((userId) => {
        props.getBranchAgencyDates(userId, typeReport, e);
      });
    }
  };

  //agency report
  const AgencyReport = () => {
    const stateZoneValue =
      fromLocation.state && fromLocation.state.stateZoneValue;
    const zoneValue = fromLocation.state && fromLocation.state.zoneValue;
    const agencyValue = fromLocation.state && fromLocation.state.agencyValue;
    const aggregateBy = fromLocation.state && fromLocation.state.aggregateBy;
    const connection = fromLocation.state && fromLocation.state.connection;
    const currentYear = fromLocation.state && fromLocation.state.currentYear;
    return (
      <div className="report-container ">
        <Pathbox
          stateZoneValue={stateZoneValue}
          zoneValue={zoneValue}
          agencyValue={agencyValue}
          callingFromAgency={true}
          aggregateBy={aggregateBy}
          connection={connection}
          currentYear={currentYear}
        />
        <div className="site-vist sitrepot  ">
          <h3> Agency Connect Report </h3>
        </div>
        <>
          {props.isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="customer-details-sec width45">
                <label className="customer-title">Address</label>
                <input
                  type="text"
                  value={address}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Location</label>
                <input
                  type="text"
                  value={location}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Person Met</label>
                <input
                  type="text"
                  value={personMetAgency}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Staff Strength</label>
                <input
                  type="text"
                  value={staffStrength}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-area">
                <label className="customer-title">Parameters Discussed</label>
                <textarea
                  type="text"
                  value={paramsDiscussed}
                  className="site-vist-desc w-50"
                  disabled
                />
              </div>
              <div className="customer-details-area">
                <label className="customer-title">Agency Feedback</label>
                <textarea
                  type="text"
                  value={agencyFeedback}
                  className="site-vist-desc w-50"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Visited On</label>
                <input
                  type="text"
                  value={AgencyVisitedOn}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Visited By</label>
                <input
                  type="text"
                  value={AgencyVisitedBy}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Updated On</label>
                <input
                  type="text"
                  value={AgencyUpdatedOn}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Updated By</label>
                <input
                  type="text"
                  value={AgencyUpdatedBy}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="site-vist sitrepot marginTop  ">
                <h3>Images</h3>
              </div>
              <ImageContainer DownloadUrlImage={downloadImgUrlAgency} />
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Are all employees of vendor wearing ID card and Dress Code?
                </label>
                <input
                  type="text"
                  value={dressCode}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Due Diligence of agency staff done by the vendor?
                </label>
                <input
                  type="text"
                  value={dueDiligence}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">BCP in place?</label>
                <input
                  type="text"
                  value={bcp}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Proper infrastructure in place?
                </label>
                <input
                  type="text"
                  value={infrastructure}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Storage area is fire/water proof free?
                </label>
                <input
                  type="text"
                  value={storageArea}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Anti virus in place?</label>
                <input
                  type="text"
                  value={antiVirus}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Frequency of training given to employee?
                </label>
                <input
                  type="text"
                  value={frequencyTraining}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Availability of bio metric?
                </label>
                <input
                  type="text"
                  value={availableOfBM}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Subcontracting of activity ?
                </label>
                <input
                  type="text"
                  value={subContract}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Data download and storage purging?
                </label>
                <input
                  type="text"
                  value={dataDownload}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Date of agrement with icici bank
                </label>
                <input
                  type="text"
                  value={dateOfAggrement}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="site-vist sitrepot marginTop  ">
                <h3>First page of aggrement</h3>
              </div>
              <ImageContainer DownloadUrlImage={aggrementImgS3Urls} />
              <div className="site-vist sitrepot marginTop  ">
                <h3>Self Assessment</h3>
              </div>
              <ImageContainer DownloadUrlImage={selfAssesmentS3Image} />
            </>
          )}
        </>
      </div>
    );
  };

  //branch report
  const BranchReport = () => {
    const stateValue = fromLocation.state && fromLocation.state.stateValue;
    const cityValue = fromLocation.state && fromLocation.state.cityValue;
    const branchValue = fromLocation.state && fromLocation.state.branchValue;
    const aggregateBy = fromLocation.state && fromLocation.state.aggregateBy;
    const connection = fromLocation.state && fromLocation.state.connection;
    const currentYear = fromLocation.state && fromLocation.state.currentYear;
    return (
      <div className="report-container ">
        <Pathbox
          stateValue={stateValue}
          cityValue={cityValue}
          branchValue={branchValue}
          callingFromBranch={true}
          aggregateBy={aggregateBy}
          connection={connection}
          currentYear={currentYear}
        />
        <div className="site-vist sitrepot branch-container  ">
          <h3> Branch Connect Report </h3>
        </div>
        <>
          {props.isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="customer-details-sec width45">
                <label className="customer-title">Employee Met</label>
                {/* <input
            type="text"
            value={empMet}
            className="customer-desc"
            disabled
            /> */}
                <label style={{ width: "45%" }} className="customer-title ">
                  Person Met
                </label>
              </div>
              {empMet.map((ele, i) => (
                <div className="customer-details-sec width45">
                  {/* <label className="customer-title">Person Met</label> */}

                  <input
                    type="text"
                    value={ele}
                    style={{ width: "50%" }}
                    className="customer-desc"
                    disabled
                  />
                  <input
                    type="text"
                    value={personMetBranch[i]}
                    className="customer-desc "
                    disabled
                  />
                </div>
              ))}
              <div className="customer-details-area">
                <label className="customer-title">Points Discussed</label>
                <textarea
                  type="text"
                  value={pointsDiscussed}
                  className="site-vist-desc w-50 mt-20"
                  disabled
                />
              </div>
              <div className="customer-details-area">
                <label className="customer-title">Suggestions Received</label>
                <textarea
                  type="text"
                  value={Suggestions}
                  className="site-vist-desc w-50"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Mortgage Disb in Mn.</label>
                <input
                  type="text"
                  value={mortgageDisb}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">
                  Business Banking Disb in Mn.
                </label>
                <input
                  type="text"
                  value={businessDisb}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Visited On</label>
                <input
                  type="text"
                  value={branchVisitedOn}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Visited By</label>
                <input
                  type="text"
                  value={branchVisitedBy}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Updated On</label>
                <input
                  type="text"
                  value={branchUpdateOn}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Updated By</label>
                <input
                  type="text"
                  value={branchUpdateBy}
                  className="customer-desc"
                  disabled
                />
              </div>
              <div className="site-vist sitrepot   ">
                <h3>Images</h3>
              </div>
              <ImageContainer DownloadUrlImage={downloadImgUrlBranch} />
            </>
          )}
        </>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Header aesKey={aesKey} link={"reports-analytics-data"} />
      <div className="report-parent-container">
        <div className="report-filter">
          <div className="search-filters">
            {typeReport === "Branch" && (
              <div className="region-select">
                <label>Branch Name</label>
                <select
                  // value={agencyValues != [] ? agencySelected  : branchValues != [] && branchSelected?branchValues:""}
                  value={branch}
                  onChange={(e) => {
                    branchValueSelected(e.target.value);
                  }}
                >
                  <option>Selected</option>
                  {branchValues.map((item) => {
                    return (
                      <option value={item.ifsc_code}>{item.branch_text}</option>
                    );
                  })}
                </select>
              </div>
            )}

            {typeReport === "Agency" && (
              <div className="region-select">
                <label>Agency Name</label>
                <select
                  // value={agencyValues != [] ? agencySelected  : branchValues != [] && branchSelected}
                  value={agency}
                  onChange={(e) => {
                    agencyValueSelected(e.target.value);
                  }}
                  className="agency-name-field"
                >
                  <option>Selected</option>
                  {agencyValues.map((item) => {
                    return (
                      <option value={item.agency_id}>{item.agency_name}</option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
        {branchSelect ? BranchReport() : AgencyReport()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  branchStatesNameData: state.getBranchStates.branchStatesNameData,
  branchCitiesNameData: state.getBranchCities.branchCitiesNameData,
  branchNamesData: state.getBranchNames.branchNamesData,
  branchReportData: state.getBranchReport.branchReportData,
  branchAgencyDates: state.getBranchAgencyDates.branchAgencyDates,
  agencyStatesNameData: state.getAgencyStates.agencyStatesNameData,
  agencyCitiesNameData: state.getAgencyCities.agencyCitiesNameData,
  agencyNamesData: state.getAgencyNames.agencyNamesData,
  agencyReportData: state.getAgencyReport.agencyReportData,
  agencyZoneData: state.getAgencyZone.agencyZoneNameData,
  initialBranchReport: state.getReportsData.initialBranchReport,
  initialAgencyReport: state.getReportsData.initialAgencyReport,
  isFetching: state.getReportsData.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBranchCities: getBranchCities,
      getBranchStates: getBranchStates,
      getBranchNames: getBranchNames,
      getBranchReport: getBranchReport,
      getBranchAgencyDates: getBranchAgencyDates,
      getAgencyCities: getAgencyCities,
      getAgencyStates: getAgencyStates,
      getAgencyNames: getAgencyNames,
      getAgencyReport: getAgencyReport,
      getAgencyZone: getAgencyZone,
      getBranchContactData: getBranchContactData,
      getAgencyContactData: getAgencyContactData,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
