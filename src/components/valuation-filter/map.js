import React, { useState } from "react";
import {
  Map,
  Marker,
  InfoWindow,
  Polygon,
  Polyline,
  GoogleApiWrapper,
} from "google-maps-react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../loader";
import { GOOGLE_MAP_API_KEY } from "../../comman/constants";

const iciciPin = { url: require("../../assets/images/pin-1.png") };
const customPin = { url: require("../../assets/images/pin-2.png") };
const propertyPin = { url: require("../../assets/images/pin-3.png") };
const marketPin = { url: require("../../assets/images/pin-4.png") };
const circlecolor = { url: require("../../assets/images/circle-16.png") };
const locationPin = { url: require("../../assets/images/marker.png") };

const MapComp = ({ coordinates, markPropertyData, google }) => {
  // State variables
  const [measurementStatus, setMeasurementStatus] = useState(false);
  const [polygonStatus, setPolygonStatus] = useState(false);
  const [directionValue, setDirectionValue] = useState([]);
  const [polygonArray, setPolygonArray] = useState([]);
  const [showDistancePopup, setShowDistancePopup] = useState(false);
  const [showPolyModel, setShowPolyModel] = useState(false);
  const [polygonValueStr, setPolygonValueStr] = useState("");
  const [polygonFeet, setPolygonFeet] = useState("");
  const [distanceValueStr, setDistanceValueStr] = useState("");
  const [timeValueStr, setTimeValueStr] = useState("");
  // State for selected marker
  const [uniqueString, setUniqueString] = useState("");
  const [activeMarker, setActiveMarker] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersVisible, setMarkersVisible] = useState(true);

  const iciciData = {
    address: "Address",
    age: "Age",
    land_area: "Land Area",
    land_rate: "Land Rate",
    date_of_transaction: "Date of transaction",
    distance_in_km: "Distance in Km",
    latitude: "Latitude",
    longitude: "Longitude",
    property_type: "Property type",
    sale_area: "Sale area",
    sale_rate: "Sale rate",
    unit_type: " Unit type",
  };
  const propertyData = {
    address: "Address",
    ageOfConstruction: "Age Of Construction",
    city: "City",
    createdAt: "Created At",
    // dataProvider: "Data Provider",
    dateOfListing: "Date Of Listing",
    distance_in_km: "Distance in km",
    landMark: "Land Mark",
    latitude: "Latitude",
    locality: "Locality",
    longitude: "Longitude",
    // moreDescription: 'More Description',
    nameOfProject: "Name Of Project",
    propertyType: "Property Type",
    ratePerSQFT: "Rate Per SQFT",
    reraId: "ReraId",
    salableAreaInSQFT: "Salable AreaIn SQFT",
    state: "State",
    totalAmount: "Total Amount",
    unitDetails: "Unit Details",
    updatedAt: "Updated At",
  };
  const marketData = {
    building_or_projectname: "Building or Project Name",
    type_of_property: "Property Type",
    type_of_unit: "Unit Type",
    location: "Location",
    pincode: "Pincode",
    street_name: "Street Name",
    land_area: "Land Area",
    land_rate: "Land Rate",
    sbua_area: "SBUA Area",
    sbua_rate: "SBUA Rate",
    bua_area: "BUA Area",
    bua_rate: "BUA Rate",
    carpet_area: "Carpet Area",
    carpet_rate: "Carpet Rate",
    transaction_or_quote: "Transaction or Quote",
    source_of_information: "Source of Information",
    contact_number: "Contact Number",
    date_of_entry: "Date of Entry",
  };

  // Combine Sale Property Data with fallback to empty arrays
  const iciciPropertyData = [
    ...(markPropertyData?.sale_property_data_0_2km_list || []),
    ...(markPropertyData?.sale_property_data_2_5km_list || []),
    ...(markPropertyData?.land_property_data_0_2km_list || []),
    ...(markPropertyData?.land_property_data_2_5km_list || []),
  ];
  const propertyPortalsData = [
    ...(markPropertyData?.sale_tst_0_2km || []),
    ...(markPropertyData?.sale_tst_2_5km || []),
    ...(markPropertyData?.tstData2km || []),
    ...(markPropertyData?.tstData2_5km || []),
  ];
  // Combine Land Market Data with fallback to empty arrays
  const marketTransationData = [
    ...(markPropertyData?.sale_market_transaction_0_2km_list || []),
    ...(markPropertyData?.sale_market_transaction_2_5km_list || []),
    ...(markPropertyData?.land_market_transaction_0_2km_list || []),
    ...(markPropertyData?.land_market_transaction_2_5km_list || []),
  ];

  // Handle click events on the map for polygon or measurement
  const polygonGetLoc = (ref, map, ev) => {
    const { latLng } = ev;
    const lat = latLng.lat();
    const lng = latLng.lng();
    const point = { lat, lng };

    if (polygonStatus) {
      // Add to polygon array only if in polygon mode
      setPolygonArray((prev) => [...prev, point]);
    } else if (measurementStatus) {
      // Handle measurement mode
      getDirection(point);
    }
  };

  // Toggle measurement mode
  const handleMeasureToggle = () => {
    setMeasurementStatus((prev) => !prev);
    setPolygonStatus(false);
    resetPolygonAndDirection();
  };

  // Toggle polygon mode
  const handlePolygonToggle = () => {
    setPolygonStatus((prev) => !prev);
    setMeasurementStatus(false);
    resetPolygonAndDirection();
  };

  // Reset direction and polygon data
  const resetPolygonAndDirection = () => {
    setDirectionValue([]);
    setPolygonArray([]);
  };

  // Get Direction for distance measurement
  const getDirection = (point) => {
    // Allow only two points for measuring distance
    if (directionValue.length < 2) {
      setDirectionValue((prev) => [...prev, point]);
      // If two points are selected, show the route
      if (directionValue.length === 1) {
        showDirection();
      }
    } else {
      // Reset if trying to add more than two points
      setDirectionValue([point]); // Start again with the new point
    }
  };

  // Show directions and calculate distance
  const showDirection = () => {
    calculateAndDisplayRoute(directionValue);
  };

  // Google Maps Directions
  const calculateAndDisplayRoute = (directionArr) => {
    const { google } = window;
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    directionsDisplay.setMap(google.maps.Map); // Ensure this refers to your map instance

    directionsService.route(
      {
        origin: directionArr[0],
        destination: directionArr[1],
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
          setDistanceValueStr(response.routes[0].legs[0].distance.text);
          setTimeValueStr(response.routes[0].legs[0].duration.text);
          setShowDistancePopup(true);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      },
    );
  };

  // Show polygon area
  const showPolygon = () => {
    if (polygonArray.length > 2) {
      const coordinates = polygonArray.map(({ lat, lng }) => [
        parseFloat(lat),
        parseFloat(lng),
      ]);
      coordinates.push(coordinates[0]); // Closing the polygon

      const coordData = {
        type: "Feature",
        properties: { name: "Polygon" },
        geometry: { type: "Polygon", coordinates: [coordinates] },
      };

      if (isValidGeoJSON(coordData)) {
        const google = window.google;
        const polygon = new google.maps.Polygon({
          path: polygonArray,
          map: google,
        });

        const areaInSqMeters = google.maps.geometry.spherical.computeArea(
          polygon.getPath(),
        );
        const areaInSqFeet = (areaInSqMeters * 10.7639).toFixed(2);

        setPolygonValueStr(areaInSqMeters);
        setPolygonFeet(areaInSqFeet);
        setShowPolyModel(true);
      } else {
        toast.error("Invalid Polygon", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      toast.error("Invalid Polygon", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const isValidGeoJSON = (feature) => {
    if (!feature || feature.type !== "Feature") {
      return false;
    }

    const geometry = feature.geometry;
    if (!geometry || !geometry.type) {
      return false;
    }

    const validGeometryTypes = [
      "Point",
      "LineString",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
      "GeometryCollection",
      "FeatureCollection",
    ];

    if (!validGeometryTypes.includes(geometry.type)) {
      return false;
    }

    return true;
  };

  // Reset measurement state
  const resetMeasure = () => {
    resetPolygonAndDirection();
    setMeasurementStatus(false);
    setShowDistancePopup(false);
  };

  // Reset polygon state
  const resetPolygon = () => {
    setPolygonArray([]);
    setPolygonStatus(false);
    setShowPolyModel(false);
  };

  // Function to handle marker click
  const handleMarkerClick = (markerData, marker, uniqueString) => {
    setUniqueString(uniqueString);
    setActiveMarker(marker);
    setSelectedMarker(markerData);
    setShowingInfoWindow(true);
  };

  // Function to close the InfoWindow
  const onInfoWindowClose = () => {
    setActiveMarker(null);
    setShowingInfoWindow(false);
  };

  return (
    <>
      {/* Measure Distance Button */}
      <div
        className={`measure-icon ${measurementStatus ? "active-marker" : ""}`}
        onClick={handleMeasureToggle}
      >
        <label>
          <img src={require("../../assets/images/icons.png")} alt="icon" />
          Measure Distance
        </label>
        <img src={require("../../assets/images/scale.png")} alt="edit" />
      </div>

      {/* Measure Polygon Button */}
      <div
        className={`polygon-icon ${polygonStatus ? "active-marker" : ""}`}
        onClick={handlePolygonToggle}
      >
        <label>
          <img src={require("../../assets/images/icons.png")} alt="icon" />
          Measure Polygon
        </label>
        <img src={require("../../assets/images/polygon.png")} alt="edit" />
      </div>

      {/* Action Buttons */}
      {measurementStatus && (
        <>
          <div className="go-icon" onClick={showDirection}>
            <img src={require("../../assets/images/tick.png")} alt="confirm" />
          </div>
          <div className="wrong-icon" onClick={resetMeasure}>
            <img
              src={require("../../assets/images/close-button.png")}
              alt="cancel"
            />
          </div>
        </>
      )}

      {polygonStatus && (
        <>
          <div className="go-icon" onClick={showPolygon}>
            <img src={require("../../assets/images/tick.png")} alt="confirm" />
          </div>
          <div className="wrong-icon" onClick={resetPolygon}>
            <img
              src={require("../../assets/images/close-button.png")}
              alt="cancel"
            />
          </div>
        </>
      )}

      <div className="marker-toggle">
        <BootstrapSwitchButton
          checked={markersVisible}
          value={markersVisible}
          onlabel="Off"
          onstyle="danger"
          offlabel="On"
          offstyle="success"
          style="w-10 mx-2"
          onChange={() => setMarkersVisible((prev) => !prev)}
        />
      </div>
      {/* Google Map Component */}
      {google && coordinates.lat && (
        <Map
          google={google}
          style={{ height: "calc(100vh - 196px)" }}
          mapType="hybrid"
          initialCenter={coordinates}
          center={coordinates}
          onClick={polygonGetLoc}
        >
          <Marker icon={customPin} position={coordinates} />

          {markersVisible &&
            iciciPropertyData.map((data, id) => {
              const iciciCoordinates = {
                lat: data.latitude,
                lng: data.longitude,
              };
              return (
                <Marker
                  position={markersVisible ? iciciCoordinates : null}
                  icon={iciciPin}
                  key={`marker${id}`}
                  onClick={(props, marker) =>
                    handleMarkerClick(data, marker, `icici`)
                  }
                />
              );
            })}

          {markersVisible &&
            propertyPortalsData.map((data, id) => {
              const propetrycoordinates = {
                lat: data.latitude,
                lng: data.longitude,
              };
              return (
                <Marker
                  position={markersVisible ? propetrycoordinates : null}
                  icon={propertyPin}
                  key={`marker${id}`}
                  onClick={(props, marker) =>
                    handleMarkerClick(data, marker, `propertyPortals`)
                  }
                />
              );
            })}

          {markersVisible &&
            marketTransationData.map((data, id) => {
              const marketCoordinates = {
                lat: data.latitude,
                lng: data.longitude,
              };
              return (
                <Marker
                  position={markersVisible ? marketCoordinates : null}
                  icon={marketPin}
                  key={`marker${id}`}
                  onClick={(props, marker) =>
                    handleMarkerClick(data, marker, "marketTransation")
                  }
                />
              );
            })}

          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={onInfoWindowClose}
          >
            {/* uniqueString */}
            {selectedMarker ? (
              uniqueString === "icici" ? (
                <ul
                  className={`marker-info ${uniqueString === "icici" ? "icici" : ""}`}
                >
                  {Object.keys(iciciData).map((key) => {
                    return (
                      <li key={key}>
                        <label>{iciciData[key]}</label>
                        <span>
                          {selectedMarker[key] ? selectedMarker[key] : "-"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : uniqueString === "propertyPortals" ? (
                <ul
                  className={`marker-info ${uniqueString === "propertyPortals" ? "propertyPortals" : ""}`}
                >
                  {Object.keys(propertyData).map((key) => {
                    return (
                      <li key={key}>
                        <label>{propertyData[key]}</label>
                        <span>
                          {selectedMarker[key] ? selectedMarker[key] : "-"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : uniqueString === "marketTransation" ? (
                <ul
                  className={`marker-info ${uniqueString === "marketTransation" ? "marketTransation" : ""}`}
                >
                  {Object.keys(marketData).map((key) => {
                    return (
                      <li key={key}>
                        <label>{marketData[key]}</label>
                        <span>
                          {selectedMarker[key] ? selectedMarker[key] : "-"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null
            ) : null}
          </InfoWindow>
          {polygonArray.map((data, id) => (
            <Marker position={data} icon={circlecolor} key={`marker${id}`} />
          ))}
          {directionValue.map((data, id) => (
            <Marker position={data} icon={locationPin} key={`marker${id}`} />
          ))}

          {/* Draw Polyline for measuring distance */}
          {directionValue.length === 2 && (
            <Polyline
              paths={directionValue}
              strokeColor="#FF0000"
              strokeOpacity={1.0}
              strokeWeight={2}
            />
          )}

          {/* Draw Polygon Lines */}
          {polygonArray.length > 2 && (
            <Polygon
              paths={polygonArray}
              strokeColor="#656262"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#656262"
              fillOpacity={0.35}
            />
          )}
        </Map>
      )}
      <ul className="map-legend">
        <li className="icici_legend">ICICI</li>
        <li className="pp_legend">Property Portals</li>
        <li className="mt_legend"> Market Transaction</li>
      </ul>
      {/* Modal for Polygon Area */}
      <Modal
        size="sm"
        show={showPolyModel}
        onHide={() => setShowPolyModel(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>Polygon Area</Modal.Header>
        <Modal.Body>
          <p>{polygonFeet} (Sq.ft)</p>
          <p>{polygonValueStr} (Sq.m)</p>
        </Modal.Body>
      </Modal>

      {/* Modal for Distance & Time */}
      <Modal
        size="sm"
        show={showDistancePopup}
        onHide={() => setShowDistancePopup(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>Distance & Time</Modal.Header>
        <Modal.Body>
          <div>
            <span>Distance: </span>
            <label>{distanceValueStr}</label>
          </div>
          <div>
            <span>Time: </span>
            <label>{timeValueStr}</label>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

// Redux connection and mapStateToProps
const mapStateToProps = (state) => ({
  serveyReportData: {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

const LoadingContainer = () => <Loader />;

const enhance = compose(
  GoogleApiWrapper({
    apiKey: GOOGLE_MAP_API_KEY,
    LoadingContainer,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(MapComp);
