import React, { Component } from "react";

// compment
import Header from "../header";
import Loader from "../loader/index";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import createHistory from "history/createBrowserHistory";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";

// css
import "./landing.css";

// const
import { AES_KEY, USER_ADMIN } from "../../comman/constants";

// fun
import { decryptRsa } from "../../comman/decodeEncodeData";
import { _getStorageValue } from "../../comman/localStorage";

var history = createHistory();
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutLoader: false,
      aesKey: "",
      aEmail: "",
      loaderStatus: false,
      hideShow: true,
      aPassword: "",
      adminShow: false,
      admin: false,
    };
  }

  componentDidMount() {
    _getStorageValue(AES_KEY).then((key) => {
      // _getStorageValue(USER_ADMIN).then((adminValue) => {
      // decryptRsa(token).then((key) => {
      this.setState({
        // admin: adminValue,
        aesKey: key,
        layoutLoader: true,
      });
      // });
      // });
    });
    _getStorageValue(USER_ADMIN).then((adminValue) => {
      this.setState({
        admin: adminValue,
      });
    });
  }
  adminLoginShow() {
    this.setState({
      adminShow: true,
    });
  }
  adminClose() {
    this.setState({
      adminShow: false,
    });
    window.location.reload();
  }
  adminLogin() {
    var aEmailID = this.state.aEmail;
    var aPassWord = this.state.aPassword;
    history.push("/landingPage");
    window.location.reload();
  }
  render() {
    const { layoutLoader, adminShow, hideShow, loaderStatus } = this.state;
    if (layoutLoader) {
      return (
        <>
          <div className="dashboard-container">
            <Header aesKeyData={this.state.aesKey} />
            <div className="dashboard-sections">
              <div className="landing-page-sec">
                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/property-map"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/map.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Property Map </p>
                    </div>
                  </Link>
                </div>

                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/property-price-index"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/rent.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Property Price Index </p>
                    </div>
                  </Link>
                </div>

                {/* <div className="card landing-card ">
                  <Link className="landing-card1" to={"/property-analytics"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/data-analytics.png")}
                        alt="Analytics"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Property Analytics </p>
                    </div>
                  </Link>
                </div> */}

                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/customer-connect"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/network.png")}
                        alt="sdsd"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Customer Connect </p>
                    </div>
                  </Link>
                </div>

                {/* {this.state.admin === "true" && ( */}
                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/automated-valuation"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/valuation.png")}
                        alt="card img"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Desktop Valuation </p>
                    </div>
                  </Link>
                </div>
                {/* )} */}
                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/calculator-layout"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/valuation.png")}
                        alt="sdsd"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Calculator </p>
                    </div>
                  </Link>
                </div>

                <div className="card landing-card ">
                  <Link
                    className="landing-card1"
                    to={"/reports-analytics-data"}
                  >
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/Analytics.png")}
                        alt="sdsd"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Branch and Agency Reports </p>
                    </div>
                  </Link>
                </div>

                {
                  <div className="card landing-card ">
                    <Link
                      className="landing-card1"
                      to={"/ownership-landing-page"}
                    >
                      <div className="card-img">
                        <img
                          className="card-img-top"
                          src={require("../../assets/images/landing-page/potential.png")}
                          alt="Map"
                        />
                      </div>
                      <div className="card-body">
                        <p className="card-text"> Ownership Check </p>
                      </div>
                    </Link>
                  </div>
                }
                {this.state.admin === "true" && (
                  <div className="card landing-card ">
                    <Link className="landing-card1" to={"/users"}>
                      <div className="card-img">
                        <img
                          className="card-img-top"
                          src={require("../../assets/images/landing-page/rent.png")}
                          alt="Map"
                        />
                      </div>
                      <div className="card-body">
                        <p className="card-text"> Employee Management </p>
                      </div>
                    </Link>
                  </div>
                )}

              {/* {this.state.admin === "true" &&<div className="card landing-card ">
                  <Link className="landing-card1" to={"/Vendor"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/network.png")}
                        alt="sdsd"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Vendor Connect </p>
                    </div>
                  </Link>
                </div>} */}

                {this.state.admin === "true" &&<div className="card landing-card ">
                  <Link className="landing-card1" to={"/map-my-india"}>
                    <div className="card-img">
                    <img
                        className="card-img-top"
                        src={require("../../assets/images/map.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Land Use Maps </p>
                    </div>
                  </Link>
                </div>}

                {this.state.admin === "true" &&<div className="card landing-card ">
                  <Link className="landing-card1" to={"/analytics-landing-page"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/rent.png")}
                        alt="Analytics"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text">Analytics</p>
                    </div>
                  </Link>
                </div>}

                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/market-transaction"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/rent.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text"> Market transaction </p>
                    </div>
                  </Link>
                </div>

                {/* {this.state.admin === "true" && (
                  <div className="card landing-card ">
                    <Link className="landing-card1" to={"/employee-analytics"}>
                      <div className="card-img">
                        <img
                          className="card-img-top"
                          src={require("../../assets/images/network-1.png")}
                          alt="sdsd"
                        />
                      </div>
                      <div className="card-body">
                        <p className="card-text"> Employee Analytics </p>
                      </div>
                    </Link>
                  </div>
                )} */}
                {this.state.admin === "true" && (
                  <div
                    className="card landing-card"
                    // onClick={() => {
                    //   this.adminLoginShow();
                    // }}
                  >
                    <Link className="landing-card1" to={"/geo-tracking"}>
                      <div className="card-img">
                        <img
                          className="card-img-top"
                          src={require("../../assets/images/landing-page/geatracking.png")}
                          alt="Map"
                        />
                      </div>
                      <div className="card-body">
                        <p className="card-text"> Geo Tracking </p>
                      </div>
                    </Link>
                  </div>
                )}
                {/* ) : null} */}
                {/* <div className="card landing-card ">
              <Link className="landing-card1" to={""}>
                <div className="card-img">
                  <img
                    className="card-img-top"
                    src={require("../../assets/images/landing-page/potential.png")}
                    alt="Map"
                  />
                </div>
                <div className="card-body">
                  <p className="card-text"> Development Potential </p>
                </div>
              </Link>
            </div> */}
              </div>
            </div>
          </div>
          <div className="admin-sections">
            <Modal
              show={adminShow}
              className="adminModal"
              onHide={() => {
                this.adminClose();
              }}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Admin Login</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="admin-login">
                  <div className="form-input-sec">
                    <label>
                      User Name
                      <span>*</span>
                    </label>
                    <Form.Control
                      placeholder="12345"
                      onChange={(e) =>
                        this.setState({
                          aEmail: e.target.value,
                        })
                      }
                      autocomplete="off"
                    />
                    {/* {showErrorMsg ? (
                      <div>
                        <label className="error-msg">
                          Please Enter valid User Name
                        </label>
                      </div>
                    ) : null} */}
                  </div>

                  <div className="form-input-sec">
                    <label>
                      Password
                      <span>*</span>
                    </label>
                    <div className="hide-show">
                      <Form.Control
                        type={`${hideShow ? "password" : "text"}`}
                        placeholder="Password"
                        onChange={(e) =>
                          this.setState({
                            aPassword: e.target.value,
                          })
                        }
                        autocomplete="off"
                      />
                      {/* {showErrorMsg ? (
                        <div>
                          <label className="error-msg">
                            Please Enter valid Password
                          </label>
                        </div>
                      ) : null} */}
                      {hideShow ? (
                        <img
                          onClick={() => {
                            this.setState({
                              hideShow: !hideShow,
                            });
                          }}
                          src={require("../../assets/images/eye-close.svg")}
                          alt="sd"
                        />
                      ) : (
                        <img
                          onClick={() => {
                            this.setState({
                              hideShow: !hideShow,
                            });
                          }}
                          src={require("../../assets/images/eye.svg")}
                          alt="sd"
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-input-submit">
                    <button
                      onClick={() => {
                        this.setState({
                          loaderStatus: true,
                        });
                        this.adminLogin();
                      }}
                      disabled={loaderStatus}
                    >
                      {loaderStatus ? <div className="loader"></div> : null}
                      Submit
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </>
      );
    } else {
      return <Loader />;
    }
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
