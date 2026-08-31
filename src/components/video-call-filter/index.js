import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

// function
import { _getStorageValue } from "../../comman/localStorage";
import {
  bankDataUser,
  resetbankDataUser,
  setPropertyUnitType,
} from "../../action/bankData";
import { apiVideoCall } from "../../comman/connect";
import { encryptStatic, decryptStatic } from "../../comman/decodeEncodeData";

// constant
import { USER_ID, GET, ACCESS_TOKEN, USER_NAME } from "../../comman/constants";
import { getUserId, setVideo } from "../../comman/localStorage";

// css
import "../filter/filter.css";

// urls
import {
  createRoomUrl,
  genrateTokenUrl,
  endRoomCallUrl,
} from "../../comman/urls";
import { propTypes } from "react-bootstrap/esm/Image";

class VideoCallFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankUserData: [],
      roomNameValue: "",
      accesTokenValue: "",
      bankValueState: props.reqID,
      isClearSearchReq: false,
      isDisabled: !!props?.selectedTypes?.unitType ? false : true,
      unitTypeIs: props?.selectedTypes?.unitType ?? "Select Unit Type",
      proTypeIS: props?.selectedTypes?.propType ?? "Select Property Type",
      submitDisable: !!props?.selectedTypes?.unitType ? true : false,
      unitType: [
        {
          value: "",
          label: "Select Unit Type",
        },
      ],
      propertyType: [
        {
          value: "",
          label: "Select Property Type",
        },
        {
          value: "Residential",
          label: "Residential",
        },
        {
          value: "Commercial",
          label: "Commercial",
        },
        {
          value: "Industrial",
          label: "Industrial",
        },
        {
          value: "Specialised property",
          label: "Specialised property",
        },
      ],
    };
  }

  // componentDidMount() {
  //   // var reqId = this.props.match.params.id;
  //   var url = window.location.href
  //   var fields = url.split("%20");

  //   if(fields[1] === "REQ-000") {
  //     this.setState({
  //       bankValueState: "",
  //     });
  //   }

  // }

  componentDidMount() {
    if (!!this.props?.selectedTypes?.propType) {
      this.onStateChange(this.props?.selectedTypes?.propType);
      this.setState({ unitTypeIs: this.props?.selectedTypes?.unitType });
    }
  }

  getBankData(e) {
    this.setState({
      bankValueState: e.target.value.toUpperCase().trim(),
      submitDisable: false,
    });
  }

  searchReqId() {
    const { bankValueState } = this.state;

    const { aesKey } = this.props;

    var trimValue = bankValueState.replace(" ", "", "g");

    // var trimValue = "pJkd4JYuGfKZwCDi0xtvukX0agEGFGWF87PA0jdIhqs%3D";
    this.props.historyReqIdCheck(trimValue);

    if (trimValue !== "") {
      // var emtrim = encryptStatic(trimValue, aesKey);
      var dataValue = encryptStatic(trimValue, aesKey);
      this.props.dataValueEnc(dataValue);
      _getStorageValue(USER_ID).then((userId) => {
        this.props.bankDataUser(
          userId,
          dataValue,
          this.props.successBankCall,
          this.props.failureBankCall,
        );
      });
      this.setState({ isDisabled: false });
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  onStateChange = (item) => {
    let data = [];
    if (item !== "") {
      this.setState({ proTypeIS: item });
      if (item == "Residential") {
        data = [
          { value: "", label: "Select Unit Type" },
          { label: "Land", value: "Land" },
          { label: "Flat", value: "Flat" },
          { label: "Independent House", value: "Independent House" },
        ];
      } else if (item == "Commercial") {
        data = [
          { value: "", label: "Select Unit Type" },
          { label: "Land", value: "Land" },
          { label: "Office", value: "Office" },
          { label: "Retail", value: "Retail" },
          { label: "Independent Building", value: "Independent Building" },
        ];
      } else if (item == "Industrial") {
        data = [
          { value: "", label: "Select Unit Type" },
          { label: "Land", value: "Land" },
          { label: "Unit", value: "Unit" },
        ];
      } else if (item == "Specialised property") {
        data = [
          { value: "", label: "Select Unit Type" },
          { label: "Hospital", value: "Hospital" },
          {
            label: "Function Hall/Marriage Garden",
            value: "Function Hall/Marriage Garden",
          },
          { label: "Educational Institute", value: "Educational Institute" },
          { label: "Cinema Halls", value: "Cinema Halls" },
          { label: "Malls", value: "Malls" },
          { label: "Hotels", value: "Hotels" },
          { label: "Warehouses", value: "Warehouses" },
        ];
      }
      this.setState({ unitType: data, unitTypeIs: "Select Unit Type" });
    }
  };

  render() {
    const { bankValueState, isClearSearchReq, submitDisable } = this.state;
    const { isFetchingSearchReq } = this.props;
    return (
      <div className="search-video-req">
        <h6>Search Req Id</h6>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "65%%" }}>
            <Form.Control
              placeholder="eg. REQ-000"
              className="search-key"
              value={bankValueState}
              onChange={(e) => this.getBankData(e)}
              disabled={!this.state.isDisabled}
            />
          </div>

          <div
            style={{
              width: "46%",
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
            className="filter-Button mrg-fil"
          >
            <button
              onClick={() => {
                this.searchReqId();
                this.setState({ submitDisable: true });
              }}
              style={{
                width: 80,
                height: 30,
                opacity: submitDisable ? 0.5 : 1,
              }}
              disabled={isFetchingSearchReq || submitDisable}
            >
              {isFetchingSearchReq ? <div className="loader"></div> : "Search"}
            </button>
            <button
              className="report"
              style={{ width: 80, height: 30 }}
              onClick={() => {
                this.setState({
                  isClearSearchReq: true,
                  isDisabled: true,
                });
                setTimeout(() => {
                  this.setState({
                    isClearSearchReq: false,
                  });
                  window.location.reload();
                }, 2000);
              }}
            >
              {isClearSearchReq ? <div className="loader"></div> : "Clear"}
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            opacity: this.state.isDisabled ? 0.5 : 1,
          }}
        >
          <div
            style={{
              width: "40%",
              paddingLeft: 0,
              marginTop: 0,
              marginBottom: 0,
            }}
            className="search-element"
          >
            <div className="down-arrow">
              <select
                value={this.state.proTypeIS}
                onChange={(e) => {
                  this.onStateChange(e.target.value);
                  this.props.setButtonStatus(true);
                }}
                disabled={this.state.isDisabled}
              >
                {this.state.propertyType.map((data) => (
                  <option value={data.value} label={data.label} />
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              width: "40%",
              paddingLeft: 0,
              marginTop: 0,
              marginBottom: 0,
            }}
            className="search-element"
          >
            <div className="down-arrow">
              <select
                value={this.state.unitTypeIs}
                onChange={(e) => {
                  this.setState({ unitTypeIs: e.target.value });
                  this.props.setButtonStatus(true);
                }}
                disabled={this.state.isDisabled}
              >
                {this.state.unitType.map((data) => (
                  <option value={data.value} label={data.label} />
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="form-input-submit">
              <button
                onClick={() => {
                  this.setState({
                    loaderStatus: true,
                    isTrigger: Date.now(),
                  });

                  if (
                    this.state.unitTypeIs !== "Select Unit Type" &&
                    this.state.proTypeIS !== "Select Property Type"
                  ) {
                    this.props.setButtonStatus(false);
                    this.props.setPropertyUnitType({
                      propType: this.state.proTypeIS,
                      unitType: this.state.unitTypeIs,
                    });
                  } else {
                    toast.warning("Please choose unit type and property type", {
                      position: toast.POSITION.BOTTOM_CENTER,
                    });
                  }
                  // this.triggerLogin();
                }}
                disabled={this.state.isDisabled}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetchingSearchReq: state.bankData.isFetchingSearchReq,
  bankDataValue: state.bankData.bankDataValue,
  selectedTypes: state.bankData.selectedTypes,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      bankDataUser: bankDataUser,
      resetbankDataUser: resetbankDataUser,
      setPropertyUnitType: setPropertyUnitType,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCallFilter);
