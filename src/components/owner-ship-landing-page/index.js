import React, { Component } from "react";

// compment
import Header from "../header";
import Loader from "../loader/index";

// plugins
import createHistory from "history/createBrowserHistory";
import { Link } from "react-router-dom";

// css

// const
import { AES_KEY, USER_ADMIN } from "../../comman/constants";

// fun
import { _getStorageValue } from "../../comman/localStorage";

var history = createHistory();
class OwnerShipLandingPage extends Component {
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
    const { layoutLoader } = this.state;
    if (layoutLoader) {
      return (
        <>
          <div className="dashboard-container">
            <Header link="/landingPage" aesKeyData={this.state.aesKey} />
            <div className="dashboard-sections">
              <div className="landing-page-sec">
                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/survey-report"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/map.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text">Survey Level Check</p>
                    </div>
                  </Link>
                </div>
                <div className="card landing-card ">
                  <Link className="landing-card1" to={"/adva-risk"}>
                    <div className="card-img">
                      <img
                        className="card-img-top"
                        src={require("../../assets/images/landing-page/rent.png")}
                        alt="Map"
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-text">Unit Level Check</p>
                    </div>
                  </Link>
                </div>
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
        </>
      );
    } else {
      return <Loader />;
    }
  }
}

export default OwnerShipLandingPage;
