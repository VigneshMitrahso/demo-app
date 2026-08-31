import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";
import { Link, useLocation } from "react-router-dom";
import { rsaEnc } from "../../comman/decodeEncodeData";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginUser, loginRapidUser } from "../../action/login";
import { sessonLoginUser } from "../../action/sessonLogin";
import { loginEncUser } from "../../action/loginEnc";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import { updateLocation } from "../../action/updateLocation";
import { Modal, Button } from "react-bootstrap";

import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions,
} from "mic-check";
import { getCallDetails, getCustomerAddress } from "../../action/azureCalling";
import {
  _getStorageValue,
  getUserId,
  _getStorageValueRapid,
} from "../../comman/localStorage";
import { ModalFooter } from "react-bootstrap";
import { JoiningScreen } from "../../components/azure-video/components/screens/JoiningScreen";
import { useMeetingAppContext } from "../../components/azure-video/MeetingAppContextDef";
import { Constants, useMediaDevice, useMeeting } from "@videosdk.live/react-sdk";
import useMediaStream from "../../components/azure-video/hooks/useMediaStream";
import useIsMobile from "../../components/azure-video/hooks/useIsMobile";

async function testDownloadSpeed(fileUrl, fileSizeInBytes) {
  const startTime = new Date().getTime();
  try {

    const response = await fetch(fileUrl, { cache: "no-cache" });
    await response.blob(); // wait for full download
    const endTime = new Date().getTime();

    const durationInSeconds = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeInBytes * 8;
    const speedMbps = (bitsLoaded / durationInSeconds / 1024 / 1024).toFixed(2);

    console.log(`Download Speed: ${speedMbps} Mbps`);
    return speedMbps;
  } catch (err) {
    console.error("Download failed:", err);
    return null;
  }
}

// Example usage:
const testFileUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"; // ~1MB
const testFileSize = 1048576; // 1MB in bytes

const RapidWeb = (props) => {
  const history = useHistory();
  const search = useLocation().search;
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rsaLoader, setRsaLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginSuccessState, setLoginSuccessState] = useState(false);
  const [isMediaPermissionDenied, setIsMediaPermissionDenied] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [azure, setAzure] = useState(false);
  const [show, setShow] = useState(false);
  const [isSafari, setSafari] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [permissions, setPermissions] = useState([{ label: "Signal Strength", permission: "" }, { label: "Camera", permission: "" }, { label: "Location", permission: "" }, { label: "Mic", permission: "" }, { label: "Speaker", permission: "" }]);
  const [isBrowser, setIsBrowser] = useState(false);
  const [timer, setTimer] = useState(20);
  const [isSpeakerModalOpen, setSpeakerModal] = useState(false);
  const [address, setAddress] = useState("");
  const [geoPosition, setGeoPosition] = useState("");

  let isAudioUnlocked = false;

const unlockAudio = () => {
  if (isAudioUnlocked) return;

  const audio = document.getElementById("myAudio");
  audio.play()
    .then(() => {
      isAudioUnlocked = true;
      audio.pause(); // Pause immediately if you don't want it to actually play
      audio.currentTime = 0;
    })
    .catch((e) => {
      console.log("Safari autoplay unlock failed", e);
    });
};

useEffect(() => {
  document.body.addEventListener('click', unlockAudio, { once: true });
  return () => {
    document.body.removeEventListener('click', unlockAudio);
  }
},[])

  const successCallBackLoginEnc = (response) => {
    setRsaLoader(false);
    loginCallRsa(response.data.rsa);
    if (response.data.rsa) {
      triggerLogin(response.data.rsa);
    }
  };

  const loginCallRsa = (key) => {
    let url = window.location.href;

    let data = url.replace(/=/g, " =");
    let datatype = data.replace(/&/g, " =");
    let fields = datatype.split("=");
  };
  const triggerLogin = (rsaKey) => {
    if (username === "") {
      setLoginSuccessState(false);
    } else if (password === "") {
      setLoginSuccessState(false);
    } else {
      props.loginRapidUser(
        rsaEnc(username, rsaKey),
        rsaEnc(password, rsaKey),
        successLogin,
        failedLogin,
      );
    }
  };

  const successLogin = (response) => {
    setLoginSuccessState(true);
    setLoading(false);
  };
  const failedLogin = () => {
    setLoading(false);
  };


  const enableContinueButton = useMemo(() => {
    return permissions.every((permission) => permission.permission === true);
  }, [permissions]);

  const enableDisableButton = useMemo(() => {
    return permissions.some((permission) => permission.permission === false);
  }, [permissions]);


  useEffect(() => {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        setSafari(false);
      } else {
        setSafari(true);
      }
    }
    const isAzure = new URLSearchParams(search).get("azureVideoCall");
    if (!!isAzure && !!props?.callDataValue?.[0]?.call_status) {
      window.location.reload();
    } else if (!!isAzure) {
      setAzure(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setUserName(new URLSearchParams(search).get("username"));
    setPassword(new URLSearchParams(search).get("password"));
    if (username !== "" && password !== "") {
      props.loginEncUser(successCallBackLoginEnc);
    }
  }, [username]);

  useEffect(() => {
    if (isLocationDenied || isMediaPermissionDenied) {
      setShow(true);
    }
  }, [isLocationDenied, isMediaPermissionDenied]);

  const onSuccessCallback = (data) => {
    setTimeout(() => {
      if (data.data[0].call_status == "Call has not been created") {
        toast.error("Call has not been created", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoading(false);
      }
    });
  };

  const onFailureCallback = () => {
    toast.error("Token is expired please try again", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };


  const onSuccessCallbackCustomerAddress = (data) => {
    if (!!data.data) {
      setAddress(data.data);
    }
  }

  const onFailureCallbackCustomerAddress = (data) => {
    // if (data.data[0].status == "success") { 
    // }
    console.log("data", data);
    toast.error("Failed to receive geo location...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  const updateLocation=(position)=>{
         if (position.coords) {
            setIsMediaPermissionDenied(false);
            setIsLocationDenied(false);
            _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
              let userID = uId;
              props.getCustomerAddress(
                userID,
                position.coords.latitude,
                position.coords.longitude,
                onSuccessCallbackCustomerAddress,
                onFailureCallbackCustomerAddress,
              );
            });

            _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
              let userID = uId;
              _getStorageValueRapid("USER_NAME").then((user) => {
                props.getCallDetails(
                  userID,
                  user,
                  onSuccessCallback,
                  onFailureCallback,
                );
              });
            });
          } else {
            setIsLocationDenied(true);
          }
  }


  const errorCallBack=()=>{
          setIsLocationDenied(true);
          setLoading(false);
          setPermissions((previousState) => {
            let updatePermissions = previousState.map((data) => {
              if (data.label === "Location") {
                return { ...data, permission: false }
              } else {
                return data;
              }
            });
            return updatePermissions; 
          })
          checkMicPermission();
  }

  

  const getCustomerLocation = (call, location="") => {
    if (call == "handleRoom") {
      navigator.geolocation.getCurrentPosition(
        function () {
          setTimeout(()=>{
             navigator.geolocation.getCurrentPosition((position)=>{
              console.log("checking the lat and long issue",position.coords.latitude,position.coords.longitude);
              setGeoPosition({latitude:position.coords.latitude,longitude:position.coords.longitude});
              getCustomerLocation("updateUserLocation", position);
              updateLocation(position);
             },()=>{  
                errorCallBack();
             }, { 
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            })
          },10000);
        },
        function (error) {
          errorCallBack();
        },
        { enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0}
      )
    } else if (call == "updateUserLocation") {
      const successCallbck = () => {
        setPermissions((previousState) => {
          let updatePermissions = previousState.map((data) => {
            if (data.label === "Location") {
              return { ...data, permission: true }
            } else {
              return data;
            }
          });
          return updatePermissions;
        })
        checkMicPermission();
      };
      
        console.log("geoPosition",geoPosition)
      
          _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
            let userID = uId;
            _getStorageValueRapid("USER_NAME").then((user) => {
              props.updateLocation(
                userID,
                user,
                  location?.coords?.latitude,
                location?.coords?.longitude,
                successCallbck,
                () => {
                  errorCallBack();
                },
              );
            });
          });

    }
  };



  const checkinternet = async () => {
    if (isConnected) {
      console.log("Connected to the video call");
      setLoading(true);
      let test = await testDownloadSpeed(testFileUrl, testFileSize);
      console.log("test", test);
      if (test > 0.5) {
        let updatePermissions = permissions.map((data) => {
          if (data.label === "Signal Strength") {
            return { ...data, permission: true }
          } else {
            return data;
          }
        });
        console.log("updatePermissions", updatePermissions);
        setPermissions(updatePermissions)
      }
      else {
        let updatePermissions = permissions.map((data) => {
          if (data.label === "Signal Strength") {
            return { ...data, permission: false }
          } else {
            return data;
          }
        });
        setPermissions(updatePermissions)
      }
      setTimeout(() => {
        checkCameraPermission();
      }, 1000);
    }
  }

  const checkCameraPermission = async () => {
    const localVideo = document.getElementById('localVideo');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        localVideo.srcObject = stream;
        localVideo.muted = true;
        localVideo.play();
        setPermissions((previousState) => {
          let updatePermissions = previousState.map((data) => {
            if (data.label === "Camera") {
              return { ...data, permission: true }
            } else {
              return data;
            }
          });
          return updatePermissions;
        });
        // stream.getTracks().forEach(track => track.stop());
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);

        setPermissions((previousState) => {
          let updatePermissions = previousState.map((data) => {
            if (data.label === "Camera") {
              return { ...data, permission: false }
            } else {
              return data;
            }
          });
          return updatePermissions;
        });

      });
    setTimeout(() => {
      getCustomerLocation("handleRoom")
    }, 1000);
  }

  const checkSpeakerPermission = () => {
    setSpeakerModal(true);
    const audio = document.getElementById("myAudio");
    audio.loop = true;
    audio.play();
  }

  const checkMicPermission = async () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((micStream) => {
        setPermissions((previousState) => {
          
          let updatePermissions = previousState.map((data) => {
            if (data.label === "Mic") {
              return { ...data, permission: true }
            } else {
              return data;
            }
          });
          return updatePermissions;
        })
        micStream.getTracks().forEach(track => track.stop());
        checkSpeakerPermission();
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);

        setPermissions((previousState) => {
          let updatePermissions = previousState.map((data) => {
            if (data.label === "Mic") {
              return { ...data, permission: false }
            } else {
              return data;
            }
          });
          return updatePermissions;
        })
        checkSpeakerPermission();
      });
  }



  useEffect(() => {
    if (isConnected) {
      checkinternet();
    }
  }, [isConnected]);


  useEffect(() => {
    if (timer === 0) {
      history.push("/azure-video");
    }
    if (timer > 0 && isBrowser) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isBrowser]);


  console.log("permissions", permissions)

  const acceptSpeakerPermission = (option) => {
    const audio = document.getElementById("myAudio");
    audio.pause();
    setPermissions((previousState) => {
      let updatePermissions = previousState.map((data) => {
        if (data.label === "Speaker") {
          return { ...data, permission: option }
        } else {
          return data;
        }
      });
      return updatePermissions;
    })
    setSpeakerModal(false);

  }


  // console.log("enableDisableButton", enableDisableButton)

  return (
    <>
      <div className="main-home-container">
        <div className="rapid-header">
          <label>ICICI - RAPID</label>
        </div>
        <a href="chrome://settings/content" target="_blank"></a>
        {loginSuccessState || azure ? (
          <React.Fragment>
            <div className={!isConnected && "sub-home-container"}>
              {!isConnected ? (<> <div className="card-videoCall" onClick={() => setConnected(true)}>
                <div className="image-png">
                  <img
                    src={require("../../assets/images/video-camera.png")}
                    alt="dsd"
                  />
                </div>
                <p className="button-text">Connect</p>
              </div>

                <div
                  style={{
                    marginTop: 30,
                    textDecoration: "underline",
                    textAlign: "center",
                    color: "blue",
                  }}
                  onClick={() => {
                    let url = window.location.href.replace("https", "rapid");
                    window.open(url);
                  }}
                >
                  Login with App
                </div>

              </>) : (
                <>
                  {!isBrowser && <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="w-50 mt-20 relative" style={{ height: 250 }}>
                      <video
                        autoPlay
                        playsInline
                        muted
                        id="localVideo"
                        controls={false}
                        style={{
                          backgroundColor: "#1c1c1c",
                        }}
                        className={
                          "rounded-[10px] h-full w-100 object-cover flex items-center justify-center flip"
                        }
                      />
                    </div>
                    {!!address && <div className="w-50 relative bg-red-600 text-black rounded-2xl shadow-md p-4 text-center font-semibold" style={{ height: "auto" }}>
                      {address}
                    </div>}
                    <div className="d-flex w-50  flex-column align-items-center justify-content-center mt-3">
                      {permissions.map((permission, index) => {
                        return (
                          <div style={{ justifyContent: "space-between" }} className="d-flex w-100 flex-row  align-items-center">
                            <div key={index} className="permission-item">
                              {permission.label}
                            </div>
                            {permission.permission === "" ? <div className="loader-circle-v1"> </div> : permission.permission === false ? <div>&#10060;</div> : <div> &#9989;</div>}
                          </div>
                        );
                      })}
                    </div>
                    <audio id="myAudio" src={require("../../assets/audio/music.mp3")} loop></audio>

                    <Modal style={{ marginTop: 80 }} className="desktop" show={isSpeakerModalOpen} onHide={() => setShow(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Speaker Status</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ height: "auto", padding: "10px", display: "flex", alignItems: "center" }}>
                        Need to check if speaker is working properly. If you can hear the noise clearly then press 'Yes', or else press 'No'.
                      </Modal.Body>
                      <Modal.Footer>
                        <div class="flex space-x-4">
                          <button onClick={() => {
                            acceptSpeakerPermission(true);
                          }} style={{ background: "green" }} class="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
                            Yes
                          </button>
                          <button onClick={() => {
                            acceptSpeakerPermission(false);
                          }} style={{ background: "red" }} class="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700">

                            No
                          </button>

                        </div>
                      </Modal.Footer>
                    </Modal>


                    {enableContinueButton && <div onClick={() => {
                      setIsBrowser(true)
                    }} style={{ color: "#003366", textDecoration: "underline", cursor: "pointer", margin: 20, }} className="app-subtitle">Continue
                    </div>}
                    {enableDisableButton && <div>
                      <p
                        style={{
                          fontSize: 15,
                          paddingTop: 10,
                          fontWeight: 800,
                          textAlign: "center",
                          color: "#F75D59",
                        }}
                      >
                        <div>For Android:</div>
                        <div>Please click</div>
                        <div>
                          {`more options (three dots) --> settings --> site settings --> enable camera, microphone & location permissions`}
                        </div>
                        <div style={{ paddingTop: 20 }}>For iOS:</div>
                        <div>Please click</div>
                        <div>
                          {`more options (`}
                          <span style={{ fontSize: 10 }}> A</span>A
                          {`)--> Website Settings --> enable camera, microphone & location permissions`}
                        </div>
                      </p>
                    </div>
                    }
                  </div>
                  }
                  {isBrowser && (<>
                    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
                      {/* Timer in top right corner */}
                      <div className="absolute top-4 right-4 text-black  bg-blue-600 px-4 py-2 rounded-full shadow-lg text-lg font-semibold">
                        {timer}s
                      </div>
                      <div className="space-y-6 max-w-xl w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-300">
                          <h2 className="text-lg font-semibold text-blue-900 mb-4">
                            During Virtual Visit we will be verifying following things –
                          </h2>
                          <ol className="list-decimal list-inside text-blue-900 space-y-2 font-medium">
                            <li>Elevation of Property</li>
                            <li>Name Board/Address</li>
                            <li>Interiors</li>
                            <li>Please click share screen prior starting the measurement of property</li>
                            <li>For measurement, always point to the floor corners to fix corner points</li>
                          </ol>
                        </div>

                        <div className="bg-red-600 text-black rounded-2xl shadow-md p-4 text-center font-semibold">
                          Please do not leave this page, or access any other app, else you will be logged out of the virtual call.
                        </div>
                      </div>
                    </div>
                  </>)
                  }
                </>
              )}
            </div>
          </React.Fragment>) : (
          <React.Fragment>
            <div className="sub-home-container">
              <p className="title-text">
                Verify the URL to check for valid login credentials.
              </p>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isFetchingSesson: state.sessonLogin.isFetchingSesson,
  callDataValue: state.azureCalling.callDataValue,
  status: state.login.status,
  message: state.login.message,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCallDetails: getCallDetails,
      loginUser: loginUser,
      loginRapidUser: loginRapidUser,
      sessonLoginUser: sessonLoginUser,
      loginEncUser: loginEncUser,
      updateLocation: updateLocation,
      getCustomerAddress: getCustomerAddress,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RapidWeb);