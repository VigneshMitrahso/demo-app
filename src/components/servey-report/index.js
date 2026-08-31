import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory, useLocation } from "react-router-dom";

import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import {
  getServeyReport,
  getServeyRequestReport,
  getSurveyUserReport,
} from "../../action/serveyReport";
import Header from "../header";
import "./styles.css";


const Report = (props) => {
  const downloadicon = {
    url: require("../../assets/images/downloadicon.png"),
  };
  const history = useHistory();
  //   const fromLocation = useLocation();
  // const [aeskey, setAesKey] =useState("");
  // const [connection, setConnection] =useState("Branch");
  // const [currentYear, setYear] =useState("");
  // const [aggregate, setAggregate] =useState("State");
  // const [isZoneAggregate, setIsZoneAggregate] = useState(false);
  // const [previousState, setPreviousState] =useState([]);
  // const [stateValue,setStateValue] = useState("");
  // const [stateZoneValue, setStateZoneValue] = useState("");
  // const [zoneValue, setZoneValue] = useState("");
  // const [cityValue, setCityValue] = useState("");
  // const [branchValue, setBranchValue] = useState("");
  // const [agencyValue, setAgencyValue] = useState("");
  // const [isReset, setIsReset] = useState(false);
  const [screen, setScreen] = useState("state");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [count, setCount] = useState(0);
  const [miniLoader, setLoader] = useState(false);

  const location = useLocation();
  const currentRouteName = location.pathname;


  useEffect(() => {
    if (currentRouteName === "/survey-all-report") {
      setIsLoading(true);
      var state = new URLSearchParams(props.location.search).get("state");
      var city = new URLSearchParams(props.location.search).get("city");
      if (!!state && !!city) {
        setSelectedState(state);
        handleGetSelectedStateCity(city, state);
      } else {
        _getStorageValue(USER_ID).then((id) => {
          props.getServeyReport(id, "state", null, null);
        });
      }
    } else {
      setIsLoading(true);
      _getStorageValue(USER_ID).then((id) => {
        props.getSurveyUserReport(id);
      });
    }

  }, [currentRouteName]);

  const refreshTable = () => {
    if (currentRouteName === "/survey-all-report") {

      setLoader(true);
      if (isEmpty(selectedState) && isEmpty(selectedCity)) {
        _getStorageValue(USER_ID).then((id) => {
          props.getServeyReport(id, "state", null, null, setLoader, setLoader);
        });
      } else if (!isEmpty(selectedState) && isEmpty(selectedCity)) {
        _getStorageValue(USER_ID).then((id) => {
          props.getServeyReport(
            id,
            "city",
            selectedState,
            null,
            setLoader,
            setLoader,
          );
        });
      } else {
        _getStorageValue(USER_ID).then((id) => {
          props.getServeyReport(
            id,
            "main_table",
            selectedState,
            selectedCity,
            setLoader,
            setLoader,
          );
        });
      }
    }
    else {
      setIsLoading(true);
      _getStorageValue(USER_ID).then((id) => {
        props.getSurveyUserReport(id);
      });
    }
  };

  const handleGetAllindiaState = () => {
    // setIsLoading(true);
    setSelectedCity("");
    setSelectedState("");
    setScreen("state");
    _getStorageValue(USER_ID).then((id) => {
      props.getServeyReport(id, "state", null, null);
    });
  };

  const handleGetSelectedState = (state) => {
    // setIsLoading(true);
    setSelectedCity("");
    setScreen("city");
    setSelectedState(state);
    history.push(`${currentRouteName}?state=${state}`);
    _getStorageValue(USER_ID).then((id) => {
      props.getServeyReport(id, "city", state, null);
    });
  };

  const handleGetSelectedStateCity = (city, state = "") => {
    setSelectedCity(city);
    if (state == "") {
      history.push(`${currentRouteName}?state=${selectedState}&city=${city}`);
      setScreen("main_table");
      setCount(count + 1);
      setIsLoading(true);
      _getStorageValue(USER_ID).then((id) => {
        props.getServeyReport(id, "main_table", selectedState, city);
      });
      setIsLoading(false);
    } else {
      setScreen("main_table");
      setCount(count + 1);
      setIsLoading(true);
      _getStorageValue(USER_ID).then((id) => {
        props.getServeyReport(id, "main_table", state, city);
      });
      setIsLoading(false);
    }
  };

  const options = {
    responsive: "scroll",
    fixedHeader: true,
    overflowX: "auto",
    filter: false,
    sort: true,
    download: false,
    empty: true,
    index: 10,
    print: true,
    // customSearch: (searchQuery, currentRow, columns) => {
    //   let isFound = false;
    //     currentRow.forEach(col => {
    //     if(col !== "" && col !== undefined){
    //      let colData = "";
    //       columns.forEach(data =>{
    //         if(data.name === "city" || data.name === "State" ) {
    //           // colData = decryptStatic(col.toString(), aeskey);
    //           if(colData.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >=0){
    //             isFound = true;
    //           }
    //         }
    //         else if (col.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
    //           isFound = true;
    //         }
    //       })
    //     }
    //   });
    //   return isFound;
    // },
    // viewColumns: true,
    selectableRows: false,
    pagination: false,
    textLabels: {
      showResponsive: true,
      rowsPerPage: "Total items Per Page",
    },
  };

  const columns = useMemo(() => {
    let columns = [];
    if (screen === "city") {
      columns = [
        {
          name: "city",
          label: "Cities",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#2F80ED",
                  }}
                  onClick={() =>
                    handleGetSelectedStateCity(
                      props.serveyReport.table_data[value].city,
                    )
                  }
                >
                  {props.serveyReport.table_data[value].city}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "completed_count",
          label: "Report Generated",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 50,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "inprogress_count",
          label: "Report In progress",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "failed_count",
          label: "Report Failed",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
      ];
    } else if (screen === "main_table" || currentRouteName == "/survey-report") {
      columns = [
        {
          name: "request_id",
          label: "Request Id",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "request_time",
          label: "Request Time",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 50,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "latitude",
          label: "Latitude",
          customBodyRenderLite: (value, item) => {
            return (
              <div>
                {props.serveyReport.table_data[item].request_data?.latLon
                  ?.coordinates?.[1] || "NA"}
              </div>
            );
          },
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "longitude",
          label: "Longitude",
          customBodyRenderLite: (value) => {
            return (
              <div>
                {props.serveyReport.table_data[value].request_data?.latLon
                  ?.coordinates?.[0] || "NA"}
              </div>
            );
          },
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "property report status",
          label: "Ownership report status",
          options: {
            filter: true,
            sort: false,
            customBodyRenderLite: (value) => {
              return (
                <div style={{ cursor: "pointer" }}>
                  {Number(
                    props.serveyReport.table_data[value]?.ownership_status,
                  ) === 1 ? (
                    <div
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href =
                          props.serveyReport.table_data[
                            value
                          ]?.ownership_report_url;
                        // a.download = `${reqid}.pdf`;
                        a.click();
                      }}
                    >
                      Completed
                      <img
                        src={downloadicon.url}
                        width={20}
                        height={20}
                        alt="download"
                      />
                    </div>
                  ) : Number(
                    props.serveyReport.table_data[value]?.ownership_status,
                  ) === 2 ? (
                    "In-progress"
                  ) : (
                    "failed"
                  )}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "property report status",
          label: "Survey Report Status",
          options: {
            filter: true,
            sort: false,
            customBodyRenderLite: (value) => {
              return (
                <div style={{ cursor: "pointer" }}>
                  {Number(
                    props.serveyReport.table_data[value]
                      ?.property_report_status,
                  ) === 1 ? (
                    <div style={{ justifyContent: "space-around" }}>
                      Completed
                      <img
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href =
                            props.serveyReport.table_data[
                              value
                            ]?.download_survey_url;
                          a.click();
                        }}
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        src={downloadicon.url}
                        width={20}
                        height={20}
                        alt="download"
                      />
                      <Link
                        to={`/survey-report-pdf?reqid=${props.serveyReport.table_data[value]?.request_id}&current-route=${currentRouteName}`}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          rotate={45}
                          color="#000"
                          size="2x"
                        />
                      </Link>
                    </div>
                  ) : Number(
                    props.serveyReport.table_data[value]
                      ?.property_report_status,
                  ) === 2 ? (
                    "In-progress"
                  ) : (
                    "failed"
                  )}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        // {
        //   name: "request_id",
        //   label: "View Report",
        //   options: {
        //     sort: false,
        //     customBodyRenderLite: (value) => {
        //       return (
        //         <div style={{ cursor: "pointer" }}>
        //           {props.serveyReport.table_data[value]
        //             ?.property_report_status === 2 ||
        //           props.serveyReport.table_data[value]
        //             ?.property_report_status === 0 ? (
        //             <FontAwesomeIcon
        //               icon={faEyeSlash}
        //               rotate={45}
        //               color="#000"
        //               size="2x"
        //             />
        //           ) : (

        //               <div style={{flexDirection:"row",alignItems:"center",justifyContent:"center",display:"flex"}}>
        //                   <Link
        //                     to={`/survey-report-pdf?reqid=${props.serveyReport.table_data[value]?.request_id}`}
        //                 >
        //               <FontAwesomeIcon
        //                 icon={faEye}
        //                 rotate={45}
        //                 color="#000"
        //                 size="2x"
        //               />
        //               </Link>
        //                 {/* <a
        //               download
        //               style={{paddingLeft:10}}
        //               href={
        //                 `${props.serveyReport.table_data[value].download_survey_url}`
        //               }
        //             >
        //               <img
        //                 src={downloadicon.url}
        //                 width={20}
        //                 height={20}
        //                 alt="download"
        //               />
        //             </a> */}
        //               </div>

        //           )}
        //         </div>
        //       );
        //     },
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position: "sticky",
        //         left: "0",
        //         background: "#ffffff",
        //         textAlign: "center",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 100,
        //       },
        //     }),
        //     setCellHeaderProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position: "sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "center",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        {
          name: "ilens_status",
          label: "iLens Status",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value) => {
              return (
                <div>
                  {props.serveyReport.table_data[value].ilens_status || "N/A"}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        // {
        //   name: "download_survey_url",
        //   label: "Download Report",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     customBodyRenderLite: (value) => {
        //       return (
        //         <div>
        //           {props.serveyReport.table_data[value].download_survey_url &&
        //           Number(
        //             props.serveyReport.table_data[value]?.property_report_status
        //           ) === 1 ? (
        //             <a
        //               download
        //               href={
        //                 `${props.serveyReport.table_data[value].download_survey_url}`
        //               }
        //             >
        //               <img
        //                 src={downloadicon.url}
        //                 width={20}
        //                 height={20}
        //                 alt="download"
        //               />
        //             </a>
        //           ) : (
        //             "N/A"
        //           )}
        //         </div>
        //       );
        //     },
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position: "sticky",
        //         left: "0",
        //         background: "#ffffff",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 100,
        //       },
        //     }),
        //     setCellHeaderProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position: "sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
      ];
    } else if (screen === "state") {
      columns = [
        {
          name: "state",
          label: "States",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#2F80ED",
                  }}
                  onClick={() =>
                    handleGetSelectedState(
                      props.serveyReport.table_data[value].state,
                    )
                  }
                >
                  {props.serveyReport.table_data[value].state}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "left",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "completed_count",
          label: "Report Generated",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 50,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "inprogress_count",
          label: "Report In progress",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
        {
          name: "failed_count",
          label: "Report Failed",
          options: {
            filter: true,
            sort: false,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: "0",
                background: "#ffffff",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 100,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: "nowrap",
                position: "sticky",
                left: 0,
                background: "#DCE5E5",
                textAlign: "center",
                borderRight: "2px solid #A9C4C5",
                zIndex: 150,
              },
            }),
          },
        },
      ];
    }
    return columns;
  }, [props.serveyReport, screen]);

  const submit = () => {
    setCount(count + 1);
    let data = {
      latLon: {
        type: "Point",
        coordinates: [Number(latitude), Number(longitude)],
      },
    };

    var reg = new RegExp("^-?([0-8]?[0-9]|90)(.[0-9]{1,10})$");

    if (
      latitude.replace(/\s\s+/g, "") == "" ||
      longitude.replace(/\s\s+/g, "") == ""
    ) {
      toast.error("Please enter latitude and logitude ", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (!reg.test(latitude) || !reg.test(longitude)) {
      toast.error("Please enter valide latitude and logitude ", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      _getStorageValue(USER_ID).then((id) => {
        props.getServeyRequestReport(
          id,
          data,
          screen,
          selectedState,
          selectedCity,
          setLatitude,
          setLongitude,
        );
      });
    }
  };

  return (
    <>
      <Header link={currentRouteName === "/survey-all-report" ? "analytics-landing-page" : "/ownership-landing-page"} />
      <div className="dashboard-container">
        <div className="servey-container">
          <div
            className="report-sub-container"
            style={{ justifyContent: "space-between" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 25,
                justifyContent: "space-between",
              }}
            >
              {currentRouteName !== "/survey-all-report" && <div
                style={{ width: "50%", display: "flex", alignItems: "center" }}
              >
                <div style={{ width: "30%" }}>
                  <label>
                    Latitude <span>*</span>
                  </label>
                  <input
                    className="input_style"
                    type="text"
                    maxlength={"8"}
                    placeholder="Latitude"
                    value={longitude}
                    onChange={(e) => {
                      //    const coordinatesRegex = /^[+-]?[0-9.]+$/;
                      //    if(coordinatesRegex.test(e.target.value)|| e.target.value==""){
                      // setLongitude(e.target.value);
                      //    }
                      const formattedText = e.target.value.replace(
                        /[^\d]/g,
                        "",
                      );
                      // Insert a "." after the first two digits
                      if (formattedText.length > 2) {
                        setLongitude(
                          formattedText.substring(0, 2) +
                          "." +
                          formattedText.substring(2),
                        );
                      } else {
                        setLongitude(formattedText);
                      }
                    }}
                  />
                </div>
                <div style={{ width: "30%", marginLeft: "10px" }}>
                  <label>
                    Longitude <span>*</span>
                  </label>
                  <input
                    className="input_style"
                    type="text"
                    placeholder="Longitude"
                    maxlength={"8"}
                    value={latitude}
                    onChange={(e) => {
                      //    const coordinatesRegex = /^[+-]?[0-9.]+$/;
                      //    if(coordinatesRegex.test(e.target.value)|| e.target.value==""){
                      //   setLatitude(e.target.value)
                      // }
                      const formattedText = e.target.value.replace(
                        /[^\d]/g,
                        "",
                      );
                      // Insert a "." after the first two digits
                      if (formattedText.length > 2) {
                        setLatitude(
                          formattedText.substring(0, 2) +
                          "." +
                          formattedText.substring(2),
                        );
                      } else {
                        setLatitude(formattedText);
                      }
                    }}
                  />
                </div>
                <div style={{ marginLeft: 5, alignSelf: "end" }}>
                  <button onClick={submit} className="submit_button">
                    submit
                  </button>
                </div>
                <div style={{ marginLeft: 5, alignSelf: "end" }}>
                  <button
                    onClick={() => {
                      history.push("/report-coverage");
                    }}
                    className="submit_button"
                  >
                    Report coverage
                  </button>
                </div>
              </div>}
              <div style={{ textAlign: "end", position: "absolute", right: 10, top: 10 }}>
                <div>Total Reports Generated</div>
                <div style={{ textAlign: "center" }}>
                  {props.serveyReport?.count}
                </div>
              </div>
            </div>
           {currentRouteName === "/survey-all-report" &&<div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 100
              }}
            >
              <Breadcrumb style={{}} className="survey-report-breadcrumb">
                <Breadcrumb.Item
                  onClick={() => handleGetAllindiaState()}
                  active={!selectedState && !selectedCity}
                >
                  All India
                </Breadcrumb.Item>
                {selectedState && (
                  <Breadcrumb.Item
                    onClick={() => handleGetSelectedState(selectedState)}
                    active={selectedState && !selectedCity}
                  >
                    {selectedState}
                  </Breadcrumb.Item>
                )}
                {selectedCity && (
                  <Breadcrumb.Item active={selectedState && selectedCity}>
                    {selectedCity}
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
              <div
                style={{ marginRight: 20 }}
                onClick={() => {
                  refreshTable();
                }}
              >
                {miniLoader ? (
                  <label className="loader-circle-v1"></label>
                ) : (
                  <>
                    <img
                      style={{ height: 30, width: 30 }}
                      src={require("../../assets/images/refresh.png")}
                      alt="sdsd"
                    />
                    <label style={{ paddingLeft: 10 }}>Refresh</label>
                  </>
                )}
              </div>
            </div>
            }
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
              <MUIDataTable
                className="tracks"
                loading={loading}
                data={
                  !isEmpty(props.serveyReport)
                    ? props.serveyReport.table_data.map((data) => ({
                      ...data,
                      longitude:
                        data.request_data?.latLon?.coordinates?.[0] ?? "",
                      latitude:
                        data.request_data?.latLon?.coordinates?.[1] ?? "",
                    }))
                    : []
                }
                columns={columns}
                options={options}
              />
            )}
            {/* } */}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  serveyReport: state.serveyReport.serveyReport,
  isFetching: state.serveyReport.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServeyReport: getServeyReport,
      getServeyRequestReport: getServeyRequestReport,
      getSurveyUserReport: getSurveyUserReport
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
