import React, { Component } from "react";
// components
import Header from "../../components/header";
import GeoTracker from "../../components/geoTracking";

class GeoTrackingCo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { sideBarShow } = this.state;
    return (
      <div className="geo-tracking-container">
        <Header
          sideBarCallBack={() => {
            this.setState({
              sideBarShow: !sideBarShow,
            });
          }}
          link="/landingPage"
        />
        <div className="agent-travel-data">
          <GeoTracker />
        </div>
      </div>
    );
  }
}

export default GeoTrackingCo;
