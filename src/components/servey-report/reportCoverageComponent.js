import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { getServeyReportCoverage } from "../../action/serveyReport";
import "./styles.css";
import { Breadcrumb } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Report = (props) => {
  const [loading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
      props.getServeyReportCoverage(id, setTableData, setIsLoading);
    });
  }, []);

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
    let columns = [];
    if (tableData.length > 0) {
      columns = [
        {
          name: "state",
          label: "State",
          options: {
            filter: false,
            sort: false,
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
          name: "city",
          label: "City",
          options: {
            filter: false,
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
          name: "coverage_percentage",
          label: "% Completed",
          options: {
            filter: false,
            sort: false,
            customBodyRenderLite: (value) => {
              return (
                <div>
                  <p>
                    {Number(tableData[value].coverage_percentage).toFixed(2)} %
                  </p>
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
      ];
    }

    return columns;
  }, [tableData]);

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumb style={{}} className="survey-report-breadcrumb">
            <Breadcrumb.Item
              onClick={() => history.push("/survey-report")}
              active={false}
            >
              Survey Report
            </Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => {}} active={true}>
              Report coverage
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div>
        {loading ? (
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
            data={tableData}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  serveyReport: state.serveyReport.serveyReport,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServeyReportCoverage: getServeyReportCoverage,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
