import React, { Component } from "react";

// compment
import Header from "../header";
import Loader from "../loader/index";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import createHistory from "history/createBrowserHistory";
import { Link } from "react-router-dom";

// css
import "../landing-page/landing.css";

// const
import { AES_KEY, USER_ADMIN } from "../../comman/constants";

// fun
import { decryptRsa } from "../../comman/decodeEncodeData";
import { _getStorageValue } from "../../comman/localStorage";
import Calculator from "./index";
import RentalCalc from "./RentalCalc";
import PremiumDiscount from "./premiumDiscount";
import DCF from "./DCF";
import { calculatorCounter } from "../../action/searchHistory";

var history = createHistory();
class CalculatorLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swapFilter: "type1",
      defaultShow: "none",
      admin:false,
    };
  }

  componentDidMount() {
    _getStorageValue(USER_ADMIN).then((adminValue) => {
      this.setState({
        admin: adminValue,
      });
    });
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

  swapFilterType(type) {
    this.setState({
      swapFilter: type,
      propertyDetailsData: {},
    });
  }

  onDownload=(data)=>{
    _getStorageValue("USER_ID").then((userId) => {
      this.props.calculatorCounter(userId,data,()=>{
        console.log("success");
      },()=>{
        console.log("failiure");
      });
    });
  }

  render() {
    const { layoutLoader, swapFilter, defaultShow } = this.state;
    if (layoutLoader) {
      return (
        <>
          <div className="dashboard-container">
            <Header link="/landingPage" />

            <div className="automated-valuation-filter">
              <div
                className="filter-sections"
                style={{ width: "100%", marginTop: 100 }}
              >
                <div className="swap-filter">
                  <label
                    className={swapFilter === "type1" ? "active-filter" : ""}
                    onClick={() => {
                      this.swapFilterType("type1");
                    }}
                  >
                    Residual
                    <h2 className="filter-title"> Calculator </h2>
                  </label>
                  <label
                    className={swapFilter === "type2" ? "active-filter" : ""}
                    onClick={() => {
                      this.swapFilterType("type2");
                    }}
                  >
                    Rental
                    <h2 className="filter-title"> Calculator </h2>
                  </label>
                  <label
                    className={swapFilter === "type3" ? "active-filter" : ""}
                    onClick={() => {
                      this.swapFilterType("type3");
                    }}
                  >
                    Premium Discount
                    <h2 className="filter-title"> Calculator </h2>
                  </label>
                {this.state.admin &&   <label
                    className={swapFilter === "type4" ? "active-filter" : ""}
                    onClick={() => {
                      this.swapFilterType("type4");
                    }}
                  >
                    DCF
                  <h2 className="filter-title"> Calculator </h2>
                  </label>}
                </div>
              </div>
              <div className="calculatorHeight">
                <div
                  style={{
                    display: swapFilter === "type1" ? "block" : defaultShow,
                  }}
                >
                  <Calculator onDownload={this.onDownload}/>
                </div>

                <div
                  style={{
                    display: swapFilter === "type2" ? "block" : defaultShow,
                  }}
                >
                  <RentalCalc onDownload={this.onDownload}/>
                </div>

                <div
                  style={{
                    display: swapFilter === "type3" ? "block" : defaultShow,
                  }}
                >
                  <PremiumDiscount onDownload={this.onDownload}/>
                </div>

               {this.state.admin && <div
                  style={{
                    display: swapFilter === "type4" ? "block" : defaultShow,
                  }}
                >
                  <DCF onDownload={this.onDownload}/>
                </div>}
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  paddingRight: 30,
                  justifyContent: "flex-end",
                }}
              >
                <div className="add-Button">
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    {"Clear"}
                  </button>
                </div>
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

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({calculatorCounter:calculatorCounter}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalculatorLandingPage);
