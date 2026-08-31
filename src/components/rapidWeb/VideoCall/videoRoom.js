import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "../../../containers/video-call/Participant";
import LocalParticipant from "../../../containers/video-call/LocalParticipant";
import { updateLocation } from "../../../action/updateLocation";
import { logErrors } from "../../../comman/connect";
import { _getStorageValueRapid } from "../../../comman/localStorage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const VideoRoom = (props) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [videoHideAndShow, setVideoHideAndShow] = useState(true);
  const [audioHideAndShow, setaudioHideAndShow] = useState(true);
  const [videoRoomLoader, setVideoRoomLoader] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      if (lat !== "") {
        _getStorageValueRapid("USER_ID_RAPID").then((userId) => {
          _getStorageValueRapid("USER_NAME").then((userName) => {
            props.updateLocation(userId, userName, lat, lng);
          });
        });
      }
    });
  }, []);
  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    };

    if (props.callStatus) {
      Video.connect(props.accessToken, {
        name: props.roomName,
        region: "in1",
        audio: audioHideAndShow,
        video: videoHideAndShow,
      }).then(
        (room) => {
          setRoom(room);
          room.on("participantConnected", participantConnected);
          room.on("participantDisconnected", participantDisconnected);
          room.participants.forEach(participantConnected);
          setVideoRoomLoader(false);
        },
        (error) => {
          _getStorageValueRapid("ACCESS_TOKEN").then((token) => {
            logErrors("join call", error, token, "{}");
          });
        },
      );
    } else {
      navigator.mediaDevices.getMedia =
        navigator.mediaDevices.ia || // use the proper vendor prefix: ;
        // navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia ||
        navigator.mediaDevices.msGetUserMedia;

      navigator.getMedia(
        { video: true },
        function () {
          // webcam is available
          toast.success("webcam is available", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          navigator.getMedia(
            { audio: true },
            function () {
              // webcam audio is available
              toast.success("webcam audio is available", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            },
            function () {
              // webcam audio is not available
              toast.warning("webcam audio is not available", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              setaudioHideAndShow(false);
            },
          );
        },
        function () {
          // webcam is not available
          toast.warning("webcam is not available", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setVideoHideAndShow(false);
          navigator.getMedia(
            { audio: true },
            function () {
              // webcam audio is available
              toast.success("webcam audio is available", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            },
            function () {
              // webcam audio is not available
              toast.warning("webcam audio is not available", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              setaudioHideAndShow(false);
            },
          );
        },
      );
    }

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(
            function (trackPublication) {
              trackPublication.track.stop();
            },
          );
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [props.roomName, props.accessToken]);

  const remoteParticipants = participants.map((participant) => {
    return <Participant key={participant.sid} participant={participant} />;
  });

  return (
    <div className="customer-call-sec">
      {(() => {
        if (props.completed) {
          return (
            <div className="call-status-message">
              <p className="message-text">No calls available</p>
            </div>
          );
        } else if (props.reJoinScreen) {
          return (
            <div className="local-participant">
              <div className="video-call-profile">
                <div className="user-icon">
                  <img
                    src={require("../../../assets/images/user.png")}
                    alt="user"
                  />
                </div>
              </div>
              <div className="join-call-menu">
                <button onClick={props.joinCall}>
                  {videoRoomLoader ? <div className="loader"></div> : null}
                  Rejoin Call
                </button>
                <button className="red-call" onClick={props.endVideoCall}>
                  {props.loading ? <div className="loader"></div> : null}
                  Cancel
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <>
              {room ? (
                <>
                  <div className="local-participant">
                    <div className="video-call-profile hide-video-call">
                      {remoteParticipants}
                    </div>
                    <div className="join-call-menu">
                      <div className="option-button-red">
                        {props.loading ? (
                          <div className="loader"></div>
                        ) : (
                          <FontAwesomeIcon
                            icon={faPhone}
                            style={{ transform: "rotate(226deg)" }}
                            color="#fff"
                            onClick={props.endVideoCall}
                            size="lg"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="remote-participants">
                    <LocalParticipant
                      audioHideAndShowvalue={audioHideAndShow}
                      videoHideAndShowValue={videoHideAndShow}
                      key={room.localParticipant.sid}
                      participant={room.localParticipant}
                    />
                  </div>
                </>
              ) : (
                <div className="connecting-text">
                  <p className="text">Connecting to Video Call...</p>
                  <button className="red-call" onClick={props.endVideoCall}>
                    {props.loading ? <div className="loader"></div> : null}
                    Cancel
                  </button>
                </div>
              )}
            </>
          );
        }
      })()}
    </div>
  );
};

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateLocation: updateLocation,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoRoom);
