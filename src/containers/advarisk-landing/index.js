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
  getAdvariskData,
  getEmployeeAnalytic,
  getEmployeeDetailsData,
  getReportAnalytics,
} from "../../action/actionEmployeeAnalytics";
import Header from "../../components/header";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";

import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const AdvaRiskLandingPage = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setpaginationData] = useState({});

  useEffect(() => {
    getAdvariskapi();
  }, []);

  const getAdvariskapi = (currentPagePagination = 1) => {
    const successCallBack = (response) => {
      setDataSource(response.data.adva_request_table);
      setpaginationData(response.data.pagination);
      setLoading(false);
    };

    const failurCallback = () => {
      setLoading(false);
    };
    setLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      props.getAdvarisk(
        id,
        currentPagePagination,
        successCallBack,
        failurCallback,
      );
    });
  };

  const options = {
    filter: true,
    sort: true,
    download: false,
    empty: true,
    index: 10,
    print: true,
    searchable: true,
    viewColumns: true,
    selectableRows: false,
    rowsPerPage: 10,
    textLabels: {
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
    },
  };

  const columns = useMemo(() => {
    let columns = [];

    columns = [
      {
        name: "order_id",
        label: "Order ID",
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
        name: "report status",
        label: "Report Status",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            return (
              <div style={{ cursor: "pointer" }}>
                {dataSource[value]?.status === "success" ? (
                  <div style={{ justifyContent: "space-around" }}>
                    Completed
                  </div>
                ) : dataSource[value]?.status === "In-progress" ? (
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
        name: "message",
        label: "message",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            return (
              <div className="textwrap" style={{ width: 200 }}>
                {dataSource[value]?.message}
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
        name: "report status",
        label: "View",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            return (
              <div style={{ cursor: "pointer" }}>
                {dataSource[value]?.status === "success" ? (
                  <div style={{ justifyContent: "space-around" }}>
                    <Link
                      to={`/adva-risk-detail?orderID=${dataSource[value]?.order_id}`}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        rotate={45}
                        color="#000"
                        size="2x"
                      />
                    </Link>
                  </div>
                ) : (
                  <div
                    style={{ justifyContent: "space-around", cursor: "auto" }}
                  ></div>
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
        name: "project_case_name",
        label: "Customer Name",
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
        name: "state",
        label: "State",
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
        name: "district",
        label: "District",
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
        name: "village_city_town_locality",
        label: "City",
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
        name: "pin_code",
        label: "Pincode",
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
        name: "requested_at",
        label: "Requested At",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value, index) => {
            let date = !!dataSource[value].requested_at
              ? dataSource[value].requested_at.split(".")
              : [];
            return <div>{date.length > 0 ? date[0] : ""}</div>;
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
        name: "recieved_at",
        label: "Received At",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            let date = !!dataSource[value].recieved_at
              ? dataSource[value].recieved_at.split(".")
              : [];
            return <div>{date.length > 0 ? date[0] : ""}</div>;
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
    ];
    return columns;
  }, [dataSource]);

  const request = () => {
    props.history.push("/adva-risk-request");
  };

  const reportTat = () => {
    props.history.push("/adva-risk-report-tat");
  };

  return (
    <div className="geo-tracking-container">
      <Header link="/ownership-landing-page" />
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
                {/* <div style={{ width: "40%" }}>
                  <label>Date Range</label>
                  <DateRangePicker 
                    value={`${startDate == "" ? "": moment(startDate,"dd mm YYYY").format("DD/MM/YYYY")}  ${endDate == "" ? "" : moment(endDate,"dd mm YYYY").format("DD/MM/YYYY")}`}
                    onCallback={handleCallback} 
                >
                    <input
                      style={{ width: "100%" }}
                      type="text"
                      className="form-control"
                      placeholder="Select date"
                      value={`${startDate == "" ? "": startDate }  ${endDate == "" ? "" : endDate}`}
                    />
                  </DateRangePicker>
                </div> */}
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
                  <button onClick={request} className="submit_button">
                    Request Report
                  </button>
                  <button onClick={reportTat} className="submit_button">
                    Report TAT
                  </button>
                </div>
              </div>
              <div
                style={{ marginRight: 20 }}
                onClick={() => {
                  getAdvariskapi();
                }}
              >
                {isLoading ? (
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

            {isLoading ? (
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
                data={dataSource || []}
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
                  count: paginationData.total_items,
                  print: true,
                  selectableRows: false,
                  pagination: true,
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
                      getAdvariskapi(currentPage + 1);
                    };
                    const PreviousPage = () => {
                      changePage(0);
                      setCurrentPage(currentPage - 1);
                      getAdvariskapi(currentPage - 1);
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
                                paginationData.current_page === 1 ? 0.5 : 1,
                              cursor:
                                paginationData.current_page === 1
                                  ? "no-drop"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (paginationData.current_page !== 1) {
                                PreviousPage();
                              }
                            }}
                          >
                            {"<"}
                          </div>
                          {currentPage}
                          <div
                            style={{
                              fontSize: 30,
                              opacity:
                                paginationData.total_pages === currentPage
                                  ? 0.5
                                  : 1,
                              cursor:
                                paginationData.total_pages === currentPage
                                  ? "no-drop"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (paginationData.total_pages !== currentPage)
                                nextPage();
                            }}
                          >
                            {">"}
                          </div>
                        </div>
                      </>
                    );
                  },
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
      getAdvarisk: getAdvariskData,
      getEmployeeDetailsData: getEmployeeDetailsData,
      exportEmployeeAnalytic: exportEmployeeAnalytic,
      getReportAnalytics: getReportAnalytics,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdvaRiskLandingPage);
