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
import {
  ACCESS_TOKEN,
  GET,
  GOOGLE_MAP_API_KEY,
  USER_ID,
} from "../../comman/constants";
import { getServeyReportData } from "../../action/serveyReport";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "../header";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import * as htmlPdf from "html-pdf-chrome";
import { Bar } from "react-chartjs-2";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { compose } from "redux";

import "chartjs-plugin-datalabels";
import Loader from "../loader";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import { apiCall } from "../../comman/connect";
import {
  serveyReportDataUrl,
  serveyReportGenUrl,
  serveyReportRequestUrl,
  serveyAESKey,
} from "../../comman/urls";
import { isEmpty } from "lodash";
import moment from "moment";
// import { color } from "html2canvas/dist/types/css/types/color";

// import windowSize from "react-window-size";

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

const customPin = {
  url: require("../../assets/images/pin-2.png"), // url
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

const downloadicon = {
  url: require("../../assets/images/downloadicon.png"),
};

var locmap = null;
var centLocboundMap = null;
var adjCentLocboundMap = null;

var options = {
  plugins: {
    datalabels: {
      anchor: function () {
        return "start";
      },
      align: function () {
        return "start";
      },
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

const PropertyReportPdf = (props) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [pincode, setPincode] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  var routeName = new URLSearchParams(props.location.search).get("current-route").replaceAll("/","");



  var dataSet = [];
  var lineChartData = [];
  useEffect(() => {
    _getStorageValue(USER_ID).then((id) => {
      let reqid = new URLSearchParams(props.location.search).get("reqid");
      props.getServeyReportData(id, reqid);
    });
    return () => {
      window.location.reload();
    };
  }, []);

  const exportPDF = async () => {
    // _getStorageValue(USER_ID).then(async (id) => {
    // setLoading(true);
    // let reqid = new URLSearchParams(props.location.search).get("reqid");
    // _getStorageValue(ACCESS_TOKEN).then(async (token) => {
    //   let surveyurl = serveyReportGenUrl(id, reqid);
    //   const response = await axios.get(surveyurl, {
    //     headers: {
    //       authorization: token,
    //     },
    //     responseType: "blob", // Important for binary data like PDFs
    //   });
    //   const blob = new Blob([response.data], { type: "application/pdf" });
    //   const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = props.serveyReportData.download_url;
    // a.download = `${reqid}.pdf`;
    a.click();
    //     setLoading(false);
    //   });
    // });
  };

  const pdfExports = useRef(null);

  useEffect(() => {
    if (props.serveyReportData != "") {
      prosuccess({
        ...props?.serveyReportData?.map_data,
        ...props?.serveyReportData?.map_data?.data,
      });
    }

    function prosuccess(propEyeData) {
      setPincode(propEyeData?.pincode || null);
      setCoordinates(
        propEyeData?.coordinates ? JSON.parse(propEyeData.coordinates) : [],
      );
      console.log("propEyeData", propEyeData);

      var metadata = propEyeData?.metadata;
      // propEyeId
      var y, j;
      y = document.querySelectorAll("#propEyeId");
      for (j = 0; j < y.length; j++) {
        y[j].innerHTML =
          propEyeData.prop_request_id ||
          props?.serveyReportData.survey_request_id;
      }
      // Date
      var x, i;
      x = document.querySelectorAll("#reportDate");
      for (i = 0; i < x.length; i++) {
        x[i].innerHTML = metadata?.reportDate
          ? moment(metadata?.reportDate).format("DD-MM-YYYY")
          : "N/A";
      }

      // document.getElementById("propEyeId").innerHTML = propEyeData.prop_request_id;
      let lonLat = JSON.parse(propEyeData.coordinates);
      document.getElementById("reportlong").innerHTML = lonLat[0] ?? "NA";
      document.getElementById("reportlat").innerHTML = lonLat[1] ?? "NA";
      document.getElementById("pincodeid").innerHTML =
        propEyeData.pincode ?? "NA";
      // propertyDetails
      var propertyDetails = propEyeData.propertyDetails;
      // document.getElementById("state").innerHTML ="hello"
      for (var key in propertyDetails) {
        if (propertyDetails.hasOwnProperty(key)) {
          document.getElementById(key).innerHTML = propertyDetails[key];
        }
      }
      // B. Percentage Inclusion
      const propEyeDataMap = propEyeData;
      var surveyNumberDetails = propEyeDataMap.surveyNumberDetails;
      var yellowPolygon = propEyeDataMap.surveyNumberDetails;
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

      //     if(!!yellowPolygon || (!!surveyNumberDetails && surveyNumberDetails.length > 1)){
      //     if (yellowPolygon?.geometry !== null) {
      //         if (yellowPolygon.geometry.type === "Polygon") {
      //             var yellowSurveyNumberBoundaries = {
      //                 type: "FeatureCollection",
      //                 features: [
      //                     {
      //                         type: "Feature",
      //                         properties: { name: "Farms Geometry" },
      //                         geometry: {
      //                             type: "Polygon",
      //                             coordinates: yellowPolygon.geometry.coordinates,
      //                         },
      //                     },
      //                 ],
      //             };
      //         } else if (yellowPolygon.geometry.type === "MultiPolygon") {
      //             console.log(yellowPolygon.geometry.coordinates[0])
      //             var yellowSurveyNumberBoundaries = {
      //                 type: "FeatureCollection",
      //                 features: [
      //                     {
      //                         type: "Feature",
      //                         properties: { name: "Farms Geometry" },
      //                         geometry: {
      //                             type: "MultiPolygon",
      //                             coordinates: yellowPolygon.geometry.coordinates,
      //                         },
      //                     },
      //                 ],
      //             };
      //         }

      //         centLocboundMap = L.geoJSON(yellowSurveyNumberBoundaries, {
      //             style: styleYellow,
      //         }).addTo(locmap);

      //         locmap.fitBounds(centLocboundMap.getBounds());
      //         locmap.setZoom(16);

      //         for (const geometryValue of surveyNumberDetails) {
      //             L.marker(
      //                 [geometryValue.centroid.lat.value, geometryValue.centroid.lon.value],
      //                 {
      //                     icon: L.divIcon({
      //                         className: "label",
      //                         html: `<h1 style='color:#fff; font-size:10px'>${geometryValue.surveyLabel ? geometryValue.surveyLabel : "NA"
      //                             }</h1>`,
      //                     }),
      //                 }
      //             ).addTo(locmap);
      //         }
      //     } else if(!!surveyNumberDetails && surveyNumberDetails.length > 1) {
      //         L.marker(
      //             [
      //                 surveyNumberDetails[0].centroid.lat.value,
      //                 surveyNumberDetails[0].centroid.lon.value,
      //             ],
      //             {
      //                 icon: L.icon({
      //                     iconUrl: `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`,
      //                     iconSize: [30, 30],
      //                 }),
      //             }
      //         ).addTo(locmap);
      //     }
      //     console.log("surveyNumberBoundaries",surveyNumberBoundaries);
      //     if(!!surveyNumberBoundaries){

      //     surveyNumberBoundaries.map((item) => {
      //         L.geoJSON(item, {
      //             style: styleRed,
      //         }).addTo(locmap);
      //     })
      //     var locboundMap = L.geoJSON(surveyNumberBoundaries, {
      //         style: styleRed,
      //     }).addTo(locmap);
      //     locmap.fitBounds(locboundMap.getBounds());
      //     locmap.setZoom(16);
      //     }
      // }

      var ppidata = propEyeData?.ppi_data ?? [];

      // if (ppidata !== []) {
      //     ppidata.map((details) => {
      //         console.log("details")
      //         $("#ppidata tbody").append(`
      //     <tr>
      //     <td>${details.average_land_area_rate}</td>
      //     <td className="capitalize">${details.average_sellable_area_rate}</td>
      //     <td><span>${details.city}</span></td>
      //     <td className="initial"><span>${details.maximum_land_area_rate}</span></td>
      //     <td><span>${details.maximum_sellable_area_rate}</span></td>
      //     <td ><span>${details.minimum_land_area_rate}</span></td>

      //     <td>${details.minimum_sellable_area_rate}</td>
      //     <td className="capitalize">${details.no_of_properties}</td>
      //     <td><span>${details.pincode}</span></td>
      //     <td className="initial"><span>${details.property_type}</span></td>
      //     <td><span>${details.state}</span></td>
      //     <td ><span>${details.unit_type}</span></td>
      //     <td ><span>${details.year}</span></td>

      // </tr>`);
      //     });
      // }
      var individual_data = propEyeData?.individual_data ?? [];

      // if (individual_data !== []) {
      //     ppidata.map((details,index) => {
      //         $("#individual_data tbody").append(`
      //     <tr className="${index%20 === 0 && index!==0 && "page-break container-report"}">
      //     <td>${details.property_type}</td>
      //     <td className="capitalize">${details[`distance in km`]}</td>
      //     <td><span>${details.city}</span></td>
      //     <td className="initial"><span>${details.maximum_land_area_rate}</span></td>
      //     <td><span>${details.maximum_sellable_area_rate}</span></td>
      //     <td ><span>${details.minimum_land_area_rate}</span></td>

      //     <td>${details.minimum_sellable_area_rate}</td>
      //     <td className="capitalize">${details.no_of_properties}</td>
      //     <td><span>${details.pincode}</span></td>
      //     <td className="initial"><span>${details.property_type}</span></td>
      //     <td><span>${details.state}</span></td>
      //     <td ><span>${details.unit_type}</span></td>
      //     <td ><span>${details.year}</span></td>

      // </tr>`);
      //     });
      // }

      var priceTrendData = propEyeData?.property_price_trend_table ?? [];

      if (priceTrendData.length > 0) {
        priceTrendData.map((details, index) => {
          $("#Property-price-trend tbody").append(`
                <tr className="${"page-break"}">
                  <td >${`E${index + 1}` || "NA"}</td>
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
        $("#Property-price-trend tbody").append(
          `<tr><td colspan='8'>No data available</td></tr>`,
        );
      }

      var branchDetails = propEyeData?.branch_details ?? [];
      if (!isEmpty(branchDetails)) {
        branchDetails.map((details, index) => {
          $("#branchDetails tbody").append(`
                <tr className="${
                  index % 20 === 0 && index !== 0 && "page-break"
                }">
                <td>${details?.source_IFSC}</td>
                <td>${details?.source_branch_name}</td>
                <td className="capitalize">${details.source_state}</td>
                <td><span>${
                  details?.distance ? Number(details.distance).toFixed(2) : "-"
                }KM</span></td>
            </tr>`);
        });
      } else {
        $("#branchDetails tbody").append(
          `<tr><td colspan='4'>No data available</td></tr>`,
        );
      }

      var individual_data = propEyeData?.individual_data ?? [];
      if (individual_data != []) {
        individual_data.map((details, index) => {
          $("#individual tbody").append(
            `<tr className="page-break "">
            <td >${index + 1}</td>
                  <td >${details?.property_type || "NA"}</td>
                  <td>${details?.unit_type || "NA"}</td>
                  <td>${details?.land_area || "NA"}</td>
                  <td>${details?.land_rate || "NA"}</td>
                  <td>${details?.sale_area || "NA"}</td>
                  <td>${details?.sale_rate || "NA"}</td>
                  <td>${details?.age || "NA"}</td>
                  <td>${Number(details.distance_in_km).toFixed(2) || "NA"}</td>
                  <td>${
                    moment(details?.date_of_transaction, "YYYY-MM-DD").format(
                      "DD-MM-YYYY",
                    ) || "NA"
                  }</td>
              </tr>`,
          );
        });
      } else {
        $("#individual tbody").append(
          `<tr><td colspan='10'>No data available</td></tr>`,
        );
      }

      // Details of Survey Numbers
      var surveyNumberDetails = propEyeData.surveyNumberDetails;

      if (!isEmpty(surveyNumberDetails)) {
        surveyNumberDetails.map((details) => {
          // let convertObject = Object.entries(details.surveyDetails);
          // let detailsValue = convertObject
          //   .map((item) => `${item[0]}-${item[1]}`)
          //   .toString();
          $("#surveyNumberDetails tbody").append(`
            <tr>
            <td>${details?.surveyLabel || "NA"}</td>
            <td className="capitalize">${details?.surveyDetails}</td>
            <td><span>${
              details?.centroid?.lat?.value.toFixed(5) + "°,  " || "NA"
            }</span><span>${
              details?.centroid?.lon?.value.toFixed(5) + "°" || "NA"
            }</span></td>
            <td className="initial"><span>${
              details?.surveyArea + " Sq m" || "NA"
            }</span></td>

        </tr>`);
        });
        let hdfcLocPin = document.getElementById("hdfcLocPin");
        // let propCat = document.getElementById("propCat");
        if (surveyNumberDetails.length === 1) {
          // propCat.classList.add("naActive");
          hdfcLocPin.classList.remove("displayNone");
          const boxesList = document.querySelectorAll(
            ".mapActive, .mapActive1",
          );
          boxesList.forEach((box) => {
            box.classList.add("geoAre");
          });
        } else {
          // let aPropCat = document.getElementById("aPropCat");
          // propCat.classList.add("naActive");
          // hdfcLocPin.classList.add("displayNone");
          // aPropCat.classList.add('aActive');
        }
      } else {
        $("#surveyNumberDetails tbody").append(
          `<tr><td colspan='4'>No data available</td></tr>`,
        );
      }
      // Adjacent Land Details
      var adjacentLandDetails = propEyeData.adjacentLandDetails;
      if (!isEmpty(adjacentLandDetails)) {
        var adjStyleRed = {
          color: "#FF2121",
          fillColor: "#000",
          fillOpacity: 0,
          weight: 2,
          opacity: 1,
        };
        var styleTransparent = {
          opacity: 0,
          fillColor: "#000",
          fillOpacity: 0,
        };

        // var adjacentMap = L.map("adjacent-land-details", {
        //   // center: [
        //   //     surveyNumberDetails[0].centroid.lat.value,
        //   //     surveyNumberDetails[0].centroid.lon.value
        //   // ],
        //   // zoomAnimation: false,
        //   zoom: 16,
        //   attributionControl: true,
        //   zoomControl: true,
        //   fadeAnimation: false,
        //   // scrollWheelZoom: false,
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
        // if (!isEmpty(yellowPolygon) && yellowPolygon?.geometry !== null) {
        //   if (yellowPolygon.geometry?.type === "Polygon") {
        //     var yellowSurveyNumberBoundaries = {
        //       type: "FeatureCollection",
        //       features: [
        //         {
        //           type: "Feature",
        //           properties: { name: "Farms Geometry" },
        //           geometry: yellowPolygon.geometry,
        //         },
        //       ],
        //     };
        //   } else if (yellowPolygon.geometry?.type === "MultiPolygon") {
        //     var yellowSurveyNumberBoundaries = {
        //       type: "FeatureCollection",
        //       features: [
        //         {
        //           type: "Feature",
        //           properties: { name: "Farms Geometry" },
        //           geometry: {
        //             type: "MultiPolygon",
        //             coordinates: yellowPolygon.geometry.coordinates,
        //           },
        //         },
        //       ],
        //     };
        //   }

        //   // adjCentLocboundMap = L.geoJSON(yellowSurveyNumberBoundaries, {
        //   //   style: adjStyleRed,
        //   // }).addTo(adjacentMap);
        //   // adjacentMap.fitBounds(adjCentLocboundMap.getBounds());
        //   // adjacentMap.setZoom(16);
        // } else {
        //   var surveyNumberBoundaries = {
        //     type: "FeatureCollection",
        //     features: [
        //       {
        //         type: "Feature",
        //         properties: { name: "Farms Geometry" },
        //         geometry: {
        //           type: "MultiPolygon",
        //           coordinates: coordinates,
        //         },
        //       },
        //     ],
        //   };
        //   adjCentLocboundMap = L.geoJSON(surveyNumberBoundaries, {
        //     style: styleRed,
        //   }).addTo(adjacentMap);
        //   // adjacentMap.fitBounds(adjCentLocboundMap.getBounds());
        //   // adjacentMap.setZoom(17);
        // }

          // const markers = [];
          // for (let i in adjacentLandDetails) {
          //   var iconMarker = L.marker(
          //     [
          //       adjacentLandDetails[i].centroid.lat.value,
          //       adjacentLandDetails[i].centroid.lon.value,
          //     ],
          //     {
          //       icon: L.icon({
          //         iconUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${adjacentLandDetails[i].surveyLabel}|FFFFFF|000000`,
          //         iconSize: [25, 35],
          //       }),
          //       opacity: 0,
          //     },
          //   ).addTo(adjacentMap);

          //   markers.push(iconMarker);
          // }
          // const markerLatLongCen = [[[]]];
          // markers.map((markerLatLong) => {
          //   markerLatLongCen[0][0].push([
          //     markerLatLong._latlng.lng,
          //     markerLatLong._latlng.lat,
          //   ]);
          // });
          // // Adjacent Land Details icon Bounding Box
          // var iconBoundaries = {
          //   type: "FeatureCollection",
          //   features: [
          //     {
          //       type: "Feature",
          //       properties: { name: "Farms Geometry" },
          //       geometry: {
          //         type: "MultiPolygon",
          //         coordinates: markerLatLongCen,
          //       },
          //     },
          //   ],
          // };
          // var adjIconLocboundMap = L.geoJSON(iconBoundaries, {
          //   style: styleTransparent,
          // }).addTo(adjacentMap);

          // adjacentMap.fitBounds(adjIconLocboundMap.getBounds());
          // adjacentMap.setZoom(16);

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
        } else {
          $("#adjacentLandDetails tbody").append(
            `<tr><td colspan='3'>No data available</td></tr>`,
          );
        }
      }
      // Distance To Nearest HDFC Ltd. Office
      //     var nearestOffices = propEyeData.nearestOffices;
      //     nearestOffices.map((nearestDetails) => {
      //         $("#nearestOffices tbody").append(`
      //     <tr>
      //     <td className="width-5">${nearestDetails.label || "NA"}</td>
      //     <td className="width-50 blueText">${nearestDetails.name || "NA"}</td>
      //     <td className="width-50 lowercase"><span>${(nearestDetails.distance / 1000).toFixed(2) + " km" || "NA"
      //             }</span></td>
      // </tr>`);
      //     });

      //  Distance To Amenities In The Neighbourhood
      var amenities = propEyeData.amenities;
      document.getElementById("nearestSchoolName").textContent =
        amenities?.nearestSchool?.name || "NA";
      var nearestSchool = amenities?.nearestSchool?.distance / 1000 || 0;
      document.getElementById("nearestSchool").textContent =
      !!nearestSchool ?  nearestSchool.toFixed(2): "NA";
      document.getElementById("nearestHospitalName").textContent =
        amenities?.nearestHospital?.name || "NA";
      var nearestHospital = amenities?.nearestHospital?.distance / 1000 || 0;
      document.getElementById("nearestHospital").textContent =
      !!nearestHospital?  nearestHospital.toFixed(2):"NA";
      document.getElementById("nearestUniversityName").textContent =
        amenities?.nearestUniversity?.name || "NA";
      var nearestUniversity = amenities?.nearestUniversity?.distance / 1000 || 0;
      document.getElementById("nearestUniversity").textContent =
      !!nearestUniversity ? nearestUniversity.toFixed(2) : "NA";
      document.getElementById("nearestHighwayName").textContent =
        amenities?.nearestHighway.name;
      var nearestHighway = amenities?.nearestHighway?.distance / 1000 || 0;
      document.getElementById("nearestHighway").textContent =
      !!nearestHighway ? nearestHighway.toFixed(2): "NA";
      document.getElementById("nearestRoadRailName").textContent =
        amenities?.nearestRoadRail?.name || "NA";
      var nearestRoadRail = amenities?.nearestRoadRail?.distance / 1000 || 0;
      document.getElementById("nearestRoadRail").textContent =
       !!nearestRoadRail? nearestRoadRail.toFixed(2) : "NA";

      //chart
      var years = [];

      dataSet = [];
      var chart = propEyeData.property_price_trend_graph;
      if (chart?.length > 0) {
        chart.forEach((list, index) => {
          years = [...years, list?.year || list?.years_1];
          var obj = {
            label: index === 0 ? "Avegrage LandPrice" : "Average sale price",
            fill: true,
            borderColor:
              "#" + Math.floor(Math.random() * 16777215).toString(16),
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
    }
  }, [props.serveyReportData]);

  const getMapOptions = (maps) => {
    return {
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      gestureHandling: "greedy",
      disableDoubleClickZoom: true,
      minZoom: 11,
      maxZoom: 18,
      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.SATELLITE, // Set the default view to satellite
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [
          maps.MapTypeId.ROADMAP,
          maps.MapTypeId.SATELLITE,
          maps.MapTypeId.HYBRID,
        ],
      },
      zoomControl: true,
      clickableIcons: false,
    };
  };

  return (
    <>
      <Header link={routeName} />
      <div className="container-report">
        {/* <button onClick={exportPDF} className="valu-report">
          Download Report in PDF format
        </button> */}
        {/* <PDFExport
                ref={pdfExports}
                paperSize="A4"
                margin={0}
                imageResolution={3000}
                fileName={"reqid"}
                scale={0.55}
            > */}
        {/* {isLoading && <LoadingContainer />} */}
        <div ref={pdfExports} className="propeye-report-section">
          <header className="propeye-report-header">
            <div className="content">
              <label className="propeye-report-title">PROPERTY REPORT</label>
              <div className="propeye-report-details">
                <div className="propeye-report-id">
                  {/* <label>Property ID : </label>
                  <span id="propEyeId"></span> */}
                  {isLoading ? (
                    <label className="loader-circle-v1"></label>
                  ) : (
                    <>
                      <img
                        src={downloadicon.url}
                        alt="download"
                        width={20}
                        height={20}
                      />
                      <button
                        onClick={exportPDF}
                        style={{
                          opacity: !!!props.serveyReportData.download_url
                            ? 0.5
                            : 1,
                        }}
                        className="download-report-btn"
                        disabled={!!!props.serveyReportData.download_url}
                      >
                        Download Report
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="propeye-report-warppers">
            <div className="common-margin-bottom propeye-report-description">
              <label className="common-title-details">
                A. Property Details
              </label>
              <div className="common-border">
                <div className="property-details-title">
                  <div>
                    <label className="">Property ID : </label>
                    <span id="propEyeId"></span>
                  </div>
                  <div>
                    <label className="">Report Generated on : </label>
                    <span id="reportDate"></span>
                  </div>
                </div>
                <ul className="property-details-table">
                  <li>
                    <label>State : </label>
                    <span className="capitalize" id="state"></span>
                  </li>
                  <li>
                    <label>District : </label>
                    <span className="capitalize" id="district"></span>
                  </li>
                  <li>
                    <label>Property Address : </label>
                    <span className="capitalize" id="propertyAddress"></span>
                  </li>
                  {/* <li>
                    <label>Report Generated On : </label>
                    <span className="capitalize" id="reportDate"></span>
                  </li> */}
                  <li>
                    <label>Latitude : </label>
                    <span className="capitalize" id="reportlat"></span>
                  </li>
                  <li>
                    <label>Longitude : </label>
                    <span className="capitalize" id="reportlong"></span>
                  </li>
                  <li>
                    <label>Pincode : </label>
                    <span className="capitalize" id="pincodeid"></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="common-margin-bottom amenities-neighbourhood">
              <label className="common-title-details">
                B. Distance to nearest ICICI Banks
              </label>
              <table
                id="branchDetails"
                className="border-right-dashed"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="width-7">Sol ID </th>
                    <th className="width-26">Branch Name</th>
                    <th className="width-7">State </th>
                    <th className="width-17">Distance</th>
                  </tr>
                </thead>
                <tbody> </tbody>
              </table>
              <p className="common-para"></p>
            </div>

            <div className="common-margin-bottom amenities-neighbourhood">
              <label className="common-title-details">
                C. Distance to amenities in the neighbourhood
              </label>
              <div>
                <table
                  className="align-left border-bottom-dashed"
                  style={{ width: "100%" }}
                >
                  <tr>
                    <td className="width-5">C1</td>
                    <td className="width-50 blueText">
                      Proximity to nearest SCHOOL
                    </td>
                    <td className="width-50 capitalize">
                      <span id="nearestSchool"></span>
                      <span>km</span>
                      <span
                        style={{ paddingLeft: 5 }}
                        id="nearestSchoolName"
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="width-5">C2</td>
                    <td className="width-50 blueText">
                      Proximity to nearest HOSPITALS
                    </td>
                    <td className="width-50 capitalize">
                      <span id="nearestHospital"></span> km
                      <span
                        style={{ paddingLeft: 5 }}
                        id="nearestHospitalName"
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="width-5">C3</td>
                    <td className="width-50 blueText">
                      Proximity to nearest UNIVERSITY
                    </td>
                    <td className="width-50 capitalize">
                      <span id="nearestUniversity"></span> km
                      <span
                        style={{ paddingLeft: 5 }}
                        id="nearestUniversityName"
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="width-5">C4</td>
                    <td className="width-50 blueText">
                      Proximity to nearest HIGHWAYS
                    </td>
                    <td className="width-50 capitalize">
                      <span id="nearestHighway"></span> km
                      <span
                        style={{ paddingLeft: 5 }}
                        id="nearestHighwayName"
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="width-5">C5</td>
                    <td className="width-50 blueText">
                      Proximity to nearest road/rail
                    </td>
                    <td className="width-50 capitalize">
                      <span id="nearestRoadRail"></span> km
                      <span
                        style={{ paddingLeft: 5 }}
                        id="nearestRoadRailName"
                      ></span>
                    </td>
                  </tr>
                </table>
              </div>
              <p className="common-para"></p>
            </div>

            <div className="common-margin-bottom percent-inclusion-description">
              <div className="title">
                <label className="common-title-details">
                  D. Survey Details
                </label>
              </div>
              <div className="common-border">
                <div className="map-cotainer">
                  <div className="map" id="adjacent-land-details"></div>
                </div>
                <div className="map-list">
                  <ul className="details">
                    <li>
                      <label className="red"></label>
                      <div className="inline-block">
                        <span>Survey</span>
                        <span>Boundary</span>
                      </div>
                    </li>
                    <li id="hdfcLocPin">
                      {/* <label className="hdfc-loc-pin">
                                                <img src="./assets/images/hdfc-pin.svg" />
                                            </label> */}
                      {/* <div className="inline-block">
                                                <span>Geo Location marked</span>
                                                <span>by Field Agent</span>
                                            </div> */}
                    </li>
                    {/* <li className="mapActive">
                      <label className="yellow"></label>
                      <div className="inline-block">
                        <span>Geo Boundary marked</span>
                        <span>by Field Agent</span>
                      </div>
                    </li>
                    <li className="mapActive1">
                      <label className="yellow-bg"></label>
                      <div className="inline-block">
                        <span>Area of</span>
                        <span>Inclusion</span>
                      </div>
                    </li> */}
                  </ul>
                  {/* <p><label>*</label> Geo Boundary Marked by Field Agent not found </p> */}
                </div>
                <div className="map-survey-list">
                  <label className="common-table-title">
                    Details of Survey Numbers
                  </label>

                  <table
                    id="surveyNumberDetails"
                    className="border-right-dashed"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th className="width-7">S.No</th>
                        <th className="width-26">Survey Details</th>
                        <th className="width-17">
                          centroid<div>co-ordinates </div>
                        </th>
                        <th className="width-15">
                          area of<div>survery no </div>
                        </th>
                        {/* <th className="width-13">% Inclusion</th>
                                            <th className="width-17">deviation from centroid</th> */}
                      </tr>
                    </thead>
                    <tbody> </tbody>
                  </table>
                </div>
                {/* <div style={{ marginTop: 20 }}>
                  <label className="common-table-title">
                    Adjacent Land Details
                  </label>
                  <div>
                    <table
                      id="adjacentLandDetails"
                      className="border"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>ADJACENT LAND LABEL</th>
                          <th>ADJACENT LAND SURVEY DETAILS</th>
                          <th>DIRECTION</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>
                </div> */}
              </div>
            </div>

            {/* <div className="common-margin-bottom  adjacent-land-details">
              <div className="common-border ">
                <label className="common-table-title">
                  Adjacent Land Details
                </label>
                <div>
                  <table
                    id="adjacentLandDetails"
                    className="border"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>ADJACENT LAND LABEL</th>
                        <th>ADJACENT LAND SURVEY DETAILS</th>
                        <th>DIRECTION</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div> */}

            {/* <label className="common-title-details">Property analytics</label>
                        <table id="ppidata" className="border-right-dashed" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th className="width-7">Avg land <div> area rate </div></th>
                                    <th className="width-26">Avg sellable <div> area rate </div></th>
                                    <th className="width-17">city</th>
                                    <th className="width-15">Maximum land<div> area rate </div></th>
                                    <th className="width-13">maxumum sellable <div> area rate </div></th>
                                    <th className="width-17">Minimum land<div> area rate </div></th>
                                    <th className="width-17">Minimum sellable<div> area rate </div></th>
                                    <th className="width-7">No of <div> properties </div></th>
                                    <th className="width-26">Pincode </th>
                                    <th className="width-17">Property type</th>
                                    <th className="width-15">State </th>
                                    <th className="width-13">Unit type</th>
                                    <th className="width-17">year </th>
                                </tr>
                            </thead>
                            <tbody> </tbody>
                        </table> */}
            <div
              style={{ marginTop: 60 }}
              className="common-margin-top percent-inclusion-description page-break"
            >
              <div className="common-margin-bottom amenities-neighbourhood">
                <label className="common-title-details">
                  E. Property Price Trends: (distance range &lt; 5Kms)
                </label>
                <div className=" ">
                  <div>
                    <table
                      id="Property-price-trend"
                      className="border-right-dashed"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th rowspan="2" />
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
                        {/* <tr>
                          <th className="width-20">pin code </th>
                          <th className="width-20">Property </th>
                          <th className="width-20">Min </th>
                          <th className="width-20">Average </th>
                          <th className="width-20">Maximum </th>
                        </tr> */}
                      </thead>
                      <tbody> </tbody>
                    </table>
                  </div>
                  <p className="common-para"></p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 60 }}>
              <label className="common-title-details">
                F. Recent transactions (Distance range &lt; 2km)
              </label>
              <div className="common-border">
                <div
                  className=""
                  style={{
                    marginTop: 25,
                    marginBottom: 25,
                    height: 350,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {!!props.google &&
                  !!props.serveyReportData?.map_data?.individual_data &&
                  props.serveyReportData?.map_data?.individual_data.length >
                    0 ? (
                    <Map
                      google={props.google}
                      style={{ height: 350, width: "100%" }}
                      //   className="property-map"
                      mapType="satellite"
                      initialCenter={{
                        lat: props.serveyReportData?.map_data
                          .individual_data[0]["latitude"],
                        lng: props.serveyReportData?.map_data
                          .individual_data[0]["longitude"],
                      }}
                      center={{
                        lat: props.serveyReportData?.map_data
                          .individual_data[0]["latitude"],
                        lng: props.serveyReportData?.map_data
                          .individual_data[0]["longitude"],
                      }}
                    >
                      {props.serveyReportData?.map_data.individual_data.map(
                        (data, id) => {
                          if (!data.latitude && !data.latitude) {
                            return null;
                          }
                          var iconShow = "";
                          var coordinates = {
                            lat: `${data.latitude}`,
                            lng: `${data.longitude}`,
                          };

                          if (data?.property_type === "COMMERCIAL") {
                            iconShow = skyBlueColor;
                          } else if (data?.category_type === "CRFG") {
                            iconShow = greenColor;
                          } else if (
                            data?.property_type === "COMMERCIAL" &&
                            data?.category_type === "PROJECT"
                          ) {
                            iconShow = skyBuildBlueColor;
                          } else if (
                            data?.property_type === "INDUSTRIAL" &&
                            data?.category_type === "PROJECT"
                          ) {
                            iconShow = purpleBuildcolor;
                          } else if (data?.property_type === "RESIDENTIAL") {
                            iconShow = orangeBuildcolor;
                          } else if (
                            data?.property_type === "NON RESIDENTIAL"
                          ) {
                            iconShow = royalcolor;
                          } else if (data?.category_type === "LVT") {
                            iconShow = lvtColor;
                          }

                          return (
                            <Marker
                              name={data}
                              position={coordinates}
                              key={`maker${id}`}
                              label={String(id + 1)}
                            ></Marker>
                          );
                        },
                      )}

                      {!!props.serveyReportData.map_data &&
                        (() => {
                          if (isEmpty(coordinates)) return null;
                          var coordinates = {
                            lat: coordinates[1],
                            lng: coordinates[0],
                          };
                          return (
                            <Marker
                              icon={customPin}
                              position={coordinates}
                            ></Marker>
                          );
                        })()}
                    </Map>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "0.1px solid grey",
                        borderRadius: 4,
                        height: "100%",
                      }}
                    >
                      NO DATA AVAILABLE
                    </div>
                  )}
                </div>
                <div className=" page-break">
                  <table
                    id="individual"
                    className="border-right-dashed"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>SNo.</th>
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
                    <tbody> </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <ul className="propeye-report-footer" style={{ border: 0 }}>
              <li>
                <div className="hdfc-logo"></div>
              </li>
              <li>
                <div className="powered-section">
                  <label className="powered-by">Powered By</label>
                  <span className="satsure-logo">
                    <img src="./assets/images/satSure.png"></img>
                  </span>
                </div>
              </li>
              <li></li>
            </ul>
          </footer>
        </div>
        {/* </PDFExport> */}
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
const LoadingContainer = (props) => {
  return <Loader />;
};

const enhance = compose(
  GoogleApiWrapper({
    apiKey: GOOGLE_MAP_API_KEY,
    LoadingContainer: LoadingContainer,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);
export default enhance(PropertyReportPdf);
