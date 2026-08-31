import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

// components
import Header from "../../components/header";
import SideBar from "../../components/side-bar";
import HistoryFilter from "../../components/history-filter";

// function
import { _getStorageValue } from "../../comman/localStorage";
import { historyUser } from "../../action/getHistory";
import { resetgetImageUrlUser } from "../../action/getImageUrl";

// constant
import { USER_ID } from "../../comman/constants";

// css
import "../dash-board/dashBoard.css";
import "./history.css";

// constant
// import { USER_ID } from "../../comman/constants";

class HistoryLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideBarShow: false,
      key: "searched",
      searchedShow: false,
      smsGenrat: false,
      reportComplet: false,
      reportInProgressed: false,
      videoLinkGenrat: false,
      historyDataShow: {},
    };
  }

  componentWillMount() {
    _getStorageValue(USER_ID).then((userId) => {
      this.props.historyUser(userId);
    });
  }

  showHistoryDataView(response) {
    var data = response.data.status_details[0];

    this.setState({
      historyDataShow: data,
    });
  }

  render() {
    const {
      sideBarShow,
      key,
      searchedShow,
      smsGenrat,
      reportComplet,
      reportInProgressed,
      videoLinkGenrat,
      historyDataShow,
    } = this.state;

    const { historyData } = this.props;

    var searched = [];
    var reportCompleted = [];
    var smsGenrated = [];
    var videoLinkGenrated = [];
    var reportInProgress = [];

    for (let list in historyData) {
      if (historyData[list].status === "Searched") {
        searched.push(historyData[list]);
      }
      if (historyData[list].status === "Report Completed") {
        reportCompleted.push(historyData[list]);
      }
      if (historyData[list].status === "Report In-Progress") {
        reportInProgress.push(historyData[list]);
      }
      if (historyData[list].status === "SMS Generated") {
        smsGenrated.push(historyData[list]);
      }
      if (historyData[list].status === "Video link generated") {
        videoLinkGenrated.push(historyData[list]);
      }
    }

    return (
      <div className="dash-board-container">
        <Header
          sideBarCallBack={() => {
            this.setState({
              sideBarShow: !sideBarShow,
            });
          }}
        />
        <div className="row">
          <div className="col-md-9 pad0">
            <div className="dash-board-sec">
              {sideBarShow ? (
                <div className="side-bar-container">
                  <SideBar />
                </div>
              ) : null}

              <div className="map-container ">
                <div className="map-dashboard">
                  <div className="histroy-show">
                    <div className="histroy-view">
                      <div className="filter-collape ">
                        <div
                          className="filter-collapse-heading"
                          onClick={() => {
                            this.setState({
                              searchedShow: !searchedShow,
                            });
                          }}
                        >
                          <h6> Searched </h6>
                        </div>
                        {searchedShow ? (
                          <div className="history-sec">
                            {searched.map((data, id) => {
                              return (
                                <div className="history-searched">
                                  <h6> {data.status} </h6>
                                  <Link
                                    to={"/videoCall/" + data.request_id}
                                    onClick={() => {
                                      this.props.resetgetImageUrlUser();
                                    }}
                                  >
                                    <h6> {data.request_id} </h6>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="filter-collape ">
                        <div
                          className="filter-collapse-heading"
                          onClick={() => {
                            this.setState({
                              smsGenrat: !smsGenrat,
                            });
                          }}
                        >
                          <h6> Sms Generated </h6>
                        </div>
                        {smsGenrat ? (
                          <div className="history-sec">
                            {smsGenrated.map((data, id) => {
                              return (
                                <div className="history-searched">
                                  <h6> {data.status} </h6>
                                  <Link
                                    to={"/videoCall/" + data.request_id}
                                    onClick={() => {
                                      this.props.resetgetImageUrlUser();
                                    }}
                                  >
                                    <h6> {data.request_id} </h6>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="filter-collape ">
                        <div
                          className="filter-collapse-heading"
                          onClick={() => {
                            this.setState({
                              videoLinkGenrat: !videoLinkGenrat,
                            });
                          }}
                        >
                          <h6> Video Link Genrated </h6>
                        </div>
                        {videoLinkGenrat ? (
                          <div className="history-sec">
                            {videoLinkGenrated.map((data, id) => {
                              return (
                                <div className="history-searched">
                                  <h6> {data.status} </h6>
                                  <Link
                                    to={"/videoCall/" + data.request_id}
                                    onClick={() => {
                                      this.props.resetgetImageUrlUser();
                                    }}
                                  >
                                    <h6> {data.request_id} </h6>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="filter-collape ">
                        <div
                          className="filter-collapse-heading"
                          onClick={() => {
                            this.setState({
                              reportInProgressed: !reportInProgressed,
                            });
                          }}
                        >
                          <h6> Report Inprogress </h6>
                        </div>
                        {reportInProgressed ? (
                          <div className="history-sec">
                            {reportInProgress.map((data, id) => {
                              return (
                                <div className="history-searched">
                                  <h6> {data.status} </h6>
                                  <Link
                                    to={"/videoCall/" + data.request_id}
                                    onClick={() => {
                                      this.props.resetgetImageUrlUser();
                                    }}
                                  >
                                    <h6> {data.request_id} </h6>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="filter-collape ">
                        <div
                          className="filter-collapse-heading"
                          onClick={() => {
                            this.setState({
                              reportComplet: !reportComplet,
                            });
                          }}
                        >
                          <h6> Report Completed </h6>
                        </div>
                        {reportComplet ? (
                          <div className="history-sec">
                            {reportCompleted.map((data, id) => {
                              return (
                                <div className="history-searched">
                                  <h6> {data.status} </h6>
                                  <Link
                                    to={"/videoCall/" + data.request_id}
                                    onClick={() => {
                                      this.props.resetgetImageUrlUser();
                                    }}
                                  >
                                    <h6> {data.request_id} </h6>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="histroy-view">
                      <div className="filter-collape">
                        <div className="history-searched">
                          <div className="history-searched-iten">
                            <label> Request id :</label>
                            <h6> {historyDataShow.request_id} </h6>
                          </div>
                          <div className="history-searched-iten">
                            <label> Status :</label>
                            <h6> {historyDataShow.status} </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 pad0 ">
            <HistoryFilter
              successHistorCallBack={(response) => {
                this.showHistoryDataView(response);
              }}
              failureHistoryCallBack={(response) => {
                console.log(response);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  historyData: state.getHistory.historyData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      historyUser: historyUser,
      resetgetImageUrlUser: resetgetImageUrlUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryLayout);
