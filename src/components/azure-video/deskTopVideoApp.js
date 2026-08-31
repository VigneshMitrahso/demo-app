import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  CallClient,
  CallAgent,
  VideoStreamRenderer,
  LocalVideoStream,
  Features,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { MeetingProvider,useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";
// import { LeaveScreen } from "./components/screens/LeaveScreen";
// import { JoiningScreen } from "./components/screens/JoiningScreen"
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos";
import {
  getCallDetails,
  cancelVideCall,
  getCustomerLatLong,
} from "../../action/azureCalling";
import "./styles.css";

import {
  _getStorageValue,
  _getStorageValueRapid,
} from "../../comman/localStorage";
import { AES_KEY, USER_ID } from "../../comman/constants";
import { toast } from "react-toastify";
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';
// import { LeaveScreen } from "./components/screens/LeaveScreen";
// import { JoiningScreen } from "./components/screens/JoiningScreen";

var deviceManager;
var call;
var dataChannel;
var messageSender;
// var callAgent;
var incomingCall;
var callAgent;
var localVideoStream;
var localVideoStreamRenderer;
var camera = 0;
var mute = false;
let userID = "";
let reqId = "";
var connectedDevice = "";

const AzureVideoRoom = ({ isDeskTop = false, ...props }) => {
  const ref = useRef(null);
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
  const [remoteParticiapantData, setRemoteParticipantData] = useState(false);
  const [show, setShow] = useState(false);
  const [isHangup, setHangup] = useState(false);
  const [latlong, setLatlong] = useState("");
  const [iscaptureCount, setCaptureCount] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);
  const [callData, setCallData] = useState({});
  const [camerNo, setCameraNo] = useState(0);
  const [isscreenShare, setScreenshare] = useState(false);
  const [isShowLoader,setShowLoader ] = useState(false);
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

  const apiRef = useRef();
  const jitisiRef = useRef();

  useEffect(()=>{
    let bodyTag = document.getElementsByTagName("body")[0];
    bodyTag.style.background = "#000000";
    return(()=>{
      let  bodyTag = document.getElementsByTagName("body")[0];
      bodyTag.style.background = "#fff";
    })
  },[])


  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);
  console.log("meetingId",meetingId)

  // useEffect(()=>{
  //   setInterval(() => {
  //     getlatLong();
  //   }, 5000);
  // },[])

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  const { channel } = useChannel("get-started", "first", (message) => {
    // if(message.data === "Start"){
    //   setScreenSharing(true);
    // }else if(message.data === "Stop"){
    //   setScreenSharing(false);
    // }
  });


  useEffect(()=>{
    return ()=> {
    // this will call when exit the page
      channel.detach();
    }
  },[])


  // useEffect(() => {
  //   var azureToken = isDeskTop
  //     ? props?.azureToken ?? ""
  //     : new URLSearchParams(props.location.search).get("azureToken");
  //   var agentID = isDeskTop
  //     ? props?.customerID ?? ""
  //     : new URLSearchParams(props.location.search).get("customerID");
  //   // startCallToNative();
  //   if (!!azureToken && !!agentID) {
  //     //agent side
  //     setIsAgent(true);
  //     setCalleeAcsUserId(agentID);
  //     initializeCallAgent(azureToken);
  //   } else {
  //     // customer side
  //     if (props.callDataValue[0].length === 0) {
  //       setCustomerInitializeCall(false);
  //       _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
  //         userID = uId;
  //         _getStorageValueRapid("USER_NAME").then((user) => {
  //         IsAgent(false);
  //     } else {
  //       if (props.callDataValue[0][0].call_status == "Call has not been created") {
  //         history.push("/customer-connect?call=true");
  //         setCustomerInitializeCall(true);
  //         setIsAgent(false);
  //       } else {
  //         setCalleeAcsUserId(props.callDataValue[0][0].bank_id);
  //         initializeCallAgent(props.callDataValue[0][0].token);
  //         setCallData(props.callDataValue[0][0]);
  //         setCustomerInitializeCall(false);
  //       }
  //     }
  //   }

  //   return () => {
  //     hangUpCall();
  //     // props.endCallBack();
  //   };
  // }, []);  props.getCallDetails(
  //             userID,
  //             user,
  //             onSuccessCallback,
  //             onFailureCallback
  //           );
  //         });
  //       });
  //       set

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
      history.push("/customer-connect");
      setCustomerInitializeCall(true);
      setIsAgent(false);
    } else {
      setCalleeAcsUserId(data.data[0].bank_id);
      initializeCallAgent(data.data[0].token);
      setCustomerInitializeCall(false);
    }
  };
  const onFailureCallback = () => {
    history.push("/customer-connect");
    toast.error("Token is expired please try again", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

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
      // localVideoContainer.current.style.color = `white`;
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
          var azureToken = isDeskTop
            ? (props?.azureToken ?? "")
            : new URLSearchParams(props.location.search).get("azureToken");
          var agentID = isDeskTop
            ? (props?.customerID ?? "")
            : new URLSearchParams(props.location.search).get("customerID");
          // Inspect the initial call.id value.
          incomingCall = args.incomingCall;
          setTimeout(async()=>{
            try {
              setStartCall(true);
              const localVideoStream = await createLocalVideoStream();
              const videoOptions = localVideoStream
                ? { localVideoStreams: [localVideoStream] }
                : undefined;
              call = await incomingCall.accept({ videoOptions });
              subscribeToCall(call, true);
            } catch (error) {
              console.log("accept call error", error);
            }
          },500)
      
          incomingCall.on("callEnded", (args) => {
            if (
              args.callEndReason &&
              args.callEndReason.code == 487 &&
              !azureToken &&
              !agentID
            ) {
              history.push("/customer-connect");
              toast.error("Issue with connection Please try agin", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
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
      if (isDeskTop) {
        props.endCallBack(false);
        toast.error("Issue with initiating the call", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
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
      // dataChannel = call.feature(Features.DataChannel);
      // messageSender = dataChannel.createDataChannelSender({
      //   channelId: 1000,
      // });
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
      var azureToken = isDeskTop
        ? (props?.azureToken ?? "")
        : new URLSearchParams(props.location.search).get("azureToken");
      var agentID = isDeskTop
        ? (props?.customerID ?? "")
        : new URLSearchParams(props.location.search).get("customerID");
      // Inspect the initial call.id value.
      //Subscribe to call's 'idChanged' event for value changes.
      call.on("idChanged", () => {
        console.log(`Call Id changed: ${call.id}`);
      });

      // Inspect the initial call.state value.
      // Subscribe to call's 'stateChanged' event for value changes.
      call.on("stateChanged", async () => {
        if (call.state === "Connected") {
          if (isDeskTop) {
            // getlatLong();
          }
          setCallConnected(true);
          setStartCallDisabled(true);
          setHangUpCallDisabled(false);
          // setIsLoading(false)
          setStartVideoDisabled(false);
          setStopVideoDisabled(false);
          setRemoteMuteIcon(false);
          setLocalMuteIcon(false);
          setMute(false);
          setStartCall(true);
          setTimeout(async () => {
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
          }, 1000)
        } else if (call.state === "Disconnected") {
          setStartCallDisabled(false);
          setHangUpCallDisabled(true);
          setCallConnected(false);
          setStartVideoDisabled(true);
          setStopVideoDisabled(true);
          setRemoteMuteIcon(false);
          setLocalMuteIcon(false);
          setStartCall(false);
          // if (!!azureToken && !!agentID && call?._callEndReason?.code == 480 ) {
          //     props.endCallBack(false);
          // }
          if (!!azureToken && !!agentID && call?._callEndReason?.code == 603) {
            toast.error("Call Rejected ...", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            props.endCallBack(false);
          } else if (
            !!azureToken &&
            !!agentID &&
            call?._callEndReason?.code == 0
          ) {
            // startCallAgent();
            // toast.error("Call Ended ...", {
            //   position: toast.POSITION.BOTTOM_CENTER,
            // });
            // setStartCallDisabled(false);
            // setHangUpCallDisabled(true);
            // setCallConnected(false);
            // setStartVideoDisabled(true);
            // setStopVideoDisabled(true);
            // setRemoteMuteIcon(false);
            // setLocalMuteIcon(false);
            // if (!isDeskTop) {
            //   window.location.reload();
            // } else {
            //   if (isHangup) {
            //     toast.error("Call disconnected", {
            //       position: toast.POSITION.BOTTOM_CENTER,
            //     });
            //     props.endCallBack(false);
            //   } else {
            //     history.push("/customer-connect");
            //   }
            // }
            // if (!isAgent) {
            //   // history.push("/rapid?customer-connect=true");
            // }
          } else if (
            !!azureToken &&
            !!agentID &&
            String(call?._callEndReason?.code).startsWith("4")
          ) {
            startCallAgent();
          } else {
            setStartCallDisabled(false);
            setHangUpCallDisabled(true);
            setCallConnected(false);
            setStartVideoDisabled(true);
            setStopVideoDisabled(true);
            setRemoteMuteIcon(false);
            setLocalMuteIcon(false);
            if (!!azureToken && !!agentID && !isDeskTop) {
              window.location.reload();
            } else {
              setTimeout(async () => {});
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
      // call.on('remoteParticipantsUpdated', e => {
      //     console.log("remoteParticipantsUpdated",e);
      //     // Subscribe to new remote participants that are added to the call.
      //     e.added.forEach(remoteParticipant => {
      //         subscribeToRemoteParticipant(remoteParticipant)
      //     });
      //     // Unsubscribe from participants that are removed from the call
      //     e.removed.forEach(remoteParticipant => {
      //         console.log('Remote participant removed from the call.');
      //     });
      // });
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
        e.added.forEach((remoteVideoStream) => {
          subscribeToRemoteVideoStream(remoteVideoStream);
        });
        // Unsubscribe from remote participant's video streams that were removed.
        e.removed.forEach((remoteVideoStream) => {
          if (isDeskTop && callConnected) {
            props.endCallBack(false);
          }
        });
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
    let remoteVideoContainer = document.createElement("div");
    remoteVideoContainer.className = "remote-video-container-desktop";
    const createView = async () => {
      // Create a renderer view for the remote video stream.
      view = await renderer.createView();
      console.log("view594",view);
    let  remoteVideosGalleryDom = document.getElementById("remoteVideosGallery")

      // Attach the renderer view to the UI.
      remoteVideosGalleryDom.appendChild(view.target);
    };

    // Remote participant has switched video on/off
    remoteVideoStream.on("isAvailableChanged", async () => {
      try {
        if (remoteVideoStream.isAvailable) {
          await createView();
        } else {
          view.dispose();
          remoteVideosGallery.current.removeChild(remoteVideoContainer);
          // remoteVideosGallery.current.style.backgroundColor = `transparent`;
          // // localVideoContainer.current.style.backgroundSize =  `Cover`
          // remoteVideosGallery.current.style.color = "white";
          // remoteVideosGallery.current.style.marginTop = "70px";
          // remoteVideosGallery.current.style.height = "90%";
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
    setHangup(true);
    if (!!call?.hangUp) {
      if (isDeskTop) {
        try {
          await call?.hangUp();
          call = {};
          callAgent = {};
          setRemoteMuteIcon(false);
          setLocalMuteIcon(false);
          setMute(false);
          // sendDataToReactNativeApp('endCall')
          setStartCall(false);
          props.endCallBack();
        } catch (r) {
          console.log("error", r);
        }
      } else {
        await call?.hangUp();
        call = {};
        callAgent = {};
        setRemoteMuteIcon(false);
        setLocalMuteIcon(false);
        setMute(false);
        // sendDataToReactNativeApp('endCall')
        setStartCall(false);
        if (!isAgent) {
          history.push("/rapid?azureVideoCall=true");
        }
      }
    }
  };

  

  const imageCallback = (data)=>{

  }

  const captureScreenshot = () => {
    // Attempt to find the container holding the video
    let videoWrapper = document.getElementById("presenterScreen") || document.getElementById("participantScreen");
  
    if (!videoWrapper) {
      toast.error("Video container not found.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
      return;
    }
  
    const video = videoWrapper.querySelector("video");
  
    if (!video) {
      toast.error("No video stream available for screenshot.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
      return;
    }
  
    // Check if video has enough data to render
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("Video is not ready yet. Please try again.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
      return;
    }
  
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const base64Image = canvas.toDataURL();
  
      if (base64Image.length > 100) {
        props.takeScreenShot(base64Image);
  
        if (!iscaptureCount) {
        setTimeout(() => {
          _getStorageValue(USER_ID).then((userId) => {
            props.cancelVideCall(
              userId,
              props.reqID,
              () => setCaptureCount(true),
              () => setCaptureCount(false)
            );
          });
        }, 100);
        }
      } else {
        toast.error("Captured image is empty. Please try again.", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
      }
    } catch (error) {
      toast.error("Failed to capture screenshot. Please try again.", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
      console.error("Screenshot error:", error);
    }
  };
  

  const cutCall = () => {
    hangUpCall();
    acceptCallButton(false);
    // sendDataToReactNativeApp('RejectCall')
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
                icon={faPhone}
                style={{ transform: "rotate(226deg)" }}
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
                style={{ transform: "rotate(226deg)" }}
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

  // const sendDataToReactNativeApp = async (data) => {
  //     //
  //     await   (window["ReactNativeWebView"]||window).postMessage(JSON.stringify({name:data}));
  //     if(data !== 'rejoin'){
  //         setStartCall(false);
  //     }
  //     // window.location.reload();
  // };

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

  const getlatLong = () => {

    _getStorageValue(USER_ID).then((userId) => {
      props.getCustomerLatLong(
        userId,
        props.reqID,
        successApiCallBack,
        failiur,
      );
    });

    const successApiCallBack = (response) => {
      console.log("line931");
      const latitude = response.data.customer_details[0].latitude;
      const longitude = response.data.customer_details[0].longitude;
      const address = response.data.customer_details[0].address;
        setLatlong({ latitude, longitude, address });
    };
    const failiur = (data) => {
      setLatlong("");
    };
  };
console.log("props.callDataValue",props.callDataValue);


// const handleApiReady = apiObj => {
//   apiRef.current = apiObj;
//   apiRef.current.on('knockingParticipant', handleKnockingParticipant);
//   apiRef.current.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
//   apiRef.current.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
//   apiRef.current.on('raiseHandUpdated', printEventOutput);
//   apiRef.current.on('titleViewChanged', printEventOutput);
//   apiRef.current.on('chatUpdated', handleChatUpdates);
//   apiRef.current.on('knockingParticipant', handleKnockingParticipant);
// };
console.log("capture" ,capture);
  return (
    <div
      // ref={ref}
      // id="videoCall"
      
      style={{backgroundColor:"black",height:"100vh",width:"100%" }}
    >
      <MeetingAppProvider>
       

<>
{!!props.callDataValue[0]?.MeetId &&<MeetingAppProvider>
  {/* {isMeetingStarted ? ( */}

    <MeetingProvider
      config={{
        meetingId:props.callDataValue[0]?.MeetId,
        micEnabled: micOn,
        webcamEnabled: webcamOn,
        name: props.callDataValue[0]?.room_id,
        multiStream: true,
        // customCameraVideoTrack: customVideoStream,
        // customMicrophoneAudioTrack: customAudioStream,      
        participantId:props.callDataValue[0]?.room_id,
      }}
      token={props.callDataValue[0]?.token}
      reinitialiseMeetingOnConfigChange={true}
      joinWithoutUserInteraction={true}
    >
      <MeetingContainer
        onMeetingLeave={() => {
          setToken("");
          setMeetingId("");
          setParticipantName("");
          setWebcamOn(false);
          setMicOn(false);
          setMeetingStarted(false);
        }}
        onMeetingJoined={() => {
          setWebcamOn(true);
          setMicOn(true);
          setMeetingStarted(true);
        }}
        setIsMeetingLeft={setIsMeetingLeft}
        isCapture={capture}
        imageCallback={imageCallback}
      />
    </MeetingProvider>
</MeetingAppProvider>}
</>
          </MeetingAppProvider>
            {isShowLoader ? (
              <>
                <label className={"loader-circle"}></label>
                <label
                  style={{
                    color: "#e77817",
                    position: "absolute",
                    top: "52%",
                    left:"40%"
                  }}
                >
                  {"Customer returning to camera feed"}
                </label>
              </>):null}
   

{!!props.customerData.latitude && (
        <div
          style={{
            position: "absolute",
            right: 20,
            bottom: 120,
            zIndex: 9999,
            color: "#f07d20",
          }}
        >
          <div>
            <b>Customer Latitude :</b> {props.customerData.latitude}
          </div>
          <div>
            <b>Customer Longitude :</b> {props.customerData.longitude}
          </div>
          <div style={{ width: "250px" }}>
            <b>Customer Address :</b> {props.customerData.address}
          </div>
        </div>
      )}

        { (
          <div className="filter-Button call_list_container">
            <button
              type="button"
              disabled={props.isLoading}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                display: "flex",
                width: 175,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="report"
              onClick={() => captureScreenshot()}
            >

              {props.isLoading ? (
                <div className="loader"></div>
              ) : (
                <div>Take Screenshot</div>
              )}
            </button>
            <button
              type="button"
              // disabled={props.isLoading}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                display: "flex",
                // width: 175,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="report"
              onClick={() => {
                channel.publish('first', 'Add_corner');
              }}
            >
              Add corner
            </button>
            <button
              type="button"
              // disabled={props.isLoading}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                display: "flex",
                // width: 175,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="report"
              onClick={() => {
                channel.publish('first', 'undo');
              }}
            >
              Undo
            </button>
            <button
              type="button"
              // disabled={props.isLoading}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                display: "flex",
                // width: 175,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="report"
              onClick={() => {
                channel.publish('first', 'finish_measurement');
              }}
            >
              Finish measurement
            </button>
            <button
              type="button"
              // disabled={props.isLoading}
              style={{
                marginLeft: 10,
                flexDirection: "row",
                display: "flex",
                // width: 175,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="report"
              onClick={() => {
                channel.publish('first', 'add_room');
              }}
            >
              Add room
            </button>
          </div>
        )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    callDataValue: state.azureCalling.callDataValue,
    imageUrlData: state.getImageUrl.imageUrlData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCallDetails: getCallDetails,
      cancelVideCall: cancelVideCall,
      getCustomerLatLong: getCustomerLatLong,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AzureVideoRoom);
