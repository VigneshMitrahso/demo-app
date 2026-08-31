import React, { Fragment, useEffect, useState } from "react";
// import Routes from "./router";
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
// import * as Ably from "ably";
// import { AblyProvider, ChannelProvider } from "ably/react";
import { MeetingAppProvider } from "./components/azure-video/MeetingAppContextDef";
import { VideoCallScreen } from "./VideoCallScreen";

// Import all CSS files
import './App.css';
import './index.css';
import './assets/styles/common.css';
import './components/analytics-landing-page/analytics-landing.css';
import './components/analytics-screen/styles.css';
import './components/azure-video/styles.css';
import './components/calculator/style.css';
import './components/filter/filter.css';
import './components/geoTracking/styles.css';
import './components/header/header.css';
import './components/landing-page/landing.css';
import './components/loader/loader.css';
import './components/map-screen/map.css';
import './components/path-box/styles.css';
import './components/pdf/pdf.css';
import './components/popup-details/popupDetails.css';
import './components/popup-valuation-details/popupDetails.css';
import './components/ppi-barchart/ppi-chart.css';
import './components/ppi-filter/ppi-filter.css';
import './components/property-report-pdf/index.css';
import './components/rapidWeb/VideoCall/styles.css';
import './components/report/styles.css';
import './components/reports-data/styles.css';
import './components/servey-report/styles.css';
import './components/side-bar/side-bar.css';
import './components/users-page/styles.css';
import './components/valuation-filter/Autocomplete.css';
import './components/valuation-filter/valuation-filter.css';
import './components/vendor/styles.css';
import './components/videoMemo/videoMemo.css';
import './components/voiceMemo/voiceMemo.css';
import './containers/advareportTAT/styles.css';
import './containers/analytics/analytics.css';
import './containers/automated-valuation/valuation.css';
import './containers/dash-board/dashBoard.css';
import './containers/history-layout/history.css';
import './containers/login/logIn.css';
import './containers/property-price-index/ppi.css';
import './containers/rapidWeb/styles.css';
import './containers/reports-analytics/styles.css';
import './containers/users/styles.css';
import './containers/video-call/vide.css';
import './public-screen/not-found/not-found.css';
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
  // const client = new Ably.Realtime({
  //   key: "MnLrtg.SgE_JQ:gdNMGCjfgbEQULQsra39cLc1E2YxjfWi_OH4YisD5is",
  // });
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
    {/* <AblyProvider client={client}> */}
      {/* <ChannelProvider channelName="get-started"> */}
      <div className="app-shell">
      <Header />
      {route === 'videocall' ? (
        <VideoCallScreen roomId={roomId} apiresponse={apiresponse} />
      ) : (
        <HomeScreen onEnterRoom={navigateToVideoCall} />
      )}
    </div>    
      {/* </ChannelProvider> */}
    {/* </AblyProvider> */}
    </MeetingAppProvider>

  </Fragment>
  
  );
};

export default App;
