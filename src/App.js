import React, { Fragment, useEffect, useState } from "react";
import Routes from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../node_modules/toastr/build/toastr.css";
// import "~slick-carousel/slick/slick.css";
// import "../node_modules/slick-carousel/";
// import "../node_modules/";
// import "~slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { MeetingAppProvider } from "./components/azure-video/MeetingAppContextDef";
import './App.css';
import { VideoCallScreen } from "./VideoCallScreen";
import './App.css';
import './index.css';

const routes = {
  home: '/home',
  videocall: '/videocall',
}

function getRouteFromPath(pathname) {
  return pathname === routes.videocall ? 'videocall' : 'home'
}

function Header() {
  return (
    <header className="app-header">
      <h1>DEMO</h1>
    </header>
  )
}

function HomeScreen({ onEnterRoom }) {
  const [roomId, setRoomId] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onEnterRoom(roomId.trim())

  }

  return (
    <main className="screen screen-centered">
      <form className="room-card" onSubmit={handleSubmit}>
        <label htmlFor="room-id">Enter The Room ID</label>
        <input
          id="room-id"
          name="roomId"
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          pattern="[A-Za-z0-9]{1,20}"
          required
          title="Please enter a code." 
        />
        <button style={{backgroundColor:'#2A5DA8'}} type="submit">Enter</button>
      </form>
    </main>
  )
}

const App = () => {
  const client = new Ably.Realtime({
    key: "MnLrtg.SgE_JQ:gdNMGCjfgbEQULQsra39cLc1E2YxjfWi_OH4YisD5is",
  });
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname))
  const [roomId, setRoomId] = useState('')
  const [apiresponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!Object.values(routes).includes(window.location.pathname)) {
      window.history.replaceState({}, '', routes.home)
    }

    function handlePopState() {
      setRoute(getRouteFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  async function navigateToVideoCall(nextRoomId) {
    setIsLoading(true);
    await fetch(`https://dev.api.rapid.satsure.co/v1/user/public/video-call?room_id=${nextRoomId}`)
      .then((response) => response.json())
      .then((data) => { 
        setRoomId(nextRoomId)
        setApiResponse(data);
        window.history.pushState({}, '', routes.videocall)
        setRoute('videocall')
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }


  return (
    <Fragment>
    <MeetingAppProvider>
    <AblyProvider client={client}>
      <ChannelProvider channelName="get-started">
      <div className="app-shell">
      <Header />
      {route === 'videocall' ? (
        <VideoCallScreen roomId={roomId} apiresponse={apiresponse} />
      ) : (
        <HomeScreen onEnterRoom={navigateToVideoCall} />
      )}
    </div>      </ChannelProvider>
    </AblyProvider>
    </MeetingAppProvider>

  </Fragment>
  
  );
};

export default App;
