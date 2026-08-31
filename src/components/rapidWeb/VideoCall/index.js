import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "./styles.css";
import Loader from "../../loader";
import { GET } from "../../../comman/constants";
import {
  callDataUrl,
  genrateTokenUrl,
  endRoomCallUrl,
} from "../../../comman/urls";
import { apiVideoCall, apiCall } from "../../../comman/connect";
import {
  _getStorageValueRapid,
  getVideo,
  setVideo,
} from "../../../comman/localStorage";
import VideoRoom from "./videoRoom";
import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions,
} from "mic-check";

function VideoCall() {
  let history = useHistory();
  const [message, setMessage] = useState("");
  const [uName, setUname] = useState("");
  const [uPhone, setUphone] = useState("");
  const [uId, setUid] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState(false);
  const [completed, setCompleted] = useState(false);
  // const [openSettings,setOpenSettings] = useState(false);

  useEffect(() => {
    _getStorageValueRapid("PHONE_NUMBER").then((mobile) => {
      setUphone(mobile);
    });
    _getStorageValueRapid("USER_NAME").then((user) => {
      setUname(user);
    });
    _getStorageValueRapid("USER_ID_RAPID").then((uId) => {
      setUid(uId);
    });
    if (uId !== "" && uPhone !== "") {
      getVideoCall(uId, uName);
    }
  }, [uId]);

  const getVideoCall = (uId, reqid) => {
    let url = callDataUrl(uId, encodeURIComponent(reqid));
    _getStorageValueRapid("ACCESS_TOKEN").then((token) => {
      apiVideoCall(GET, url, "", onSuccess, onFailure, "", token);
    });
    const onSuccess = (response) => {
      if (response.data === null) {
        setMessage("Call Not Available");
        setLoading(false);
        toast.warning("Call Not Available", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        const callDetails = response.data.call_details;
        if (callDetails[0].status === "completed") {
          setCompleted(true);
        }
        const callData = callDetails[0];
        if (callData.length === 0 || callData.participants === 0) {
          setMessage("No Calls Available.");
        }
        const sid = callData.sid;
        const secret = callData.secret;
        const roomName = callData.room_name;
        const requestId = callData.request_id;
        joinVideoCall(secret, sid, roomName, roomName);
      }
    };
    const onFailure = (response) => {
      setMessage("Something went wrong!");
    };
  };

  const joinVideoCall = (secret, sid, roomName, requestId) => {
    let url = genrateTokenUrl(
      uId,
      encodeURIComponent(uName),
      requestId,
      secret,
      sid,
    );
    _getStorageValueRapid("ACCESS_TOKEN").then((token) => {
      apiVideoCall(GET, url, "", onSuccessCall, onFailureCall, "", token);
    });
    const onSuccessCall = (response) => {
      setLoading(false);
      setToken(response.data[0].accessToken);
      setRoom(roomName);
      setCallStatus(true);
      let callObj = {
        name: roomName,
        access: response.data[0].accessToken,
      };
      setVideo(callObj);
    };
    const onFailureCall = () => {
      setLoading(false);
    };
  };
  const joinCall = () => {
    let token = getVideo();
    setRoom(token.name);
    setToken(token.access);
    setCallStatus(true);
  };
  const endCall = () => {
    _getStorageValueRapid("ACCESS_TOKEN").then((token) => {
      _getStorageValueRapid("USER_ID_RAPID").then((userId) => {
        const url = endRoomCallUrl(userId, room);
        if (token != undefined && token != null) {
          apiCall(GET, url, "", onSuccess, onFailure, "", token);
        }
      });
    });

    const onSuccess = () => {
      history.goBack();
      setVideo(null);
      toast.success("Call Ended Successfully.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    };

    const onFailure = () => {
      history.goBack();
    };
  };
  if (token !== "" && token !== undefined && callStatus !== false) {
    return (
      <div className="main-container">
        <div className="rapid-header">
          <label>ICICI - RAPID</label>
        </div>
        {loading && <Loader />}
        <div className="sub-container">
          <VideoRoom
            accessToken={token}
            roomName={room}
            loading={loading}
            callStatus={callStatus}
            endVideoCall={endCall}
            joinCall={joinCall}
            completed={completed}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="main-container">
        <div className="rapid-header">
          <label>ICICI - RAPID</label>
        </div>
        {loading && <Loader />}
        <div className="sub-container">
          <p className="text">{message}</p>
        </div>
      </div>
    );
  }
}

export default VideoCall;
