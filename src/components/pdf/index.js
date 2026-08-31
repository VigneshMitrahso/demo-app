import React, { Component, ReactDOM } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

// component
import Header from "../header";
import SideBar from "../side-bar";
// import ImageContainer from "./ImageConatainer";
import PdfInput from "./pdfInput";

// function
import { _getStorageValue } from "../../comman/localStorage";
import { reportUser } from "../../action/reportUser";
import { reportImageUser } from "../../action/postReport";
import {
  decryptStatic,
  decryptRsa,
  encryptStatic,
} from "../../comman/decodeEncodeData";
import Loader from "../../components/loader/index";

// constant
import { AES_KEY, USER_ID } from "../../comman/constants";

import "./pdf.css";
import Form from "../../containers/video-call/Form";

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoStatus: "",
      reportBtnLoader: "",
      reportStatus: "",
      sideBarShow: false,
      headerPdf: false,
      mvgName: "",
      mvgid: "",
      mvgEmployee: "",
      propertyShown: "",
      propertAdress: "",
      realtorReference: "",
      plotArea: 0,
      occupiedBy: "",
      landMark: "",
      builtUpArea: 0,
      typeOfProperty: "",
      age: 0,
      descriptionStage: "",
      completion: 0,
      east: 0,
      west: 0,
      north: 0,
      south: 0,
      floorData: [],
      referenceDetails: "",
      DownloadUrlImage: [],
      imageUrls: [],
      customerName: "",
      latitude: 0,
      longitude: 0,
      mobileNumber: "",
      reqId: "",
      aesKey: "",
      customerDownloadBtn: true,
      layoutLoader: false,
      nowTime: "",
    };
  }

  componentWillMount() {
    _getStorageValue(AES_KEY).then((key) => {
      // decryptRsa(tokens).then((key) => {
      this.setState({
        aesKey: key,
        layoutLoader: true,
      });
      var reqId = this.props.reqId;
      if (reqId != null) {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.reportUser(
            userId,
            reqId,
            //  encryptStatic(reqId, key),
            successLatLonCall,
          );
        });
        const successLatLonCall = (response) => {
          this.setState({
            // customerName: response[0].customer_name,
            // mobileNumber: response[0].mobile_number,
            // latitude: response[0].latitude,
            // longitude: response[0].longitude,
            // reqId: response[0].request_id,
          });
        };
      }
      // });
    });
  }

  reset() {
    setTimeout(() => {
      this.setState({
        headerPdf: false,
      });
    }, 300);
  }

  saveReportData(status) {
    const {
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
      imageUrls,
      customerName,
      latitude,
      longitude,
      mobileNumber,
      reqId,
    } = this.state;

    const { reportDataValue } = this.props;
    // if (reportDataValue.length != 0) {
    //   var customerName = reportDataValue[0].customer_name;
    //   var latitude = parseInt(reportDataValue[0].latitude);
    //   var longitude = parseInt(reportDataValue[0].longitude);
    //   var mobileNumber = reportDataValue[0].mobile_number;
    //   var reqId = reportDataValue[0].request_id;
    // }
    var reportString = JSON.stringify(imageUrls);

    var postRepostObj = {
      image_urls: `${reportString.replace(/"/g, "'")}`,
    };

    if (mvgid !== "") {
      postRepostObj = Object.assign({ mvg_id: mvgid }, postRepostObj);
    }

    if (mvgName !== "") {
      postRepostObj = Object.assign({ mvg_name: mvgName }, postRepostObj);
    }

    if (longitude !== "") {
      postRepostObj = Object.assign({ longitude: longitude }, postRepostObj);
    }

    if (latitude !== "") {
      postRepostObj = Object.assign({ latitude: latitude }, postRepostObj);
    }

    if (mvgEmployee !== "") {
      postRepostObj = Object.assign(
        { mvg_employee: mvgEmployee },
        postRepostObj,
      );
    }

    if (propertyShown !== "") {
      postRepostObj = Object.assign(
        { property_shown_by: propertyShown },
        postRepostObj,
      );
    }

    if (customerName !== "") {
      postRepostObj = Object.assign(
        { customer_name: encryptStatic(customerName, this.state.aesKey) },
        postRepostObj,
      );
    }

    if (mobileNumber !== "") {
      postRepostObj = Object.assign(
        { mobile_number: mobileNumber },
        postRepostObj,
      );
    }

    if (reqId !== "") {
      postRepostObj = Object.assign({ reference_number: reqId }, postRepostObj);
    }

    if (referenceDetails !== "") {
      postRepostObj = Object.assign(
        { reference_details: referenceDetails },
        postRepostObj,
      );
    }

    if (propertAdress !== "") {
      postRepostObj = Object.assign({ address: propertAdress }, postRepostObj);
    }
    if (realtorReference !== "") {
      postRepostObj = Object.assign(
        { realtor_reference: realtorReference },
        postRepostObj,
      );
    }

    if (plotArea !== 0) {
      postRepostObj = Object.assign(
        { area: parseInt(plotArea) },
        postRepostObj,
      );
    }

    if (occupiedBy !== "") {
      postRepostObj = Object.assign({ occupied_by: occupiedBy }, postRepostObj);
    }

    if (landMark !== "") {
      postRepostObj = Object.assign({ landmark: landMark }, postRepostObj);
    }

    if (builtUpArea !== "") {
      postRepostObj = Object.assign(
        { builtup_area: parseInt(builtUpArea) },
        postRepostObj,
      );
    }

    if (typeOfProperty !== "") {
      postRepostObj = Object.assign(
        { property_type: typeOfProperty },
        postRepostObj,
      );
    }

    if (age !== "") {
      postRepostObj = Object.assign({ age: parseInt(age) }, postRepostObj);
    }

    if (completion !== "") {
      postRepostObj = Object.assign(
        { percentage_completion: parseInt(completion) },
        postRepostObj,
      );
    }

    if (east !== "") {
      postRepostObj = Object.assign({ bound_east: `${east}` }, postRepostObj);
    }

    if (west !== "") {
      postRepostObj = Object.assign({ bound_west: `${west}` }, postRepostObj);
    }

    if (south !== "") {
      postRepostObj = Object.assign({ bound_south: `${south}` }, postRepostObj);
    }

    if (north !== "") {
      postRepostObj = Object.assign({ bound_north: `${north}` }, postRepostObj);
    }

    if (descriptionStage !== "") {
      postRepostObj = Object.assign(
        { stage_description: descriptionStage },
        postRepostObj,
      );
    }

    if (descriptionStage !== "") {
      postRepostObj = Object.assign(
        { stage_description: descriptionStage },
        postRepostObj,
      );
    }

    _getStorageValue(USER_ID).then((userId) => {
      var reqId = encryptStatic(customerName, this.state.aesKey);
      this.props.reportImageUser(
        userId,
        // encodeURIComponent(mobileNumber),
        // encryptStatic(reqId, this.state.aesKey),
        reqId,
        "report-completed",
        postRepostObj,
        succesReport,
        failureReport,
      );
    });

    const succesReport = () => {
      toast.success("Report Submitted Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.setState({
        headerPdf: true,
        sideBarShow: false,
        videoStatus: "NaN",
        reportBtnLoader: false,
        customerDownloadBtn: false,
      });
      setTimeout(() => {
        this.setState({ customerDownloadBtn: true });
        this.reset();
      }, 10000);

      setTimeout(() => {
        this.pdfExportComponent.save();
      }, 1000);
    };
    const failureReport = () => {
      toast.error("Please Fill All Details", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.setState({
        // videoStatus: "NaN",
        reportBtnLoader: false,
      });
    };
  }

  reCallReportValueSet(response) {
    var datavalue = response.data;
    var data = response.data.report_details;
    console.log("ObjectData", data[0].floor_data);
    console.log("ObjectData", this.state.floorData);
    // var mobileNumber = decryptStatic(data[0].mobile_number, this.state.aesKey);

    if (datavalue.length != 0) {
      this.setState({
        mvgName: `${data[0].mvg_name !== null ? data[0].mvg_name : ""}`,
        mvgid: `${data[0].mvg_id !== null ? data[0].mvg_id : ""}`,
        mobileNumber: `${
          data[0].mobile_number !== null ? data[0].mobile_number : ""
        }`,
        customerName: `${
          decryptStatic(data[0].reference_number, this.state.aesKey) !== null
            ? decryptStatic(data[0].reference_number, this.state.aesKey)
            : ""
        }`,
        mvgEmployee: `${
          data[0].mvg_employee !== null ? data[0].mvg_employee : ""
        }`,
        propertyShown: `${
          data[0].property_shown_by !== null ? data[0].property_shown_by : ""
        }`,
        propertAdress: `${data[0].address !== null ? data[0].address : ""}`,
        realtorReference: `${
          data[0].address !== null ? data[0].realtor_reference : ""
        }`,
        plotArea: `${data[0].area !== null ? data[0].area : ""}`,
        occupiedBy: `${
          data[0].occupied_by !== null ? data[0].occupied_by : ""
        }`,
        landMark: `${data[0].landmark !== null ? data[0].landmark : ""}`,
        builtUpArea: `${
          data[0].builtup_area !== null ? data[0].builtup_area : ""
        }`,
        typeOfProperty: `${
          data[0].property_type !== null ? data[0].property_type : ""
        }`,
        age: `${data[0].age !== null ? data[0].age : ""}`,
        descriptionStage: `${
          data[0].stage_description !== null ? data[0].stage_description : ""
        }`,
        completion: `${
          data[0].percentage_completion !== null
            ? data[0].percentage_completion
            : ""
        }`,
        east: `${
          data[0].bound_east !== null && data[0].bound_east !== 0
            ? data[0].bound_east
            : ""
        }`,
        north: `${
          data[0].bound_north !== null && data[0].bound_north !== 0
            ? data[0].bound_north
            : ""
        }`,
        south: `${
          data[0].bound_south !== null && data[0].bound_south !== 0
            ? data[0].bound_south
            : ""
        }`,
        west: `${
          data[0].bound_west !== null && data[0].bound_west !== 0
            ? data[0].bound_west
            : ""
        }`,
        floorData: `${
          data[0].floor_data !== null && data[0].floor_data.length !== 0
            ? JSON.stringify(data[0].floor_data)
            : []
        }`,
        referenceDetails: `${
          data[0].reference_details !== null ? data[0].reference_details : ""
        }`,
        DownloadUrlImage: data[0].download_urls,
        imageUrls: data[0].img_urls,
        latitude: data[0].latitude,
        longitude: data[0].longitude,
      });
    }
  }

  setSaveReport() {
    const { videoStatus, floorData } = this.state;
    console.log("Objectdata", floorData);
    this.saveReportData(videoStatus);
    // if (videoStatus !== "" && videoStatus !== "NaN") {
    //   this.setState({
    //     reportBtnLoader: true,
    //   });

    //   this.saveReportData(videoStatus);
    // } else {
    //   toast.warning("Please Select the Status", {
    //     position: toast.POSITION.BOTTOM_CENTER,
    //   });
    // }
  }

  // saveDoc = () => {
  //   this.saveReportData("saved");
  // };

  // markAsComplet = () => {
  //   this.saveReportData("completed");
  // };

  render() {
    const {
      sideBarShow,
      headerPdf,
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
      DownloadUrlImage,
      videoStatus,
      customerName,
      latitude,
      longitude,
      mobileNumber,
      reqId,
      reportBtnLoader,
    } = this.state;

    const { reportDataValue } = this.props;

    if (this.state.layoutLoader) {
      return (
        <React.Fragment>
          <PDFExport
            ref={(component) => (this.pdfExportComponent = component)}
            paperSize="A4"
            fileName={customerName}
            className="exportStackPlan"
          >
            <React.Fragment>
              <div className="pdf-header">
                <Header
                  login={headerPdf}
                  sideBarCallBack={() => {
                    this.setState({
                      sideBarShow: !sideBarShow,
                    });
                  }}
                  pdfPageHeader={true}
                />
                <div>
                  <Form
                    saveBtn={this.state.nowTime}
                    reqId={reportDataValue[0].request_id}
                  />
                </div>
                <div>
                  <div className="filter-Button center-pdf pdf-add pdf-screen-1">
                    <div className="page-template page-template2-top">
                      <h1 className="watermark">ICICI BANK</h1>
                    </div>
                    {this.state.customerDownloadBtn && (
                      <div className="pdf-down">
                        <button
                          onClick={() => {
                            this.setState({ nowTime: Date.now() });
                          }}
                          className="report"
                        >
                          {reportBtnLoader ? (
                            <div className="loader"></div>
                          ) : null}
                          Report Update
                        </button>
                        <button
                          onClick={this.exportPDFWithComponent}
                          className="red-bg"
                        >
                          Download
                        </button>
                      </div>
                    )}
                    <div className="page-template page-template2-bottom">
                      <h1 className="watermark">ICICI BANK</h1>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          </PDFExport>
        </React.Fragment>
      );
    } else {
      return (
        <div className="pdf-full-loader">
          <Loader />
        </div>
      );
    }
  }

  exportPDFWithComponent = () => {
    this.setState({
      headerPdf: true,
      sideBarShow: false,
      customerDownloadBtn: false,
    });
    setTimeout(() => {
      this.setState({ customerDownloadBtn: true });
      this.reset();
    }, 10000);

    setTimeout(() => {
      this.pdfExportComponent.save();
    }, 1000);
  };
}
const mapStateToProps = (state) => ({
  reportDataValue: state.reportUserData.reportDataValue,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reportUser: reportUser,
      reportImageUser: reportImageUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Pdf);
