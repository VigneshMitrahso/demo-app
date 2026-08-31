import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  CallClient,
  CallAgent,
  VideoStreamRenderer,
  LocalVideoStream,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faPhone,
  faPhoneAlt,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos";
import { getCallDetails, cancelVideCall } from "../../action/azureCalling";
import "./styles.css";
import Loader from "../../components/loader";
import Ringing from "./ringing";
import {
  _getStorageValue,
  getUserId,
  _getStorageValueRapid,
} from "../../comman/localStorage";
import { AES_KEY, USER_ID } from "../../comman/constants";
import { toast } from "react-toastify";
// import { getNetworkBandwidth } from "../../comman/checkinternetbandwidth";
import { MeetingProvider,useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";

var deviceManager;
var call;
// var callAgent;
var incomingCall;
var callAgent;
var localVideoStream;
var localVideoStreamRenderer;
var camera = 0;
var mute = false;
let userID = "";
let reqId = "";

const AzureVideoRoom = (props) => {
  const history = useHistory();
  const startCallButton = useRef(null);
  const hangUpCallButton = useRef(null);
  const startVideoButton = useRef(null);
  const stopVideoButton = useRef(null);
  const connectedLabel = useRef(null);
  const remoteVideosGallery = useRef(null);
  const localVideoContainer = useRef(null);
  const localMute = useRef(null);
  const remoteMute = useRef(null);
  const [startCallDisabled, setStartCallDisabled] = useState(true);
  const [startVideoDisabled, setStartVideoDisabled] = useState(true);
  const [stopVideoDisabled, setStopVideoDisabled] = useState(true);
  const [hangUpCallDisabled, setHangUpCallDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [startCall, setStartCall] = useState(false);
  const [stopCall, setStopCall] = useState(false);
  const [calleeAcsUserId, setCalleeAcsUserId] = useState("");
  const [isMute, setMute] = useState(false);
  const [stopVideo, setStopVideo] = useState(false);
  const [remoteMuteIcon, setRemoteMuteIcon] = useState(false);
  const [localMuteIcon, setLocalMuteIcon] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [customerInitializeCall, setCustomerInitializeCall] = useState(false);
  const [startbtn, setStartbtn] = useState(false);
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null)
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [capture, setCapture] = useState(false);


  // useEffect(() => {
  //   var azureToken = new URLSearchParams(props.location.search).get(
  //     "azureToken",
  //   );
  //   var agentID = new URLSearchParams(props.location.search).get("customerID");
  //   // startCallToNative();
  //   if (!!azureToken && !!agentID) {
  //     //agent side
  //     setIsAgent(true);
  //     setCalleeAcsUserId(agentID);
  //     initializeCallAgent(azureToken);
  //   } else {
  //     // customer side

  //     if (props.callDataValue.length === 0) {
  //       setCustomerInitializeCall(false);
  //       _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
  //         userID = uId;
  //         _getStorageValueRapid("USER_NAME").then((user) => {
  //           props.getCallDetails(
  //             userID,
  //             user,
  //             onSuccessCallback,
  //             onFailureCallback,
  //           );
  //         });
  //       });
  //       setIsAgent(false);
  //     } else {
  //       if (props.callDataValue[0].call_status == "Call has not been created") {
  //         // toast.error("Call is not created...", {
  //         //     position: toast.POSITION.BOTTOM_CENTER,
  //         // });
  //         history.push("/rapid?azureVideoCall=true");
  //         setCustomerInitializeCall(true);
  //         setIsAgent(false);
  //       } else {
  //         // getNetworkBandwidth();
  //         setCalleeAcsUserId(props.callDataValue[0].bank_id);
  //         initializeCallAgent(props.callDataValue[0].token);
  //         setCustomerInitializeCall(false);
  //       }
  //     }
  //   }

  //   return () => {
  //     hangUpCall();
  //   };
  // }, []);

  const connectionRef = useRef(callConnected);
  connectionRef.current = callConnected;

  // useEffect(()=>{
  //     var azureToken = new URLSearchParams(props.location.search).get("azureToken");
  //     var agentID = new URLSearchParams(props.location.search).get("customerID");
  //     if((!azureToken && !agentID && !isAgent )){
  //         setTimeout(()=>{
  //             console.log("line 224",connectionRef.current);
  //             if(connectionRef.current === false ){
  //                 // window.location.reload();
  //             }
  //         },30000)
  //     }
  // },[])

  function handleEvent(message) {
    hangUpCall();
  }

  useEffect(() => {
    document.addEventListener("message", (event) => {
      const message = event.data;
      handleEvent(message);
    });

    return () => {
      document.removeEventListener("message", (event) => {
        const message = event.data;
        handleEvent(message);
      });
      hangUpCall();
    };
  }, []);

  const onSuccessCallback = (data) => {
    if (data.data[0].call_status == "Call has not been created") {
      // toast.error("Call is not created...", {
      //     position: toast.POSITION.BOTTOM_CENTER,
      // });
      history.push("/rapid?azureVideoCall=true");
      setCustomerInitializeCall(true);
      setIsAgent(false);
    } else {
      setCalleeAcsUserId(data.data[0].bank_id);
      initializeCallAgent(data.data[0].token);
      setCustomerInitializeCall(false);
    }
  };
  const onFailureCallback = () => {
    history.push("/rapid?azureVideoCall=true");
    toast.error("Token is expired please try again", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  useEffect(()=>{
    let bodyTag = document.getElementsByTagName("body")[0];
    bodyTag.style.background = "#000000";
    return(()=>{
      let  bodyTag = document.getElementsByTagName("body")[0];
      bodyTag.style.background = "#fff";
    })
  },[])


  // const containerId = "react-jitsi-meet-container";
  // const [jitsiObj, setJitsiObj] = React.useState(null);
  
  // const loadScript = () => {
  //   let resolveloadScriptPromise = null;
  
  //   const loadScriptPromise = new Promise((resolve) => {
  //     resolveloadScriptPromise = resolve;
  //   });
  
  //   const script = document.createElement("script");
  //   script.src = "https://8x8.vc/vpaas-magic-cookie-96f0941768964ab380ed0fbada7a502f/external_api.js";
  //   script.async = true;
  //   script.onload = resolveloadScriptPromise;
  //   document.body.appendChild(script);
  
  //   return loadScriptPromise;
  // };
  
  // const initialise = async () => {
  //   if (!window.JitsiMeetExternalAPI) {
  //     await loadScript();
  //   }
  
  //   const _jitsi = new window.JitsiMeetExternalAPI(`8x8.vc`, {
  //     // roomName: `vpaas-magic-cookie-956026514e514543929cc66b84895468/${props.callDataValue[0]?.room_id}`,
  //     roomName: `vpaas-magic-cookie-df793e8630e94532af8f5d7da3602308/${props.callDataValue[0]?.room_id}`,
  //     jwt: props.callDataValue[0].token,
  //     parentNode: document.getElementById(containerId),
  //     configOverwrite: {
  //       prejoinConfig: {
  //         enabled: false // Disable the pre-join screen
  //       }
  //     },
  //   });
  
  //   _jitsi.addEventListener("videoConferenceLeft", () => {
  //     _jitsi.dispose();
  //     setJitsiObj(null); // Reset Jitsi object on conference leave
  //     history.push("/rapid?azureVideoCall=true");
  //   });

  //   _jitsi.addEventListener("participantJoined", (participant) => {
  //     console.log('Participant joined: ', participant);
  //     // setShowLoader(false);
  //   });
    
  //   // Event listener for participant left
  //   _jitsi.addEventListener("participantLeft", (participant) => {
  //     console.log('Participant left: ', participant);
  //     // setShowLoader(true);
  //   });
  
  //   setJitsiObj(_jitsi); // Store the Jitsi instance in state
  // };
  
  // React.useEffect(() => {
  //   // Only initialize Jitsi when callDataValue is available and jitsiObj is not initialized
  //   if (props.callDataValue.length > 0 && !jitsiObj) {
  //     initialise();
  //   }
  
  //   // Clean up Jitsi instance when component unmounts
  //   return () => {
  //     if (jitsiObj) {
  //       jitsiObj.dispose();
  //       setJitsiObj(null); // Clear Jitsi instance in state
  //     }
  //   };
  // }, [props.callDataValue, jitsiObj]);
  

  // const createLocalVideoStream = async () => {
  //     const callClient = new CallClient();
  //     // Set up a camera device to use.
  //     deviceManager = await callClient?.getDeviceManager();
  //     let numOfCam = (await deviceManager.getCameras()).length;
  //     console.log("numOfCam",await deviceManager.getCameras())
  //     if (numOfCam>1) {
  //         const cameras=(await deviceManager.getCameras())[camera];
  //         return new LocalVideoStream(cameras);
  //     } else if (numOfCam == 1) {
  //         const cameras=(await deviceManager.getCameras())[0];
  //         return new LocalVideoStream(cameras);
  //     } else if (numOfCam == 0){
  //         toast.error("No camera device found on this system ...", {
  //             position: toast.POSITION.BOTTOM_CENTER,
  //         });
  //     }
  // }

  const createLocalVideoStream = async (zoomLevel = 1) => {
    const callClient = new CallClient();
    // Set up a camera device to use.
    const deviceManager = await callClient?.getDeviceManager();
    const cameras = await deviceManager.getCameras();
    const numOfCam = cameras.length;

    if (numOfCam > 0) {
      // Select the camera to use
      const selectedCamera = cameras[numOfCam > 1 ? camera : 0];
      const localVideoStream = new LocalVideoStream(selectedCamera);

      // Apply zoom level
      try {
        const mediaStream = await localVideoStream.getMediaStream();
        const videoTrack = mediaStream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();

        if (capabilities.zoom) {
          await videoTrack.applyConstraints({
            advanced: [{ zoom: zoomLevel }],
          });
        } else {
          console.warn("Zoom is not supported on this device.");
        }
      } catch (error) {
        console.error("Failed to apply zoom constraints:", error);
      }

      return localVideoStream;
    } else {
      toast.error("No camera device found on this system ...", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  /**
   * Display your local video stream preview in your UI
   */
  const displayLocalVideoStream = async (localVideoStream) => {
    try {
      localVideoStreamRenderer = new VideoStreamRenderer(localVideoStream);
      const view = await localVideoStreamRenderer.createView();
      if (!!view.target) {
        localVideoContainer.current.hidden = false;
        localVideoContainer.current.appendChild(view.target);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Remove your local video stream preview from your UI
   */
  const removeLocalVideoStream = async () => {
    try {
      localVideoContainer.current.style.color = `white`;
      localVideoStreamRenderer.dispose();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Using the CallClient, initialize a CallAgent instance with a CommunicationUserCredential which will enable us to make outgoing calls and receive incoming calls.
   * You can then use the CallClient.getDeviceManager() API instance to get the DeviceManager.
   */
  const initializeCallAgent = async (token) => {
    setLoad(true);
    try {
      const callClient = new CallClient();
      const tokenCredential = new AzureCommunicationTokenCredential(
        token.trim(),
      );
      let callAgentNew = await callClient.createCallAgent(tokenCredential);
      // Set up a camera device to use.
      deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({ video: true });
      await deviceManager.askDevicePermission({ audio: true });
      // Listen for an incoming call to accept.
      callAgentNew.on("incomingCall", async (args) => {
        try {
          var azureToken = new URLSearchParams(props.location.search).get(
            "azureToken",
          );
          var agentID = new URLSearchParams(props.location.search).get(
            "customerID",
          );
          // Inspect the initial call.id value.
          incomingCall = args.incomingCall;

          try {
            setStartCall(true);
            const localVideoStream = await createLocalVideoStream();
            const videoOptions = localVideoStream
              ? { localVideoStreams: [localVideoStream] }
              : undefined;
            call = await incomingCall.accept({ videoOptions });
            subscribeToCall(call, true);
            // if(!data){
            //         hangUpCall("")
            // }
            // Subscribe to the call's properties and events.
          } catch (error) {
            console.log("accept call error", error);
          }
          incomingCall.on("callEnded", (args) => {
            if (
              args.callEndReason &&
              args.callEndReason.code == 487 &&
              !azureToken &&
              !agentID
            ) {
              // window.location.reload();
            }
          });
          setStartCallDisabled(true);
          setIsLoading(true);
        } catch (error) {
          console.log("error", error);
        }
      });
      callAgent = callAgentNew;
      setLoad(false);
      setStartCallDisabled(false);
      setIsLoading(false);
    } catch (error) {
      console.log("error initial", error);
    }
  };
  /**
   * Place a 1:1 outgoing video call to a user
   * Add an event listener to initiate a call when the `startCallButton` is clicked:
   * First you have to enumerate local cameras using the deviceManager `getCameraList` API.
   * In this quickstart we're using the first camera in the collection. Once the desired camera is selected, a
   * LocalVideoStream instance will be constructed and passed within `videoOptions` as an item within the
   * localVideoStream array to the call method. Once your call connects it will automatically start sending a video stream to the other participant.
   */

  const startCallAgent = async () => {
    // setStartCall(true)
    setLoad(true);
    try {
      const localVideoStream = await createLocalVideoStream();
      const videoOptions = localVideoStream
        ? { localVideoStreams: [localVideoStream] }
        : undefined;
      call = await callAgent.startCall(
        [{ communicationUserId: calleeAcsUserId }],
        { videoOptions },
      );
      // Subscribe to the call's properties and events.
      subscribeToCall(call);
      // Subscribe to the call's properties and events.
      // setLoad(false);
    } catch (error) {
      console.log("startCallAgent error", error);
    }
  };

  const acceptCallButton = async (data) => {
    try {
      setStartCall(true);
      const localVideoStream = await createLocalVideoStream();
      const videoOptions = localVideoStream
        ? { localVideoStreams: [localVideoStream] }
        : undefined;
      call = await incomingCall.accept({ videoOptions });
      subscribeToCall(call, data);
      if (!data) {
        hangUpCall("");
      }
      // Subscribe to the call's properties and events.
    } catch (error) {
      console.log("accept call error", error);
    }
  };

  /**
   * Subscribe to a call obj.
   * Listen for property changes and collection updates.
   */

  const subscribeToCall = (call) => {
    try {
      var azureToken = new URLSearchParams(props.location.search).get(
        "azureToken",
      );
      var agentID = new URLSearchParams(props.location.search).get(
        "customerID",
      );
      // Inspect the initial call.id value.
      //Subscribe to call's 'idChanged' event for value changes.
      call.on("idChanged", () => {
        console.log(`Call Id changed: ${call.id}`);
      });

      // Inspect the initial call.state value.
      // Subscribe to call's 'stateChanged' event for value changes.
      call.on("stateChanged", async () => {
        if (call.state === "Connected") {
          setStartCallDisabled(true);
          setHangUpCallDisabled(false);
          setCallConnected(true);
          // setIsLoading(false)
          setStartVideoDisabled(false);
          setStopVideoDisabled(false);
          setRemoteMuteIcon(false);
          setLocalMuteIcon(false);
          setMute(false);
          setStartCall(true);
          call.localVideoStreams.forEach(async (lvs) => {
            localVideoStream = lvs;
            await displayLocalVideoStream(lvs);
          });
          call.on("localVideoStreamsUpdated", (e) => {
            e.added.forEach(async (lvs) => {
              localVideoStream = lvs;
              await displayLocalVideoStream(lvs);
            });
            e.removed.forEach((lvs) => {
              removeLocalVideoStream();
            });
          });
        } else if (call.state === "Disconnected") {
          setStartCallDisabled(false);
          setHangUpCallDisabled(true);
          setCallConnected(false);
          setStartVideoDisabled(true);
          setStopVideoDisabled(true);
          setRemoteMuteIcon(false);
          setLocalMuteIcon(false);
          console.log("call?._callEndReason?.code", call?._callEndReason?.code);
          if (!!azureToken && !!agentID && call?._callEndReason?.code == 603) {
            toast.error("Call Rejected ...", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          } else if (
            !!azureToken &&
            !!agentID &&
            call?._callEndReason?.code == 0
          ) {
            toast.error("Call Ended ...", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            setStartCallDisabled(false);
            setHangUpCallDisabled(true);
            setCallConnected(false);
            setStartVideoDisabled(true);
            setStopVideoDisabled(true);
            setRemoteMuteIcon(false);
            setLocalMuteIcon(false);
            window.location.reload();
            // sendDataToReactNativeApp("rejoin");
          } else if (
            !!azureToken &&
            !!agentID &&
            call?._callEndReason?.code == 480
          ) {
            startCallAgent();
            // sendDataToReactNativeApp("rejoin")
          } else {
            console.log("CUSTOMER END");
            setStartCallDisabled(false);
            setHangUpCallDisabled(true);
            setCallConnected(false);
            setStartVideoDisabled(true);
            setStopVideoDisabled(true);
            setRemoteMuteIcon(false);
            setLocalMuteIcon(false);
            if (!!azureToken && !!agentID) {
              window.location.reload();
            } else {
              setTimeout(async () => {
                //  await window.location.reload();
                await history.push("/rapid?azureVideoCall=true");
              });
            }
          }
        }
      });

      // Inspect the call's current remote participants and subscribe to them.
      call.remoteParticipants.forEach((remoteParticipant) => {
        subscribeToRemoteParticipant(remoteParticipant);
      });
      // Subscribe to the call's 'remoteParticipantsUpdated' event to be
      // notified when new participants are added to the call or removed from the call.
      call.on("remoteParticipantsUpdated", (e) => {
        // Subscribe to new remote participants that are added to the call.
        e.added.forEach((remoteParticipant) => {
          subscribeToRemoteParticipant(remoteParticipant);
        });
        // Unsubscribe from participants that are removed from the call
        e.removed.forEach((remoteParticipant) => {
          console.log("Remote participant removed from the call.");
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Subscribe to a remote participant obj.
   * Listen for property changes and collection udpates.
   */
  const subscribeToRemoteParticipant = (remoteParticipant) => {
    try {
      // Inspect the initial remoteParticipant.state value.
      // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
      remoteParticipant.on("stateChanged", () => {
        if (remoteParticipant.state === "Connected") {
          console.log(
            `Remote participant state changed: ${remoteParticipant.state}`,
          );
        } else {
          console.log(
            `Remote participant state changed: ${remoteParticipant.state}`,
          );
        }
      });

      // mute changes
      remoteParticipant.on("isMutedChanged", (event) => {
        setRemoteMuteIcon((remoteMuteIcon) => !remoteMuteIcon);
      });
      // Inspect the remoteParticipants's current videoStreams and subscribe to them.
      remoteParticipant.videoStreams.forEach((remoteVideoStream) => {
        subscribeToRemoteVideoStream(remoteVideoStream);
      });
      // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
      // notified when the remoteParticiapant adds new videoStreams and removes video streams.
      remoteParticipant.on("videoStreamsUpdated", (e) => {
        // Subscribe to new remote participant's video streams that were added.
        console.log("videoStreamsUpdated", e);
        e.added.forEach((remoteVideoStream) => {
          subscribeToRemoteVideoStream(remoteVideoStream);
        });
        // Unsubscribe from remote participant's video streams that were removed.
        //   e.removed.forEach(remoteVideoStream => {
        //       console.log('Remote participant video stream was removed.');
        //   })
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Subscribe to a remote participant's remote video stream obj.
   * You have to subscribe to the 'isAvailableChanged' event to render the remoteVideoStream. If the 'isAvailable' property
   * changes to 'true', a remote participant is sending a stream. Whenever availability of a remote stream changes
   * you can choose to destroy the whole 'Renderer', a specific 'RendererView' or keep them, but this will result in displaying blank video frame.
   */

  const subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    let renderer = new VideoStreamRenderer(remoteVideoStream);
    let view;

    const createView = async () => {
      // Create a renderer view for the remote video stream.
      view = await renderer.createView();
      // Attach the renderer view to the UI.
      remoteVideosGallery.current.appendChild(view.target);
    };

    // Remote participant has switched video on/off
    remoteVideoStream.on("isAvailableChanged", async () => {
      try {
        if (remoteVideoStream.isAvailable) {
          await createView();
        } else {
          view.dispose();
          // remoteVideosGallery.current.style.backgroundColor = `white`
          // localVideoContainer.current.style.backgroundSize =  `Cover`
          remoteVideosGallery.current.style.color = "white";
        }
      } catch (e) {
        console.error(e);
      }
    });

    // Remote participant has video on initially.
    if (remoteVideoStream.isAvailable) {
      try {
        await createView();
      } catch (e) {
        console.error(e);
      }
    }
  };

  /**
   * Start your local video stream.
   * This will send your local video stream to remote participants so they can view it.
   */
  const startVideoAgent = async () => {
    try {
      const localVideoStreamSetter = await createLocalVideoStream();
      await call.startVideo(localVideoStreamSetter);
      setStopVideo(false);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Stop your local video stream.
   * This will stop your local video stream from being sent to remote participants.
   */
  const stopVideoAgent = async () => {
    try {
      await call.stopVideo(localVideoStream);
      setStopVideo(true);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * To render a LocalVideoStream, you need to create a new instance of VideoStreamRenderer, and then
   * create a new VideoStreamRendererView instance using the asynchronous createView() method.
   * You may then attach view.target to any UI element.
   */

  /**
   * End current call
   */
  const hangUpCall = async (event) => {
    if (!!call?.hangUp) {
      await call?.hangUp();
      call = {};
      callAgent = {};
      setRemoteMuteIcon(false);
      setLocalMuteIcon(false);
      setMute(false);
      sendDataToReactNativeApp("endCall");
      setStartCall(false);
      if (!isAgent) {
        history.push("/rapid?azureVideoCall=true");
      }
    }
  };

  const cutCall = () => {
    hangUpCall();
    acceptCallButton(false);
    sendDataToReactNativeApp("RejectCall");
    setStopCall(true);
    setCallConnected(true);
    setStartCall(false);
    setRemoteMuteIcon(false);
    setLocalMuteIcon(false);
  };

  const Ringing = ({ acceptCallButton }) => {
    return (
      <div className="main-container-ring">
        <p className="message-text">Ringing...</p>
        <div className="ring-btn-container">
          <div className="padding3">
            <button
              className={"option-button-red"}
              onClick={() => cutCall()}
              ref={hangUpCallButton}
              type="button"
            >
              <FontAwesomeIcon
                icon={faCamera}
                rotate={45}
                color="#fff"
                size="lg"
              />
            </button>
          </div>
          <div className="padding3">
            <button
              className={"option-button-green"}
              onClick={() => acceptCallButton(true)}
              ref={hangUpCallButton}
              type="button"
            >
              <FontAwesomeIcon
                icon={faPhone}
                rotate={45}
                color="#fff"
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const switchCameras = async () => {
    if (camera === 0) {
      try {
        stopVideoAgent();
        const callClient = new CallClient();
        // Set up a camera device to use.
        deviceManager = await callClient?.getDeviceManager();
        let numOfCam = (await deviceManager.getCameras()).length;
        camera = numOfCam - 1;
        startVideoAgent();
      } catch (e) {
        camera = 1;
      }
    } else {
      stopVideoAgent();
      camera = 0;
      startVideoAgent();
    }
  };

  const muteCall = async () => {
    setLocalMuteIcon(!localMuteIcon);
    if (isMute == false) {
      await call.mute();
    } else {
      await call.unmute();
    }
    setMute(!isMute);
  };

  const sendDataToReactNativeApp = async (data) => {
    //
    await (window["ReactNativeWebView"] || window).postMessage(
      JSON.stringify({ name: data }),
    );
    if (data !== "rejoin") {
      setStartCall(false);
    }
    // window.location.reload();
  };

  const customerCreateCall = () => {
    setCustomerInitializeCall(false);
    _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
      userID = uId;
      _getStorageValueRapid("USER_NAME").then((user) => {
        props.getCallDetails(
          userID,
          user,
          onSuccessCallback,
          onFailureCallback,
        );
      });
    });
    setIsAgent(false);
  };

  return (
    <div
      style={{backgroundColor:"black",height:"100%",width:"100%" }}
    >
       <>
       {!!props.callDataValue[0]?.MeetId &&<MeetingAppProvider>
           <MeetingProvider
             config={{
               meetingId:props.callDataValue[0]?.MeetId,
               micEnabled: micOn,
               webcamEnabled: webcamOn,
               name: props.callDataValue[0]?.room_id,
               multiStream: true,
             }}
             token={props.callDataValue[0].token}
             reinitialiseMeetingOnConfigChange={true}
             joinWithoutUserInteraction={true}
           >
             <MeetingContainer
               onMeetingLeave={() => {
                 setToken("");
                 setMeetingId("");
                 setParticipantName("");
                 setWebcamOn(true);
                 setMicOn(true);
                 setMeetingStarted(true);
               }}
               setIsMeetingLeft={setIsMeetingLeft}
             />
           </MeetingProvider>
       </MeetingAppProvider>}
       </>
                   </div>
  );
};

function mapStateToProps(state) {
  return {
    callDataValue: state.azureCalling.callDataValue,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCallDetails: getCallDetails,
      cancelVideCall: cancelVideCall,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AzureVideoRoom);