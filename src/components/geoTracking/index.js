import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import MyLocationTwoToneIcon from "@material-ui/icons/MyLocationTwoTone";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import { decryptStatic } from "../../comman/decodeEncodeData";
import { USER_ID, AES_KEY, USER_ADMIN } from "../../comman/constants";
import { Modal } from "react-bootstrap";
import {
  getGeoLocations,
  getGeoTimeLine,
  setEmptyLocation,
} from "../../action/getGeoTracking";
import { getLocationTracking } from "../../action/locationTracking";
import AgentData from "./agentData";
import LocationtrackingMap from "./locationTracking";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./styles.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import "bootstrap/dist/css/bootstrap.css";
// you will also need the css that comes with bootstrap-daterangepicker
import "bootstrap-daterangepicker/daterangepicker.css";
import ExportModal from "../report/exportxsl";

let DatePicker = null;
class GeoTrackingData extends Component {
  constructor() {
    super();
    this.state = {
      timeline: "today",
      filter: "",
      time: "",
      startdate: "",
      enddate: "",
      dateRange: "",
      showAgentData: false,
      emp_id: "",
      zoneDataValue: "",
      agentName: "",
      centroid: { lat: 20.5937, lng: 78.9629 },
      zoomLevel: 4.4,
      isFetchingTimeline: false,
      aesKey: "",
      admin: false,
      records: [],
    };
    this.mapEnd = React.createRef();
  }

  componentDidMount() {
    _getStorageValue(USER_ID).then((id) => {
      _getStorageValue(AES_KEY).then((key) => {
        this.setState({ aesKey: key });
        console.log("AES_KEY", key);
      });
      this.props.getGeoTimeLine(id, this.state.timeline);
      this.props.getLocationTracking(
        id,
        this.state.emp_id,
        successCallBack,
        failureCallBack,
      );
      var curTime = new Date();
      var dateCU = curTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      this.setState({ time: dateCU });
      setInterval(() => {
        var curTime = new Date();
        var dateCU = curTime.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        this.setState({ time: dateCU });
        this.props.getLocationTracking(
          id,
          this.state.emp_id,
          successCallBack,
          failureCallBack,
        );
      }, 600000);
    });

    _getStorageValue(USER_ADMIN).then((adminValue) => {
      console.log("USER_ADMIN", adminValue);
      this.setState({
        admin: adminValue,
      });
    });
    this.setState({ agentData: this.props.records });
    const successCallBack = (response) => {
      console.log("data-tra", response.data);
    };
    const failureCallBack = (response) => {
      console.log("fail", response);
    };
  }

  onZoneChange(e) {}
  onPickerChange(e) {
    const timelineVal = e.target.value;
    this.setState({
      timeline: e.target.value,
      filter: "",
      startdate: new Date().toISOString().slice(0, 10),
      enddate: new Date().toISOString().slice(0, 10),
      isFetchingTimeline: true,
    });
    _getStorageValue(USER_ID).then((id) => {
      setTimeout(() => {
        this.setState({ isFetchingTimeline: false });
      }, 1000);

      if (timelineVal === "dateRange") {
        this.props.getGeoLocations(
          id,
          this.state.startdate,
          this.state.enddate,
        );
      } else {
        this.props.getGeoTimeLine(id, this.state.timeline);
      }
    });
  }

  componentWillUnmount() {
    this.props.setEmptyLocation();
  }

  render() {
    console.log("status", this.props.status);

    const {
      zoomLevel,
      centroid,
      showAgentData,
      zoneDataValue,
      startdate,
      time,
      enddate,
      dateRange,
      timeline,
      filter,
      onPickerChange,
      //  isFetchingDateDis,
    } = this.state;
    const { records, locationTrackingData, isFetching } = this.props;
    let options = {};
    var columns = [];
    var startGDate = records[0]?.start_date;
    var endGDate = records[0]?.end_date;
    if (records.length > 0) {
      options = {
        responsive: "scroll",
        fixedHeader: true,
        overflowX: "auto",
        filter: false,
        sort: true,
        download: false,
        empty: true,
        index: 10,
        print: true,
        // customSearch: (searchQuery, currentRow, columns,data="") => {
        //   let isFound = false;
        //     console.log("currentRow",currentRow);
        //     console.log("columns",columns);
        //     console.log("data",data);
        //     currentRow.forEach(col => {
        //     if(col !== "" && col !== undefined){
        //      let colData = "";
        //       columns.forEach(data =>{
        //         if(data.name === "agent_name" || data.name === "emp_id" || data.name === "ra_emp_id" || data.name === "ra_emp_name") {
        //           colData = typeof(col) ==="string" ? decryptStatic(col.toString(), this.state.aesKey):"";
        //           if(colData?.toString()??"".toLowerCase()??"".indexOf(searchQuery.toLowerCsae()) >=0){
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
        rowsPerPage: 1000,
        pagination: false,
        textLabels: {
          pagination: {
            next: "Next Page",
            previous: "Previous Page",
            rowsPerPage: "Rows per page:",
            displayRows: "of",
          },
        },
      };
      if (startGDate === undefined) {
        startGDate = "-";
        endGDate = "-";
      } else {
        console.log("get");
      }
      if (records[0]?.agentId !== undefined) {
        columns = [
          {
            name: "agent_name",
            label: "Employee Name",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  overflowX: "auto",
                  position: "sticky",
                  top: "0",
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
                  overflowX: "auto",
                  position: "sticky",
                  top: "0",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 150,
                },
              }),
              // customBodyRenderLite: (value) => {
              //   if (timeline === "yesterday" || timeline === "today") {
              //     return (
              //       <div>
              //         <p style={{ color: "#243473", fontWeight: "bold" }}>
              //           {
              //         decryptStatic(records[value].agent_name,this.state.aesKey)
              //           }
              //         </p>
              //       </div>
              //     );
              //   } else {
              //     return (
              //       <div style={{ display: "flex", justifyContent: "center" }}>
              //         <p
              //           style={{
              //             color: "#053c6d",
              //             fontWeight: "bold",
              //             cursor: "pointer",
              //           }}
              //           // onClick={() => {
              //           //   openAgentData(
              //           //     decryptStatic(records[value].agentId,this.state.aesKey),
              //           //     decryptStatic(records[value].agent_name,this.state.aesKey)
              //           //   );
              //           // }}
              //         >
              //           {decryptStatic(records[value].agent_name,this.state.aesKey)}
              //         </p>
              //         <PersonPinCircleIcon style={{ cursor: "pointer" }} />
              //       </div>
              //     );
              //   }
              // },
            },
          },
          {
            name: "Map View",
            options: {
              filter: false,
              sort: false,
              customBodyRenderLite: (dataIndex) => {
                return (
                  <div
                    onClick={() => {
                      this.mapEnd.current.scrollIntoView({
                        behavior: "smooth",
                      });
                      showMapView(
                        records[dataIndex].agentId,
                        records[dataIndex].agent_name,
                      );
                    }}
                  >
                    <MyLocationTwoToneIcon style={{ cursor: "pointer" }} />
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
            name: "emp_id",
            label: "Employee Id",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p style={{ color: "#243473", fontWeight: "bold" }}>
                      {decryptStatic(records[value].emp_id, this.state.aesKey)}
                    </p>
                  </div>
                );
              },
            },
          },
          {
            name: "ra_emp_id",
            label: "Ra Employee Id",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p style={{ color: "#243473", fontWeight: "bold" }}>
                      {decryptStatic(
                        records[value].ra_emp_id,
                        this.state.aesKey,
                      )}
                    </p>
                  </div>
                );
              },
            },
          },
          {
            name: "ra_emp_name",
            label: "Ra Employee Name",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p style={{ color: "#243473", fontWeight: "bold" }}>
                      {decryptStatic(
                        records[value].ra_emp_name,
                        this.state.aesKey,
                      )}
                    </p>
                  </div>
                );
              },
            },
          },
          {
            name: "city",
            label: "City",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "region",
            label: "Region",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "zone",
            label: "Zone",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "designation",
            label: "Designation",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "video_call_count",
            label: "Virtual Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "countOfClients",
            label: "Onsite Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          // {
          //   name: "avg_client",
          //   label: "Avg Clients",
          //   options: {
          //     filter: true,
          //     sort: true,
          //     setCellProps: () => ({
          //       style: {
          //         whiteSpace: "nowrap",
          //         // position: "sticky",
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
          //         // position: "sticky",
          //         left: 0,
          //         background: "#DCE5E5",
          //         textAlign: "center",
          //         borderRight: "2px solid #A9C4C5",
          //         zIndex: 101,
          //       },
          //     }),
          //   },
          // },
          {
            name: "distanceTravelled",
            label: "Total Distance Travelled",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].distanceTravelled} km</p>
                  </div>
                );
              },
            },
          },
          {
            name: "avg_distance_travelled",
            label: "Avg. Distance Per Client",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].avg_distance_travelled} km</p>
                  </div>
                );
              },
            },
          },
        ];
      } else if (records[0]?.zone !== undefined) {
        columns = [
          {
            name: "zone",
            label: "Zone",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "video_call_count",
            label: "Virtual Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "countOfClients",
            label: "Onsite Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          // {
          //   name: "avg_client",
          //   label: "Avg Clients",
          //   options: {
          //     filter: true,
          //     sort: true,
          //     setCellProps: () => ({
          //       style: {
          //         whiteSpace: "nowrap",
          //         // position: "sticky",
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
          //         // position: "sticky",
          //         left: 0,
          //         background: "#DCE5E5",
          //         textAlign: "center",
          //         borderRight: "2px solid #A9C4C5",
          //         zIndex: 101,
          //       },
          //     }),
          //   },
          // },
          {
            name: "distanceTravelled",
            label: "Total Distance Travelled",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].distanceTravelled} km</p>
                  </div>
                );
              },
            },
          },
          {
            name: "avg_distance_travelled",
            label: "Avg. Distance Per Client",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].avg_distance_travelled} km</p>
                  </div>
                );
              },
            },
          },
        ];
      } else if (records[0]?.region !== undefined) {
        columns = [
          {
            name: "region",
            label: "Region",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "video_call_count",
            label: "Virtual Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "countOfClients",
            label: "Onsite Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          // {
          //   name: "avg_client",
          //   label: "Avg Clients",
          //   options: {
          //     filter: true,
          //     sort: true,
          //     setCellProps: () => ({
          //       style: {
          //         whiteSpace: "nowrap",
          //         // position: "sticky",
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
          //         // position: "sticky",
          //         left: 0,
          //         background: "#DCE5E5",
          //         textAlign: "center",
          //         borderRight: "2px solid #A9C4C5",
          //         zIndex: 101,
          //       },
          //     }),
          //   },
          // },
          {
            name: "distanceTravelled",
            label: "Total Distance Travelled",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].distanceTravelled} km</p>
                  </div>
                );
              },
            },
          },
          {
            name: "avg_distance_travelled",
            label: "Avg. Distance Per Client",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].avg_distance_travelled} km</p>
                  </div>
                );
              },
            },
          },
        ];
      } else if (records[0]?.city !== undefined) {
        columns = [
          {
            name: "city",
            label: "City",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "video_call_count",
            label: "Virtual Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          {
            name: "countOfClients",
            label: "Onsite Visit Count",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
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
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
            },
          },
          // {
          //   name: "avg_client",
          //   label: "Avg Clients",
          //   options: {
          //     filter: true,
          //     sort: true,
          //     setCellProps: () => ({
          //       style: {
          //         whiteSpace: "nowrap",
          //         // position: "sticky",
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
          //         // position: "sticky",
          //         left: 0,
          //         background: "#DCE5E5",
          //         textAlign: "center",
          //         borderRight: "2px solid #A9C4C5",
          //         zIndex: 101,
          //       },
          //     }),
          //   },
          // },
          {
            name: "distanceTravelled",
            label: "Total Distance Travelled",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].distanceTravelled} km</p>
                  </div>
                );
              },
            },
          },
          {
            name: "avg_distance_travelled",
            label: "Avg. Distance Per Client",
            options: {
              filter: true,
              sort: true,
              setCellProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: "0",
                  background: timeline === "today" ? "#f5f5f5" : "#ffffff",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 100,
                },
              }),
              setCellHeaderProps: () => ({
                style: {
                  whiteSpace: "nowrap",
                  // position: "sticky",
                  left: 0,
                  background: "#DCE5E5",
                  textAlign: "center",
                  borderRight: "2px solid #A9C4C5",
                  zIndex: 101,
                },
              }),
              customBodyRenderLite: (value) => {
                return (
                  <div>
                    <p>{records[value].avg_distance_travelled} km</p>
                  </div>
                );
              },
            },
          },
        ];
      }
    }

    const onSelectChange = (e) => {
      const selectFilter = e.target.value;
      this.setState({
        filter: e.target.value,
        timeline,
        timelineFilter: selectFilter,
      });
      _getStorageValue(USER_ID).then((id) => {
        if (timeline === "dateRange") {
          this.props.getGeoLocations(
            id,
            this.state.startdate,
            this.state.enddate,
            this.state.filter,
          );
        } else {
          this.props.getGeoTimeLine(
            id,
            this.state.timeline,
            this.state.timelineFilter,
          );
        }
      });
    };
    const openAgentData = (id, name) => {
      var agTimeLine = this.state.timeline;
      var agStartDate = this.state.startdate;
      var agEndDate = this.state.enddate;
      this.setState({
        agentID: id,
        agentName: name,
        agentTimeLine: agTimeLine,
        agentidStart: agStartDate,
        agentidEnd: agEndDate,
        showAgentData: !showAgentData,
      });
    };
    const showMapView = (id, name) => {
      this.setState({ emp_id: id });
      this.setState({ agentName: name });
      _getStorageValue(USER_ID).then((id) => {
        this.props.getLocationTracking(
          id,
          this.state.emp_id,
          successMapCallBack,
          failureMapCallBack,
        );
      });
      const successMapCallBack = (response) => {
        this.setState({
          centroid: {
            lat: parseFloat(response.data[0].latitude),
            lng: parseFloat(response.data[0].longitude),
          },
          zoomLevel: 16.4,
        });
      };
      const failureMapCallBack = (response) => {
        console.log("fail");
      };
    };
    const handleEvent = (event, picker) => {};
    const handleShow = (event, picker) => {
      DatePicker = picker;
    };
    const handleCallback = (start, end, label) => {
      const diff = DatePicker.endDate.diff(DatePicker.startDate, "days");
      if (diff > 30) {
        toast.warning("You cannot select more than 30 days", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
      function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }
      this.setState({
        filter: "",
        startdate: convert(start._d),
        enddate: convert(end),
      });
      _getStorageValue(USER_ID).then((id) => {
        this.props.getGeoLocations(
          id,
          this.state.startdate,
          this.state.enddate,
        );
      });
    };

    return (
      <>
        {
          <div className="geo-table-container">
            <div className="geo-tracking-sections">
              <div className="tracking-filter">
                <div className="region-select">
                  <label>Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => this.onPickerChange(e)}
                  >
                    <option value="today" label="Today" />
                    <option value="yesterday" label="Yesterday" />
                    <option value="week" label="Week" />
                    <option value="month" label="Month" />
                    <option value="dateRange" label="Date Range" />
                  </select>
                </div>
                <div className="region-select">
                  <label>Date Range</label>
                  {(() => {
                    if (timeline === "dateRange") {
                      return (
                        <div className="select-picker">
                          <DateRangePicker
                            onEvent={handleEvent}
                            onCallback={handleCallback}
                            onShow={handleShow}
                          >
                            <input value={startdate + " / " + enddate} />
                          </DateRangePicker>
                          {this.state.isFetchingTimeline == true ? (
                            <div className="loader-cate"></div>
                          ) : null}
                        </div>
                      );
                    } else {
                      return (
                        <div className="select-picker">
                          {this.state.isFetchingTimeline == true ? (
                            <div className="loader-border">
                              <div className="loader-cate"></div>
                            </div>
                          ) : (
                            <label className="date-disp">
                              {startGDate + " / " + endGDate}
                            </label>
                          )}
                        </div>
                      );
                    }
                  })()}
                </div>
                <div className="region-select">
                  <label>Aggregate based on</label>
                  <select value={this.state.filter} onChange={onSelectChange}>
                    <option value="none" label="Select" />
                    <option value="zone" label="Zone" />
                    <option value="region" label="Region" />
                    <option value="city" label="City" />
                  </select>
                </div>
                {this.state.admin === "true" && (
                  <ExportModal geoLocation={true} />
                )}
                {(() => {
                  // if (filter === "zone") {
                  //   return (
                  //     <div className="region-select">
                  //       <label>Zone</label>
                  //       <div className="down-arrow">
                  //         <select value={zoneDataValue} onChange={(e) => this.onZoneChange(e)}>
                  //           <option value="NaN" label="Select" />
                  //           {/* {zoneData.map((data, key) => {
                  //             return (
                  //               <option key={data.id} value={data.id} label={data.name} />
                  //             );
                  //           })} */}
                  //         </select>
                  //         {/* {isFetchingState ? (
                  //           <div className="loader-cate"></div>
                  //         ) : null} */}
                  //       </div>
                  //     </div>
                  //   );
                  // } else if (filter === "region") {
                  //   return (<div>
                  //     <div className="region-select">
                  //       <label>Region</label>
                  //       <div className="down-arrow">
                  //         <select value={zoneDataValue} onChange={(e) => this.onZoneChange(e)}>
                  //           <option value="NaN" label="Select" />
                  //           {/* {zoneData.map((data, key) => {
                  //             return (
                  //               <option key={data.id} value={data.id} label={data.name} />
                  //             );
                  //           })} */}
                  //         </select>
                  //         {/* {isFetchingState ? (
                  //           <div className="loader-cate"></div>
                  //         ) : null} */}
                  //       </div>
                  //     </div>
                  //   </div>);
                  // } else if (filter === "city") {
                  //   return (
                  //     <div>
                  //       <div className="region-select">
                  //         <label>City</label>
                  //         <div className="down-arrow">
                  //           <select value={zoneDataValue} onChange={(e) => this.onZoneChange(e)}>
                  //             <option value="NaN" label="Select" />
                  //             {/* {zoneData.map((data, key) => {
                  //             return (
                  //               <option key={data.id} value={data.id} label={data.name} />
                  //             );
                  //           })} */}
                  //           </select>
                  //           {/* {isFetchingState ? (
                  //           <div className="loader-cate"></div>
                  //         ) : null} */}
                  //         </div>
                  //       </div>
                  //     </div>);
                  // }
                })()}
              </div>
              {isFetching ? (
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
                  // title={"Geo Tracking"}
                  data={records.map((data) => ({
                    ...data,
                    agent_name: decryptStatic(
                      data.agent_name,
                      this.state.aesKey,
                    ),
                  }))}
                  columns={columns}
                  options={options}
                />
              )}
              <div className="locationtracking-sections">
                <div className="latest-time">
                  <label>Last updated at : </label>
                  <span> {this.state.time}</span>
                </div>
                {records.length > 0 && (
                  <div ref={this.mapEnd} className="geo-tracking-locations">
                    <LocationtrackingMap
                      zoomLevel={zoomLevel}
                      centroid={centroid}
                      center={centroid}
                      geoCentroid={(response) => {
                        this.setState({ centroid: response, zoomLevel: 14.5 });
                      }}
                      locationTrackingData={locationTrackingData}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Modal
                show={this.state.showAgentData}
                onHide={() =>
                  this.setState({
                    showAgentData: !showAgentData,
                  })
                }
                size="lg"
                className="report-modal"
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header>
                  <p>Agent Details</p>
                  <img
                    className="cursor-close"
                    src={require("../../assets/images/minus.png")}
                    onClick={() => {
                      this.setState({
                        showAgentData: !showAgentData,
                      });
                    }}
                  />
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <AgentData
                      agentID={this.state.agentID}
                      agentName={this.state.agentName}
                      agentTimeLine={this.state.agentTimeLine}
                      agentidStart={this.state.agentidStart}
                      agentidEnd={this.state.agentidEnd}
                    />
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  records: state.geoTracking.records,
  locationTrackingData: state.getLocationTracking.locationTrackingData,
  isFetching: state.geoTracking.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getGeoLocations: getGeoLocations,
      getGeoTimeLine: getGeoTimeLine,
      getLocationTracking: getLocationTracking,
      setEmptyLocation: setEmptyLocation,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GeoTrackingData);
