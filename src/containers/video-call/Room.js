import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import LocalParticipant from "./LocalParticipant";
import { logErrors } from "../../comman/connect";
import { _getStorageValue } from "../../comman/localStorage";
import { ACCESS_TOKEN } from "../../comman/constants";
import { toast } from "react-toastify";

const Room = ({
  roomName,
  token,
  joinCall,
  endCall,
  welcomeScreen,
  joinCallLoaderRoom,
  reJoinScreen,
  videoStatus,
}) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [videoHideAndShow, setVideoHideAndShow] = useState(true);
  const [audioHideAndShow, setaudioHideAndShow] = useState(true);
  const [videoRoomLoader, setVideoRoomLoader] = useState(false);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    };

    if (videoStatus) {
      Video.connect(token, {
        name: roomName,
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
          _getStorageValue(ACCESS_TOKEN).then((token) => {
            logErrors("join call", error, token, "{}");
          });
        },
      );
    } else {
      navigator.getMedia =
        navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

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
  }, [roomName, token]);

  const remoteParticipants = participants.map((participant) => {
    return <Participant key={participant.sid} participant={participant} />;
  });

  return (
    <div className="customer-back-sec mrg-top30 ">
      {(() => {
        if (reJoinScreen) {
          return (
            <div className="local-participant">
              <div className="video-call-profile">
                <div className="user-icon">
                  <img
                    src={require("../../assets/images/user.png")}
                    alt="user"
                  />
                </div>
              </div>
              <div className="join-call-menu">
                <button onClick={joinCall}>
                  {videoRoomLoader ? <div className="loader"></div> : null}
                  Rejoin Call
                </button>
                <button className="red-call" onClick={endCall}>
                  {joinCallLoaderRoom ? <div className="loader"></div> : null}
                  Cancel
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              {room ? (
                <div>
                  <div className="local-participant">
                    <div className="video-call-profile hide-video-call">
                      {remoteParticipants}
                    </div>
                    <div className="join-call-menu">
                      <button className="red-call" onClick={endCall}>
                        {joinCallLoaderRoom ? (
                          <div className="loader"></div>
                        ) : null}
                        End Call
                      </button>
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
                </div>
              ) : (
                <div className="local-participant">
                  <div className="video-call-profile">
                    <div className="user-icon">
                      {(() => {
                        if (!videoHideAndShow && !audioHideAndShow) {
                          return (
                            <img
                              src={require("../../assets/images/audio-video.png")}
                              alt="user"
                            />
                          );
                        } else if (!audioHideAndShow) {
                          return (
                            <img
                              src={require("../../assets/images/mute.png")}
                              alt="user"
                            />
                          );
                        } else if (!videoHideAndShow) {
                          return (
                            <img
                              src={require("../../assets/images/no-video.png")}
                              alt="user"
                            />
                          );
                        } else {
                          return (
                            <img
                              src={require("../../assets/images/user.png")}
                              alt="user"
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                  <div className="join-call-menu">
                    <button
                      onClick={() => {
                        joinCall();
                        setVideoRoomLoader(true);
                      }}
                      className="green"
                    >
                      {videoRoomLoader ? <div className="loader"></div> : null}
                      Join Call
                    </button>
                    <button className="red-call" onClick={endCall}>
                      {joinCallLoaderRoom ? (
                        <div className="loader"></div>
                      ) : null}
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }
      })()}
    </div>
  );
};

export default Room;
