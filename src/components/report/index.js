import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory, useLocation } from "react-router-dom";

import { _getStorageValue } from "../../comman/localStorage";
import Pathbox from "../path-box";
import CircularProgress from "@material-ui/core/CircularProgress";
// import { decryptStatic} from "../../comman/decodeEncodeData";
import { USER_ID, AES_KEY, USER_ADMIN } from "../../comman/constants";
import {
  getReportYear,
  getAnalyticsReport,
  getStateRequestReport,
  getBranchContactData,
  getAgencyContactData,
  getTotalAgencyBranchCount,
} from "../../action/reportAnalytics";
import ExportModal from "./exportxsl";

const Report = (props) => {
  const history = useHistory();
  const fromLocation = useLocation();
  const [aeskey, setAesKey] = useState("");
  const [connection, setConnection] = useState("Branch");
  const [currentYear, setYear] = useState("");
  const [aggregate, setAggregate] = useState("State");
  const [isZoneAggregate, setIsZoneAggregate] = useState(false);
  const [previousState, setPreviousState] = useState([]);
  const [stateValue, setStateValue] = useState("");
  const [stateZoneValue, setStateZoneValue] = useState("");
  const [zoneValue, setZoneValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [branchValue, setBranchValue] = useState("");
  const [agencyValue, setAgencyValue] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    let callingFromBranch =
      fromLocation.state && fromLocation.state.callingFromBranch;
    let callingFromAgency =
      fromLocation.state && fromLocation.state.callingFromAgency;
    if (isReset) {
      callingFromBranch = false;
      callingFromAgency = false;
    }
    if (callingFromBranch || callingFromAgency) {
      console.log("Getting from previous page One!!");
    } else {
      _getStorageValue(USER_ID).then((id) => {
        _getStorageValue(AES_KEY).then((key) => {
          setAesKey(key);
        });
        props.getReportYear(id, connection);
      });
    }
  }, [connection]);

  useEffect(() => {
    setIsLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      _getStorageValue(AES_KEY).then((key) => {
        setAesKey(key);
      });
      props.getReportYear(id, connection);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    _getStorageValue(USER_ADMIN).then((adminValue) => {
      setAdmin(adminValue);
    });
  }, []);

  useEffect(() => {
    const connectionValue =
      fromLocation.state && fromLocation.state.connectionValue;
    const currentYearValue =
      fromLocation.state && fromLocation.state.currentYearValue;
    if (!!currentYearValue && !!connectionValue) {
      let timeLineYear = currentYearValue.split("-");
      _getStorageValue(USER_ID).then((id) => {
        if (timeLineYear[1])
          props.getTotalAgencyBranchCount(
            id,
            connectionValue,
            aggregate,
            timeLineYear[0],
            timeLineYear[1],
          );
      });
    }
  }, []);

  useEffect(() => {
    let callingFromBranch =
      fromLocation.state && fromLocation.state.callingFromBranch;
    let callingFromAgency =
      fromLocation.state && fromLocation.state.callingFromAgency;
    if (isReset) {
      callingFromBranch = false;
      callingFromAgency = false;
    }
    if (callingFromBranch || callingFromAgency) {
    } else {
      let timeLineYear = currentYear.split("-");
      _getStorageValue(USER_ID).then((id) => {
        if (timeLineYear[1])
          props.getTotalAgencyBranchCount(
            id,
            connection,
            aggregate,
            timeLineYear[0],
            timeLineYear[1],
          );
      });
    }
  }, [connection, props.analyticsReport, currentYear]);

  useEffect(() => {
    let callingFromBranch =
      fromLocation.state && fromLocation.state.callingFromBranch;
    let callingFromAgency =
      fromLocation.state && fromLocation.state.callingFromAgency;
    const stateName = fromLocation.state && fromLocation.state.stateName;
    const stateNameValue =
      fromLocation.state && fromLocation.state.stateNameValue;
    const zoneName = fromLocation.state && fromLocation.state.zoneName;
    const zoneNameValue =
      fromLocation.state && fromLocation.state.zoneNameValue;
    const stateZoneName =
      fromLocation.state && fromLocation.state.stateZoneName;
    const cityName = fromLocation.state && fromLocation.state.cityName;
    const connectionValue =
      fromLocation.state && fromLocation.state.connectionValue;
    const currentYearValue =
      fromLocation.state && fromLocation.state.currentYearValue;
    if (isReset) {
      callingFromBranch = false;
      callingFromAgency = false;
    }
    if (callingFromBranch || callingFromAgency) {
      if (connectionValue && currentYearValue) {
        setConnection(connectionValue);
        setYear(currentYearValue);
      }
      if (stateName) {
        setTimeout(() => {
          updateByState(stateName);
        }, 1000);
      }
      if (cityName) {
        setTimeout(() => {
          updateByCity(cityName);
        }, 1000);
      }
      if (zoneName) {
        setTimeout(() => {
          setIsZoneAggregate(true);
          updateByZone(zoneName);
        }, 1000);
      }
      if (stateZoneName) {
        setTimeout(() => {
          setIsZoneAggregate(true);
          updateByZoneState(stateZoneName);
        }, 1000);
      }
      if (zoneNameValue) {
        setTimeout(() => {
          setZoneValue(zoneNameValue);
        }, 1000);
      }
      if (stateNameValue) {
        setTimeout(() => {
          setStateValue(stateNameValue);
        }, 1000);
      }
    } else {
      console.log("On same page!!");
    }
  }, [connection, currentYear, stateValue, zoneValue]);

  useEffect(() => {
    let callingFromBranch =
      fromLocation.state && fromLocation.state.callingFromBranch;
    let callingFromAgency =
      fromLocation.state && fromLocation.state.callingFromAgency;
    if (isReset) {
      callingFromBranch = false;
      callingFromAgency = false;
    }
    if (callingFromBranch || callingFromAgency) {
      console.log("Getting from previous page!! Three", fromLocation);
    } else {
      if (!!currentYear && !!connection && !!props.year) {
        let timeLineYear = currentYear.split("-");
        _getStorageValue(USER_ID).then((id) => {
          _getStorageValue(AES_KEY).then((key) => {
            setAesKey(key);
          });
          if (connection === "Branch") {
            setAggregate("State");
            setIsZoneAggregate(false);
            props.getAnalyticsReport(
              id,
              connection,
              "State",
              timeLineYear[0],
              timeLineYear[1],
            );
          } else if (connection === "Agency") {
            setAggregate("State");
            setIsZoneAggregate(true);
            props.getAnalyticsReport(
              id,
              connection,
              "State",
              timeLineYear[0],
              timeLineYear[1],
            );
          }
        });
      }
    }
  }, [currentYear, props.year]);

  const resetAll = () => {
    setIsReset(true);
    setStateValue("");
    setStateZoneValue("");
    setZoneValue("");
    setCityValue("");
    setBranchValue("");
    setAgencyValue("");
    if (!!currentYear && !!connection) {
      let timeLineYear = currentYear.split("-");
      _getStorageValue(USER_ID).then((id) => {
        _getStorageValue(AES_KEY).then((key) => {
          setAesKey(key);
        });
        if (connection === "Branch") {
          setAggregate("State");
          setIsZoneAggregate(false);
          props.getAnalyticsReport(
            id,
            connection,
            "State",
            timeLineYear[0],
            timeLineYear[1],
          );
        } else if (connection === "Agency") {
          setIsZoneAggregate(true);

          setTimeout(() => {
            setAggregate("State");
          }, 100);
          props.getAnalyticsReport(
            id,
            connection,
            "State",
            timeLineYear[0],
            timeLineYear[1],
          );
        }
      });
    }
  };

  const resetStates = () => {
    setIsReset(true);
    setYear("");
    setPreviousState([]);
    setStateValue("");
    setStateZoneValue("");
    setZoneValue("");
    setCityValue("");
    setBranchValue("");
    setAgencyValue("");
  };

  const onYearChange = (e) => {
    resetStates();
    setYear(e.target.value);
  };

  const onConnectChange = (e) => {
    resetStates();
    setConnection(e.target.value);
    let value = e.target.value;
    _getStorageValue(USER_ID).then((id) => {
      props.getReportYear(id, value);
    });
  };

  const reportData = useMemo(() => {
    let reportData = [];
    let keys = Object.keys(props.analyticsReport);
    let keysOnState = Object.keys(props.stateToCityReport);
    if (keys.length > 0 || keysOnState.length > 0) {
      if (aggregate === "Zone") {
        keys.forEach((each) => {
          reportData = [
            ...reportData,
            { ...props.analyticsReport[each], state: each },
          ];
        });
      } else if (aggregate === "State" && isZoneAggregate) {
        keys.forEach((each) => {
          reportData = [
            ...reportData,
            { ...props.analyticsReport[each], state: each },
          ];
        });
        setPreviousState(reportData);
      } else if (aggregate === "Agency") {
        if (Array.isArray(props.stateToCityReport)) {
          props.stateToCityReport.forEach((each, index) => {
            reportData = [
              ...reportData,
              {
                ...props.stateToCityReport[index],
                visited: each.exists_in_agency ? "Yes" : "No",
              },
            ];
          });
        } else {
          console.log("cannot get stateToCity data");
        }
      } else if (aggregate === "City") {
        keysOnState.forEach((each) => {
          reportData = [
            ...reportData,
            { ...props.stateToCityReport[each], city: each },
          ];
        });
        setPreviousState(reportData);
      } else if (aggregate === "Branch") {
        if (Array.isArray(props.stateToCityReport)) {
          props.stateToCityReport.forEach((each, index) => {
            reportData = [
              ...reportData,
              {
                ...props.stateToCityReport[index],
                visited: each.exists_in_branch ? "Yes" : "No",
              },
            ];
          });
        } else {
          console.log("cannot get stateToCity data");
        }
      } else {
        keys.forEach((each) => {
          reportData = [
            ...reportData,
            { ...props.analyticsReport[each], state: each },
          ];
        });
      }
      return reportData;
    } else {
      return [];
    }
  }, [props.stateToCityReport, props.analyticsReport, connection]);

  const yearFieldDataSoucrce = useMemo(() => {
    let yearValue = props.year ?? [];
    let updatedyear = [];
    if (yearValue.length > 0) {
      props.year.forEach((each) => {
        let eachValue = [
          { label: `${each} H1 `, value: `h1-${each}` },
          { label: `${each} H2 `, value: `h2-${each}` },
        ];
        updatedyear = [...updatedyear, ...eachValue];
      });
      setYear(updatedyear?.[0]?.value ?? "");
    }
    return updatedyear;
  }, [props.year]);

  const onAggregateChange = (e) => {
    setAggregate(e.target.value);
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
    viewColumns: true,
    selectableRows: false,
    pagination: false,
    textLabels: {
      showResponsive: true,
      rowsPerPage: "Total items Per Page",
    },
  };

  const updateByState = async (state) => {
    setAggregate("City");
    setStateValue(state);
    if (cityValue != "") {
      setCityValue("");
    }
    // props.getStateRequestReport(state)
    if (!!aggregate && !!currentYear && !!connection) {
      let timeLineYear = currentYear.split("-");
      try {
        let id = await _getStorageValue(USER_ID);
        let key = await _getStorageValue(AES_KEY);
        setAesKey(key);
        await props.getStateRequestReport(
          id,
          connection,
          "City",
          timeLineYear[0],
          timeLineYear[1],
          state,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateByZone = async (zone) => {
    setAggregate("State");
    // setZoneValue("State");
    // if (stateZoneValue !== "") {
    //   setStateZoneValue("");
    // }
    let connection = "Agency";
    // props.getStateRequestReport(state)
    if (!!aggregate && !!currentYear && !!connection) {
      let timeLineYear = currentYear.split("-");

      try {
        let id = await _getStorageValue(USER_ID);
        let key = await _getStorageValue(AES_KEY);
        setAesKey(key);
        await props.getStateRequestReport(
          id,
          connection,
          "State",
          timeLineYear[0],
          timeLineYear[1],
          zone,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateByZoneState = async (stateZone) => {
    setAggregate("Agency");
    setStateZoneValue(stateZone);
    let connection = "Agency";
    // props.getStateRequestReport(state)
    if (!!aggregate && !!currentYear && !!connection) {
      let timeLineYear = currentYear.split("-");
      try {
        let id = await _getStorageValue(USER_ID);
        let key = await _getStorageValue(AES_KEY);
        setAesKey(key);
        await props.getStateRequestReport(
          id,
          connection,
          "Analytics",
          timeLineYear[0],
          timeLineYear[1],
          stateZone,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateByCity = async (city) => {
    setAggregate("Branch");
    setCityValue(city);
    // props.getStateRequestReport(state)
    if (!!aggregate && !!currentYear && !!connection) {
      let timeLineYear = currentYear.split("-");
      try {
        let id = await _getStorageValue(USER_ID);
        let key = await _getStorageValue(AES_KEY);
        setAesKey(key);
        await props.getStateRequestReport(
          id,
          connection,
          "Analytics",
          timeLineYear[0],
          timeLineYear[1],
          city,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateByBranch = (value) => {
    // setBranchValue(value)
    if (value && value.exists_in_branch) {
      let timeLineYear = currentYear.split("-");
      _getStorageValue(USER_ID).then((id) => {
        _getStorageValue(AES_KEY).then((key) => {
          setAesKey(key);
        });

        let data = {
          stateValue: stateValue,
          cityValue: cityValue,
          branchValue: value.branch + "-" + value.sol_id,
          aggregateBy: aggregate,
          ifsc_code: value.sol_id,
          timeLineYear: timeLineYear,
          currentYear: currentYear,
          connection: connection,
        };
        props.getBranchContactData(
          id,
          value.IFSC_code,
          timeLineYear[0],
          timeLineYear[1],
        );
        history.push("/reports-data", data);
      });
    }
  };

  const updateByAgency = (value) => {
    // setAgencyValue(value)
    let timeLineYear = currentYear.split("-");
    _getStorageValue(USER_ID).then((id) => {
      _getStorageValue(AES_KEY).then((key) => {
        setAesKey(key);
      });
      let data = {
        stateZoneValue: stateZoneValue,
        zoneValue: zoneValue,
        agencyValue: value.agency_name,
        aggregateBy: aggregate,
        agency_id: value.agency_id,
        timeLineYear: timeLineYear,
        currentYear: currentYear,
        connection: connection,
      };
      props.getAgencyContactData(
        id,
        value.agency_id,
        timeLineYear[0],
        timeLineYear[1],
      );
      history.push("/reports-data", data);
    });
  };

  const columns = useMemo(() => {
    let columns = [];
    if (aggregate === "Zone") {
      columns = [
        {
          name: "state",
          label: "State",
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
                  onClick={() => updateByZone(reportData[value].state)}
                >
                  {reportData[value].state}
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
          name: "visited",
          label: "Visits Completed",
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
          name: "not_visited",
          label: "Visits not Completed",
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
    } else if (aggregate === "State" && isZoneAggregate) {
      columns = [
        // {
        //   name: "zone",
        //   label: "Zone",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        {
          name: "state",
          label: "State",
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
                  onClick={() => updateByZoneState(reportData[value].state)}
                >
                  {reportData[value].state}
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
          name: "visited",
          label: "Visits Completed",
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
          name: "not_visited",
          label: "Visits not Completed",
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
    } else if (aggregate === "Agency" && isZoneAggregate) {
      columns = [
        // {
        //   name: "zone",
        //   label: "Zone",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        // {
        //   name: "state",
        //   label: "State",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        {
          name: "agency_name",
          label: "Agency",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value) => {
              if (reportData[value].exists_in_agency) {
                return (
                  <div
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#2F80ED",
                    }}
                    onClick={() => updateByAgency(reportData[value])}
                  >
                    {reportData[value].agency_name}
                  </div>
                );
              } else {
                return (
                  <div style={{ cursor: "no-pointer" }}>
                    {reportData[value].agency_name}
                  </div>
                );
              }
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
          name: "visited",
          label: "Visit Completed",
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
      ];
    } else if (aggregate === "State") {
      columns = [
        {
          name: "state",
          label: "State",
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
                  onClick={() => updateByState(reportData[value].state)}
                >
                  {reportData[value].state}
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
          name: "visited",
          label: "Visits Completed",
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
          name: "not_visited",
          label: "Visits not Completed",
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
    } else if (aggregate === "City") {
      columns = [
        // {
        //   name: "state",
        //   label: "State",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        {
          name: "city",
          label: "City",
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
                  onClick={() => updateByCity(reportData[value].city)}
                >
                  {reportData[value].city}
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
          name: "visited",
          label: "Visits Completed",
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
          name: "not_visited",
          label: "Visits not Completed",
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
    } else if (aggregate == "Branch") {
      columns = [
        // {
        //   name: "state",
        //   label: "State",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        // {
        //   name: "city",
        //   label: "City",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     setCellProps: () => ({
        //       style: {
        //         whiteSpace: "nowrap",
        //         position:"sticky",
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
        //         position:"sticky",
        //         left: 0,
        //         background: "#DCE5E5",
        //         textAlign: "left",
        //         borderRight: "2px solid #A9C4C5",
        //         zIndex: 150,
        //       },
        //     }),
        //   },
        // },
        {
          name: "branch",
          label: "Branch",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value) => {
              if (reportData[value].exists_in_branch) {
                return (
                  <div
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#2F80ED",
                    }}
                    onClick={() => updateByBranch(reportData[value])}
                  >
                    {reportData[value] &&
                    reportData[value].branch &&
                    reportData[value].sol_id
                      ? reportData[value].branch +
                        " - " +
                        reportData[value].sol_id
                      : " "}
                  </div>
                );
              } else {
                return (
                  <div style={{ cursor: "no-drop" }}>
                    {reportData[value].branch +
                      " - " +
                      reportData[value].sol_id}
                  </div>
                );
              }
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
          name: "visited",
          label: "Visit Completed",
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
  }, [aggregate, connection, reportData, props.stateToCityReport]);

  return (
    <div className="geo-table-container">
      <div className="geo-tracking-sections">
        <div
          className="tracking-filter"
          style={{ justifyContent: "space-between" }}
        >
          <div style={{ display: "flex" }}>
            <div className="region-select">
              <label>Connect</label>
              <select value={connection} onChange={(e) => onConnectChange(e)}>
                <option value="Branch" label="Branch connect" />
                <option value="Agency" label="Agency connect" />
              </select>
            </div>
            <div className="region-select">
              <label>Year</label>
              <select value={currentYear} onChange={(e) => onYearChange(e)}>
                {yearFieldDataSoucrce.map((data) => {
                  return <option value={data.value} label={data.label} />;
                })}
              </select>
            </div>
            {isAdmin === "true" && <ExportModal />}
          </div>
          <div className="counts-container">
            <div className="region-select">
              <label>Total Visited</label>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {props?.totalAgencyBranchCount?.visited ?? 0}
              </div>
            </div>
            <div className="region-select">
              <label>Total Not Visited</label>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {props?.totalAgencyBranchCount?.not_visited ?? 0}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {(stateValue != "" || stateZoneValue != "") && (
              <div
                style={{
                  display: "flex",
                  color: "#f5f5f5",
                  backgroundColor: "#0bafaf",
                  border: "1px solid black",
                  width: "150px",
                  height: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={resetAll}
              >
                <p>All India</p>
              </div>
            )}
            <Pathbox
              updateByState={updateByState}
              updateByZone={updateByZone}
              updateByCity={updateByCity}
              updateByZoneState={updateByZoneState}
              updateByBranch={updateByBranch}
              updateByAgency={updateByAgency}
              stateValue={stateValue}
              stateZoneValue={stateZoneValue}
              cityValue={cityValue}
              zoneValue={zoneValue}
              branchValue={branchValue}
              agencyValue={agencyValue}
              aggregateBy={aggregate}
              resetStates={resetStates}
              fetching={props.isFetchingReport}
            />
          </div>
          {props.isFetchingReport || loading ? (
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
              data={reportData}
              columns={columns}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  year: state.reportAnalytics.years,
  analyticsReport: state.reportAnalytics.analyticsReport,
  stateToCityReport: state.reportAnalytics.stateToCityReport,
  isFetchingReport: state.reportAnalytics.isFetchingReport,
  totalAgencyBranchCount: state.getReportsData.totalAgencyBranchCount,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getReportYear: getReportYear,
      getAnalyticsReport: getAnalyticsReport,
      getStateRequestReport: getStateRequestReport,
      // getBranchRequestReport:getBranchRequestReport
      getAgencyContactData: getAgencyContactData,
      getBranchContactData: getBranchContactData,
      getTotalAgencyBranchCount: getTotalAgencyBranchCount,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
