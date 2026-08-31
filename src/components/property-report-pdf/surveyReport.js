import React, { useRef, useState } from "react";
import "./index.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.gridlayer.googlemutant";
import $ from "jquery";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { _getStorageValue } from "../../comman/localStorage";
import { AES_KEY, GOOGLE_MAP_API_KEY, USER_ID } from "../../comman/constants";
import { getServeyReportData } from "../../action/serveyReport";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "../header";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import * as htmlPdf from "html-pdf-chrome";
import { Bar, Line } from "react-chartjs-2";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { compose } from "redux";

import "chartjs-plugin-datalabels";
import Loader from "../loader";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import { decryptStatic, encryptStatic } from "../../comman/decodeEncodeData";
import { serveyAESKeyUrl } from "../../comman/urls";
import header from "../header";

import newSurveydata from "../../assets/json/new_survey_map.json";
import moment from "moment";
// import windowSize from "react-window-size";

const iciciLogo = {
  url: require("../../assets/images/icicilogo.png"),
};

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

const satsureLogo = {
  url: require("../../assets/images/satsure-new-logo.png"),
};

var locmap = null;
var centLocboundMap = null;
var adjCentLocboundMap = null;

var options = {
  plugins: {
    datalabels: {
      display: true,
      offset: 2,
      padding: 0,
      color: "#053c6d",
      formatter: Math.round,
      font: {
        size: 14,
      },
    },
  },
  animation: {
    duration: 1000,
    easing: "easeInOutBack",
    lineTension: {
      from: 0,
      to: 1,
      duration: 500,
      loop: true,
    },
  },
  legend: {
    position: "bottom",
    display: true,
    labels: {
      boxWidth: 5,
    },
  },
  scales: {
    xAxes: [
      {
        ticks: { display: true },
      },
    ],
    yAxes: [
      {
        stacked: true,
        ticks: {
          display: true,
          scaleLabel: {
            show: true,
          },
        },
      },
    ],
  },
};

const SurveyReportPdfGen = (props) => {
  const [chartData, setChartData] = useState({});
  const [serveyReportData, setData] = useState("");
  const [surveyReport, setSurvey] = useState("");
  const [vlaus, setValues] = useState({
    north: "",
    east: "",
    south: "",
    west: "",
  });

  var dataSet = [];

  var lineChartData = [];

  useEffect(async () => {
    let urls = serveyAESKeyUrl();
    const responseAES = await axios.get(urls, {
      headers: {
        "aes-token": "e81d215a-0bec-42a7-9e3e-335fda72785a",
      },
    });
    let key = responseAES.data.data.key;
    let url = new URLSearchParams(props.location.search).get("jsonQueryUrl");
    let token = new URLSearchParams(props.location.search).get("token");
    let id = new URLSearchParams(props.location.search).get("id");
    // console.log("token decryptStatic",decryptStatic(token,) );
    // console.log("token wo encode",token );
    let encript = encryptStatic(decryptStatic(token, key), key);
    encript = encodeURIComponent(encript);
    let encriptid = encryptStatic(decryptStatic(id, key), key);
    encriptid = encodeURIComponent(encriptid);
    const response = await axios.get(`${url}?token=${encript}&id=${encriptid}`);
    setData(response.data.data.map_data);
    setSurvey(response.data);
  }, []);

  useEffect(() => {
    if (serveyReportData != "") {
      console.log("serveyReportData", serveyReportData);
      prosuccess({ ...serveyReportData, ...serveyReportData?.data });
    }
  }, [surveyReport]);

  function prosuccess(propEyeData) {
    let dummyRecord = [{}, {}, {}, {}, {}, {}, {}, {}];
    let recentDummyRecord = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    const pricetrendsData = dummyRecord.map(
      (data, index) => propEyeData.property_price_trend_table[index] || {},
    );
    console.log("pricetrendsData", surveyReport);
    const recentTrsnctnData = recentDummyRecord.map(
      (data, index) => propEyeData.individual_data[index] || {},
    );
    const metaData = propEyeData.metadata;
    const propertyDetails = propEyeData.propertyDetails;
    const surveyDetails = propEyeData.surveyNumberDetails ?? [];
    const branchDetails = propEyeData.branch_details;
    let longLat = JSON.parse(propEyeData.coordinates);

    console.log("surveyDetails", propEyeData);

    document.getElementById("propertyid").innerHTML =
      surveyReport.data.survey_request_id;

    document.getElementById("reportdateID").innerHTML = metaData?.reportDate
      ? moment(metaData.reportDate).format("DD-MM-YYYY")
      : "NA";
    document.getElementById("statedata").innerHTML =
      propertyDetails?.state || "NA";
    document.getElementById("districtdata").innerHTML =
      propertyDetails?.district || "NA";
    document.getElementById("propaddress").innerHTML =
      propertyDetails?.propertyAddress || "NA";
    if (surveyDetails.length > 0) {
      document.getElementById("surveydetail").innerHTML =
        surveyDetails[0]?.surveyDetails || "NA";
      document.getElementById("surveyarea").innerHTML =
        surveyDetails[0]?.surveyArea || "NA";
    }
    document.getElementById("propreportlong").innerHTML = longLat[0] ?? "NA";
    document.getElementById("propreportlat").innerHTML = longLat[1] ?? "NA";
    calculateBoundaries(longLat[1], longLat[0], 10);
    if (branchDetails.length > 0) {
      document.getElementById("surveyboundary").innerHTML = "NA";
      document.getElementById("nearbranch").innerHTML =
        branchDetails[0]?.source_branch_name || "NA";
      document.getElementById("branchid").innerHTML =
        branchDetails[0]?.source_IFSC || "NA";
      document.getElementById("branchdistance").innerHTML =
        branchDetails[0]?.distance.toFixed(2) || "NA";
    }
    // Price trend table new data start
    if (pricetrendsData.length > 0) {
      pricetrendsData.splice(0, 8).map((details, index) => {
        $("#prop-price-trend tbody").append(`
                <tr className="${
                  index % 20 === 0 && index !== 0 && "page-break"
                }">
                <td >${details.pincode || "NA"}</td>
                <td>${details.land_min || "NA"}</td>
                <td>${details.land_avg || "NA"}</td>
                <td>${details.land_max || "NA"}</td>
                <td>${details.sale_min || "NA"}</td>
                <td>${details.sale_avg || "NA"}</td>
                <td>${details.sale_max || "NA"}</td>
            </tr>`);
      });
    } else {
      $("#prop-price-trend tbody").append(
        `<tr><td colspan='7'>No data available</td></tr>`,
      );
    }
    // Price trend table new data end

    // Recent transaction table new data start
    if (recentTrsnctnData.length > 0) {
      recentTrsnctnData
        .filter((fd, index) => index < 10)
        .map((details, index) => {
          $("#prop-recent-transaction tbody").append(`
                <tr className="${
                  index % 20 === 0 && index !== 0 && "page-break page-break-new"
                }">
                <td >${details.property_type || "NA"}</td>
                <td>${details.unit_type || "NA"}</td>
                <td>${details.land_area || "NA"}</td>
                <td>${details.land_rate || "NA"}</td>
                <td>${details.sale_area || "NA"}</td>
                <td>${details.sale_rate || "NA"}</td>
                <td>${details.age || "NA"}</td>
                <td>${Number(details.distance_in_km).toFixed(2) || "NA"}</td>
                <td>${moment(details.date_of_transaction, "YYYY-MM-DD").format("DD-MM-YYYY") || "NA"}</td>
                </tr>`);
        });
    } else {
      $("#prop-recent-transaction tbody").append(
        `<tr><td colspan='9'>No data available</td></tr>`,
      );
    }
    // Recent transaction table new data end

    // B. Percentage Inclusion
    const propEyeDataMap = propEyeData;
    var surveyNumberDetails = propEyeDataMap.surveyNumberDetails;
    if (!!surveyNumberDetails) {
    }

    var priceTrendData = propEyeData?.property_price_trend_table ?? [];
    if (priceTrendData.length > 1) {
      priceTrendData.splice(0, 10).map((details, index) => {
        $("#Property-price-trend tbody").append(`
              <tr className="${
                index % 20 === 0 && index !== 0 && "page-break"
              }">
              <td >${details.pincode}</td>
              <td className="capitalize">${details.property_type} -  ${
                details.rate_type
              } </td>
              <td >${details.minimum_area_rate}</td>
              <td >${details.average_area_rate}</td>
              <td >${details.maximum_area_rate}</td>
          </tr>`);
      });
    }

    // var individual_data = propEyeData?.individual_data ?? [];
    // if (individual_data != []) {
    //   individual_data.splice(0, 10).map((details, index) => {
    //     $("#individual tbody").append(` ${
    //       (index + 1) % 51 === 0 &&
    //       `<tr><div class="container-report-pdf"></div></tr>`
    //     }
    //           <tr class="${(index + 1) % 50 === 0 && "page-break"}}">
    //           <td>${details[`property_type`]}</td>
    //           <td>${details[`distance in km`]}</td>
    //           <td>${details[`landarea_rate`]}</td>
    //           <td>${details[`sellablearea_rate`]}</td>
    //           <td>${details[`entered_on`]}</td>
    //       </tr>`);
    //   });
    // }

    var yellowPolygon = propEyeDataMap.metadata;
    var adjacentLandDetails = propEyeData.adjacentLandDetails;

      console.log("error yellowPolygon", yellowPolygon);
      // return;
      const coordinates = [];

      if (!!surveyNumberDetails) {
        if (surveyNumberDetails.length > 0) {
          surveyNumberDetails.map((details) => {
            let coGeometry = typeof details.geometry === "string"
            ? JSON.parse(details.geometry)
            : details.geometry;
            console.log("coGeometry", coGeometry);
            if (coGeometry.type === "MultiPolygon") {
              coordinates.push(coGeometry.coordinates[0]);
            } else if (coGeometry.type === "Polygon") {
              coordinates.push(coGeometry.coordinates);
            }
          });
        } else {
          surveyNumberDetails.map((details) => {
            let coGeometry =
              typeof details.geometry === "string"
                ? JSON.parse(details.geometry)
                : details.geometry;
            if (coGeometry.type === "MultiPolygon") {
              coordinates.push(coGeometry.coordinates[0]);
            } else if (coGeometry.type === "Polygon") {
              coordinates.push(coGeometry.coordinates);
            }
          });
        }
        var styleRed = {
          color: "#FF2121",
          fillColor: "#000",
          weight: 2,
          opacity: 1,
          dashArray: "5",
          fillOpacity: 0,
          zIndex: 999,
        };

        var styleYellow = {
          color: "#F2DA00",
          fillColor: "#FFF961",
          fillOpacity: 0.65,
          weight: 2,
          zIndex: 999,
        };

        console.log("coordinates", coordinates);

        locmap = L.map("adjacent-land-details", {
            center: [
                surveyNumberDetails[0].centroid.lat.value,
                surveyNumberDetails[0].centroid.lon.value,
            ],
            zoomAnimation: false,
            zoom: 16,
            attributionControl: true,
            zoomControl: false,
            fadeAnimation: false,
            scrollWheelZoom: false
        });
        L.gridLayer
            .googleMutant({
                type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            })
            .addTo(locmap);
        var surveyNumberBoundaries = []

        coordinates.map((surveyBoundaryGeom) => {
            surveyNumberBoundaries.push({
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: { name: "Farms Geometry" },
                        geometry: {
                            type: "Polygon",
                            coordinates: surveyBoundaryGeom,
                        },
                    },
                ],
            })
        })
            adjCentLocboundMap = L.geoJSON(surveyNumberBoundaries, {
            style: styleRed,
          }).addTo(locmap);
          locmap.fitBounds(adjCentLocboundMap.getBounds());
          locmap.setZoom(16);
      }
    if (!!adjacentLandDetails) {
      // var adjStyleRed = {
      //   color: "#FF2121",
      //   fillColor: "#000",
      //   fillOpacity: 0,
      //   weight: 2,
      //   opacity: 1,
      // };
      // var styleTransparent = {
      //   opacity: 0,
      //   fillColor: "#000",
      //   fillOpacity: 0,
      // };

      // var adjacentMap = L.map("adjacent-land-details", {
      //   center: [
      //       surveyNumberDetails[0].centroid.lat.value,
      //       surveyNumberDetails[0].centroid.lon.value
      //   ],
      //   zoomAnimation: false,
      //   scrollWheelZoom: false,
      // });
      //  L.Control.Zoom({
      //       position: 'bottomright' // Adjust position as needed (e.g., 'topleft', 'bottomleft', 'bottomright')
      //     }).addTo(adjacentMap);

      // Add the zoom control to the map (if not already added)
      // adjacentMap.addControl(zoomControl);

      // ).setView(
      //     [adjacentLandDetails[0].centroid.lat.value,
      //     adjacentLandDetails[0].centroid.lon.value], 12
      // );
      // L.gridLayer
      //   .googleMutant({
      //     type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      //   })
      //   .addTo(adjacentMap);




   
      // Adjacent Land Details icon Bounding Box
  

      // Table Data
      if (adjacentLandDetails.length > 0) {
        adjacentLandDetails.map((adjacentDetails) => {
          $("#adjacentLandDetails tbody").append(`
              <tr>
              <td>${adjacentDetails.surveyLabel || "NA"}</td>
              <td className="capitalize">${
                adjacentDetails?.surveyDetails || "NA"
              }</td>
              <td className="capitalize">${
                adjacentDetails.direction || "NA"
              }</td>
          </tr>`);
        });
      }
    } else {
      document.getElementById("adjacent-land-details").style.display = "none";
    }

    var surveyNumberDetails = propEyeData.surveyNumberDetails;

    function calculateBoundaries(lat, lng, distance) {
      const radius = 6371; // Earth's radius in kilometers
      const delta = distance / radius; // Angular distance in radians

      const minLat = lat - delta * (180 / Math.PI);
      const maxLat = lat + delta * (180 / Math.PI);

      const deltaLng = Math.asin(
        Math.sin(delta) / Math.cos(lat * (Math.PI / 180)),
      );
      const minLng = lng - deltaLng * (180 / Math.PI);
      const maxLng = lng + deltaLng * (180 / Math.PI);

      let vlaus = {
        north: maxLat,
        east: maxLng,
        south: minLat,
        west: minLng,
      };
      setValues(vlaus);
    }

    var years = [];

    dataSet = [];
    var chart = propEyeData.property_price_trend_graph;
    chart.forEach((list, index) => {
      years = [...years, list?.years_1];
      var obj = {
        label: index === 0 ? "Avegrage LandPrice" : "Average sale price",
        fill: true,
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        borderWidth: 3,
        pointRadius: 5,
        data:
          index === 0
            ? chart.map((md) => Math.round(md.avg_land_price))
            : chart.map((md) => Math.round(md.avg_sale_price)),
        lineTension: 0,
        pointColor: "#E77817",
        pointHoverRadius: 8,
        pointBackgroundColor: "#E77817",
        duration: "100ms",
        type: "line",
      };
      dataSet.push(obj);
    });
    lineChartData = {
      labels: years,
      datasets: dataSet,
    };
    setChartData(lineChartData);
  }
  return (
    <>
      <div className="">
        <div className="propeye-report-section">
          <div className="property-report-header">
            {/* <div className="content">
              <label className="propeye-report-title">PROPERTY REPORT</label>
              <div className="propeye-report-details">
                <div
                  style={{ textAlign: "center" }}
                  className="propeye-report-id"
                >
                  <label>Property ID : </label>
                  <span id="propEyeId"></span>
                </div>
              </div>
            </div> */}
            <div className="header-content">
              <div className="pdf-header-logo">
                <img src={iciciLogo.url} alt="icici" />
              </div>
              <div className="header-text">
                <span>property report</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginLeft: 10,
              marginRight: 10,
              padding: 10,
              marginTop: 52,
            }}
            className="propeye-report-warppers"
          >
            <div className="property-detail-trend">
              <div className="property-detail-content">
                <div className="property-detail-title">Property details</div>
                <div className="property-detail-content-inr">
                  <div className="property-detail-card-main detail-1">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">Property ID</div>
                      <div
                        className="card-detail-inr-data"
                        id="propertyid"
                      ></div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Report generated on
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="reportdateID"
                      ></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="property-detail-card-main detail-2">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">State</div>
                      <div
                        className="card-detail-inr-data"
                        id="statedata"
                      ></div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">District</div>
                      <div
                        className="card-detail-inr-data"
                        id="districtdata"
                      ></div>
                    </div>
                  </div>
                  <div className="property-detail-card-main detail-3">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Property address
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="propaddress"
                      ></div>
                    </div>
                  </div>
                  <div className="property-detail-card-main detail-4">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">Latitude</div>
                      <div
                        className="card-detail-inr-data"
                        id="propreportlat"
                      ></div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">Longitude</div>
                      <div
                        className="card-detail-inr-data"
                        id="propreportlong"
                      ></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="property-detail-card-main detail-5">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Survey Details
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="surveydetail"
                      ></div>
                    </div>
                  </div>
                  <div className="property-detail-card-main detail-6">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Total number of properties valued in survey boundary
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="surveyboundary"
                      ></div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Area (Ha) of survey boundary
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="surveyarea"
                      ></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="property-detail-card-main detail-7">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Nearest branch
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="nearbranch"
                      ></div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">Branch ID</div>
                      <div className="card-detail-inr-data" id="branchid"></div>
                    </div>
                  </div>
                  <div className="property-detail-card-main detail-8">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title">
                        Distance to branch (km)
                      </div>
                      <div
                        className="card-detail-inr-data"
                        id="branchdistance"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="property-trends-content">
                <div className="property-detail-title">
                  Property Price trends
                </div>
                <div className="property-detail-content-inr">
                  <div className="price-table-div">
                    <table border="1" id="prop-price-trend">
                      <thead>
                        <tr>
                          <th rowspan="2">Pincode</th>
                          <th colspan="3">Land rate</th>
                          <th colspan="3">Sale rate</th>
                        </tr>
                        <tr>
                          <th>Min</th>
                          <th>Avg</th>
                          <th>Max</th>
                          <th>Min</th>
                          <th>Avg</th>
                          <th>Max</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>
                  <div
                    className="map"
                    id="adjacent-land-details"
                    style={{ height: 300 }}
                  ></div>
                  {!!props.google &&
                    !!serveyReportData &&
                    !serveyReportData?.adjacentLandDetails && (
                      <>
                        <div className="property-map-div">
                          <Map
                            google={props.google}
                            className="property-map-new"
                            initialCenter={{
                              lat: JSON.parse(serveyReportData.coordinates)[1],
                              lng: JSON.parse(serveyReportData.coordinates)[0],
                            }}
                            center={{
                              lat: JSON.parse(serveyReportData.coordinates)[1],
                              lng: JSON.parse(serveyReportData.coordinates)[0],
                            }}
                            mapType="satellite"
                          >
                            {(() => {
                              var iconShow = "";
                              var coordinates = {
                                lat: JSON.parse(
                                  serveyReportData.coordinates,
                                )[1],
                                lng: JSON.parse(
                                  serveyReportData.coordinates,
                                )[0],
                              };

                              return (
                                <Marker
                                  name={"location"}
                                  icon={locationPin}
                                  position={coordinates}
                                  style={{ height: 100, width: 100 }}
                                  key={`maker${1}`}
                                ></Marker>
                              );
                            })()}
                          </Map>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className="recent-transaction">
              <div className="property-detail-title">
                Recent transactions (Distance range &lt; 2km)
              </div>
              <div className="recent-transaction-table-div">
                <table border="1" id="prop-recent-transaction">
                  <thead>
                    <tr>
                      <th>Property type</th>
                      <th>Unit type</th>
                      <th>Land area</th>
                      <th>Land rate</th>
                      <th>Sale area</th>
                      <th>Sale rate</th>
                      <th>Age</th>
                      <th>{`Distance from survey no.(KM)`}</th>
                      <th>Date of transaction</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
            {/* <div className="layout-horizontal" style={{ marginTop: 10 }}>
              <div className="flex-quater ">
                <div>
                  <label style={{ color: "#828282" }} className="">
                    Owner name :{" "}
                  </label>
                  <span>{}</span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <label style={{ color: "#828282" }} className="">
                    Lat Long :{" "}
                  </label>
                  <span id="reportlat" />
                  <span>,</span> <span id="reportlong"></span>
                </div>
              </div>
              <div className="flex-quater">
                <div>
                  <label style={{ color: "#828282" }} className="">
                    Property Type :{" "}
                  </label>
                  <span></span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <label style={{ color: "#828282" }} className="">
                    City/District :{" "}
                  </label>
                  <span id="reportlat"></span>{" "}
                  <span id="reportlong">
                    {serveyReportData?.regionData?.district ?? ""}
                  </span>
                </div>
              </div>
              <div className="flex-quater">
                <div>
                  <label style={{ color: "#828282" }} className="">
                    Village Name :{" "}
                  </label>
                  <span>{serveyReportData?.regionData?.village ?? ""}</span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <label style={{ color: "#828282" }} className="">
                    Survey Numbers :{" "}
                  </label>{" "}
                  <span id="reportlong">
                    {serveyReportData?.surveyNumberDetails?.[0]
                      ?.surveyDetails ?? 0}
                  </span>
                </div>
              </div>
              <div className="flex-quater">
                {" "}
                <div>
                  <label style={{ color: "#828282" }} className="">
                    Locality:{" "}
                  </label>
                  <span>{serveyReportData?.regionData?.subDistrict ?? ""}</span>
                </div>{" "}
              </div>
            </div> */}

            {/* <div style={{ marginTop: 30 }} className="layout-horizontal">
              <div className="flex-half ">
                <div>
                  <label className="common-title-details">
                    {" "}
                    Boundary Name{" "}
                  </label>
                  <table
                    width="95%"
                    className="align-left border-bottom-dashed"
                  >
                    <tr>
                      <td
                        style={{ textAlign: "left" }}
                        className="blueText flex-half"
                      >
                        {" "}
                        <div>
                          <label style={{ color: "#828282" }} className="">
                            East:{" "}
                          </label>
                          <span>{vlaus.east}</span>
                        </div>{" "}
                      </td>
                      <td className="blueText flex-half">
                        <div>
                          <label style={{ color: "#828282" }} className="">
                            West:{" "}
                          </label>
                          <span>{vlaus.west}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left" }} className="blueText">
                        {" "}
                        <div>
                          <label style={{ color: "#828282" }} className="">
                            North:{" "}
                          </label>
                          <span>{vlaus.north}</span>
                        </div>{" "}
                      </td>
                      <td className="blueText">
                        <div>
                          <label style={{ color: "#828282" }} className="">
                            South:{" "}
                          </label>
                          <span>{vlaus.south}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div style={{ marginTop: 30 }} className="flex-half">
                <div>
                  <label style={{ color: "#828282" }} className="">
                    Distance Nearest ICICI branch :{" "}
                  </label>{" "}
                  <span>
                    {serveyReportData?.branch_details?.[0]?.source_IFSC ?? ""}
                  </span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <label style={{ color: "#828282" }} className="">
                    Number of properties valued in survey number :{" "}
                  </label>
                  <span id="reportlat"></span> <span id="reportlong"></span>
                </div>
              </div>
            </div> */}

            {/* <div style={{ marginTop: 30 }} className="layout-horizontal"> */}
            {/* <div className="flex-half ">
                <label className="common-title-details">
                  {" "}
                  {`Property Price Trends: (distance range<2Kms)`}
                </label>
                <div>
                  <table
                    width="110%"
                    id="Property-price-trend"
                    className="border-right-dashed"
                  >
                    <thead>
                      <tr>
                        <th className="width-20">pin code </th>
                        <th className="width-20">Property </th>
                        <th className="width-20">Min </th>
                        <th className="width-20">Average </th>
                        <th className="width-20">Maximum </th>
                      </tr>
                    </thead>
                    <tbody> </tbody>
                  </table>
                </div>
              </div> */}

            {/* <div
                style={{ marginTop: 30, paddingLeft: 100 }}
                className="flex-half"
              >
                <label className="common-title-details">
                  {" "}
                  {`Property Price Trends`}
                </label>
                <div style={{ width: "50%" }}>
                  <Bar
                    data={chartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div> */}
            {/* </div> */}

            {/* <div style={{ marginTop: 30 }} className="layout-horizontal">
              <div style={{ flex: 0.7 }}>
                <div>
                  <table
                    id="individual"
                    className="border-right-dashed"
                    style={{ width: "95%" }}
                  >
                    <thead>
                      <tr>
                        <th className="width-7">Property Type </th>
                        <th className="width-26">
                          Distance from <div>Subject property</div>{" "}
                        </th>
                        <th className="width-17">{`Land Rate (in sq ft)`} </th>
                        <th className="width-15">{`Flat Rate (in sq ft)`} </th>
                        <th className="width-13">Date of valuation </th>
                      </tr>
                    </thead>
                    <tbody> </tbody>
                  </table>
                </div>
              </div>

              <div style={{ flex: 0.3 }} className="flex-half">
                <div>
                  <div style={{ height: "100%" }}>
                    {!!props.google &&
                      !!serveyReportData.individual_data &&
                      serveyReportData.individual_data.length > 1 && (
                        <Map
                          google={props.google}
                          className="property-map-new"
                          initialCenter={{
                            lat: serveyReportData.individual_data[0][
                              "latitude"
                            ],
                            lng: serveyReportData.individual_data[0][
                              "longitude"
                            ],
                          }}
                          center={{
                            lat: serveyReportData.individual_data[0][
                              "latitude"
                            ],
                            lng: serveyReportData.individual_data[0][
                              "longitude"
                            ],
                          }}
                        >
                          {serveyReportData.individual_data
                            .splice(0, 10)
                            .map((data, id) => {
                              var iconShow = "";
                              var coordinates = {
                                lat: `${data["latitude"]}`,
                                lng: `${data["longitude"]}`,
                              };

                              if (data.property_type === "COMMERCIAL") {
                                iconShow = skyBlueColor;
                              } else if (data.category_type === "CRFG") {
                                iconShow = greenColor;
                              } else if (
                                data.property_type === "COMMERCIAL" &&
                                data.category_type === "PROJECT"
                              ) {
                                iconShow = skyBuildBlueColor;
                              } else if (
                                data.property_type === "INDUSTRIAL" &&
                                data.category_type === "PROJECT"
                              ) {
                                iconShow = purpleBuildcolor;
                              } else if (data.property_type === "RESIDENTIAL") {
                                iconShow = orangeBuildcolor;
                              } else if (
                                data.property_type === "NON RESIDENTIAL"
                              ) {
                                iconShow = royalcolor;
                              } else if (data.category_type === "LVT") {
                                iconShow = lvtColor;
                              }

                              return (
                                <Marker
                                  name={data}
                                  icon={iconShow}
                                  position={coordinates}
                                  style={{ height: 100, width: 100 }}
                                  key={`maker${id}`}
                                ></Marker>
                              );
                            })}
                        </Map>
                      )}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="property-report-footer">
            <span>Powered By</span>
            <img src={satsureLogo.url} width={100} height={30} alt="satsure" />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  serveyReportData: state.serveyReport.serveyReportData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServeyReportData: getServeyReportData,
    },
    dispatch,
  );
}
const LoadingContainer = (props) => <Loader />;

const enhance = compose(
  GoogleApiWrapper({
    apiKey: GOOGLE_MAP_API_KEY,
    LoadingContainer: LoadingContainer,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);
export default enhance(SurveyReportPdfGen);
