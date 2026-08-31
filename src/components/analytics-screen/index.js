import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";

import { _getStorageValue } from "../../comman/localStorage";
import { ACCESS_TOKEN, USER_ID } from "../../comman/constants";
import {
  getAnalyticsList,
  getVendorAgencyList,
  getVendorCityList,
  getVendorList,
  getVendorStateList,
} from "../../action/serveyReport";
import "./styles.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { getAnalyticalListUrl } from "../../comman/urls";

const AnalyticsScreen = (props) => {

  const [loading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [empID, setEmpID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moduleData, setSelectedModule] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setpaginationData] = useState({});

  const onChangeModule = (e) => {
    setSelectedModule(e)
    setStartDate("");
    setEndDate("");
  }

  const successTableData = (data) => {
    setTableData(data.adva_request_table||data.survey || data.video_call);
    setpaginationData(data.pagination);
  }

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
    selectableRows: false,
    pagination: false,
    textLabels: {
      showResponsive: true,
      rowsPerPage: "Total items Per Page",
    },
  };



  const columns = useMemo(() => {
    const options = {
      filter: true,
      sort: false,
      setCellProps: () => ({
        style: {
          whiteSpace: "nowrap",
          left: "0",
          background: "#ffffff",
          textAlign: "center",
          borderRight: "2px solid #A9C4C5",
          zIndex: 100,
          width: 200,
        },
      }),
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: "nowrap",
          left: 0,
          background: "#DCE5E5",
          textAlign: "center",
          borderRight: "2px solid #A9C4C5",
          zIndex: 150,
          width: 200,
        },
      }),
    };

    let columns = [];
    if(moduleData === "calculation"){
      columns = [
        {
          name: "module",
          label: "Module",
          options
        },
        {
          name: "emp_name",
          label: "Emp name",
          options
        },
        {
          name: "count",
          label: "Count",
          options 
        },
      ];
    }  
    if(moduleData == "ownership_unit"){
       columns = [
        {
          name: "district",
          label: "District",
          options
        },
        {
          name: "emp_id",
          label: "Emp ID",
          options
        },
        {
          name: "emp_name",
          label: "Emp Name",
          options
        },
        {
          name: "message",
          label: "Message",
          options
        },
        {
          name: "order_id",
          label: "Order ID",
          options
        },
        {
          name: "owner_names",
          label: "Owner Names",
          options
        },
        {
          name: "pin_code",
          label: "Pin Code",
          options
        },
        {
          name: "project_case_name",
          label: "Project Case Name",
          options
        },
        {
          name: "recieved_at",
          label: "Received At",
          options
        },
        {
          name: "reference_number",
          label: "Reference Number",
          options
        },
        {
          name: "requested_at",
          label: "Requested At",
          options
        },
        {
          name: "service_type",
          label: "Service Type",
          options
        },
        {
          name: "state",
          label: "State",
          options
        },
        {
          name: "status",
          label: "Status",
          options
        },
        {
          name: "time_difference",
          label: "Time Difference",
          options
        },
        {
          name: "village_city_town_locality",
          label: "Village/City/Town/Locality",
          options
        },
      ];
      
    }
    if(moduleData ==  "ownership_survey"){
       columns = [
        {
          name: "city",
          label: "City",
          options
        },
        {
          name: "emp_id",
          label: "Emp ID",
          options
        },
        {
          name: "emp_name",
          label: "Emp Name",
          options
        },
        {
          name: "ownership_report_status",
          label: "Ownership Report Status",
          options
        },
        {
          name: "property_report_status",
          label: "Property Report Status",
          options
        },
        {
          name: "request_id",
          label: "Request ID",
          options
        },
        {
          name: "request_time",
          label: "Request Time",
          options
        },
        {
          name: "state",
          label: "State",
          options
        },
      ];
      
    }
    if(moduleData == "desktop_valuation"){
       columns = [
        {
          name: "city",
          label: "City",
          options
        },
        {
          name: "date_of_report",
          label: "Date of report",
          options
        },
        {
          name: "emp_id",
          label: "Emp id",
          options
        },
        {
          name: "emp_name",
          label: "Emp name",
          options
        },
        {
          name: "land_area",
          label: "Land area",
          options
        },
        {
          name: "land_rate",
          label: "Land rate",
          options
        },
        {
          name: "property_type",
          label: "Property type",
          options
        },
        {
          name: "received_on",
          label: "Received on",
          options
        },
        {
          name: "request_id",
          label: "Request id",
          options
        },
        {
          name: "request_time",
          label: "Request time",
          options
        },
        {
          name: "sellable_area",
          label: "Sellable area",
          options
        },
        {
          name: "sellable_rate",
          label: "Sellable rate",
          options
        },
        {
          name: "status",
          label: "Status",
          options
        },
        {
          name: "total_value",
          label: "Total value",
          options
        },
        {
          name: "type_of_city",
          label: "Type of city",
          options
        },
        {
          name: "unit_type",
          label: "Unit type",
          options
        },
      ];
      
    } 
    if(moduleData == "video_call_analytics"){

columns = [
  {
    name: "access_from",
    label: "Access from",
    options
  },
  {
    name: "emp_id",
    label: "Emp ID",
    options
  },
  {
    name: "emp_name",
    label: "Emp name",
    options
  },
  {
    name: "request_id",
    label: "Request ID",
    options 
  },
  {
    name: "video_call_status",
    label: "Video call status",
    options 
  },
];
    }   

    return columns;
  }, [ tableData]);

  //   const submit = () => {
  //     setCount(count + 1);
  //     let data = {
  //       latLon: {
  //         type: "Point",
  //         coordinates: [Number(latitude), Number(longitude)],
  //       },
  //     };

  //     var reg = new RegExp("^-?([0-8]?[0-9]|90)(.[0-9]{1,10})$");

  //     if (
  //       latitude.replace(/\s\s+/g, "") == "" ||
  //       longitude.replace(/\s\s+/g, "") == ""
  //     ) {
  //       toast.error("Please enter latitude and logitude ", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     } else if (!reg.test(latitude) || !reg.test(longitude)) {
  //       toast.error("Please enter valide latitude and logitude ", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     } else {
  //       _getStorageValue(USER_ID).then((id) => {
  //         props.getServeyRequestReport(
  //           id,
  //           data,
  //           screen,
  //           selectedState,
  //           selectedCity,
  //           setLatitude,
  //           setLongitude,
  //         );
  //       });
  //     }
  //   };

  const handleCallback = (start, end, label) => {
    setStartDate(start || "");
    setEndDate(end || "");
  };

  const onsubmit = (currentPagePagination = 1) => {
    let queryParams = "";

    if (moduleData != "") {
      // queryParams += `module=${moduleData}&page=${currentPagePagination}&per_page=10`;
      queryParams += `module=${moduleData}`;
    }
    if (empID !== "") {
      queryParams += `&emp_id=${empID}`;
    }
    if (startDate !== "" && endDate !== "") {
      queryParams += `&start_date=${moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD")}&end_date=${moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD")}`;
    }
    console.log("queryParams", queryParams);

    if (moduleData != "") {
      
      _getStorageValue(USER_ID).then((id) => {
        props.getAnalyticsList(id, queryParams, successTableData,setTableData);
      });

    } else {
      toast.warning("Please select the module", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }


  const exportExcel = () => {
    _getStorageValue(USER_ID).then(async (id) => {
      _getStorageValue(ACCESS_TOKEN).then(async (token) => {
        let queryParams = "";
    if (moduleData != "") {
      queryParams += `module=${moduleData}&output=excel_export`;
    }
    if (empID !== "") {
      queryParams += `&emp_id=${empID}`;
    }
    if (startDate !== "" && endDate !== "") {
      queryParams += `&start_date=${moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD")}&end_date=${moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD")}`;
    }
    if (moduleData != "") {
        let surveyurl =  getAnalyticalListUrl(id,queryParams);
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
        a.download = `Analytics.xlsx`;
        a.click();
      }else{
        toast.warning("Please select the module", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      });
    });
  };


  


  return (
    <>
      {/* <Header link="/ownership-landing-page" /> */}
      <div className="dashboard-container">
        <div className="">
          <div
            className="report-sub-container"
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="region-select">
                <label>Module *</label>
                <select style={{ width: 200 }} value={moduleData} onChange={(e) => onChangeModule(e.target.value)} >
                <option value={""} label={"Select"} />

                  <option value={"calculation"} label={"Calculation"} />
                  <option value={"ownership_unit"} label={"Ownership Unit"} />
                  <option value={"ownership_survey"} label={"Ownership Survey"} />
                  <option value={"desktop_valuation"} label={"Desktop Valuation"} />
                  <option value={"video_call_analytics"} label={"video call Analytics"} />
                </select>
              </div>
              {/* <div className="region-select">
                <label>Employee ID</label>
                <input type="text" style={{ width: 200 }} className="customer-desc" value={empID} onChange={(e) => setEmpID(e.target.value)} />
              </div> */}
              <div className="region-select">
                <label>Date Range</label>
                <DateRangePicker
                  value={`${startDate == "" ? "" : moment(startDate, "dd mm YYYY").format("DD/MM/YYYY")}  ${endDate == "" ? "" : moment(endDate, "dd mm YYYY").format("DD/MM/YYYY")}`}
                  onCallback={handleCallback}
                  placeholder="Select date"
                >
                  <input
                    style={{ width: 300 }}
                    type="text"
                    className="form-control"
                    placeholder="Select date"
                    value={ `${startDate === "" ? "" : moment(startDate, "dd mm YYYY").format("DD/MM/YYYY")}  ${endDate == "" ? "" : moment(endDate, "dd mm YYYY").format("DD/MM/YYYY")}`}
                  />
                </DateRangePicker>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div className="add-Button">
                    <button
                      onClick={() => {
                        onsubmit();
                      }}
                    >
                      Submit
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
            </div>
            <div style={{ marginTop: 30 }}>
              <MUIDataTable
                className="tracks"
                loading={loading}
                data={
                  tableData
                }
                columns={columns}
                options={{...options,
                  // customFooter: (
                  //   count,
                  //   page,
                  //   rowsPerPage,
                  //   changeRowsPerPage,
                  //   changePage,
                  //   textLabels,
                  // ) => {
                  //   const nextPage = () => {
                  //     changePage(1);
                  //     setCurrentPage(currentPage + 1);
                  //     onsubmit(currentPage + 1);
                  //   };
                  //   const PreviousPage = () => {
                  //     changePage(0);
                  //     setCurrentPage(currentPage - 1);
                  //     onsubmit(currentPage - 1);
                  //   };
                  //   return (
                  //     <>
                  //       <div
                  //         style={{
                  //           display: "flex",
                  //           flexDirection: "row",
                  //           alignItems: "center",
                  //           justifyContent: "center",
                  //           marginTop: 15,
                  //           marginBottom: 15,
                  //           gap: 20,
                  //         }}
                  //       >
                  //         <div
                  //           style={{
                  //             fontSize: 30,
                  //             opacity:
                  //               paginationData.current_page === 1 ? 0.5 : 1,
                  //             cursor:
                  //               paginationData.current_page === 1
                  //                 ? "no-drop"
                  //                 : "pointer",
                  //           }}
                  //           onClick={() => {
                  //             if (paginationData.current_page !== 1) {
                  //               PreviousPage();
                  //             }
                  //           }}
                  //         >
                  //           {"<"}
                  //         </div>
                  //         {currentPage}
                  //         <div
                  //           style={{
                  //             fontSize: 30,
                  //             opacity:
                  //               paginationData.total_pages === currentPage
                  //                 ? 0.5
                  //                 : 1,
                  //             cursor:
                  //               paginationData.total_pages === currentPage
                  //                 ? "no-drop"
                  //                 : "pointer",
                  //           }}
                  //           onClick={() => {
                  //             if (paginationData.total_pages !== currentPage)
                  //               nextPage();
                  //           }}
                  //         >
                  //           {">"}
                  //         </div>
                  //       </div>
                  //     </>
                  //   );
                  // },
                }}
               
              />
            </div>
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
      getAnalyticsList: getAnalyticsList,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen);
