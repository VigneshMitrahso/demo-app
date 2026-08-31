import React, { Component } from "react";
import { GOOGLE_MAP_API_KEY } from "../../comman/constants";
// plugins
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Circle,
  Polygon,
} from "google-maps-react";

import PopupValuationDetails from "../popup-valuation-details";

const darkBlueColor = {
  url: require("../../assets/images/home-dark-blue.png"),
};
const orangecolor = {
  url: require("../../assets/images/home-yellow.png"), // url
};
class ValuationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      popup: "",
    };
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true,
      popup: props.name,
    });
  };

  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });
  };

  render() {
    const { popup } = this.state;
    const {
      zoomLevel,
      centroid,
      approvalValuationData,
      approvalAnalyticsData,
      radius,
      appraiserate,
    } = this.props;
    return (
      <div className="valuation-map">
        <Map
          google={this.props.google}
          initialCenter={centroid}
          center={centroid}
          zoom={zoomLevel}
        >
          {approvalValuationData.map((data, id) => {
            var kioskLocation = JSON.parse([data.geocoded_location]);
            var coordinates = {
              lat: kioskLocation["coordinates"][1],
              lng: kioskLocation["coordinates"][0],
            };
            var approvalValuation = approvalValuationData.map(
              (data) => data.data.approval_number,
            );
            var approvalValuationanCurrent = approvalAnalyticsData.map(
              (data) => data.approval_number,
            );
            if (data.data.approval_number === approvalValuationanCurrent[0]) {
              var iconShow = orangecolor;
            } else {
              var iconShow = darkBlueColor;
            }
            // if (data.property_type === "COMMERCIAL") {
            //   var iconShow = skyBlueColor;
            // } else if (data.property_type === "INDUSTRIAL") {
            //   var iconShow = purplecolor;
            // } else if (data.property_type === "RESIDENTIAL") {
            //   var iconShow = orangecolor;
            // }

            // if (appraiserate) {
            return (
              <Marker
                name={data}
                icon={iconShow}
                position={coordinates}
                key={`maker${id}`}
                ref={this.onMarkerMounted}
                onClick={this.onMarkerClick}
              ></Marker>
            );
            // } else {
            //   return (
            // <Marker
            //   position={coordinates}
            //   icon={transPng}
            //   label={`${data.data.appraised_rate}`}
            //   zIndex={99999}
            //   fontSize={20}
            //   fontWeight="bold"
            // />
            //   );
            // }
          })}
          {(() => {
            if (radius !== 0) {
              return (
                <Circle
                  radius={radius}
                  center={centroid}
                  strokeColor="#336366"
                  strokeWeight={2}
                  fillColor="transparent"
                  strokeOpacity="0.8"
                  fillOpacity="0.3"
                />
              );
            } else {
              return null;
            }
          })()}

          <InfoWindow
            marker={this.state.activeMarker}
            onClose={this.onInfoWindowClose}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <div id="iwc" />
              <PopupValuationDetails popupDesc={popup} />
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_API_KEY,
})(ValuationMap);
