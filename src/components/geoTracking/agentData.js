import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { getAgentData } from "../../action/getGeoTracking";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./styles.css";

class AgentData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoTrackingBar: {},
    };
  }
  state = {
    agentData: [],
    filter: "today",
  };
  // this.setState({ reqreCallReport: user_Name });
  componentDidMount() {
    _getStorageValue(USER_ID).then((id) => {
      if (
        this.props.agentTimeLine === "week" ||
        this.props.agentTimeLine === "month"
      ) {
        this.props.getAgentData(
          id,
          this.props.agentID,
          this.props.agentTimeLine,
          "",
          "",
          successAgCallBack,
          failureAgCallBack,
        );
      } else {
        this.props.getAgentData(
          id,
          this.props.agentID,
          "",
          this.props.agentidStart,
          this.props.agentidEnd,
          successAgCallBack,
          failureAgCallBack,
        );
      }
    });
    const successAgCallBack = (response) => {
      var agentRecordsArr = response.data;
      var labelTextBar = agentRecordsArr.map((data) => data.date);
      var barChartArr = agentRecordsArr.map((data) => data.distanceTravelled);
      var data = {
        labels: labelTextBar,
        datasets: [
          {
            // label: "Second dataset",
            data: barChartArr,
            fill: false,
            backgroundColor: "#e77817",
            // backgroundColor: labelTextBar.includes(approvalReport.data.project_name) ? "#000" : "#e77817",
            borderWidth: 1,
            borderColor: "#053c6d",
          },
        ],
      };
      this.setState({
        geoTrackingBar: data,
      });
    };
    const failureAgCallBack = (response) => {
      console.log("failed to fetch", response);
    };
  }

  render() {
    const { geoTrackingBar } = this.state;
    let { agentRecords, isFetching } = this.props;
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
    const columns = [
      {
        name: "date",
        label: "Date",
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
        label: "Clients",
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
        name: "distanceTravelled",
        label: "Distance",
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
                <p>{agentRecords[value].distanceTravelled} km</p>
              </div>
            );
          },
        },
      },
    ];
    var option = {
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              // max: 180,
              fontSize: 12,
              // fontColor: "black",
              // fontStyle: "bold",
              // stepSize: 40
            },
            scaleLabel: {
              display: true,
              labelString: "(Km)",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              maxTicksLimit: 15,
            },
            scaleLabel: {
              display: true,
              labelString: "(yy/mm/dd)",
            },
          },
        ],
      },

      plugins: {
        datalabels: {
          align: "bottom",
          display: true,
          color: "#000",
          formatter: Math.round,
          font: {
            weight: "bold",
          },
        },
      },
      legend: {
        display: false,
      },
    };
    return (
      <div>
        {/* {(() => {
          if (agentRecords === []) {
            console.log("agentRecords-1")
            return (
              <h2>No Data</h2>
            )
          } else {
            console.log("agentRecords-2") */}
        {/* return ( */}
        <div>
          <div className="geo-table-container">
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
                title={this.props.agentName}
                data={agentRecords}
                columns={columns}
                options={options}
              />
            )}
          </div>
          <Bar data={geoTrackingBar} options={option} />
        </div>
        {/* ) */}
        {/* }
        })()} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  agentRecords: state.geoTracking.agentRecords,
  isFetching: state.geoTracking.isFetching,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAgentData: getAgentData,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentData);
