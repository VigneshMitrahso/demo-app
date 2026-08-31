import React, { Component } from "react";
import { upperCase, isEmpty } from "lodash";
// plugins
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Circle,
  Polygon,
} from "google-maps-react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { GOOGLE_MAP_API_KEY } from "../../comman/constants";

// component
import Loader from "../loader";
import PopupDetails from "../popup-details";

// css
import "./map.css";

const redcolor = {
  url: require("../../assets/images/pin.png"), // url
};

const bluecolor = {
  url: require("../../assets/images/pin-1.png"), // url
};

const circlecolor = {
  url: require("../../assets/images/circle-16.png"), // url
};

const blackColor = {
  url: require("../../assets/images/pin-black.png"),
};

const locationPin = {
  url: require("../../assets/images/marker.png"),
};

const skyBlueColor = {
  url: require("../../assets/images/home-blue.png"),
};

const purplecolor = {
  url: require("../../assets/images/home-purple.png"), // url
};

const orangecolor = {
  url: require("../../assets/images/home-yellow.png"), // url
};

const royalcolor = {
  url: require("../../assets/images/home-royal.png"), // url
};

const pinkcolor = {
  url: require("../../assets/images/home-pink.png"), // url
};

const skyBuildBlueColor = {
  url: require("../../assets/images/build-blue.png"),
};

const royalBuildColor = {
  url: require("../../assets/images/build-royal.png"),
};

const pinkBuildColor = {
  url: require("../../assets/images/build-pink.png"),
};

const purpleBuildcolor = {
  url: require("../../assets/images/build-purple.png"), // url
};

const orangeBuildcolor = {
  url: require("../../assets/images/build-yellow.png"), // url
};

const transPng = {
  url: require("../../assets/images/trans.png"), // url
};

const greenColor = {
  url: require("../../assets/images/crfg.png"),
};

const lvtColor = {
  url: require("../../assets/images/lvt.png"),
};

const LoadingContainer = (props) => <Loader />;

const isValidGeoJSON = (feature) => {
  if (!feature || feature.type !== "Feature") {
    console.error("Invalid feature type");
    return false;
  }

  const geometry = feature.geometry;
  if (!geometry || !geometry.type) {
    console.error("Invalid geometry");
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
    console.error("Invalid geometry type");
    return false;
  }

  return true;
};

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      mapLoaded: false,
      popup: {},
      directions: null,
      polygonShow: false,
      mapCerdintical: {},
      polygonArray: [],
      directionValue: [],
      disableMapIntract: true,
      redirect: false,
      editable: false,
      polygonStatus: false,
      measurmentStatus: false,
      measurPoly: false,
      measurDir: false,
      dirRespone: {},
      rerenderData: true,
      dirZoomCerdienctial: {},
      polygonValueStr: "",
      polygonFeet: "",
      distanceValueStr: "",
      timeValueStr: "",
      showPolyModel: false,
      showDistancePopup: false,
      gridHideShow: true,
      loaderMapTile: true,
    };
    this.handleMapReady = this.handleMapReady.bind(this);
  }

  componentDidUpdate(preProps, preState) {
    if (
      preProps.closeModal !== this.props.closeModal &&
      this.props.closeModal
    ) {
      this.onInfoWindowClose();
      this.props.setCloseModal();
    }
  }

  dragends = (mapProps, map) => {
    const {
      allowDrag,
      allowRadiusDrag,
      allowGrid,
      isFetchingSearchByRegion,
      isFetchingSearchByRadius,
      isFetchingGridStatus,
      gridCrentical,
    } = this.props;

    var loaderMap =
      isFetchingSearchByRegion ||
      isFetchingSearchByRadius ||
      isFetchingGridStatus;

    let ne = map.getBounds().getNorthEast();
    let sw = map.getBounds().getSouthWest();

    var drageUrl =
      "&bbox=" +
      ne.lng() +
      "%2C" +
      ne.lat() +
      "%2C" +
      sw.lng() +
      "%2C" +
      sw.lat() +
      "&zoom-level=" +
      map.getZoom();

    var gridUrl =
      "?bbox=" +
      ne.lng() +
      "%2C" +
      ne.lat() +
      "%2C" +
      sw.lng() +
      "%2C" +
      sw.lat();

    if (loaderMap) {
    } else {
      if (allowDrag) {
        this.props.dragRegionCallBack(drageUrl);
        if (map.getZoom() >= 13) {
          if (gridCrentical) {
            this.props.gridCallBack(gridUrl);
          }
        }
      } else if (allowRadiusDrag) {
        this.props.dragRadiusCallBack(drageUrl);
      }
    }

    this.props.branchDataCallBack(drageUrl);

    var setValueDir = {
      centerData: {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      },
      zoomData: map.getZoom(),
    };

    this.setState({
      dirZoomCerdienctial: setValueDir,
    });
  };

  zoomChanged = (mapProps, map) => {
    let ne = map.getBounds().getNorthEast();
    let sw = map.getBounds().getSouthWest();

    const {
      allowDrag,
      allowRadiusDrag,
      allowGrid,
      isFetchingSearchByRegion,
      isFetchingSearchByRadius,
      isFetchingGridStatus,
      gridCrentical,
    } = this.props;

    var loaderMap =
      isFetchingSearchByRegion ||
      isFetchingSearchByRadius ||
      isFetchingGridStatus;

    var zoomUrl =
      "&bbox=" +
      ne.lng() +
      "%2C" +
      ne.lat() +
      "%2C" +
      sw.lng() +
      "%2C" +
      sw.lat() +
      "&zoom-level=" +
      map.getZoom();

    var gridUrl =
      "?bbox=" +
      ne.lng() +
      "%2C" +
      ne.lat() +
      "%2C" +
      sw.lng() +
      "%2C" +
      sw.lat();

    if (loaderMap) {
    } else {
      if (allowDrag) {
        this.props.zoomRegionCallBack(zoomUrl);
        if (map.getZoom() >= 13) {
          if (gridCrentical) {
            this.props.gridZoomCallBack(gridUrl);
          }
        }
      } else if (allowRadiusDrag) {
        this.props.zoomRadiusCallBack(zoomUrl);
      }
    }
    this.props.branchzoomUrl(zoomUrl);

    var setValueDir = {
      centerData: {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      },
      zoomData: map.getZoom(),
    };

    this.setState({
      dirZoomCerdienctial: setValueDir,
    });
  };

  handleMapReady = (mapProps, map) => {
    this.setState({
      mapCerdintical: map,
      showingInfoWindow: false,
    });
  };

  calculateAndDisplayRoute(directionArr) {
    const { mapCerdintical, measurDir } = this.state;
    var google = window.google;
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    directionsDisplay.setMap(mapCerdintical);
    directionsDisplay.setOptions({ suppressMarkers: true });

    const origin = directionArr[0];
    const destination = directionArr[1];

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
          this.setState({
            distanceValueStr: response.routes[0].legs[0].distance.text,
            timeValueStr: response.routes[0].legs[0].duration.text,
          });
          setTimeout(() => {
            this.setState({
              showDistancePopup: true,
            });
          }, 200);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      },
    );
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

  polygonGetLoc = (ref, map, ev) => {
    const { measurPoly, measurDir, polygonStatus, measurmentStatus } =
      this.state;

    if (polygonStatus === true) {
      const latit = ev.latLng.lat();
      const long = ev.latLng.lng();

      var poly = [];

      var polyObj = {
        lat: latit,
        lng: long,
      };

      var poly = poly.concat(polyObj);

      this.getLoction(poly);
    } else if (measurmentStatus === true) {
      const latit = ev.latLng.lat();
      const long = ev.latLng.lng();

      var direct = [];

      var directObj = {
        lat: latit,
        lng: long,
      };

      var direct = direct.concat(directObj);

      this.getDirection(direct);
    }
  };

  getDirection(direct) {
    const { directionValue } = this.state;

    if (directionValue.length !== 2) {
      var directionArr = this.state.directionValue.concat(direct);
      this.setState({
        directionValue: directionArr,
      });
    }
  }

  getLoction(poly) {
    const { polygonShow } = this.state;

    var polyarr = this.state.polygonArray.concat(poly);

    this.setState({ polygonArray: polyarr });

    if (polyarr.length > 2) {
      this.setState({
        polygonShow: true,
      });
    } else {
      this.setState({
        polygonShow: false,
      });
    }
  }

  showDirection() {
    const { directionValue } = this.state;
    this.calculateAndDisplayRoute(directionValue);
  }

  closeDirPoly() {
    window.location.reload();
  }

  removerDir() {
    const { dirZoomCerdienctial } = this.state;
    this.setState({
      rerenderData: false,
    });

    setTimeout(() => {
      this.setState({
        rerenderData: true,
      });
    }, 100);

    this.props.zoomSetDir(dirZoomCerdienctial);
  }

  showPolyGon() {
    const { polygonArray, mapCerdintical } = this.state;

    if (polygonArray.length > 2) {
      var coord = [];

      for (let coor in polygonArray) {
        var data = polygonArray[coor];
        var innerArr = [parseFloat(data.lat), parseFloat(data.lng)];
        coord.push(innerArr);
      }

      coord.push(coord[0]);

      const coordData = {
        type: "Feature",
        properties: { name: "My non-simple hourglass-shaped geometry" },
        geometry: {
          type: "Polygon",
          coordinates: [coord],
        },
      };

      if (isValidGeoJSON(coordData)) {
        var google = window.google;

        var arr = [];

        for (let coor in polygonArray) {
          var data = polygonArray[coor];
          var innerArr = new google.maps.LatLng(
            parseFloat(data.lat),
            parseFloat(data.lng),
          );
          arr.push(innerArr);
        }

        var polygonRight = new google.maps.Polygon({
          path: arr,
          map: mapCerdintical,
        });

        var areaSelected = google.maps.geometry.spherical.computeArea(
          polygonRight.getPath(),
        );

        var squareMeters = parseFloat(areaSelected.toFixed(2));
        var squareFeet = (squareMeters * 10.7639).toFixed(2);

        this.setState({
          polygonValueStr: squareMeters,
          polygonFeet: squareFeet,
        });

        setTimeout(() => {
          this.setState({
            showPolyModel: true,
          });
        }, 200);
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
  }

  removeDuplicatesAndGroupData = (entries) => {
    const uniqueEntries = {};
    entries.forEach((entry) => {
      const {
        latitude,
        longitude,
        geocoded_location,
        category_type,
        property_type,
        unit_type,
      } = entry;
      const latLngKey = `${latitude},${longitude}`;

      if (!uniqueEntries[latLngKey]) {
        uniqueEntries[latLngKey] = {
          data: [{ ...entry }],
          latitude,
          longitude,
          geocoded_location,
          category_type,
          property_type,
          unit_type,
        };
      } else {
        uniqueEntries[latLngKey].data.push(entry);
      }
    });

    return Object.values(uniqueEntries);
  };

  render() {
    const {
      popup,
      polygonArray,
      polygonShow,
      directionValue,
      editable,
      polygonStatus,
      measurmentStatus,
      rerenderData,
      polygonValueStr,
      polygonFeet,
      showPolyModel,
      distanceValueStr,
      timeValueStr,
      showDistancePopup,
      gridHideShow,
      loaderMapTile,
    } = this.state;

    const {
      centroid,
      zoomLevel,
      latLongStatus,
      radius,
      searchByRegionData,
      searchByRadiusData,
      agencyData,
      branchData,
      isFetchingSearchByRegion,
      isFetchingSearchByRadius,
      isFetchingAgencyBranch,
      isFetchingGridStatus,
      gridData,
      propertyAppraiseRate,
      gridCrentical,
    } = this.props;

    var gridArray = [];

    for (let girdList in gridData) {
      var gridvalue = JSON.parse(gridData[girdList].gridGeometry);

      var gridSqure = gridvalue.coordinates[0];
      var data = [];

      for (let squList in gridSqure) {
        data.push({ lat: gridSqure[squList][1], lng: gridSqure[squList][0] });
      }
      gridArray.push(data);
    }

    var loaderMap =
      isFetchingSearchByRegion ||
      isFetchingSearchByRadius ||
      isFetchingGridStatus;

    return (
      <>
        <div
          className={`measure-icon ${
            measurmentStatus ? "active-marker" : null
          } `}
          onClick={() => {
            this.setState({
              measurmentStatus: !measurmentStatus,
              polygonStatus: false,
              measurDir: true,
              measurPoly: false,
              polygonArray: [],
            });
          }}
        >
          <label>
            <img src={require("../../assets/images/icons.png")} alt="icon" />
            Measure Distance
          </label>
          <img src={require("../../assets/images/scale.png")} alt="edit" />
        </div>
        <div
          className={`polygon-icon ${polygonStatus ? "active-marker" : null} `}
          onClick={() => {
            this.setState({
              polygonStatus: !polygonStatus,
              measurmentStatus: false,
              measurPoly: true,
              directionValue: [],
              measurDir: false,
              polygonArray: [],
            });
            this.removerDir();
          }}
        >
          <label>
            <img src={require("../../assets/images/icons.png")} alt="icon" />
            Measure Polygon
          </label>
          <img src={require("../../assets/images/polygon.png")} alt="edit" />
        </div>

        {measurmentStatus ? (
          <div
            className={`go-icon`}
            onClick={() => {
              this.showDirection();
            }}
          >
            <img src={require("../../assets/images/tick.png")} alt="edit" />
          </div>
        ) : null}

        {measurmentStatus ? (
          <div
            className={`wrong-icon`}
            onClick={() => {
              this.setState({
                directionValue: [],
                measurmentStatus: false,
                showDistancePopup: false,
              });
              this.removerDir();
            }}
          >
            <img
              src={require("../../assets/images/close-button.png")}
              alt="edit"
            />
          </div>
        ) : null}

        {polygonStatus ? (
          <div
            className={`go-icon`}
            onClick={() => {
              this.showPolyGon();
            }}
          >
            <img src={require("../../assets/images/tick.png")} alt="edit" />
          </div>
        ) : null}

        {polygonStatus ? (
          <div
            className={`wrong-icon`}
            onClick={() => {
              this.setState({
                polygonArray: [],
                polygonStatus: false,
                showPolyModel: false,
              });
            }}
          >
            <img
              src={require("../../assets/images/close-button.png")}
              alt="edit"
            />
          </div>
        ) : null}

        {(() => {
          if (rerenderData) {
            return (
              <Map
                google={this.props.google}
                initialCenter={centroid}
                center={centroid}
                zoom={zoomLevel}
                onClick={this.polygonGetLoc}
                onReady={this.handleMapReady}
                onDragend={this.dragends}
                onZoomChanged={this.zoomChanged}
                onTilesloaded={() => {
                  this.setState({ loaderMapTile: false });
                }}
              >
                {/* Grid Label */}
                {gridCrentical && !measurmentStatus && !polygonStatus
                  ? gridData.map((data, id) => {
                      var kioskLocation = JSON.parse([data.gridCentroid]);
                      var coordinates = {
                        lat: kioskLocation["coordinates"][1],
                        lng: kioskLocation["coordinates"][0],
                      };
                      return (
                        <Marker
                          position={coordinates}
                          icon={transPng}
                          label={{
                            text: `${data.gridId}`,
                            color: "#006667",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                          // label={{text:`${id}`,color:'#fff'}}
                          // zIndex={99999}
                          // fontSize={40}
                          // fontWeight="bold"
                        />
                      );
                    })
                  : null}
                {/* Grid Polygon */}
                {gridCrentical && !measurmentStatus && !polygonStatus
                  ? gridArray.map((data, id) => {
                      return (
                        <Polygon
                          paths={data}
                          strokeColor="#006667"
                          strokeOpacity={1}
                          strokeWeight={1}
                          fillColor="#006667"
                          fillOpacity={0}
                        />
                      );
                    })
                  : null}
                {branchData
                  .map((md) => ({ data: [md], ...md }))
                  .map((data, id) => {
                    var kioskLocation = JSON.parse([data.geocoded_location]);
                    var coordinates = {
                      lat: kioskLocation["coordinates"][1],
                      lng: kioskLocation["coordinates"][0],
                    };

                    if (data.property_type === "BRANCH") {
                      var iconShow = bluecolor;
                    } else if (data.property_type === "AGENCY") {
                      var iconShow = redcolor;
                    }

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
                  })}
                {agencyData
                  .map((md) => ({ data: [md], ...md }))
                  .map((data, id) => {
                    var kioskLocation = JSON.parse(data.geocoded_location);
                    if (isEmpty(kioskLocation)) return null;
                    var coordinates = {
                      lat: kioskLocation["coordinates"][1],
                      lng: kioskLocation["coordinates"][0],
                    };

                    if (upperCase(data.property_type) === "BRANCH") {
                      var iconShow = bluecolor;
                    } else if (upperCase(data.property_type) === "AGENCY") {
                      iconShow = redcolor;
                    }

                    return (
                      <Marker
                        name={data}
                        icon={iconShow}
                        position={coordinates}
                        key={`marker-${id}`}
                        ref={this.onMarkerMounted}
                        onClick={this.onMarkerClick}
                      ></Marker>
                    );
                  })}
                {this.removeDuplicatesAndGroupData(searchByRadiusData).map(
                  (data, id) => {
                    var kioskLocation = JSON.parse([data.geocoded_location]);
                    var coordinates = {
                      lat: kioskLocation["coordinates"][1],
                      lng: kioskLocation["coordinates"][0],
                    };

                    if (
                      data.property_type === "COMMERCIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = skyBlueColor;
                    } else if (data.category_type === "MARKET TRANSACTION") {
                      var iconShow = lvtColor;
                    } else if (data.category_type === "CRFG") {
                      var iconShow = greenColor;
                    } else if (
                      data.property_type === "COMMERCIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = skyBuildBlueColor;
                    } else if (
                      data.property_type === "INDUSTRIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = purplecolor;
                    } else if (
                      data.property_type === "INDUSTRIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = purpleBuildcolor;
                    } else if (
                      data.property_type === "RESIDENTIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = orangecolor;
                    } else if (
                      data.property_type === "RESIDENTIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = orangeBuildcolor;
                    } else if (
                      data.property_type === "NON RESIDENTIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = royalcolor;
                    } else if (
                      data.property_type === "NON RESIDENTIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = royalBuildColor;
                    } else if (
                      data.property_type === "MIXED" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = pinkcolor;
                    } else if (
                      data.property_type === "MIXED" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = pinkBuildColor;
                    } else if (data.category_type === "LVT") {
                      var iconShow = lvtColor;
                    }

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
                  },
                )}
                {this.removeDuplicatesAndGroupData(searchByRegionData).map(
                  (data, id) => {
                    var kioskLocation = JSON.parse([data.geocoded_location]);
                    var coordinates = {
                      lat: kioskLocation["coordinates"][1],
                      lng: kioskLocation["coordinates"][0],
                    };
                    if (
                      data.property_type === "COMMERCIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = skyBlueColor;
                    } else if (data.category_type === "MARKET TRANSACTION") {
                      var iconShow = lvtColor;
                    } else if (data.category_type === "CRFG") {
                      var iconShow = greenColor;
                    } else if (
                      data.property_type === "COMMERCIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = skyBuildBlueColor;
                    } else if (
                      data.property_type === "INDUSTRIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = purplecolor;
                    } else if (
                      data.property_type === "INDUSTRIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = purpleBuildcolor;
                    } else if (
                      data.property_type === "RESIDENTIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = orangecolor;
                    } else if (
                      data.property_type === "RESIDENTIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = orangeBuildcolor;
                    } else if (
                      data.property_type === "NON RESIDENTIAL" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = royalcolor;
                    } else if (
                      data.property_type === "NON RESIDENTIAL" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = royalBuildColor;
                    } else if (
                      data.property_type === "MIXED" &&
                      data.category_type === "INDIVIDUAL"
                    ) {
                      var iconShow = pinkcolor;
                    } else if (
                      data.property_type === "MIXED" &&
                      data.category_type === "PROJECT"
                    ) {
                      var iconShow = pinkBuildColor;
                    } else if (data.category_type === "LVT") {
                      var iconShow = lvtColor;
                    }
                    if (propertyAppraiseRate) {
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
                    } else {
                      if (data.data.appraised_rate !== undefined) {
                        return (
                          <Marker
                            position={coordinates}
                            icon={transPng}
                            label={{
                              text: `A - ${data.data.appraised_rate}`,
                              color: "#006667",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          />
                        );
                      } else if (data.data.sellable_rate != undefined) {
                        return (
                          <Marker
                            position={coordinates}
                            icon={transPng}
                            label={{
                              text: `S - ${data.data.sellable_rate}`,
                              color: "#006667",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          />
                        );
                      } else {
                        return (
                          <Marker
                            position={coordinates}
                            icon={transPng}
                            label={{
                              text: `L - ${data.data.landarea_rate}`,
                              color: "#006667",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          />
                        );
                      }
                    }
                  },
                )}
                <InfoWindow
                  marker={this.state.activeMarker}
                  onClose={this.onInfoWindowClose}
                  visible={this.state.showingInfoWindow}
                >
                  <div>
                    <div id="iwc" />
                    <PopupDetails popupData={popup} />
                  </div>
                </InfoWindow>
                {(() => {
                  if (latLongStatus && !measurmentStatus && !polygonStatus) {
                    return (
                      <Circle
                        radius={radius}
                        center={centroid}
                        strokeColor="#000"
                        strokeWeight={2}
                        fillColor="#928e8e"
                      />
                    );
                  } else {
                    return null;
                  }
                })()}
                {(() => {
                  if (latLongStatus) {
                    return <Marker position={centroid} icon={blackColor} />;
                  } else {
                    return null;
                  }
                })()}
                {(() => {
                  if (polygonShow) {
                    return (
                      <Polygon
                        paths={polygonArray}
                        strokeColor="#656262"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor="#656262"
                        fillOpacity={0.35}
                      />
                    );
                  }
                })()}
                {polygonArray.map((data, id) => {
                  return (
                    <Marker
                      position={data}
                      icon={circlecolor}
                      key={`marker${id}`}
                    />
                  );
                })}
                {directionValue.map((data, id) => {
                  return (
                    <Marker
                      position={data}
                      icon={locationPin}
                      key={`marker${id}`}
                    />
                  );
                })}
              </Map>
            );
          }
        })()}

        {(() => {
          if (loaderMap) {
            return (
              <div className="map-loader">
                <Loader />
              </div>
            );
          }
        })()}

        {(() => {
          if (loaderMapTile) {
            return (
              <div className="map-loader">
                <Loader />
              </div>
            );
          }
        })()}

        {(() => {
          if (isFetchingAgencyBranch) {
            return (
              <div className="map-loader">
                <Loader />
              </div>
            );
          }
        })()}

        <Modal
          size="sm"
          show={showPolyModel}
          onHide={() =>
            this.setState({
              showPolyModel: false,
            })
          }
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>Polygon Area</Modal.Header>
          <Modal.Body>
            <div>
              <p>{polygonFeet} (Sq.ft)</p>
              <p>{polygonValueStr} (Sq.m)</p>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          size="sm"
          show={showDistancePopup}
          onHide={() =>
            this.setState({
              showDistancePopup: false,
            })
          }
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>Distance & TIme</Modal.Header>
          <Modal.Body>
            <div>
              <span> Distance : </span>
              <label>{distanceValueStr}</label>
            </div>
            <div>
              <span> Time : </span>
              <label>{timeValueStr} </label>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_API_KEY,
  LoadingContainer: LoadingContainer,
})(MapScreen);
