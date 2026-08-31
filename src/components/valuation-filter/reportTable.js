import React, { use, useEffect, useMemo, useState } from "react";
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
  getAvmReportData,
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
import { toast } from "react-toastify";

const ReportTable = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setpaginationData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const downloadicon = {
    url: require("../../assets/images/downloadicon.png"),
  };
  useEffect(() => {
    getAdvariskapi();
    setSearchValue("");
  }, []);

  const getAdvariskapi = (currentPagePagination = 1,searchValueData="") => {
    const successCallBack = (response) => {
      setDataSource(response.data.avm_request_table);
      setpaginationData(response.data.pagination);
      setLoading(false);
    };

    const failurCallback = (data) => {
      setLoading(false);
      setDataSource([]);
      setpaginationData({});
      toast.error(data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };
    setLoading(true);
    _getStorageValue(USER_ID).then((id) => {
      props.getAdvarisk(
        id,
        currentPagePagination,
        searchValueData,
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
        name: "request_code",
        label: "Request Code",
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
        name: "property_type",
        label: "property type",
        options: {
          filter: true,
          sort: false,
          //   customBodyRenderLite: (value) => {
          //     return (
          //       <div style={{ cursor: "pointer" }}>
          //         {dataSource[value]?.status === "success" ? (
          //           <div style={{ justifyContent: "space-around" }}>
          //             Completed
          //           </div>
          //         ) : dataSource[value]?.status === "In-progress" ? (
          //           "In-progress"
          //         ) : (
          //           "failed"
          //         )}
          //       </div>
          //     );
          //   },
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
        name: "unit_type",
        label: "unit type",
        options: {
          filter: true,
          sort: false,
          //   customBodyRenderLite: (value) => {
          //     return (
          //       <div style={{ cursor: "pointer" }}>
          //         {dataSource[value]?.status === "success" ? (
          //           <div style={{ justifyContent: "space-around" }}>
          //             Completed
          //           </div>
          //         ) : dataSource[value]?.status === "In-progress" ? (
          //           "In-progress"
          //         ) : (
          //           "failed"
          //         )}
          //       </div>
          //     );
          //   },
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
        label: "Employee ID",
        options: {
          filter: true,
          sort: false,
          //   customBodyRenderLite: (value) => {
          //     return (
          //       <div style={{ cursor: "pointer" }}>
          //         {dataSource[value]?.status === "success" ? (
          //           <div style={{ justifyContent: "space-around" }}>
          //             Completed
          //           </div>
          //         ) : dataSource[value]?.status === "In-progress" ? (
          //           "In-progress"
          //         ) : (
          //           "failed"
          //         )}
          //       </div>
          //     );
          //   },
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
        name: "pdf_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            return (
              <div className="textwrap" style={{ width: 200 }}>
                {dataSource[value]?.pdf_status}
                {dataSource[value]?.pdf_status.toLocaleLowerCase() ===
                  "success" && (
                  <img
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = dataSource[value]?.pdf_file_url;
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
        name: "requested_on",
        label: "Requested At",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value, index) => {
            let date = !!dataSource[value].requested_on
              ? dataSource[value].requested_on.split(".")
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
        name: "received_on",
        label: "Received At",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (value) => {
            let date = !!dataSource[value].received_on
              ? dataSource[value].received_on.split(".")
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
        name: "time_difference",
        label: "time difference",
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
      <Header link="/automated-valuation" />
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
                  {/* <button onClick={request} className="submit_button"> */}
                  Valuation Report
                  {/* </button>
                  <button onClick={reportTat} className="submit_button">
                    Report TAT
                  </button> */}
                </div>
              </div>
              <div
                style={{ marginRight: 20 }}
                onClick={() => {
                  getAdvariskapi("");
                  setSearchValue("");
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
                      setSearchValue("");
                    };
                    const PreviousPage = () => {
                      changePage(0);
                      setCurrentPage(currentPage - 1);
                      getAdvariskapi(currentPage - 1);
                      setSearchValue("");
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
                  customSearch: true,
                  customSearchRender: (searchText, handleSearch,...rest) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          value={searchValue}
                          className="customer-desc"
                          placeholder="Search REQ ID"
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                          }}
                        />
                        <button
                          onClick={() => {
                            getAdvariskapi(1, searchValue);
                          }}
                          style={{
                            marginLeft: 10,
                            backgroundColor: "#053c6d",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: 5,
                          }}
                        >
                          Search
                        </button>
                        <button
                          onClick={() => {
                            setSearchValue("");
                            getAdvariskapi(1,"");
                          }}
                          style={{
                            marginLeft: 10,
                            backgroundColor: "#053c6d",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: 5,
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    );
                  },

                  search: true,
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
      getAdvarisk: getAvmReportData,
      getEmployeeDetailsData: getEmployeeDetailsData,
      exportEmployeeAnalytic: exportEmployeeAnalytic,
      getReportAnalytics: getReportAnalytics,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTable);
