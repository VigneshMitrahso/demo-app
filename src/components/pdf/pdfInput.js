import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// component
import ImageContainer from "./ImageConatainer";
import VoiceMemo from "../../components/voiceMemo";
import VideoMemo from "../../components/videoMemo";
// function
import { _getStorageValue } from "../../comman/localStorage";
import { reportUser } from "../../action/reportUser";
import { reCallReportUser } from "../../action/reCallReport";

// constant
import { AES_KEY, USER_ID } from "../../comman/constants";
import {
  decryptStatic,
  decryptRsa,
  encryptStatic,
} from "../../comman/decodeEncodeData";
import Loader from "../../components/loader/index";

import "./pdf.css";

class PdfInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addReportTable: [],
      operation: "add",
      currentItem: {
        noOfFloor: "",
        noOfRoom: "",
        noOfKitchen: "",
        noOfUsage: "",
      },
      sideBarShow: false,
      headerPdf: false,
      selectedImage: [],
      errorFloorThrow: false,
      errorRoomThrow: false,
      errorKitchenThrow: false,
      errorUsageThrow: false,
      deletShow: false,
      aesKey: "",
      layoutLoader: false,
    };
  }

  componentDidMount() {
    const { reqId, reqreCallReport, floorData } = this.props;
    setTimeout(() => {
      console.log("ObjectFLOORDATA", floorData);
    }, 5000);
    _getStorageValue(AES_KEY).then((key) => {
      // decryptRsa(tokens).then((key) => {
      this.setState({
        aesKey: key,
      });
      setTimeout(() => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.reCallReportUser(
            userId,
            reqreCallReport,
            // encryptStatic(this.props.reqId, key),
            this.props.successReCall,
            this.props.faulierReCall,
          );
          this.setState({
            layoutLoader: true,
          });
        });
      }, 500);
      // });
    });
  }

  addItem = (e) => {
    e.preventDefault();
    const { addReportTable, currentItem, operation } = this.state;

    var valid =
      currentItem.noOfFloor !== "" &&
      currentItem.noOfRoom !== "" &&
      currentItem.noOfKitchen !== " " &&
      currentItem.noOfUsage !== "";

    if (currentItem.noOfFloor === "") {
      this.setState({
        errorFloorThrow: true,
      });
    } else if (currentItem.noOfRoom === "") {
      this.setState({
        errorRoomThrow: true,
      });
    } else if (currentItem.noOfKitchen === "") {
      this.setState({
        errorKitchenThrow: true,
      });
    } else if (currentItem.noOfUsage === "") {
      this.setState({
        errorUsageThrow: true,
      });
    } else {
      if (operation === "add") {
        var id;
        if (addReportTable.length) {
          id = addReportTable[addReportTable.length - 1].id + 1;
          currentItem.id = id;
        } else {
          id = 1;
          currentItem.id = id;
        }

        this.setState({
          addReportTable: [...addReportTable, currentItem],
        });

        this.setState({
          currentItem: {
            noOfFloor: "",
            noOfRoom: "",
            noOfKitchen: "",
            noOfUsage: "",
          },
        });
      }
    }
  };

  deleteItem(id) {
    let { addReportTable } = this.state;
    let index = addReportTable.findIndex((obj) => obj.id === id);
    addReportTable.splice(index, 1);
    this.setState({
      noOfFloor: "",
      noOfRoom: "",
      noOfKitchen: "",
      noOfUsage: "",
      id: "",
    });
  }

  clearItem() {
    this.setState({
      currentItem: {
        noOfFloor: "",
        noOfKitchen: "",
        noOfRoom: "",
        noOfUsage: "",
      },
    });
  }

  handleChange = (e) => {
    const { currentItem } = this.state;

    var valid =
      currentItem.noOfFloor !== "" &&
      currentItem.noOfRoom !== "" &&
      currentItem.noOfKitchen !== " " &&
      currentItem.noOfUsage !== "";

    currentItem[e.target.name] = e.target.value;
    this.setState(currentItem);
    this.setState({
      errorFloorThrow: false,
      errorKitchenThrow: false,
      errorRoomThrow: false,
      errorUsageThrow: false,
    });
  };

  render() {
    const {
      addReportTable,
      currentItem,
      errorFloorThrow,
      deletShow,
      aesKey,
      errorRoomThrow,
      errorKitchenThrow,
      errorUsageThrow,
    } = this.state;
    const {
      headerPdf,
      reportDataValue,
      mvgid,
      mvgName,
      mvgEmployee,
      propertyShown,
      propertAdress,
      realtorReference,
      plotArea,
      occupiedBy,
      landMark,
      builtUpArea,
      typeOfProperty,
      age,
      descriptionStage,
      completion,
      east,
      west,
      north,
      south,
      floorData,
      referenceDetails,
      customerName,
      latitude,
      longitude,
      mobileNumber,
      reqId,
      DownloadUrlImage,
      isFetchingAddImage,
      reportBtnLoader,
      reqreCallReport,
    } = this.props;
    if (this.state.layoutLoader) {
      return (
        <div className="pdf-gentarter-sec">
          <div className="pdf-screen-1">
            <div className="page-template page-template-top">
              <h1 className="watermark">ICICI BANK</h1>
            </div>
            <div className="customer-sec  marginTop">
              {/* <div className="customer-details-sec width45 ">
              <label className="customer-title">MVG Employee Name </label>
              <input
                type="text"
                value={mvgName}
                onChange={(e) => {
                  this.props.onChangeMvgName(e.target.value);
                }}
                className="customer-desc"
              />
            </div> */}
              <div className="customer-details-sec width45">
                <label className="customer-title">MVG Employee Email Id</label>
                <input
                  type="text"
                  value={mvgid}
                  onChange={(e) => {
                    this.props.onChangeMvgId(e.target.value);
                  }}
                  className="customer-desc"
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Property Shown by</label>
                <input
                  type="text"
                  value={propertyShown}
                  className="customer-desc"
                  onChange={(e) => {
                    this.props.onChangePropertyShown(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="customer-details-sec mar-top-5 width1001">
              <label className="customer-title width24">
                Realtor Reference
                {/* realtor_reference */}
              </label>
              <input
                type="text"
                value={realtorReference}
                className="customer-desc width74"
                onChange={(e) => {
                  this.props.onChangeRealtorReference(e.target.value);
                }}
              />
            </div>
            {/* <div className="customer-sec  marginTop">
            <div className="customer-details-sec width45 ">
              <label className="customer-title">MVG Employee </label>
              <input
                type="text"
                onChange={(e) => {
                  this.props.onChangeMvgEmp(e.target.value);
                }}
                value={mvgEmployee}
                className="customer-desc"
              />
            </div>
  
  
          </div> */}
            <div className="site-vist sitrepot marginTop">
              <h3 className=""> Site Visit Report </h3>
            </div>
            <div className="customer-sec">
              <div className="customer-details-sec width45 ">
                <label className="customer-title ">Reference Number</label>
                <input
                  type="text"
                  value={customerName}
                  className="customer-desc "
                />
              </div>
              <div className="customer-details-sec width45 ">
                <label className="customer-title  ">Latitude</label>
                <input
                  type="text"
                  className="customer-desc "
                  placeholder="LATITUDE"
                  value={latitude}
                />
              </div>
            </div>
            {/* <div className="customer-sec mar-top-5">
            <label className="customer-title width45 ">Reference Number</label>
            <input type="text" value={reqId} className="customer-desc width45" />
          </div> */}
            <div className="customer-sec mar-top-5">
              <div className="customer-details-sec width45">
                <label className="customer-title">Mobile Number</label>
                <input
                  type="text"
                  value={decryptStatic(mobileNumber, this.state.aesKey)}
                  className="customer-desc"
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Longitude</label>
                <input
                  type="text"
                  className="customer-desc "
                  placeholder="LONGITUDE"
                  value={longitude}
                />
              </div>
            </div>
            <div className="site-vist sitrepot marginTop ">
              <h3> Reference Details </h3>
            </div>
            <textarea
              type="text"
              value={referenceDetails}
              onChange={(e) => {
                this.props.onChangeReferenceDetails(e.target.value);
              }}
              className="site-vist-desc"
            />
            <div className="site-vist sitrepot">
              <h3> Property Details </h3>
            </div>
            <div className="customer-sec">
              <div className="customer-details-sec width45">
                {/* <label className="customer-title">Property address</label>
              <input
                type="text"
                value={propertAdress}
                className="customer-desc"
                onChange={(e) => {
                  this.props.onChangePropertyAdd(e.target.value);
                }}
              /> */}
                <label className="customer-title ">Occupied by</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.props.onChangeOccupied(e.target.value);
                  }}
                  value={occupiedBy}
                  className="customer-desc "
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">Plot Area</label>
                <input
                  type="text"
                  value={plotArea}
                  onChange={(e) => {
                    this.props.onChangePlotArea(e.target.value);
                  }}
                  className="customer-desc"
                />
              </div>
              <div className="customer-details-sec mar-top-5 width1001">
                <label className="customer-title width24">
                  Property Address
                </label>
                <input
                  type="text"
                  value={propertAdress}
                  className="customer-desc width74"
                  onChange={(e) => {
                    this.props.onChangePropertyAdd(e.target.value);
                  }}
                />
                {/* <label className="customer-title width45 ">Occupied by</label>
              <input
                type="text"
                onChange={(e) => {
                  this.props.onChangeOccupied(e.target.value);
                }}
                value={occupiedBy}
                className="customer-desc width45 "
              /> */}
              </div>
            </div>
            <div className="customer-sec mar-top-5">
              <div className="customer-details-sec width45">
                <label className="customer-title">Land Mark</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.props.onChangeLandMark(e.target.value);
                  }}
                  value={landMark}
                  className="customer-desc"
                />
              </div>
              <div className="customer-details-sec width45 ">
                <label className="customer-title">Built-up Area</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.props.onChangeBuiltArea(e.target.value);
                  }}
                  value={builtUpArea}
                  className="customer-desc"
                />
              </div>
              <div className="customer-details-sec mar-top-5 width1001 ">
                <div className="customer-details-sec width45 ">
                  <label className="customer-title ">Type of Property</label>
                  <input
                    type="text"
                    value={typeOfProperty}
                    className="customer-desc"
                    onChange={(e) => {
                      this.props.onChangeTypeOfProperty(e.target.value);
                    }}
                  />
                </div>
                <div className="customer-details-sec width45 ">
                  <label className="customer-title">Age</label>
                  <input
                    onChange={(e) => {
                      this.props.onChangeAge(e.target.value);
                    }}
                    type="number"
                    value={age}
                    className="customer-desc"
                  />
                </div>
              </div>
            </div>
            <div className="customer-sec mar-top-5">
              <div className="customer-details-sec width45 ">
                <label className="customer-title">Description of Stage</label>
                <input
                  type="text"
                  value={descriptionStage}
                  className="customer-desc"
                  onChange={(e) => {
                    this.props.onChangeDiscriptionStage(e.target.value);
                  }}
                />
              </div>
              <div className="customer-details-sec width45">
                <label className="customer-title">% Completion</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.props.onChangeCompletion(e.target.value);
                  }}
                  value={completion}
                  className="customer-desc"
                />
              </div>
            </div>
            <div className="page-template page-template-bottom">
              <h1 className="watermark">ICICI BANK</h1>
            </div>
          </div>
          <div className="pdf-screen-1">
            {/* <div className="page-template">

              <div className="watermark">C O N F I D E N T I A L</div>

            </div> */}
            <div className="customer-sec mar-top-5">
              <div className="customer-details-sec width1001">
                <label className="customer-title width16 ">
                  Boundary Details
                </label>
                <label className="customer-title width16 ">East</label>
                <label className="customer-title width16 ">West</label>
                <label className="customer-title width16 ">North</label>
                <label className="customer-title width16 ">South</label>
              </div>
            </div>
            <div className="customer-sec mar-top-5">
              <div className="customer-details-sec width1001">
                <label className="customer-title width16 ">At Site</label>
                <input
                  type="text"
                  value={east}
                  className="customer-desc width16 "
                  onChange={(e) => {
                    this.props.onChangeEast(e.target.value);
                  }}
                />
                <input
                  type="text"
                  value={west}
                  className="customer-desc width16 "
                  onChange={(e) => {
                    this.props.onChangeWest(e.target.value);
                  }}
                />
                <input
                  type="text"
                  value={north}
                  className="customer-desc width16 "
                  onChange={(e) => {
                    this.props.onChangeNorth(e.target.value);
                  }}
                />
                <input
                  type="text"
                  value={south}
                  className="customer-desc width16 "
                  onChange={(e) => {
                    this.props.onChangeSouth(e.target.value);
                  }}
                />
              </div>
            </div>
            {/*for page break add this in class =page-break  */}
            <div className="customer-sec mar-top-5">
              <div
                className={`customer-details-sec ${
                  headerPdf ? "width1001" : "width1001"
                } `}
              >
                <label className="customer-title width16 ">No. of Floors</label>
                <label className="customer-title width16 ">No. of Rooms</label>
                <label className="customer-title width16 ">
                  No. of Kitchen
                </label>
                <label className="customer-title width32 ">Usage</label>
              </div>
            </div>
            {addReportTable.map((data) => {
              return (
                <div key={data.id} className="customer-sec mar-top-5">
                  <div
                    className={`customer-details-sec mar-top-10 ${
                      headerPdf ? "width1001" : "width1001"
                    } `}
                  >
                    <label className="customer-desc width16 ">
                      {data.noOfFloor}
                    </label>
                    <label className="customer-desc width16 ">
                      {data.noOfRoom}
                    </label>
                    <label className="customer-desc width16 ">
                      {data.noOfKitchen}
                    </label>
                    <label className="customer-desc width32 ">
                      {data.noOfUsage}
                    </label>
                  </div>
                  {/* {headerPdf ? null : ( */}
                  <div>
                    {(() => {
                      if (!headerPdf) {
                        return (
                          <div className="pdfclose">
                            <img
                              src={require("../../assets/images/delete.png")}
                              onClick={() => {
                                this.deleteItem(data.id);
                              }}
                              alt="dsd"
                            />
                          </div>
                        );
                      }
                    })()}
                    {/* {deletShow ? (
                      <div className="pdfclose">
                        <img
                          src={require("../../assets/images/delete.png")}
                          onClick={() => {
                            this.deleteItem(data.id);
                          }}
                          alt="dsd"
                        />
                      </div>
                    ) : null} */}
                  </div>
                  {/* )} */}
                </div>
              );
            })}
            <div>
              <div className="customer-sec mar-top-5">
                <div
                  className={`customer-details-sec mar-top-10 ${
                    headerPdf ? "width1001" : "width1001"
                  } `}
                >
                  <input
                    type="text"
                    // value={this.state.value}
                    className={`${
                      errorFloorThrow
                        ? "customer-desc active width16"
                        : " customer-desc width16"
                    }`}
                    name="noOfFloor"
                    value={currentItem.noOfFloor}
                    onChange={this.handleChange}
                  />
                  <input
                    type="text"
                    // value={this.state.value}
                    className={
                      `${
                        errorRoomThrow
                          ? "customer-desc active width16"
                          : " customer-desc width16"
                      }`
                      // " customer-desc width36"
                    }
                    name="noOfRoom"
                    value={currentItem.noOfRoom}
                    onChange={this.handleChange}
                  />
                  <input
                    type="text"
                    className={`${
                      errorKitchenThrow
                        ? "customer-desc active width16"
                        : " customer-desc width16"
                    }`}
                    name="noOfKitchen"
                    value={currentItem.noOfKitchen}
                    onChange={this.handleChange}
                  />
                  <input
                    type="text"
                    className={`${
                      errorUsageThrow
                        ? "customer-desc active width32"
                        : " customer-desc width32"
                    }`}
                    name="noOfUsage"
                    value={currentItem.noOfUsage}
                    onChange={this.handleChange}
                  />
                </div>
                {headerPdf ? null : (
                  <div className="pdfclose">
                    <img
                      src={require("../../assets/images/delete.png")}
                      onClick={() => {
                        this.clearItem();
                      }}
                      alt="dfd"
                    />
                  </div>
                )}
              </div>
              {headerPdf ? null : (
                <div className="filter-Button pdf-add">
                  <button onClick={this.addItem} className="report">
                    Add Row
                  </button>
                </div>
              )}
            </div>
            <div className="site-vist sitrepot marginTop  ">
              <h3> Property Photos</h3>
            </div>
            <ImageContainer DownloadUrlImage={DownloadUrlImage} />
            <VoiceMemo reqId={reqreCallReport} isPdf={true} />
            <VideoMemo reqId={reqreCallReport} isPdf={true} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="pdf-full-loader">
          <Loader />
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  isFetchingAddImage: state.reportImageData.isFetchingAddImage,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reportUser: reportUser,
      reCallReportUser: reCallReportUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PdfInput);
