import React, { useState, useEffect, useRef } from "react";
import Track from "./Track";
import "./vide.css";
import Video from "twilio-video";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { ContactSupportOutlined } from "@material-ui/icons";
const LocalParticipant = ({
  participant,
  audioHideAndShowvalue,
  videoHideAndShowValue,
}) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [videoHideAndShow, setVideoHideAndShow] = useState(true);
  const [audioHideAndShow, setAudioHideAndShow] = useState(true);
  const [audioTracks, setAudioTracks] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [devices, setDevices] = useState([]);
  const [cameraMode, setCameraMode] = useState(0);
  const [cameraFacing, setCameraFacing] = useState("");

  const videoRef = useRef();
  const audioRef = useRef();

  const trackSubscribed = (track) => {
    if (track.kind === "video") {
      setVideoTracks((videoTracks) => [...videoTracks, track]);
    } else if (track.kind === "audio") {
      setAudioTracks((audioTracks) => [...audioTracks, track]);
    }
  };

  const trackUnsubscribed = (track) => {
    if (track.kind === "video") {
      setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
    } else if (track.kind === "audio") {
      setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
    }
  };

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  let currentStream;

  // const stopMediaTracks =(stream) => {
  //   stream.getTracks().forEach(track => {
  //     track.stop();
  //   });
  // }
  useEffect(async() => {
   await  navigator.mediaDevices.enumerateDevices().then(gotDevices);
  }, []);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));
    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  //attach video track
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  //attach audio track
  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  //get media devices
  const gotDevices = (mediaDevices) => {
    let devices = [];
    mediaDevices.forEach((mediaDevice) => {
      if (mediaDevice.kind === "videoinput") {
        devices.push(mediaDevice);
      }
    });
    setDevices(devices);
  };

  // function attachTracks(track) {
  //       track.attach(videoRef.current)
  // }

  // const detachTracks = (tracks) => {
  //   tracks.forEach(function(track) {
  //     if (track) {
  //       track.detach()
  //     }
  //   });
  // }

  //stop current track
  const stopTracks = (tracks) => {
    tracks.forEach(function (track) {
      track.stop();
    });
  };

  //toggle camera devices
  const onCameraChange = (e) => {
    e.persist();
    // if (typeof currentStream !== 'undefined') {
    //   let track = Array.from(participant.tracks.values());
    //   participant.unPublishTrack(track);
    // }
    const tracks = Array.from(participant.videoTracks.values()).map(
      function (trackPublication) {
        return trackPublication.track;
      },
    );
    let currentTrack = trackpubsToTracks(participant.videoTracks);
    trackUnsubscribed(currentTrack[0]);
    participant.unpublishTracks(currentTrack);
    stopTracks(tracks);

    Video.createLocalVideoTrack({ deviceId: { exact: e.target.value } })
      .then(function (localVideoTrack) {
        trackSubscribed(localVideoTrack);
        participant.publishTrack(localVideoTrack);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // navigator.mediaDevices
  //   .getUserMedia(constraints)
  //   .then(stream => {
  //     currentStream = stream;
  //     participant.publishTrack(stream);
  //     videoRef.current.srcObject = stream;
  //     return navigator.mediaDevices.enumerateDevices();
  //   })
  //   .then(gotDevices)
  //   .catch(error => {
  //     console.error(error);
  //   });
  // }

  //mute/unmute audio track
  const toggleAudioTrack = () => {
    Array.from(participant.tracks.values())
      .map((publication) => publication.track)
      .filter((track) => {
        if (track.kind === "audio") {
          if (audioHideAndShow) {
            track.disable();
            setAudioHideAndShow(!audioHideAndShow);
          } else {
            track.enable();
            setAudioHideAndShow(!audioHideAndShow);
          }
        }
      });
  };

  const toggleVideoTrack = () => {
    Array.from(participant.tracks.values())
      .map((publication) => publication.track)
      .filter((track) => {
        if (track.kind === "video") {
          if (videoHideAndShow) {
            track.disable();
            setVideoHideAndShow(!videoHideAndShow);
          } else {
            track.enable();
            setVideoHideAndShow(!videoHideAndShow);
          }
        }
        // else {
        //   track.enable();
        //   setVideoHideAndShow(!videoHideAndShow);
        // }
      });
  };

  return (
    <>
      <div className="av-sec">
        {videoHideAndShowValue ? (
          <select
            style={{
              borderRadius: 5,
              backgroundColor: "#053c6d",
              color: "#fff",
              border: "none",
            }}
            onChange={onCameraChange}
          >
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        ) : null}
        {audioHideAndShowvalue ? (
          <div className="option-button">
            <FontAwesomeIcon
              icon={audioHideAndShow ? faMicrophone : faMicrophoneSlash}
              onClick={toggleAudioTrack}
              color="#fff"
              size="lg"
            />
          </div>
        ) : null}

        {videoHideAndShowValue ? (
          <div className="option-button">
            <FontAwesomeIcon
              icon={videoHideAndShow ? faVideo : faVideoSlash}
              onClick={toggleVideoTrack}
              color="#fff"
              size="lg"
            />
          </div>
        ) : null}
      </div>
      <div className="customer-video">
        <video
          ref={videoRef}
          autoPlay={true}
          width="480"
          height="640"
          className="video-room"
        />
        <audio ref={audioRef} autoPlay={true} />
      </div>
    </>
  );
};

export default LocalParticipant;
