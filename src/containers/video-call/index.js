import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import Slider from "react-slick";
import { Modal } from "react-bootstrap";
import Countdown from "react-countdown";

import { toast } from "react-toastify";
// components
import Header from "../../components/header";
import SideBar from "../../components/side-bar";
import Room from "./Room";
import VideoCallFilter from "../../components/video-call-filter";
import Pdf from "../../components/pdf";
import Loader from "../../components/loader/index";
import VoiceMemo from "../../components/voiceMemo";
import VideoMemo from "../../components/videoMemo";
// function
import { _getStorageValue } from "../../comman/localStorage";
import { apiVideoCall, logErrors } from "../../comman/connect";

import {
  getImageUrlUser,
  resetgetImageUrlUser,
} from "../../action/getImageUrl";
import { reportImageUser, resetreportImageUser } from "../../action/postReport";
// import { historyUser } from "../../action/getHistory";
import { bankDataUser, resetbankDataUser } from "../../action/bankData";
import { removeImageUserAction } from "../../action/removeImage";
import { reportUser } from "../../action/reportUser";
import { disableReqIdUser } from "../../action/disableReqId";

// constant
import {
  USER_ID,
  GET,
  ACCESS_TOKEN,
  USER_NAME,
  AES_KEY,
} from "../../comman/constants";
import {
  getUserId,
  setVideo,
  getVideo,
  getTime,
  setTime,
} from "../../comman/localStorage";

// css
import "../dash-board/dashBoard.css";
import {
  createRoomUrl,
  genrateTokenUrl,
  smsUrl,
  endRoomCallUrl,
  callDataUrl,
  smsWhatsappUrl,
} from "../../comman/urls";
import {
  decryptStatic,
  decryptRsa,
  encryptStatic,
} from "../../comman/decodeEncodeData";
import DeskTopCall from "./DeskTopCall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { getNetworkBandwidth } from "../../comman/checkinternetbandwidth";
import { createCall } from "../../action/azureCalling";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", zIndex: 9999 }}
      onClick={onClick}
      disabled={false}
    />
  );
}

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
  rowsPerPage: 15,
};

const columns = [
  {
    name: "request_id",
    label: "Request Id",
  },
  {
    name: "status",
    label: "Status",
  },
  {
    name: "update_date",
    label: "Time",
  },
];

const columnsMeasure = [
  {
    name: "room_description",
    label: "Room Description",
  },
  {
    name: "length",
    label: "Length",
  },
  {
    name: "width",
    label: "Width",
  },
  {
    name: "area",
    label: "Sq. Ft",
  },
];

class VideoCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encReqId: "",
      sideBarShow: false,
      roomName: "",
      token: "",
      reqreCallReport: "",
      welcomeScreen: false,
      smsCredential: {},
      smsScreen: false,
      joinCallDisable: true,
      joinCallLoader: false,
      reJoinScreen: false,
      joincallBtnStatus: false,
      reportImageData: [],
      mvgName: "",
      mvgId: "",
      bankValueState: "",
      imageDetailsArr: [],
      smsStatus: false,
      lat: 0,
      long: 0,
      showDisableUser: false,
      showReportData: false,
      aesKey: "",
      layoutLoader: false,
      reqIdCheckValue: false,
      videoStatus: false,
      joinCallLoaderRoom: false,
      showRecordedVoice: false,
      showRecordedVideo: false,
      isVideoCallToggle: false,
      isDisabled: true,
      isLoading: false,
    };
    // this.callBack = this.callBack.bind(this);
  }

  componentDidMount() {
    _getStorageValue(AES_KEY).then((key) => {
      // decryptRsa(tokens).then((key) => {
      this.setState({
        aesKey: key,
        layoutLoader: true,
      });

      var token = getVideo();
      if (token.access != null) {
        this.setState({
          smsScreen: true,
        });
      } else {
        this.setState({
          smsScreen: false,
        });
      }

      // _getStorageValue(USER_ID).then((userId) => {
      //   this.props.historyUser(userId);
      // });
    });
  }

  getImageData() {
    const { bankDataValue } = this.props;
    var user_Name = bankDataValue[0].name;
    var mobile_numbers = bankDataValue[0].id;

    _getStorageValue(USER_ID).then((userId) => {
      this.props.getImageUrlUser(
        userId,
        // encryptStatic(user_Name, this.state.aesKey),
        user_Name,
        successCall,
      );
      this.props.reportUser(
        userId,
        // encryptStatic(user_Name, this.state.aesKey),
        user_Name,
        successLatLonCall,
      );
    });
    this.setState({ reqreCallReport: user_Name });
    const successCall = (response) => {
      var slidLength = response.data.image_details;

      if (slidLength.length !== 0) {
        var dummyArr = [{}, {}, {}, {}, {}, {}];

        if (slidLength.length === 1) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 2) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 3) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 4) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 5) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 6) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length >= 7) {
          var sliderValue = [...slidLength, ...dummyArr];
        }

        // sliderValue.sort(function (a, b) {
        //   return (a.selected === false) - (b.selected === false);
        // });

        sliderValue.sort(function (x, y) {
          // true values first
          return x.selected === y.selected ? 0 : x.selected ? -1 : 1;
          // false values first
          // return (x === y)? 0 : x? 1 : -1;
        });

        this.setState({
          imageDetailsArr: sliderValue,
          joinCallDisable: false,
        });
      } else {
        this.setState({
          imageDetailsArr: [],
          joinCallDisable: false,
        });
      }
    };

    const successLatLonCall = (response) => {
      this.setState({
        lat: response[0].latitude,
        long: response[0].longitude,
      });
    };
  }

  async sendSms() {
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];
    if (reqId !== undefined) {
      var user_Name = bankDataValue[0].name;
      // var encryptedName = encryptStatic(user_Name, this.state.aesKey);
      var encryptedName = user_Name;

      _getStorageValue(USER_ID).then((userId) => {
        _getStorageValue(ACCESS_TOKEN).then((token) => {
          var urls = smsUrl(userId, encodeURIComponent(encryptedName));
          apiVideoCall(GET, urls, "", onSuccess, onFailure, "", token);

          this.setState({
            smsStatus: true,
          });
        });
      });

      const onSuccess = (response) => {
        toast.success(response.data[0].data, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        const { bankDataValue } = this.props;
        var reqId = bankDataValue[0];
        if (reqId !== undefined) {
          var user_Name = bankDataValue[0].name;
          // var encryptedName = encryptStatic(user_Name, this.state.aesKey);
          var encryptedName = user_Name;
        _getStorageValue(USER_ID).then((userId) => {
          _getStorageValue(ACCESS_TOKEN).then((token) => {
            var urls = smsWhatsappUrl(userId, encodeURIComponent(encryptedName));
            apiVideoCall(GET, urls, "", (response)=>{
              toast.success("Whatsapp Message Generated", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }, (response)=>{
              toast.warning(response.message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }, "", token);
          });
        });
      }

        this.startTimer();
        _getStorageValue(USER_ID).then((userId) => {
          this.props.createCall(
            userId,
            encodeURIComponent(encryptedName),
            successApi,
            failiur,
          );
        });
      };
      const successApi = () => {
        console.log("userData");
      };

      const failiur = () => {
        console.log("failiur");
      };

      const onFailure = (response) => {
        toast.warning(response.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        this.setState({
          smsStatus: false,
        });
      };
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  checkStatus = async () => {
    this.setState({
      isLoading: true,
    });
    await getNetworkBandwidth();
    this.setState({
      isLoading: false,
    });
  };

  joinVideoCall() {
    const { smsStatus } = this.state;
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];

    // if (smsStatus) {
    //   toast.warning("Try After SMS Countdown", {
    //     position: toast.POSITION.BOTTOM_CENTER
    //   });
    // }
    // else {
    if (reqId !== undefined) {
      var name = bankDataValue[0].name;
      var mobileNo = bankDataValue[0].id;
      this.getCallData(mobileNo);

      this.setState({
        joinCallDisable: true,
        joinCallLoader: true,
      });
    } else {
      toast.warning("Search for REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    // }
  }

  getCallData(mobileNo) {
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0].userName;
    var name = bankDataValue[0].name;
    // var mobileNo = bankDataValue[0].id;

    _getStorageValue(USER_ID).then((userId) => {
      _getStorageValue(ACCESS_TOKEN).then((token) => {
        var urls = callDataUrl(userId, encodeURIComponent(mobileNo));
        apiVideoCall(GET, urls, "", onSuccess, onFailure, "", token);
      });
    });

    const onSuccess = (response) => {
      var callStatusData = response.data;
      var callStatus = response.data.call_details;
      if (callStatusData === null) {
        this.creatRoomCall(reqId, mobileNo, name);
      }
      if (callStatus.length === 0) {
        this.creatRoomCall(reqId, mobileNo, name);
      } else {
        if (callStatus[0].status === "completed") {
          this.creatRoomCall(reqId, mobileNo, name);
        } else {
          var sid = callStatus[0].sid;
          var secret = callStatus[0].secret;
          var roomName = callStatus[0].room_name;
          this.getAccessToken(reqId, sid, secret, roomName);
        }
      }
    };

    const onFailure = (response) => {
      this.creatRoomCall(reqId, mobileNo, name);
    };
  }

  creatRoomCall(reqId, mobileNo, userName) {
    _getStorageValue(USER_ID).then((userId) => {
      _getStorageValue(ACCESS_TOKEN).then((token) => {
        var urls = createRoomUrl(
          userId,
          // encodeURIComponent(encryptStatic(reqId, this.state.aesKey)),
          encodeURIComponent(reqId),
          encodeURIComponent(mobileNo),
          encodeURIComponent(userName),
        );
        apiVideoCall(GET, urls, "", onSuccess, onFailure, "", token);
      });
    });

    const onSuccess = (response) => {
      var sid = response.data[0].roomSID;
      var secret = response.data[0].roomSecret;
      var roomName = response.data[0].roomName;
      this.getAccessToken(userName, sid, secret, roomName);
    };

    const onFailure = (response) => {
      console.log(response);
    };
  }

  getAccessToken(userName, sid, secret, roomName) {
    const { welcomeScreen } = this.state;

    _getStorageValue(USER_NAME).then((userName) => {
      _getStorageValue(USER_ID).then((userId) => {
        _getStorageValue(ACCESS_TOKEN).then((token) => {
          var urls = genrateTokenUrl(
            userId,
            encodeURIComponent(userName),
            roomName,
            secret,
            sid,
          );
          apiVideoCall(GET, urls, "", onSuccess, onFailure, "", token);
        });
      });
    });

    const onSuccess = (response) => {
      this.setState({
        welcomeScreen: !welcomeScreen,
        smsScreen: true,
        joinCallLoader: false,
      });
      var roomObj = {
        name: roomName,
        access: response.data[0].accessToken,
      };
      setVideo(roomObj);
      toast.success("Join the Video Call", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    const onFailure = (response) => {
      console.log(response);
    };
  }

  joinCallVideo() {
    var tokens = getVideo();
    this.setState({
      roomName: tokens.name,
      token: tokens.access,
      reJoinScreen: false,
      videoStatus: true,
    });
  }

  endCallVideo() {
    const { welcomeScreen } = this.state;

    var tokens = getVideo();
    var roomNameValue = tokens.name;
    _getStorageValue(USER_ID).then((userId) => {
      _getStorageValue(ACCESS_TOKEN).then((token) => {
        var urls = endRoomCallUrl(
          userId,
          encodeURIComponent(encryptStatic(roomNameValue, this.state.aesKey)),
        );
        apiVideoCall(GET, urls, "", onSuccess, onFailure, "", token);
      });
    });

    const onSuccess = (response) => {
      this.setState({
        welcomeScreen: !welcomeScreen,
        reJoinScreen: false,
        joinCallDisable: true,
        joinCallLoaderRoom: false,
      });
      setVideo(null);
      window.location.reload();
    };

    const onFailure = (response) => {
      this.setState({
        welcomeScreen: !welcomeScreen,
        reJoinScreen: false,
        joinCallDisable: true,
        joinCallLoaderRoom: false,
      });
      setVideo(null);
      window.location.reload();
    };
  }

  addImageToReport(id) {
    let { reportImageData, imageDetailsArr } = this.state;
    var index1 = imageDetailsArr.findIndex((obj) => obj.id === id);
    imageDetailsArr[index1].selected = !imageDetailsArr[index1].selected;
    this.setState({ imageDetailsArr });

    this.setState({
      reportImageData: [...reportImageData, imageDetailsArr[index1].img_url],
    });

    setTimeout(() => {
      this.postReportImageData();
    }, 200);
  }

  removeImageToReport(id) {
    let { imageDetailsArr } = this.state;
    let { imageUrlData, bankDataValue } = this.props;
    var mobileNo = bankDataValue[0].id;
    var reqId = bankDataValue[0].userName;
    var index1 = imageDetailsArr.findIndex((obj) => obj.id === id);
    var removeIndex = imageUrlData.findIndex((obj) => obj.id === id);

    if (imageUrlData[removeIndex].selected === true) {
      var imageUrl = [imageUrlData[removeIndex].img_url];

      var stringUrl = JSON.stringify(imageUrl).replace(/"/g, "'");

      _getStorageValue(USER_ID).then((userId) => {
        this.props.removeImageUserAction(
          userId,
          stringUrl,
          reqId,
          // encodeURIComponent(mobileNo),
          // encryptStatic(reqId, this.state.aesKey)
        );
      });
    }

    imageDetailsArr[index1].selected = !imageDetailsArr[index1].selected;
    this.setState({ imageDetailsArr });
  }

  postReportImageData() {
    const { bankDataValue } = this.props;
    var mobileNo = bankDataValue[0].id;
    var reqId = bankDataValue[0].userName;
    const { reportImageData, lat, long } = this.state;
    var reportString = JSON.stringify(reportImageData);

    var postRepostObj2 = {
      mobile_number: mobileNo,
      image_urls: `${reportString.replace(/"/g, "'")}`,
    };

    _getStorageValue(USER_ID).then((userId) => {
      this.props.reportImageUser(
        userId,
        // mobileNo,
        // encryptStatic(reqId, this.state.aesKey),
        reqId,
        "",
        postRepostObj2,
        succesReport,
        failureReport,
      );
    });

    const succesReport = () => {
      toast.success("Image Added Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.getImageData();
    };
    const failureReport = () => {
      console.log("fail");
    };
    setTimeout(() => {
      this.resetImage();
    }, 100);
  }

  resetImage() {
    this.setState({
      reportImageData: [],
    });
  }
  async downloadAllImages(images) {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let urls = images.map((data) => data.download_url).filter((fd) => !!fd);
    for (const url of urls) {
      const a = document.createElement("a");
      a.download = "";
      a.href = url;
      a.click();
      await delay(200);
    }
  }

  openPdfTab() {
    const { showReportData } = this.state;
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];
    if (reqId !== undefined) {
      this.setState({
        showReportData: !showReportData,
      });
      // var user_Name = bankDataValue[0].name;
      // window.open(`/pdf/${user_Name}`);
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  openVoiceTab() {
    const { showRecordedVoice } = this.state;
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];

    if (reqId !== undefined) {
      this.setState({
        showRecordedVoice: !showRecordedVoice,
      });
      // var user_Name = bankDataValue[0].name;
      // window.open(`/pdf/${user_Name}`);
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
  openVideoTab() {
    const { showRecordedVideo } = this.state;
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];

    if (reqId !== undefined) {
      this.setState({
        showRecordedVideo: !showRecordedVideo,
      });
      // var user_Name = bankDataValue[0].name;
      // window.open(`/pdf/${user_Name}`);
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
  disabledUserId() {
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0].userName;
    var name = bankDataValue[0].name;
    var mobileNo = bankDataValue[0].id;

    _getStorageValue(USER_ID).then((userId) => {
      this.props.disableReqIdUser(
        userId,
        name,
        // encryptStatic(name, this.state.aesKey),
        encodeURIComponent(mobileNo),
      );
    });

    this.setState({
      showDisableUser: false,
    });
  }

  disableCallBackUser() {
    const { bankDataValue } = this.props;
    var reqId = bankDataValue[0];

    if (reqId !== undefined) {
      this.setState({
        showDisableUser: true,
      });
    } else {
      toast.warning("Please Enter the REQ-ID", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  startTimer(reqIdCheck) {
    if (reqIdCheck) {
      this.setState({
        smsStatus: false,
      });
    } else {
      var countDownDate = new Date();
      countDownDate.setMinutes(countDownDate.getMinutes() + 2);

      var x = setInterval(() => {
        var display = document.querySelector("#time");

        var now = new Date().getTime();

        var distance = countDownDate - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (display !== null) {
          display.textContent = minutes + ":" + seconds;
        } else {
          clearInterval(x);
        }
        if (distance < 0) {
          clearInterval(x);
          this.setState({
            smsStatus: false,
          });
        }
      }, 1000);
    }
  }

  historyReqIdCheck(reqIdCheck) {
    this.setState({
      reqIdCheckValue: reqIdCheck,
    });
  }

  setToggle = () => {
    if (this.state.isVideoCallToggle) {
      setTimeout(() => {
        this.getImageData();
      }, 3000);
    }
    this.setState({
      isVideoCallToggle: !this.state.isVideoCallToggle,
    });
  };

  buttonStatus = (data) => {
    this.setState({ isDisabled: data });
  };

  render() {
    const {
      sideBarShow,
      roomName,
      token,
      reqreCallReport,
      welcomeScreen,
      smsScreen,
      smsCredential,
      joinCallDisable,
      reJoinScreen,
      bankValueState,
      imageDetailsArr,
      smsStatus,
      joinCallLoader,
      showDisableUser,
      showReportData,
      aesKey,
      videoStatus,
      joinCallLoaderRoom,
      showRecordedVoice,
      showRecordedVideo,
      isVideoCallToggle,
      isDisabled,
    } = this.state;
    let { reportImageData } = this.state;
    const settings = {
      dots: false,
      infinite: false,
      speed: 1000,
      slidesToShow: 7,
      slidesToScroll: 5,
      arrows: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,

      responsive: [
        {
          breakpoint: 1024,
          settings: { slidesToShow: 4, slidesToScroll: 3, infinite: false },
        },
      ],
    };
    const {
      imageUrlData,
      measurmentData,
      // historyData,
      bankDataValue,
      isFetchingAddImage,
      isFetchingDisable,
      isFetchingImageUrl,
      isFetchingSearchReq,
    } = this.props;

    var user_Name = "";
    var mobile_numbers = "";
    var req_Status = "";
    if (bankDataValue.length !== 0) {
      var user_Name = bankDataValue[0].name;
      var mobile_numbers = bankDataValue[0].id;
      var req_Status = bankDataValue[0].status;
    }

    var reportCallDisable = reportImageData.length !== 0;

    // var connectPageLoader =
    //   smsStatus || isFetchingSearchReq || isFetchingDisable || joinCallLoader;
    if (this.state.layoutLoader) {
      return (
        <div className="vido-containe-customer">
          <Header
            sideBarCallBack={() => {
              this.setState({
                sideBarShow: !sideBarShow,
              });
            }}
            link="/landingPage"
          />
          {isVideoCallToggle ? (
            <DeskTopCall
              setToggle={this.setToggle}
              location={this.props.location}
              reqID={encodeURIComponent(this.props?.bankDataValue[0]?.name)}
            />
          ) : (
            <>
              {(() => {
                if (smsScreen) {
                  return (
                    <Room
                      videoStatus={videoStatus}
                      welcomeScreen={welcomeScreen}
                      roomName={roomName}
                      token={token}
                      reJoinScreen={reJoinScreen}
                      joinCallLoaderRoom={joinCallLoaderRoom}
                      joinCall={() => {
                        this.joinCallVideo();
                      }}
                      endCall={() => {
                        this.endCallVideo();
                        this.setState({ joinCallLoaderRoom: true });
                      }}
                    />
                  );
                } else {
                  return (
                    <div className=" customer-back-sec ">
                      <div className="customer-back-details">
                        <div className="customer-back-filter">
                          <div className="customer-back-search">
                            <VideoCallFilter
                              historyReqIdCheck={(reqIdCheck) =>
                                this.historyReqIdCheck(reqIdCheck)
                              }
                              reqID={
                                !!user_Name
                                  ? decryptStatic(user_Name, this.state.aesKey)
                                  : ""
                              }
                              dataValueEnc={(encReq) => {
                                this.setState({ encReqId: encReq });
                              }}
                              aesKey={aesKey}
                              setButtonStatus={this.buttonStatus}
                              successBankCall={(response) => {
                                var dataId =
                                  response.data.customer_details[0]
                                    .customer_name;
                                setTimeout(() => {
                                  this.getImageData();
                                }, 300);
                                var userCheckHis = getTime();
                                if (userCheckHis !== dataId) {
                                  setTime(dataId);
                                  this.startTimer(true);
                                }
                              }}
                              failureBankCall={(response) => {
                                _getStorageValue(ACCESS_TOKEN).then((token) => {
                                  var json = {
                                    reqid: this.state.reqIdCheckValue,
                                    encreqid: this.state.encReqId,
                                  };
                                  logErrors(
                                    this.state.reqIdCheckValue,
                                    response,
                                    token,
                                    JSON.stringify(json),
                                  );
                                });
                                this.props.resetreportImageUser();
                                this.props.resetbankDataUser();
                                this.setState({
                                  joinCallDisable: false,
                                  imageDetailsArr: [],
                                  lat: 0,
                                  long: 0,
                                });
                                toast.error(response.message, {
                                  position: toast.POSITION.BOTTOM_CENTER,
                                });
                                this.startTimer(true);
                              }}
                            />
                          </div>
                        </div>
                        <div className="customer-back-call">
                          <div className="customer-sep">
                            <div className="customer-back-video-call">
                              <div className="customer-label-video">
                                <div className="side-by-side">
                                  <div className="customer-label-video-1">
                                    <label>Req Id</label>
                                    <label className="colon">:</label>
                                    <span>
                                      {decryptStatic(
                                        user_Name,
                                        this.state.aesKey,
                                      )}
                                    </span>
                                  </div>
                                  <div className="customer-label-video-1">
                                    <label>Mobile No </label>
                                    <label className="colon">:</label>
                                    <span>
                                      {decryptStatic(
                                        mobile_numbers,
                                        this.state.aesKey,
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="customer-label-video-1">
                                  <label>Status</label>
                                  <label className="colon">:</label>
                                  <span> {req_Status} </span>
                                </div>
                              </div>
                              <div className="filter-Button sms-btn ">
                                <button
                                  onClick={() => {
                                    this.checkStatus();
                                  }}
                                  className="report"
                                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                                  disabled={isDisabled}
                                >
                                  {this.state.isLoading && (
                                    <div className="loader"></div>
                                  )}
                                  Check Connectivity
                                </button>
                                {
                                  <>
                                    <button
                                      onClick={() => {
                                        this.sendSms();
                                      }}
                                      style={{ opacity: isDisabled ? 0.5 : 1 }}
                                      disabled={isDisabled}
                                    >
                                      {smsStatus && user_Name !== "" ? (
                                        <div className="loader"></div>
                                      ) : null}

                                      {smsStatus && user_Name !== "" ? (
                                        <span id="time">02:00</span>
                                      ) : (
                                        <p> Send SMS</p>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => {
                                        // this.openPdfTab();
                                        this.setState({
                                          isVideoCallToggle: true,
                                          smsStatus: false,
                                        });
                                        this.props.history.push(
                                          "/customer-connect?call=true",
                                        );
                                      }}
                                      className="report"
                                      style={{ opacity: isDisabled ? 0.5 : 1 }}
                                      disabled={isDisabled}
                                    >
                                      Video call
                                    </button>
                                  </>
                                }
                                {/* <button
                              onClick={() => {
                                this.joinVideoCall();
                              }}
                              className="room-btn-disable create-room-btn"
                              // disabled={joinCallLoader}
                              disabled={true}
                            >
                              {joinCallLoader ? (
                                <div className="loader"></div>
                              ) : null}
                              Create Video Room
                            </button> */}
                                {/* <button
                              onClick={() => {
                                this.disableCallBackUser();
                              }}
                              className="create-room-btn"
                            >
                              Disable Req Id
                            </button> */}
                                <button
                                  onClick={() => {
                                    this.openVoiceTab();
                                  }}
                                  className="report"
                                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                                  disabled={isDisabled}
                                >
                                  Voice Memos
                                </button>
                                <button
                                  onClick={() => {
                                    this.openVideoTab();
                                  }}
                                  className="report"
                                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                                  disabled={isDisabled}
                                >
                                  Video Memos
                                </button>
                                <button
                                  onClick={() => {
                                    this.openPdfTab();
                                  }}
                                  className="report"
                                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                                  disabled={isDisabled}
                                >
                                  Open Report
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ position: "relative" }}
                        className="customer-back-image bottom-spance-40"
                      >
                        <h6> User Uploaded Images </h6>
                        {imageDetailsArr.length != 0 && (
                          <div
                            onClick={() => {
                              this.downloadAllImages(imageDetailsArr);
                            }}
                            style={{
                              width: 30,
                              height: 30,
                              background: "#97291e",
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              position: "absolute",
                              top: 10,
                              zIndex: 11,
                              cursor: "pointer",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFileDownload}
                              rotate={45}
                              color="#fff"
                              size="md"
                            />
                          </div>
                        )}

                        {(() => {
                          if (!isFetchingImageUrl) {
                            if (imageDetailsArr.length != 0) {
                              return (
                                <Slider {...settings} className="download-lick">
                                  {imageDetailsArr.map((data) => {
                                    return (
                                      <div>
                                        {(() => {
                                          if (data.selected === undefined) {
                                            return (
                                              <div
                                                className={`down-load-img image-layout`}
                                              >
                                                <p>Image</p>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div
                                                className={`down-load-img ${
                                                  data.selected
                                                    ? "active-state"
                                                    : null
                                                }`}
                                              >
                                                <div className="overlay"></div>
                                                <a
                                                  className="download-img"
                                                  download="image.png"
                                                  href={data.download_url}
                                                >
                                                  <img
                                                    className="download-img-sec"
                                                    src={require("../../assets/images/cloud-computing.png")}
                                                    alt="dd"
                                                  />
                                                </a>
                                                {(() => {
                                                  if (data.selected) {
                                                    return (
                                                      <a
                                                        className="report-img"
                                                        onClick={() => {
                                                          this.removeImageToReport(
                                                            data.id,
                                                          );
                                                        }}
                                                      >
                                                        <img
                                                          className="download-img-sec"
                                                          src={require("../../assets/images/trash.png")}
                                                          alt="ds"
                                                        />
                                                      </a>
                                                    );
                                                  } else {
                                                    return <></>;
                                                  }
                                                })()}
                                                <img
                                                  className="customer-downlod-image"
                                                  src={data.download_url}
                                                />
                                              </div>
                                            );
                                          }
                                        })()}
                                      </div>
                                    );
                                  })}
                                </Slider>
                              );
                            } else {
                              return (
                                <Slider {...settings} className="download-lick">
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className={`down-load-img image-layout`}
                                    >
                                      <p>Image</p>
                                    </div>
                                  </div>
                                </Slider>
                              );
                            }
                          } else {
                            return (
                              <Slider {...settings} className="download-lick">
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                                <div className={`down-load-img image-layout`}>
                                  <p>Image</p>
                                </div>
                              </Slider>
                            );
                          }
                        })()}
                      </div>
                      {/* <div className="customer-back-details">
                    <div className="customer-back-filter back-filter-width">
                      <MUIDataTable
                        title={"History"}
                        data={historyData}
                        columns={columns}
                        options={options}
                      />
                    </div>
                    <div className="customer-back-call back-call-width">
                      <MUIDataTable
                        title={"Measurment"}
                        data={measurmentData}
                        columns={columnsMeasure}
                        options={options}
                      />
                    </div>
                  </div> */}
                    </div>
                  );
                }
              })()}
              {!showReportData ? (
                <div
                  className="popup-report"
                  onClick={() => {
                    this.openPdfTab();
                  }}
                >
                  <img src={require("../../assets/images/report-icon.png")} />
                </div>
              ) : null}

              <div>
                <Modal
                  size="sm"
                  show={showDisableUser}
                  onHide={() =>
                    this.setState({
                      showDisableUser: false,
                    })
                  }
                  aria-labelledby="example-modal-sizes-title-sm"
                >
                  <Modal.Header closeButton>
                    Disable User Id & Password
                  </Modal.Header>
                  <Modal.Body>
                    <div className="disable-req">
                      <ul className="disable-list">
                        <li>
                          <label> User Id : </label>
                          <span>
                            {decryptStatic(user_Name, this.state.aesKey)}
                          </span>
                        </li>
                        <li>
                          <label> Mobile No : </label>
                          <span>
                            {decryptStatic(mobile_numbers, this.state.aesKey)}
                          </span>
                        </li>
                      </ul>

                      <div className="filter-Button add-btn ">
                        <button
                          onClick={() => {
                            this.disabledUserId();
                          }}
                          disabled={isFetchingDisable}
                        >
                          {isFetchingDisable ? (
                            <div className="loader"></div>
                          ) : null}
                          Disable
                        </button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
              <div>
                <Modal
                  show={showReportData}
                  onHide={() =>
                    this.setState({
                      showReportData: !showReportData,
                    })
                  }
                  size="lg"
                  className="report-modal"
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header>
                    <p>Report Details</p>
                    <img
                      className="cursor-close"
                      src={require("../../assets/images/minus.png")}
                      onClick={() => {
                        this.setState({
                          showReportData: !showReportData,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <Pdf
                        reqId={user_Name}
                        reqreCallReport={reqreCallReport}
                      />
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
              <div>
                <Modal
                  show={showRecordedVoice}
                  onHide={() =>
                    this.setState({
                      showRecordedVoice: !showRecordedVoice,
                    })
                  }
                  size="lg"
                  className="report-modal"
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header>
                    <p>Report Details</p>
                    <img
                      className="cursor-close"
                      src={require("../../assets/images/minus.png")}
                      onClick={() => {
                        this.setState({
                          showRecordedVoice: !showRecordedVoice,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <VoiceMemo reqId={user_Name} aesKey={aesKey} />
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
              {/* showRecordedVideo */}
              <div>
                <Modal
                  show={showRecordedVideo}
                  onHide={() =>
                    this.setState({
                      showRecordedVideo: !showRecordedVideo,
                    })
                  }
                  size="lg"
                  className="report-modal"
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header>
                    <p>Report Details</p>
                    <img
                      className="cursor-close"
                      src={require("../../assets/images/minus.png")}
                      onClick={() => {
                        this.setState({
                          showRecordedVideo: !showRecordedVideo,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <VideoMemo reqId={user_Name} aesKey={aesKey} />
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </>
          )}
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

const mapStateToProps = (state) => ({
  isFetchingImageUrl: state.getImageUrl.isFetchingImageUrl,
  imageUrlData: state.getImageUrl.imageUrlData,
  // historyData: state.getHistory.historyData,
  bankDataValue: state.bankData.bankDataValue,
  measurmentData: state.getImageUrl.measurmentData,
  isFetchingAddImage: state.reportImageData.isFetchingAddImage,
  isFetchingDisable: state.disableReqIdData.isFetchingDisable,
  // isFetchingImageUrl: state.getImageUrl.isFetchingImageUrl,
  isFetchingSearchReq: state.bankData.isFetchingSearchReq,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getImageUrlUser: getImageUrlUser,
      reportImageUser: reportImageUser,
      // historyUser: historyUser,
      bankDataUser: bankDataUser,
      removeImageUserAction: removeImageUserAction,
      reportUser: reportUser,
      disableReqIdUser: disableReqIdUser,
      resetreportImageUser: resetreportImageUser,
      resetbankDataUser: resetbankDataUser,
      createCall: createCall,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCallScreen);
