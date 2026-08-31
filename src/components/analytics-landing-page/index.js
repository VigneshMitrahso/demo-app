import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../header";
import Loader from "../loader/index";
import { AES_KEY } from "../../comman/constants";
import { _getStorageValue } from "../../comman/localStorage";
import "../landing-page/landing.css";

class AnalyticsLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutLoader: false,
      aesKey: "",
    };
  }

  componentDidMount() {
    _getStorageValue(AES_KEY).then((key) => {
      this.setState({
        aesKey: key,
        layoutLoader: true,
      });
    });
  }

  render() {
    const { layoutLoader } = this.state;
    if (!layoutLoader) {
      return <Loader />;
    }
    return (
      <div className="dashboard-container">
        <Header link="/landingPage" aesKeyData={this.state.aesKey} />
        <div className="dashboard-sections">
          <div className="landing-page-sec">
            <div className="card landing-card ">
              <Link className="landing-card1" to={"/analytics-screen"}>
                <div className="card-img">
                  <img
                    className="card-img-top"
                    src={require("../../assets/images/map.png")}
                    alt="Survey Report"
                  />
                </div>
                <div className="card-body">
                  <p className="card-text">Analytics</p>
                </div>
              </Link>
            </div>
            <div className="card landing-card ">
              <Link className="landing-card1" to={"survey-all-report"}>
                <div className="card-img">
                  <img
                    className="card-img-top"
                    src={require("../../assets/images/landing-page/Analytics.png")}
                    alt="Analytics"
                  />
                </div>
                <div className="card-body">
                  <p className="card-text">Survey Report</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsLandingPage; 