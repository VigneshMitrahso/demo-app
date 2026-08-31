import React, { Component } from "react";
import GooglePlacesAutocomplete, {
  getLatLng,
  geocodeByAddress,
} from "react-google-places-autocomplete";
import { decryptStatic } from "../../comman/decodeEncodeData";
import { _getStorageValue } from "../../comman/localStorage";
import { AES_KEY } from "../../comman/constants";
import { PopupLocationTrackingDetails } from "./locationTrackingPopup";

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

const person = {
  url: require("../../assets/images/pin-2.png"),
};
class locationtrackingMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      popup: "",
      agent_name: "",
      aesKey: "",
    };
  }

  onMarkerClick = (props, marker) => {
    const agentName = "";
    if (!this.props.isUsers) {
      _getStorageValue(AES_KEY).then((key) => {
        this.setState({ aesKey: key });
        this.setState({
          agent_name: decryptStatic(props.name.agent_name, key),
        });
      });
      this.setState({
        activeMarker: marker,
        selectedPlace: props,
        showingInfoWindow: true,
        popup: props.name,
        agent_name: this.state.agent_name,
      });
    } else {
      this.setState({
        activeMarker: marker,
        selectedPlace: props,
        showingInfoWindow: true,
        popup: { ...props.name, ...this.props.userData },
        agent_name: this.state.agent_name,
      });
    }
  };

  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });
  };

  getPlacesID(e) {
    var placeid = e.value.description;
    geocodeByAddress(placeid)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.props.geoCentroid({ lat, lng });
      });
  }

  render() {
    const { popup, agent_name } = this.state;
    const {
      zoomLevel,
      centroid,
      locationTrackingData,
      isUsers = false,
    } = this.props;
    return (
      <div className="location-tracking-map">
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_MAP_API_KEY}
          selectProps={{
            onChange: (e) => {
              this.getPlacesID(e);
            },
          }}
        />
        {!!this.props.google && (
          <div className="map-sections">
            <Map
              google={this.props.google}
              initialCenter={centroid}
              center={centroid}
              zoom={zoomLevel}
            >
              {locationTrackingData.map((data, id) => {
                var coordinates = {
                  lat: data.latitude,
                  lng: data.longitude,
                };
                var iconShow = person;
                return (
                  <Marker
                    name={data}
                    icon={iconShow}
                    key={`maker${id}`}
                    position={coordinates}
                    ref={this.onMarkerMounted}
                    onClick={this.onMarkerClick}
                  />
                );
              })}

              <InfoWindow
                marker={this.state.activeMarker}
                onClose={this.onInfoWindowClose}
                visible={this.state.showingInfoWindow}
              >
                <div>
                  <div id="iwc" />
                  <PopupLocationTrackingDetails
                    popupDesc={popup}
                    userData={agent_name}
                    isUsers={isUsers}
                  />
                </div>
              </InfoWindow>
            </Map>
          </div>
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_API_KEY,
})(locationtrackingMap);
