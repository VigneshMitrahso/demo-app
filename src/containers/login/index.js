import React, { Component, useEffect, useCallback, useState } from "react";

// plugin
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form } from "react-bootstrap";
import createHistory from "history/createBrowserHistory";
import { toast } from "react-toastify";
// component
import Header from "../../components/header";
import Loader from "../../components/loader";

// function
import { loginUser } from "../../action/login";
import { sessonLoginUser } from "../../action/sessonLogin";
import { loginEncUser } from "../../action/loginEnc";
import { _getStorageValue } from "../../comman/localStorage";
import { rsaEnc } from "../../comman/decodeEncodeData";
import {
  useGoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import eyeclose from "../../assets/images/eye-close.svg";
import eyeopen from "../../assets/images/eye.svg";

// css
import "./logIn.css";

import { USER_ID } from "../../comman/constants";

var history = createHistory();
const crypto = require("crypto");

const Captcha = (props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    const token = await executeRecaptcha("yourAction");
    // Do whatever you want with the token
    // props.settoken(token)
    props.updateRecapcha(token);
  }, [executeRecaptcha]);

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    if (props.isTrigger !== "") {
      handleReCaptchaVerify();
    }
  }, [props.isTrigger]);
  return <>Submit</>;
};

const LoginWithCaptcha = (props) => {
  const [token, settoken] = useState("");
  return (
    <>
      <GoogleReCaptchaProvider
        reCaptchaKey={"6Ld-chgpAAAAAMj-9de6awHHc7m4FxxoKmGt02qu"}
      >
        <LogIns token={token} {...props} />
      </GoogleReCaptchaProvider>
    </>
  );
};

class LogIns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loaderStatus: false,
      showErrorMsg: false,
      hideShow: true,
      isFetchingLogin: false,
      rsaLoader: true,
      rsaKey: "",
      recapchaToken: "",
      isTrigger: "",
    };
    this.triggerLogin = this.triggerLogin.bind(this);
  }
  componentDidMount() {
    _getStorageValue(USER_ID).then((userId) => {
      this.props.loginEncUser(successCallBackLoginEnc);
    });

    const successCallBackLoginEnc = (response) => {
      this.setState({
        rsaLoader: false,
        rsaKey: response.data.rsa,
      });
      this.loginCallRsa(response.data.rsa);
    };
  }

  componentDidUpdate(prp, preState) {
    if (preState.recapchaToken !== this.state.recapchaToken) {
      this.triggerLogin();
    }
  }

  loginCallRsa(key) {
    // https://rapid.satsure.co/?user-id=215736&session-id=12312231231214123123
    var userId = new URLSearchParams(this.props.location.search).get("user-id");
    var uId = parseInt(userId);
    var sessonId = new URLSearchParams(this.props.location.search).get(
      "session-id",
    );
    var sId = parseInt(sessonId);
    var appRef = new URLSearchParams(this.props.location.search).get(
      "app-reference",
    );
    var url = window.location.href;
    var data = url.replace(/=/g, " =");
    var datatype = data.replace(/&/g, " =");
    var fields = datatype.split("=");

    if (fields[1] !== undefined) {
      if (appRef !== null || appRef !== undefined) {
        _getStorageValue(USER_ID).then((id) => {
          this.props.sessonLoginUser(
            rsaEnc(userId, key),
            rsaEnc(sessonId, key),
            appRef,
            successCallBack,
            failureCallBack,
          );
        });
      } else {
        _getStorageValue(USER_ID).then((id) => {
          this.props.sessonLoginUser(
            rsaEnc(JSON.stringify(uId), key),
            rsaEnc(JSON.stringify(sId), key),
            appRef,
            successCallBack,
            failureCallBack,
          );
        });
      }

      const successCallBack = (response) => {
        this.setState({
          loaderStatus: false,
        });
        // if (response.data.admin === true) {
        //   console.log("admin-succes");
        // } else {
        history.push("/landingPage");
        window.location.reload();
        // }
      };

      const failureCallBack = (response) => {
        this.setState({
          loaderStatus: false,
        });
      };
    }
  }

  // successCallBack(response) {
  // history.push("/landingPage");
  // setTimeout(() => {
  //   window.location.reload();
  // }, 100);
  // }

  triggerLogin() {
    this.setState({
      showErrorMsg: false,
      isFetchingLogin: true,
    });

    var emailID = this.state.email;
    var passWord = this.state.password;

    var validEmail = emailID !== "" && passWord !== "";

    if (validEmail) {
      _getStorageValue(USER_ID).then((id) => {
        this.props.loginUser(
          rsaEnc(emailID, this.state.rsaKey),
          rsaEnc(passWord, this.state.rsaKey),
          this.state.recapchaToken,
          successCallBack,
          failureCallBack,
        );
      });

      const successCallBack = (response) => {
        this.setState({
          loaderStatus: false,
        });
        // console.log("admin-1", response.data.admin);
        // if (response.data.admin === true) {
        //   console.log("admin-succes");
        // } else {
        history.push("/landingPage");
        window.location.reload();
        // }
      };

      const failureCallBack = (response) => {
        this.setState({
          loaderStatus: false,
        });
      };
    } else {
      toast.error("Enter User Name & Password", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.setState({
        showErrorMsg: true,
        loaderStatus: false,
      });
    }
  }

  updateRecapcha = (data) => {
    this.setState({ recapchaToken: data });
  };

  render() {
    const { loaderStatus, showErrorMsg, hideShow, isFetchingLogin, rsaLoader } =
      this.state;

    const { isFetchingSesson } = this.props;

    if (rsaLoader) {
      return <Loader />;
    } else {
      return (
        <div>
          {(() => {
            if (isFetchingSesson) {
              return <Loader />;
            }
          })()}

          <div className="login-loader-sec">
            <Header login={true} pdfPageHeader={true} />
            <div className="login-sec">
              <div className="rapid-sec">
                <h6>RAPID</h6>
                <p> Realtime Appraisal of Property In Digital Mode </p>
              </div>
              <div className="log-in-sec">
                <div className="log-in-form-sec">
                  <div className="form-input-sec">
                    <label>
                      User Name
                      <span>*</span>
                    </label>
                    <Form.Control
                      placeholder="12345"
                      onChange={(e) =>
                        this.setState({
                          email: e.target.value,
                          loaderStatus: false,
                        })
                      }
                      autocomplete="off"
                    />
                    {showErrorMsg ? (
                      <div>
                        <label className="error-msg">
                          Please Enter valid User Name
                        </label>
                      </div>
                    ) : null}
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
                            password: e.target.value,
                            loaderStatus: false,
                          })
                        }
                        autocomplete="off"
                        // style={"-webkit-text-security: circle;"}
                      />
                      {showErrorMsg ? (
                        <div>
                          <label className="error-msg">
                            Please Enter valid Password
                          </label>
                        </div>
                      ) : null}
                      {hideShow ? (
                        <img
                          onClick={() => {
                            this.setState({
                              hideShow: !hideShow,
                            });
                          }}
                          src={eyeclose}
                          alt="sd"
                        />
                      ) : (
                        <img
                          onClick={() => {
                            this.setState({
                              hideShow: !hideShow,
                            });
                          }}
                          src={eyeopen}
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
                          isTrigger: Date.now(),
                        });
                        // this.triggerLogin();
                      }}
                      disabled={loaderStatus}
                    >
                      {loaderStatus ? <div className="loader"></div> : null}
                      <Captcha
                        isTrigger={this.state.isTrigger}
                        updateRecapcha={this.updateRecapcha}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="powered-by">
                <p> Powered By</p>
                <img
                  src={require("../../assets/images/satsure-new-logo.png")}
                  alt="Satsure Logo"
                />
              </div>
            </div>
            {/* {(() => {
              if (isFetchingLogin) {
                return (
                  <div className="login-loader" >
                    <Loader />
                  </div>
                );
              }
            })()} */}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  isFetchingSesson: state.sessonLogin.isFetchingSesson,
  status: state.login.status,
  message: state.login.message,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginUser: loginUser,
      sessonLoginUser: sessonLoginUser,
      loginEncUser: loginEncUser,
    },
    dispatch,
  );
}
export { LogIns };

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithCaptcha);
