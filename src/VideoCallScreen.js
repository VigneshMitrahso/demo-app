import { MeetingProvider,useMeeting, useParticipant } from "@videosdk.live/react-sdk";
// import { MeetingAppProvider } from "./MeetingAppContextDef";
// import { MeetingContainer } from "./azure-video/meeting/MeetingContainer.jsx";
import {useEffect, useState} from "react";
import { MeetingAppProvider } from "./components/azure-video/MeetingAppContextDef";
import { MeetingContainer } from "./components/azure-video/meeting/MeetingContainer";
// import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';

export function VideoCallScreen({ roomId,apiresponse }) {
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
  const [isJoined, setIsJoined] = useState(true);

  const {data } = apiresponse || {};

  // useConnectionStateListener("connected", () => {
  //   console.log("Connected to Ably!");
  // });

    // const { channel } = useChannel("get-started", "first", (message) => {
    //   // if(message.data === "Start"){
    //   //   setScreenSharing(true);
    //   // }else if(message.data === "Stop"){
    //   //   setScreenSharing(false);
    //   // }
    // });



  return (
    <main className="screen videocall-screen">
      <section className="video-stage">
        {/* <h2>Video Call</h2>
        {roomId ? <p>Room ID: {roomId}</p> : <p>Room ID not provided</p>} */}
        <div style={{width:'100%', height:'100%'}}>
        <MeetingAppProvider>

            <MeetingProvider
              config={{
                meetingId:data[0].video_call_room_id,
                micEnabled: micOn,
                webcamEnabled: webcamOn,
                name: data[0].room_id,
                multiStream: true,
                // customCameraVideoTrack: customVideoStream,
                // customMicrophoneAudioTrack: customAudioStream,      
                // participantId:"srm9-rkhz-9qwc",
              }}
              token={
                data[0].token
              }
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
                  setIsJoined(true);
                }}
                setIsMeetingLeft={setIsMeetingLeft}
                isCapture={capture}
                imageCallback={()=>{}}
              />
            </MeetingProvider>
        </MeetingAppProvider>
        </div>

        { isJoined &&(
          <div className="filter-Button call_list_container">
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
                backgroundColor: "white",
                color: "black",
              }}
              className="report"
              onClick={() => {
                // channel.publish('first', 'Add_corner');
              }}
            >
              Add Corner
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
                backgroundColor: "white",
                color: "black",
              }}
              className="report"
              onClick={() => {
                // channel.publish('first', 'undo');
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
                backgroundColor: "white",
                color: "black",
              }}
              className="report"
              onClick={() => {
                // channel.publish('first', 'add_room');
              }}
            >
              Add Room
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
                backgroundColor: "white",
                color: "black",
              }}
              className="report"
              onClick={() => {
                // channel.publish('first', 'finish_measurement');
              }}
            >
              Finish measurement
            </button>
          
          </div>
        )}
      </section>
    </main>
  )
}