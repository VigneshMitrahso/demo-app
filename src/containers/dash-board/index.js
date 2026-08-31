import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// components
import MapScreen from "../../components/map-screen";
import Filter from "../../components/filter";
import Header from "../../components/header";
import SideBar from "../../components/side-bar";
import Loader from "../../components/loader";

// function
import { _getStorageValue } from "../../comman/localStorage";
import { getStateByRadiusUser } from "../../action/getStatesByRadius";
import { stateUser } from "../../action/getState";
import { getStateByRegionUser } from "../../action/getSearchByRegion";
import { agencyUser, resetagencyUser } from "../../action/getAgency";
import { resetStateByRegionUSer } from "../../action/getSearchByRegion";
import { resetStateByRadiusUSer } from "../../action/getStatesByRadius";
import { getUserId } from "../../comman/localStorage";
import { gridUser } from "../../action/getGrid";

// css
import "./dashBoard.css";

// constant
import { USER_ID } from "../../comman/constants";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centroid: { lat: 21.1458, lng: 79.0882 },
      zoomLevel: 4.4,
      latLongStatus: false,
      case1Credentials: {},
      case2Credentials: {},
      mapMarkerData: [],
      agency: [],
      branch: [],
      popUp: true,
      mapStyle: "satilite",
      editable: false,
      sideBarShow: false,
      radius: 0,
      polygonStatus: false,
      measurmentStatus: false,
      goDirection: null,
      goPolyGon: null,
      searchByCoordinate: [],
      searchByRegion: [],
      zoomDragData: {},
      allowDrag: false,
      allowGrid: false,
      allowRadiusDrag: false,
      branchDataUrlState: "",
      branchDataStatus: true,
      angencyDataStatus: true,
      gridCrentical: true,
      propertyByCityLoader: false,
      propertyByLatLonLoader: false,
      case1Loader: false,
      case2Loader: false,
      mapCenterRender: true,
      propertyAppraiseRate: true,
      closeModal: false,
    };
  }

  componentDidMount() {
    const stateUrl = `${getUserId()}/state`;
    var branchUrl = `&bbox=68.1766451354%2C7.96553477623%2C97.4025614766%2C35.4940095078&zoom-level=4.4`;
    this.props.stateUser(stateUrl);
    this.setState({
      branchDataUrlState: branchUrl,
    });
  }

  setRadiusLatLng(cerdintial) {
    if (cerdintial.lat !== undefined) {
      var center = {
        lat: parseFloat(cerdintial.lat),
        lng: parseFloat(cerdintial.lng),
      };
      this.setState({
        centroid: center,
        radius: cerdintial.km,
        latLongStatus: true,
        zoomLevel: 14,
        allowRadiusDrag: true,
      });
    } else {
      this.setState({
        latLongStatus: false,
      });
    }
  }

  // showCase2Center(selectObject) {
  //   var kioskLocation = JSON.parse([selectObject.centroid]);
  //   var coordinates = {
  //     lat: kioskLocation["coordinates"][1],
  //     lng: kioskLocation["coordinates"][0],
  //   };

  //   this.setState({
  // zoomLevel: 14,
  // centroid: coordinates,
  // allowDrag: true,
  //   });
  // }

  resizeMap() {
    this.setState({
      centroid: { lat: 21.1458, lng: 79.0882 },
      zoomLevel: 4.4,
      latLongStatus: false,
    });
  }

  zoomRadiusCallData(zoomUrl) {
    const { zoomDragData } = this.state;

    var zoomDataUrl = ``;

    if (zoomDragData.categoryTypeId !== undefined) {
      zoomDataUrl += zoomDragData.categoryTypeId;
    }

    if (zoomDragData.minMaxAppUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxAppUrl;
    }

    if (zoomDragData.propertyId !== undefined) {
      zoomDataUrl += zoomDragData.propertyId;
    }

    if (zoomDragData.unitName !== undefined) {
      zoomDataUrl += zoomDragData.unitName;
    }

    if (zoomDragData.year !== undefined) {
      zoomDataUrl += zoomDragData.year;
    }

    if (zoomDragData.month !== undefined) {
      zoomDataUrl += zoomDragData.month;
    }
    if (zoomDragData.minMaxLimtUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxLimtUrl;
    }

    if (zoomDragData.builderGroup !== undefined) {
      zoomDataUrl += zoomDragData.builderGroup;
    }

    if (zoomDragData.projectName !== undefined) {
      zoomDataUrl += zoomDragData.projectName;
    }

    if (zoomDragData.approvalNumber !== undefined) {
      zoomDataUrl += zoomDragData.approvalNumber;
    }

    if (zoomDragData.minMaxAgeUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxAgeUrl;
    }

    if (zoomDragData.lat !== undefined) {
      zoomDataUrl += zoomUrl;
      var userId = getUserId();

      this.props.getStateByRadiusUser(
        userId,
        zoomDragData.lat,
        zoomDragData.lng,
        zoomDragData.radiusKmData,
        zoomDataUrl,
        function () {},
        function () {},
      );
    }
  }

  dragRadiusCallData(drageUrl) {
    var userId = getUserId();
    const { zoomDragData } = this.state;

    var dragDataUrl = ``;

    if (zoomDragData.categoryTypeId !== undefined) {
      dragDataUrl += zoomDragData.categoryTypeId;
    }

    if (zoomDragData.minMaxAppUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxAppUrl;
    }

    if (zoomDragData.propertyId !== undefined) {
      dragDataUrl += zoomDragData.propertyId;
    }

    if (zoomDragData.unitName !== undefined) {
      dragDataUrl += zoomDragData.unitName;
    }

    if (zoomDragData.year !== undefined) {
      dragDataUrl += zoomDragData.year;
    }

    if (zoomDragData.month !== undefined) {
      dragDataUrl += zoomDragData.month;
    }

    if (zoomDragData.minMaxLimtUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxLimtUrl;
    }

    if (zoomDragData.builderGroup !== undefined) {
      dragDataUrl += zoomDragData.builderGroup;
    }

    if (zoomDragData.projectName !== undefined) {
      dragDataUrl += zoomDragData.projectName;
    }

    if (zoomDragData.approvalNumber !== undefined) {
      dragDataUrl += zoomDragData.approvalNumber;
    }

    if (zoomDragData.minMaxAgeUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxAgeUrl;
    }

    if (zoomDragData.lat !== undefined) {
      dragDataUrl += drageUrl;
      this.props.getStateByRadiusUser(
        userId,
        zoomDragData.lat,
        zoomDragData.lng,
        zoomDragData.radiusKmData,
        dragDataUrl,
        function () {},
        function () {},
      );
    }
  }

  dragRegionCallData(drageUrl) {
    var userId = getUserId();
    const { zoomDragData } = this.state;

    var dragDataUrl = ``;

    if (zoomDragData.categoryTypeId !== undefined) {
      dragDataUrl += zoomDragData.categoryTypeId;
    }

    if (zoomDragData.minMaxAppUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxAppUrl;
    }

    if (zoomDragData.propertyId !== undefined) {
      dragDataUrl += zoomDragData.propertyId;
    }

    if (zoomDragData.unitName !== undefined) {
      dragDataUrl += zoomDragData.unitName;
    }

    if (zoomDragData.year !== undefined) {
      dragDataUrl += zoomDragData.year;
    }

    if (zoomDragData.month !== undefined) {
      dragDataUrl += zoomDragData.month;
    }

    if (zoomDragData.minMaxLimtUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxLimtUrl;
    }

    if (zoomDragData.builderGroup !== undefined) {
      dragDataUrl += zoomDragData.builderGroup;
    }

    if (zoomDragData.projectName !== undefined) {
      dragDataUrl += zoomDragData.projectName;
    }

    if (zoomDragData.approvalNumber !== undefined) {
      dragDataUrl += zoomDragData.approvalNumber;
    }

    if (zoomDragData.minMaxAgeUrl !== undefined) {
      dragDataUrl += zoomDragData.minMaxAgeUrl;
    }

    if (zoomDragData.state !== undefined) {
      dragDataUrl += drageUrl;

      if (zoomDragData.case2Locality !== undefined) {
        dragDataUrl += zoomDragData.case2Locality;
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          dragDataUrl,
          function () {},
          function () {},
        );
      } else if (zoomDragData.case2Zone !== undefined) {
        dragDataUrl += zoomDragData.case2Zone;
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          dragDataUrl,
          function () {},
          function () {},
        );
      } else {
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          dragDataUrl,
          function () {},
          function () {},
        );
      }
    }
  }

  zoomRegionDataCall(zoomUrl) {
    var userId = getUserId();
    const { zoomDragData } = this.state;
    var zoomDataUrl = ``;
    // var zoomUrllink +=zoomUrl;

    if (zoomDragData.categoryTypeId !== undefined) {
      zoomDataUrl += zoomDragData.categoryTypeId;
    }

    if (zoomDragData.minMaxAppUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxAppUrl;
    }

    if (zoomDragData.propertyId !== undefined) {
      zoomDataUrl += zoomDragData.propertyId;
    }

    if (zoomDragData.unitName !== undefined) {
      zoomDataUrl += zoomDragData.unitName;
    }

    if (zoomDragData.year !== undefined) {
      zoomDataUrl += zoomDragData.year;
    }

    if (zoomDragData.month !== undefined) {
      zoomDataUrl += zoomDragData.month;
    }

    if (zoomDragData.minMaxLimtUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxLimtUrl;
    }

    if (zoomDragData.builderGroup !== undefined) {
      zoomDataUrl += zoomDragData.builderGroup;
    }

    if (zoomDragData.projectName !== undefined) {
      zoomDataUrl += zoomDragData.projectName;
    }

    if (zoomDragData.approvalNumber !== undefined) {
      zoomDataUrl += zoomDragData.approvalNumber;
    }

    if (zoomDragData.minMaxAgeUrl !== undefined) {
      zoomDataUrl += zoomDragData.minMaxAgeUrl;
    }

    if (zoomDragData.state !== undefined) {
      zoomDataUrl += zoomUrl;
      if (zoomDragData.case2Locality !== undefined) {
        zoomDataUrl += zoomDragData.case2Locality;
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          zoomDataUrl,
          function () {},
          function () {},
        );
      } else if (zoomDragData.case2Zone !== undefined) {
        zoomDataUrl += zoomDragData.case2Zone;
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          zoomDataUrl,
          function () {},
          function () {},
        );
      } else {
        this.props.getStateByRegionUser(
          userId,
          zoomDragData.state,
          zoomDragData.city,
          zoomDataUrl,
          function () {},
          function () {},
        );
      }
    }
  }

  branchDataCall(drageUrl) {
    var userId = getUserId();
    this.setState({
      branchDataUrlState: drageUrl,
    });
    const { branchDataStatus, angencyDataStatus } = this.state;
    if (branchDataStatus === false && angencyDataStatus === true) {
      this.props.agencyUser(userId, "1", "0", drageUrl);
    } else if (branchDataStatus === true && angencyDataStatus === true) {
      // this.props.agencyUser(userId, "0", "0", drageUrl);
      this.props.resetagencyUser();
    } else if (branchDataStatus === true && angencyDataStatus === false) {
      this.props.agencyUser(userId, "0", "1", drageUrl);
    } else if (branchDataStatus === false && angencyDataStatus === false) {
      this.props.agencyUser(userId, "1", "1", drageUrl);
    }
  }

  branchzoomUrlData(zoomUrl) {
    var userId = getUserId();

    this.setState({
      branchDataUrlState: zoomUrl,
    });

    const { branchDataStatus, angencyDataStatus } = this.state;
    if (branchDataStatus === false && angencyDataStatus === true) {
      this.props.agencyUser(userId, "1", "0", zoomUrl);
    } else if (branchDataStatus === true && angencyDataStatus === true) {
      // this.props.agencyUser(userId, "0", "0", zoomUrl);
      this.props.resetagencyUser();
    } else if (branchDataStatus === true && angencyDataStatus === false) {
      this.props.agencyUser(userId, "0", "1", zoomUrl);
    } else if (branchDataStatus === false && angencyDataStatus === false) {
      this.props.agencyUser(userId, "1", "1", zoomUrl);
    }
  }

  setGridDragLevel(gridUrl) {
    this.props.gridUser(gridUrl);
  }
  setGridZoomLevel(gridUrl) {
    this.props.gridUser(gridUrl);
  }

  setCloseModal = () => {
    this.setState({ closeModal: false });
  };

  render() {
    const {
      centroid,
      zoomLevel,
      latLongStatus,
      mapMarkerData,
      popUp,
      mapStyle,
      editable,
      sideBarShow,
      radius,
      polygonStatus,
      measurmentStatus,
      goDirection,
      goPolyGon,
      searchByCoordinate,
      searchByRegion,
      zoomDragData,
      allowDrag,
      allowRadiusDrag,
      branchDataUrlState,
      branchDataStatus,
      angencyDataStatus,
      allowGrid,
      gridCrentical,
      propertyByCityLoader,
      propertyByLatLonLoader,
      case2Loader,
      case1Loader,
      closeModal,
      mapCenterRender,
      propertyAppraiseRate,
    } = this.state;

    const {
      stateData,
      searchByRegionData,
      searchByRadiusData,
      branchData,
      agencyData,
      isFetchingSearchByRegion,
      isFetchingSearchByRadius,
      isFetchingAgencyBranch,
      gridData,
      isFetchingGridStatus,
      isFetchingState,
      isFetchingCity,
      isFetchingZone,
      isFetchingCatestate,
      isFetchingProjectNameByCity,
      isFetchingBuliderByCity,
      isFetchingApprovalByCity,
      isFetchingPropertyByCity,
      isFetchingUnitTypeByCity,
      isFetchingYearByCity,
      isFetchingMonthByCity,
      isFetchingProperty,
      isFetchingUnitType,
      isFetchingApprovalByLatLon,
      isFetchingProjectByLatLon,
      isFetchingBuilderByLatLon,
      isFetchingCategory,
      isFetchingYearByLatLon,
      isFetchingMonthByLatLong,
      isFetchingLocal,
    } = this.props;

    var latLongLoader =
      isFetchingProperty || propertyByCityLoader || case1Loader;
    // isFetchingUnitType ||
    // isFetchingApprovalByLatLon ||
    // isFetchingProjectByLatLon ||
    // isFetchingBuilderByLatLon ||
    // isFetchingCategory ||
    // isFetchingYearByLatLon ||
    // isFetchingMonthByLatLong;

    var validationLoader =
      isFetchingState ||
      isFetchingCity ||
      isFetchingZone ||
      isFetchingLocal ||
      propertyByLatLonLoader ||
      case2Loader;
    // isFetchingCatestate ||
    // isFetchingProjectNameByCity ||
    // isFetchingBuliderByCity ||
    // isFetchingApprovalByCity ||
    // isFetchingPropertyByCity ||
    // isFetchingUnitTypeByCity ||
    // isFetchingYearByCity ||
    // isFetchingMonthByCity || isFetchingLocal;

    return (
      <div className="dash-board-container">
        <Header
          sideBarCallBack={() => {
            this.setState({
              sideBarShow: !sideBarShow,
            });
          }}
          link="/landingPage"
        />
        <div className="row dash-board-warpper">
          <div className=" col-sm-9 col-xl-9 col-lg-8 col-md-7 pad0">
            <div className="dash-board-sec">
              {sideBarShow ? (
                <div className="side-bar-container">
                  <SideBar />
                </div>
              ) : null}

              <div className="map-container">
                {(() => {
                  if (mapCenterRender) {
                    return (
                      <div className="map-dashboard">
                        <MapScreen
                          closeModal={closeModal}
                          setCloseModal={this.setCloseModal}
                          propertyAppraiseRate={propertyAppraiseRate}
                          centroid={centroid}
                          zoomLevel={zoomLevel}
                          radius={radius}
                          latLongStatus={latLongStatus}
                          gridData={gridData}
                          searchByRegion={searchByRegion}
                          bankLocationData={mapMarkerData}
                          searchByCoordinate={searchByCoordinate}
                          popUp={popUp}
                          mapStyle={mapStyle}
                          polygonStatus={polygonStatus}
                          measurmentStatus={measurmentStatus}
                          goDirection={goDirection}
                          goPolyGon={goPolyGon}
                          zoomDragData={zoomDragData}
                          allowDrag={allowDrag}
                          allowGrid={allowGrid}
                          searchByRegionData={searchByRegionData}
                          allowRadiusDrag={allowRadiusDrag}
                          searchByRadiusData={searchByRadiusData}
                          branchData={branchData}
                          agencyData={agencyData}
                          // loaders
                          isFetchingSearchByRegion={isFetchingSearchByRegion}
                          isFetchingSearchByRadius={isFetchingSearchByRadius}
                          isFetchingGridStatus={isFetchingGridStatus}
                          isFetchingAgencyBranch={isFetchingAgencyBranch}
                          // isFetchingState={isFetchingState}
                          gridCrentical={gridCrentical}
                          zoomRegionCallBack={(zoomUrl) => {
                            this.zoomRegionDataCall(zoomUrl);
                          }}
                          dragRegionCallBack={(drageUrl) => {
                            this.dragRegionCallData(drageUrl);
                          }}
                          zoomRadiusCallBack={(zoomUrl) => {
                            this.zoomRadiusCallData(zoomUrl);
                          }}
                          dragRadiusCallBack={(drageUrl) => {
                            this.dragRadiusCallData(drageUrl);
                          }}
                          branchDataCallBack={(drageUrl) => {
                            this.branchDataCall(drageUrl);
                          }}
                          branchzoomUrl={(zoomUrl) => {
                            this.branchzoomUrlData(zoomUrl);
                          }}
                          zoomSetDir={(zoomSetDir) => {
                            this.setState({
                              centroid: zoomSetDir.centerData,
                              zoomLevel: zoomSetDir.zoomData,
                              allowDrag: false,
                            });
                            // zoomLevel: 14,
                            // centroid: coordinates,
                            // allowDrag: true,
                          }}
                          gridCallBack={(gridUrl) => {
                            this.setGridDragLevel(gridUrl);
                          }}
                          gridZoomCallBack={(gridUrl) => {
                            this.setGridZoomLevel(gridUrl);
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="map-loader">
                        <Loader />
                      </div>
                    );
                  }
                })()}

                <div className="ajanda-sec">
                  <table>
                    <tbody>
                      <tr>
                        <td className="width300">Type of Property</td>
                        <td className="blue"> Commercial </td>
                        <td className="purpple"> Industrial </td>
                        <td className="residential"> Residential </td>
                        <td className="non-residential"> Non Residential </td>
                        <td className="mixed"> Mixed </td>
                        <td className="crfg">CRFG</td>
                        <td className="lvt">Market Transaction</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-sm-3  col-xl-3 col-lg-4 col-md-5 pad0 ">
            <Filter
              stateData={stateData}
              branchDataUrlState={branchDataUrlState}
              isFetchingAgencyBranch={isFetchingAgencyBranch}
              propertyAppraiseRate={propertyAppraiseRate}
              getCentroid={(e) => {
                this.setState({ case1Credentials: e });
              }}
              zoomDragCrentential={(postDataType) => {
                this.setState({
                  zoomDragData: postDataType,
                });
              }}
              resizeMapData={() => {
                this.resizeMap();
                this.setState({
                  latLongStatus: false,
                });
              }}
              resetMapData={() => {
                this.setState({
                  zoomDragData: {},
                  latLongStatus: false,
                  allowGrid: false,
                  allowDrag: false,
                  allowRadiusDrag: false,
                  closeModal: true,
                });
              }}
              cas1Submit={(cerdintial) => {
                this.setRadiusLatLng(cerdintial);
              }}
              // case2Centroid={(selectObject) => {
              //   this.showCase2Center(selectObject);
              // }}
              // cas1Submit={(cerdintial) => {
              //   this.setRadiusLatLng(cerdintial);
              // }}
              // case2Centroid={(selectObject) => {
              //   this.showCase2Center(selectObject);
              // }}
              branchStatusCallBack={() => {
                this.setState({
                  branchDataStatus: !branchDataStatus,
                });
              }}
              angencyStatusCallBack={() => {
                this.setState({
                  angencyDataStatus: !angencyDataStatus,
                });
              }}
              showHideGrid={(girdHideShow) => {
                this.setState({
                  gridCrentical: girdHideShow,
                });
              }}
              propertyAppriselHide={() => {
                this.setState({
                  propertyAppraiseRate: true,
                });
              }}
              proprtyAppraiseRateCallBack={(pgrid) => {
                this.setState({
                  propertyAppraiseRate: !propertyAppraiseRate,
                });
              }}
              propertyByCityLoaderCallBack={() => {
                this.setState({
                  propertyByCityLoader: true,
                });
              }}
              propertyByCityLoaderCallBackClose={() => {
                this.setState({
                  propertyByCityLoader: false,
                });
              }}
              propertyByLatLonLoaderCallBack={() => {
                this.setState({
                  propertyByLatLonLoader: true,
                });
              }}
              propertyByLatLonLoaderCallBackClose={() => {
                this.setState({
                  propertyByLatLonLoader: false,
                });
              }}
              case2LocalCallBack={() => {
                this.setState({
                  case2Loader: true,
                });
              }}
              case2LocalCloaseCallBack={() => {
                this.setState({
                  case2Loader: false,
                });
              }}
              case1LoaderCallBack={() => {
                this.setState({
                  case1Loader: true,
                });
              }}
              case1LoaderCloseCallBack={() => {
                this.setState({
                  case1Loader: false,
                });
              }}
              centerMapByData={(centroid) => {
                this.setState(
                  {
                    centroid: { lat: centroid.lat, lng: centroid.lng },
                    zoomLevel: centroid.zoom,
                    mapCenterRender: false,
                    allowDrag: true,
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        mapCenterRender: true,
                      });
                    }, 300);
                  },
                );
              }}
            />
          </div>

          {/* {(() => {
            if (validationLoader) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()}

          {(() => {
            if (latLongLoader) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()} */}

          {/* {(() => {
            if (this.props.isFetchingCity) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()} */}
          {/* {(() => {
            if (this.props.isFetchingZone) {
              return (
                <div className="public-loader">
                  <Loader />
                </div>
              );
            }
          })()} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  searchByRadiusData: state.getStateByRadius.searchByRadiusData,
  stateData: state.getState.stateData,
  builderData: state.getBuilder.builderData,
  projectNameData: state.getProjectName.projectNameData,
  searchByRegionData: state.getStateByRegion.searchByRegionData,
  // searchByRadiusData: state.getStateByRadius.searchByRadiusData,
  agencyData: state.getAgency.agencyData,
  branchData: state.getAgency.branchData,
  isFetchingGridStatus: state.getGrid.isFetchingGridStatus,
  gridData: state.getGrid.gridData,
  isFetchingAgencyBranch: state.getAgency.isFetchingAgencyBranch,
  isFetchingSearchByRegion: state.getStateByRegion.isFetchingSearchByRegion,
  isFetchingSearchByRadius: state.getStateByRadius.isFetchingSearchByRadius,
  isFetchingState: state.getState.isFetchingState,
  isFetchingCity: state.getCityName.isFetchingCity,
  isFetchingZone: state.barByzone.isFetchingZone,
  isFetchingCatestate: state.categoryTypeStateCity.isFetchingCatestate,
  isFetchingBuliderByCity: state.getBuilder.isFetchingBuliderByCity,
  isFetchingApprovalByCity: state.getApprovalNoByCity.isFetchingApprovalByCity,
  isFetchingPropertyByCity: state.getPropertyByCity.isFetchingPropertyByCity,
  isFetchingUnitTypeByCity: state.getUnitByStateCityType.isFetchingUnitType,
  isFetchingYearByCity: state.getYearByStateCity.isFetchingYearByCity,
  isFetchingMonthByCity: state.getMonthByCityType.isFetchingMonthByCity,
  isFetchingLocal: state.barByLocality.isFetchingLocal,
  // latlong
  isFetchingProperty: state.getProperty.isFetchingProperty,
  isFetchingUnitType: state.getUnitType.isFetchingUnitType,
  isFetchingApprovalByLatLon:
    state.getApprovalNoByLatLong.isFetchingApprovalByLatLon,
  isFetchingProjectByLatLon:
    state.getProjectNoByLatLong.isFetchingProjectByLatLon,
  isFetchingBuilderByLatLon:
    state.getBuilderByLatLong.isFetchingBuilderByLatLon,
  isFetchingCategory: state.categoryType.isFetchingCategory,
  isFetchingYearByLatLon: state.getYearByLatLon.isFetchingYearByLatLon,
  isFetchingMonthByLatLong: state.getMonth.isFetchingMonthByLatLong,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getStateByRadiusUser: getStateByRadiusUser,
      stateUser: stateUser,
      gridUser: gridUser,
      getStateByRegionUser: getStateByRegionUser,
      agencyUser: agencyUser,
      resetStateByRadiusUSer: resetStateByRadiusUSer,
      resetStateByRegionUSer: resetStateByRegionUSer,
      resetagencyUser: resetagencyUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
