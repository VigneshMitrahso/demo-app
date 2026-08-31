import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Breadcrumb } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Modal } from "react-bootstrap";
import { CircularProgress } from "@material-ui/core";
import { isEmpty, keys } from "lodash";
import {
  exportEmployeeAnalytic,
  getEmployeeAnalytic,
  getEmployeeDetailsData,
  getReportAnalytics,
} from "../../action/actionEmployeeAnalytics";
import Header from "../../components/header";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";

const EmployeeAnalytics = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screen, setScreen] = useState("state");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [requestIds, setrequestIds] = useState("");

  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeAnalytic(id, "state", null, null, null, null);
    });
  }, []);

  const handleGetAllindiaState = () => {
    setIsLoading(true);
    setSelectedCity("");
    setSelectedState("");
    setScreen("state");
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeAnalytic(
        id,
        "state",
        null,
        null,
        !isEmpty(startDate) ? moment(startDate).format("YYYY-MM-DD") : null,
        !isEmpty(endDate) ? moment(endDate).format("YYYY-MM-DD") : null,
      );
    });
    setIsLoading(true);
  };

  const handleGetSelectedState = (state) => {
    setIsLoading(true);
    setSelectedCity("");
    setScreen("city");
    setSelectedState(state);
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeAnalytic(
        id,
        "city",
        state,
        null,
        !isEmpty(startDate) ? moment(startDate).format("YYYY-MM-DD") : null,
        !isEmpty(endDate) ? moment(endDate).format("YYYY-MM-DD") : null,
      );
    });
    setIsLoading(true);
  };

  const handleGetSelectedStateCity = (city) => {
    setSelectedCity(city);
    setScreen("main");
    setCount(count + 1);
    setIsLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeAnalytic(
        id,
        "main",
        selectedState,
        city,
        !isEmpty(startDate) ? moment(startDate).format("YYYY-MM-DD") : null,
        !isEmpty(endDate) ? moment(endDate).format("YYYY-MM-DD") : null,
      );
    });
    setIsLoading(false);
  };

  const submit = (start = "", end = "") => {
    setIsLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeAnalytic(
        id,
        screen,
        !isEmpty(selectedState) ? selectedState : null,
        !isEmpty(selectedCity) ? selectedCity : null,
        !isEmpty(start)
          ? moment(start, "dd mm YYYY").format("MM-DD-YYYY")
          : null,
        !isEmpty(end) ? moment(end, "dd mm YYYY").format("MM-DD-YYYY") : null,
      );
    });
    setIsLoading(true);
    setStartDate(
      !isEmpty(start) ? moment(start, "dd mm YYYY").format("MM-DD-YYYY") : "",
    );
    setEndDate(
      !isEmpty(end) ? moment(end, "dd mm YYYY").format("MM-DD-YYYY") : "",
    );
  };

  const exportExcel = () => {
    _getStorageValue(USER_ID).then((id) => {
      props.exportEmployeeAnalytic(
        id,
        "main",
        !isEmpty(selectedState) ? selectedState : null,
        !isEmpty(selectedCity) ? selectedCity : null,
        !isEmpty(startDate) ? startDate : null,
        !isEmpty(endDate) ? endDate : null,
      );
    });
  };

  const handleDetailsCallback = (data) => {
    if (data.status) {
      setEmployeeDetails(data?.data[0] || null);
    }
  };

  const handleGetSelectedEmployeeDetails = (empid) => {
    setIsLoading(true);
    setOpenModal(true);
    _getStorageValue(USER_ID).then((id) => {
      props.getEmployeeDetailsData(id, empid, handleDetailsCallback);
    });
    setIsLoading(true);
  };

  const sucessCallback = (data) => {
    setIsLoading(false);
    console.log("sucessCallbackdata", data);
    setrequestIds(data.request_id);
    setOpenModal(true);
  };

  const failurCallback = (data) => {
    console.log("sucessCallbackdata", data);
  };

  const getReportData = (empid, report) => {
    setIsLoading(true);

    _getStorageValue(USER_ID).then((id) => {
      props.getReportAnalytics(
        id,
        !isEmpty(startDate) ? startDate : null,
        !isEmpty(endDate) ? endDate : null,
        empid,
        report,
        sucessCallback,
        failurCallback,
      );
    });
  };

  const columns = useMemo(() => {
    let columns = [];
    if (screen === "city") {
      columns = [
        {
          name: "cities",
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
                  onClick={() =>
                    handleGetSelectedStateCity(
                      props.employeeAnalytics?.stats[value]?.city,
                    )
                  }
                >
                  {props.employeeAnalytics?.stats[value]?.city || ""}
                </div>
              );
            },

            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
              },
            }),
          },
        },
        {
          name: "active_employees",
          label: "Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
                border: "0.1px solid #8080807a",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "non_active_employees",
          label: "Not Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
                border: "0.1px solid #8080807a",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "video_count",
          label: "Video Call Count",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "report_count",
          label: "Report Completed Count",

          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "visit_count",
          label: "On Site Visit Count",

          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "market_count",
          label: "Market Transaction Submitted",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
      ];
    } else if (screen === "main") {
      columns = [
        {
          name: "emp_id",
          label: "Employee ID",
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
                    handleGetSelectedEmployeeDetails(
                      props.employeeAnalytics?.stats[value]?.emp_id || "",
                    )
                  }
                >
                  {props.employeeAnalytics?.stats[value]?.emp_id || ""}
                </div>
              );
            },
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
              },
            }),
          },
        },
        {
          name: "emp_name",
          label: "Employee Name",
          options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
              },
            }),
          },
        },
        {
          name: "active_employees",
          label: "Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
                border: "0.1px solid #8080807a",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "non_active_employees",
          label: "Not Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
                border: "0.1px solid #8080807a",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "video_count",
          label: "Video Call Count",
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
                  onClick={() => {
                    let empid = props.employeeAnalytics?.stats[value]?.emp_id;

                    getReportData(empid, "video_call");
                  }}
                >
                  {props.employeeAnalytics?.stats[value]?.video_count || ""}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "report_completed",
          label: "Report Completed Count",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value, index) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#2F80ED",
                  }}
                  onClick={() => {
                    let empid = props.employeeAnalytics?.stats[value]?.emp_id;
                    getReportData(empid, "report");
                  }}
                >
                  {props.employeeAnalytics?.stats[value]?.report_completed ||
                    ""}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "visit_count",
          label: "On Site Visit Count",
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
                  onClick={() => {
                    let empid = props.employeeAnalytics?.stats[value]?.emp_id;
                    getReportData(empid, "on_site");
                  }}
                >
                  {props.employeeAnalytics?.stats[value]?.visit_count || ""}
                </div>
              );
            },
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "market_count",
          label: "Market Transaction Submitted",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
      ];
    } else if (screen === "state") {
      columns = [
        {
          name: "states",
          label: "States",
          options: {
            filter: true,
            sort: true,
            customBodyRenderLite: (value, item) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#2F80ED",
                  }}
                  onClick={() =>
                    handleGetSelectedState(
                      props.employeeAnalytics?.stats[value]?.state || "",
                    )
                  }
                >
                  {props.employeeAnalytics?.stats[value]?.state || ""}
                </div>
              );
            },
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
              },
            }),
          },
        },
        {
          name: "active_employees",
          label: "Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
                border: "0.1px solid #8080807a",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "non_active_employees",
          label: "Not Active Employees",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                border: "0.1px solid #8080807a",
                whiteSpace: "nowrap",
                background: "#9e9d9d5c",
                textAlign: "center",
                borderRadius: 0,
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "video_count",
          label: "Video Call Count",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "report_count",
          label: "Report Completed Count",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "visit_count",
          label: "On Site Visit Count",
          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
        {
          name: "market_count",
          label: "Market Transaction Submitted",

          options: {
            filter: true,
            sort: true,
            setCellProps: () => ({
              style: {
                textAlign: "center",
              },
            }),
            setCellHeaderProps: () => ({
              style: {
                background: "#d0e5e6",
                borderRadius: 0,
                textAlign: "center",
              },
            }),
          },
        },
      ];
    }
    return columns;
  }, [props.employeeAnalytics, screen, loading, startDate, endDate]);

  const handleCallback = (start, end, label) => {
    setStartDate(start || "");
    setEndDate(end || "");
    submit(start, end);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEmployeeDetails(null);
    setrequestIds("");
  };

  const clear = () => {
    setStartDate("");
    setEndDate("");
    submit();
  };

  return (
    <div className="geo-tracking-container">
      <Header link="/landingPage" />
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
              <div
                style={{ width: "50%", display: "flex", alignItems: "center" }}
              >
                <div style={{ width: "40%" }}>
                  <label>Date Range</label>
                  <DateRangePicker
                    value={`${startDate == "" ? "" : moment(startDate, "dd mm YYYY").format("DD/MM/YYYY")}  ${endDate == "" ? "" : moment(endDate, "dd mm YYYY").format("DD/MM/YYYY")}`}
                    onCallback={handleCallback}
                  >
                    <input
                      style={{ width: "100%" }}
                      type="text"
                      className="form-control"
                      placeholder="Select date"
                      value={`${startDate == "" ? "" : startDate}  ${endDate == "" ? "" : endDate}`}
                    />
                  </DateRangePicker>
                </div>
                <div
                  style={{
                    marginLeft: 5,
                    alignSelf: "end",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  {/* <button
                    disabled={isEmpty(startDate)}
                    onClick={submit}
                    className="submit_button"
                  >
                    Submit
                  </button> */}
                  <button
                    disabled={isEmpty(startDate)}
                    onClick={clear}
                    className="submit_button"
                  >
                    Clear
                  </button>
                </div>
                <div
                  style={{
                    marginLeft: 5,
                    alignSelf: "end",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  {/* <button
                    disabled={isEmpty(startDate)}
                    onClick={submit}
                    className="submit_button"
                  >
                    Submit
                  </button> */}
                  <button onClick={exportExcel} className="submit_button">
                    Excel Export
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "end" }}>
                <div>Total MVG Employee</div>
                <div style={{ textAlign: "center" }}>
                  {props.employeeAnalytics?.total_employess_added || "-"}
                </div>
              </div>
            </div>
            <Breadcrumb className="survey-report-breadcrumb">
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
                data={props.employeeAnalytics?.stats || []}
                components={{
                  TableToolbar(props) {
                    return null;
                  },
                }}
                columns={columns}
                options={{
                  responsive: "scroll",
                  fixedHeader: true,
                  overflowX: "auto",
                  filter: true,
                  sort: true,
                  download: false,
                  empty: true,
                  index: 10,
                  print: true,
                  selectableRows: false,
                  pagination: false,
                  textLabels: {
                    showResponsive: true,
                    rowsPerPage: "Total items Per Page",
                  },
                  search: false,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        show={isOpenModal}
        onHide={() => handleCloseModal()}
        className="employee-modal"
      >
        <Modal.Header closeButton>
          {requestIds == "" ? "Employee Details" : "Customers List"}
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              height: 500,
              overflow: "auto",
            }}
          >
            {requestIds == "" ? (
              employeeDetails ? (
                keys(employeeDetails).map((item, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      key={index}
                    >
                      <div
                        style={{
                          width: "40%",
                          backgroundColor: "#053c6d",
                          color: "#fff",
                          padding: 10,
                          borderRadius: 6,
                          fontSize: 10,
                          fontFamily: "poppins",
                          textTransform: "capitalize",
                        }}
                      >
                        {item ? item.replace("_", " ") : ""}
                      </div>
                      <div
                        style={{
                          width: "50%",
                          textAlign: "left",
                          padding: 10,
                          borderRadius: 6,
                          fontSize: 12,
                          fontFamily: "poppins",
                          border: "0.5px solid #053c6d",
                        }}
                      >
                        {employeeDetails[item] || "NA"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              )
            ) : (
              <>
                {requestIds.map((md) => (
                  <div>{md}</div>
                ))}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  employeeAnalytics: state.employeeAnalytics.employeeAnalytics,
  isFetching: state.employeeAnalytics.isFetching,
  isFetchingEmployeeDetails: state.employeeAnalytics.isFetchingEmployeeDetails,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployeeAnalytic: getEmployeeAnalytic,
      getEmployeeDetailsData: getEmployeeDetailsData,
      exportEmployeeAnalytic: exportEmployeeAnalytic,
      getReportAnalytics: getReportAnalytics,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeAnalytics);
