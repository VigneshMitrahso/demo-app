import React, { useState, useEffect, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { Breadcrumb } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { getAdvariskAggrData } from "../../action/actionEmployeeAnalytics";
import "./styles.css";

const ReportTAT = (props) => {
  const [loading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
      props.getAdvariskAggrData(id, setTableData, setIsLoading);
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
          name: "average_time",
          label: "Average Time",
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
                textTransform: "capitalize",
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
                textTransform: "capitalize",
              },
            }),
          },
        },
      ];
    }

    return columns;
  }, [tableData]);

  const transformedData = useMemo(() => {
    return tableData.map((item) => ({
      state: item.state,
      average_time: `${item.average_time.days || 0}d ${item.average_time.hours || 0}h ${item.average_time.minutes || 0}m ${Math.round(item.average_time.seconds || 0)}s`,
    }));
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
              onClick={() => history.push("/adva-risk")}
              active={false}
            >
              Adva Risk
            </Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => {}} active={true}>
              Report Average Time
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
            data={transformedData}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAdvariskAggrData: getAdvariskAggrData,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTAT);
