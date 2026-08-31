import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { getAgentData } from "../../action/getGeoTracking";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import MyLocationTwoToneIcon from "@material-ui/icons/MyLocationTwoTone";
import { ACCESS_TOKEN, USER_ID } from "../../comman/constants";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./styles.css";
import InsertUser from "./insertUser";
import { getUsers } from "../../action/usersAction";
import DatePicker from "react-datepicker";
import axios from "axios";
import LocationtrackingMap from "../geoTracking/locationTracking";
import "../geoTracking/styles.css";

import "react-datepicker/dist/react-datepicker.css";
import { employeeEcelExport } from "../../comman/urls";
import { decryptStatic } from "../../comman/decodeEncodeData";
import { useHistory } from "react-router-dom";

const UsersList = (props) => {
  const [isAdded, setAdd] = useState(false);
  const [currentuser, setCurrentuser] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(4.4);
  const [centroid, setCentroid] = useState({ lat: 20.5937, lng: 78.9629 });
  const [eName, setEName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [allMarker, setMarkersData] = useState([]);

  const history = useHistory();

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
    viewColumns: true,
    selectableRows: false,
    count: props.usersData?.[0]?.not_logged_in,
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
  useEffect(() => {
    let isAdd = new URLSearchParams(props.location.search).get("add");
    if (isAdd) {
      setAdd(true);
    } else {
      setAdd(false);
      setCurrentuser(false);
    }
  }, [props.location.search]);

  const mapEnd = useRef();
  useEffect(() => {
    if (!isAdded) {
      getUsersapi();
    }
  }, [isAdded]);

  const getUsersapi = (currentPagePagination = 1) => {
    _getStorageValue(USER_ID).then((id) => {
      props.getUsers(id, currentPagePagination);
    });
  };

  const showMapView = (lat, lon, ename) => {
    if (!lat && !lon) {
      return;
    }
    setCentroid({
      lat: parseFloat(lat),
      lng: parseFloat(lon),
    });
    setMarkersData([{ latitude: lat, longitude: lon }]);
    setZoomLevel(16.4);
    setEName(ename);
  };

  const customRenderBody = (value, key) => {
    return (
      <div>
        <p style={{}}>
          {`${props.usersData?.[0]?.employee_details[value][key] || ""} `}
        </p>
      </div>
    );
  };

  const customEmpID = (value, key) => {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setCurrentuser(props.usersData?.[0]?.employee_details[value]);
          history.push("/users?add=true");
          setAdd(true);
        }}
      >
        <p
          style={{
            color: "#243473",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          {props.usersData?.[0]?.employee_details[value][key]}
        </p>
      </div>
    );
  };

  const columns = useMemo(() => {
    const cellStyle = {
      whiteSpace: "nowrap",
      // position: "sticky",
      left: "0",
      background: "#ffffff",
      textAlign: "center",
      borderRight: "2px solid #A9C4C5",
      zIndex: 100,
    };
    const cellHeader = {
      whiteSpace: "nowrap",
      // position: "sticky",
      left: 0,
      background: "#DCE5E5",
      textAlign: "center",
      borderRight: "2px solid #A9C4C5",
      // zIndex: 101,
    };
    setMarkersData(props.usersData?.[0]?.employee_details);
    return [
      {
        name: "emp_id",
        label: "Employee ID",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: {
              whiteSpace: "nowrap",
              background: "#ffffff",
              textAlign: "center",
              borderRight: "2px solid #A9C4C5",
              left: 0,
              position: "sticky",
              top: 0,
              zIndex: 0,
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
            },
            className: "report-z-index",
          }),
          customBodyRenderLite: (value) => customEmpID(value, "emp_id"),
        },
      },
      {
        name: "emp_name",
        label: "Employee name",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) => customRenderBody(value, "emp_name"),
        },
      },
      {
        name: "ra_emp_id",
        label: "ra emp id",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "ra_emp_name",
        label: "ra emp name",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "region",
        label: "region",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "city",
        label: "City",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) => customRenderBody(value, "city"),
        },
      },
      {
        name: "state",
        label: "State",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) => customRenderBody(value, "state"),
        },
      },
      {
        name: "designation",
        label: "Designation",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) =>
            customRenderBody(value, "designation"),
        },
      },
      {
        name: "department",
        label: "Department",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) =>
            customRenderBody(value, "department"),
        },
      },
      {
        name: "base_hub",
        label: "Base hub",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) => customRenderBody(value, "base_hub"),
        },
      },
      {
        name: "working_cpc",
        label: "Working cpc",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "branch",
        label: "Branch",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) => customRenderBody(value, "branch"),
        },
      },

      {
        name: "latitude",
        label: "latitude",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "longitude",
        label: "longitude",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
        },
      },
      {
        name: "is_logged_in_today",
        label: "Is logged in today",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          customBodyRenderLite: (value) =>
            customRenderBody(value, "is_logged_in_today"),
        },
      },
      {
        name: "last_login_datetime",
        label: "Last login time",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          // customBodyRenderLite:(value)=>(customRenderBody(value,"is_logged_in_today"))
        },
      },
      {
        name: "last_live_latitude_today",
        label: "Last live latitude",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          // customBodyRenderLite:(value)=>(customRenderBody(value,"is_logged_in_today"))
        },
      },
      {
        name: "last_live_longitude_today",
        label: "Last live longitude",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          // customBodyRenderLite:(value)=>(customRenderBody(value,"is_logged_in_today"))
        },
      },
      {
        name: "last_live_today",
        label: "last live date",
        options: {
          filter: true,
          sort: true,
          setCellProps: () => ({
            style: cellStyle,
          }),
          setCellHeaderProps: () => ({
            style: cellHeader,
          }),
          // customBodyRenderLite:(value)=>(customRenderBody(value,"is_logged_in_today"))
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
                  mapEnd.current.scrollIntoView({
                    behavior: "smooth",
                  });

                  showMapView(
                    props.usersData?.[0]?.employee_details[dataIndex].latitude,
                    props.usersData?.[0]?.employee_details[dataIndex].longitude,
                    props.usersData?.[0]?.employee_details[dataIndex],
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
              // position:"sticky",
              left: "0",
              background: "#ffffff",
              textAlign: "center",
              borderRight: "2px solid #A9C4C5",
              // zIndex: 9999,
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
              // zIndex: 9999,
            },
          }),
        },
      },
    ];
  }, [props.usersData?.[0]?.employee_details]);

  const exportExcel = () => {
    _getStorageValue(USER_ID).then(async (id) => {
      _getStorageValue(ACCESS_TOKEN).then(async (token) => {
        let surveyurl = employeeEcelExport(id);
        const response = await axios.get(surveyurl, {
          headers: {
            authorization: token,
          },
          responseType: "blob", // Important for binary data like PDFs
        });
        const blob = new Blob([response.data], { type: "application/xlsx" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employee.xlsx`;
        a.click();
      });
    });
  };
  return (
    <div>
      <div>
        <div className="geo-table-container">
          {props.isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              {!isAdded ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", width: "50%" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 5,
                        }}
                      >
                        <div className="add-Button">
                          <button
                            onClick={() => {
                              history.push("/users?add=true");
                              setAdd(true);
                            }}
                          >
                            Add Employee
                          </button>
                        </div>
                        <div className="add-Button">
                          <button
                            onClick={() => {
                              exportExcel();
                            }}
                          >
                            Excel export
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "50%",
                        justifyContent: "flex-end",
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      <div className="counts-container">
                        <div className="region-select">
                          <label>Total Logged in </label>
                          <div
                            style={{ textAlign: "center", marginTop: "5px" }}
                          >
                            {props.usersData?.[0]?.total_employees_logged_in ??
                              0}
                          </div>
                        </div>
                        <div className="region-select">
                          <label>Total Not Logged in</label>
                          <div
                            style={{ textAlign: "center", marginTop: "5px" }}
                          >
                            {props.usersData?.[0]?.not_logged_in ?? 0}
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <MUIDataTable
                    className="tracks"
                    data={props.usersData?.[0]?.employee_details}
                    columns={columns}
                    options={{
                      ...options,
                      customFooter: (
                        count,
                        page,
                        rowsPerPage,
                        changeRowsPerPage,
                        changePage,
                        textLabels,
                      ) => {
                        const nextPage = () => {
                          changePage(1);
                          setCurrentPage(currentPage + 1);
                          getUsersapi(currentPage + 1);
                        };
                        const PreviousPage = () => {
                          changePage(0);
                          setCurrentPage(currentPage - 1);
                          getUsersapi(currentPage - 1);
                        };
                        return (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 15,
                                marginBottom: 15,
                                gap: 20,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 30,
                                  opacity:
                                    props.usersData?.[0]?.current_page === 1
                                      ? 0.5
                                      : 1,
                                  cursor:
                                    props.usersData?.[0]?.current_page === 1
                                      ? "no-drop"
                                      : "pointer",
                                }}
                                onClick={() => {
                                  if (
                                    props.usersData?.[0]?.current_page !== 1
                                  ) {
                                    PreviousPage();
                                  }
                                }}
                              >
                                {"<"}
                              </div>
                              <div
                                style={{
                                  fontSize: 30,
                                  opacity:
                                    props.usersData?.[0]?.total_pages ===
                                    currentPage
                                      ? 0.5
                                      : 1,
                                  cursor:
                                    props.usersData?.[0]?.total_pages ===
                                    currentPage
                                      ? "no-drop"
                                      : "pointer",
                                }}
                                onClick={() => {
                                  if (
                                    props.usersData?.[0]?.total_pages !==
                                    currentPage
                                  )
                                    nextPage();
                                }}
                              >
                                {">"}
                              </div>
                            </div>
                          </>
                        );
                      },
                    }}
                  />
                  {/* <MUIDataTable
             className="tracks"
             // title={"Geo Tracking"}
             data={[]}
             columns={columns}
             options={options}
           /> */}
                  {/* } */}
                  <div className="locationtracking-sections">
                    <div className="latest-time">
                      {/* <label>Last updated at : </label>
              <span> {this.state.time}</span> */}
                    </div>
                    <div ref={mapEnd} className="geo-tracking-locations">
                      <LocationtrackingMap
                        zoomLevel={zoomLevel}
                        centroid={centroid}
                        center={centroid}
                        // geoCentroid={(response) => {
                        //   this.setState({ centroid: response, zoomLevel: 14.5 });
                        // }}
                        locationTrackingData={allMarker}
                        isUsers={true}
                        userData={eName}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="tracks" style={{}}>
                  <InsertUser
                    setAdd={setAdd}
                    currentuser={currentuser}
                    setCurrentuser={setCurrentuser}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  usersData: state.users.usersData,
  isFetching: state.users.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUsers: getUsers,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
