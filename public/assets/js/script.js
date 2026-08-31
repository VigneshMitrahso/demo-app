// Local
//const hdfcPin = './assets/images/hdfc-pin.svg';
// Deploy
import hdfcPin from "../images/hdfc-pin.svg";
import json from "../json/test.json";
// jQuery document ready
$(document).ready(function () {
  apiCall();
});
// Api Call
// function apiCall() {
//     // extract query string from url
//     const params = new Proxy(new URLSearchParams(window.location.search), {
//         get: (searchParams, prop) => searchParams.get(prop),
//     });

//     let jsonQueryUrl = params.jsonQueryUrl;
//     console.log(jsonQueryUrl)
//     fetch(jsonQueryUrl)
//         .then((response) => {
//             return response
//                 .json()
//                 .then((responseJson) => {
//                     console.log("response", responseJson);
//                     let file = responseJson.data;
//                     prosuccess(file);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

prosuccess(json);
function prosuccess(propEyeData) {
  var metadata = propEyeData.metadata;
  // propEyeId
  var y, j;
  y = document.querySelectorAll("#propEyeId");
  for (j = 0; j < y.length; j++) {
    y[j].innerHTML = metadata.propEyeId;
  }
  // Date
  var x, i;
  x = document.querySelectorAll("#reportDate");
  for (i = 0; i < x.length; i++) {
    x[i].innerHTML = metadata.reportDate;
  }
  // propertyDetails
  var propertyDetails = propEyeData.propertyDetails;
  var propertyDetails = propEyeData.propertyDetails;
  // document.getElementById("state").innerHTML ="hello"
  for (var key in propertyDetails) {
    if (propertyDetails.hasOwnProperty(key)) {
      document.getElementById(key).innerHTML = propertyDetails[key];
      // You can access the property using propertyDetails[key]
      // For example: var value = propertyDetails[key] || "NA";
    }
  }
  // B. Percentage Inclusion
  const propEyeDataMap = propEyeData;
  var surveyNumberDetails = propEyeDataMap.surveyNumberDetails;
  var yellowPolygon = propEyeDataMap.metadata;
  const coordinates = [];

  if (surveyNumberDetails.length > 1) {
    surveyNumberDetails.map((details) => {
      let coGeometry = JSON.parse(details.geometry);
      if (coGeometry.type === "MultiPolygon") {
        coordinates.push(coGeometry.coordinates[0]);
      } else if (coGeometry.type === "Polygon") {
        coordinates.push(coGeometry.coordinates);
      }
    });
  } else {
    surveyNumberDetails.map((details) => {
      let coGeometry = JSON.parse(details.geometry);
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
  };
  var styleYellow = {
    color: "#F2DA00",
    fillColor: "#FFF961",
    fillOpacity: 0.65,
    weight: 2,
  };
  var locmap = L.map("property-category-map", {
    center: [
      surveyNumberDetails[0].centroid.lat.value,
      surveyNumberDetails[0].centroid.lon.value,
    ],
    zoomAnimation: false,
    zoom: 18,
    attributionControl: true,
    zoomControl: true,
    fadeAnimation: false,
  });
  L.gridLayer
    .googleMutant({
      type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    })
    .addTo(locmap);
  var surveyNumberBoundaries = [];

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
    });
  });

  if (yellowPolygon?.geometry !== null) {
    if (yellowPolygon.geometry.type === "Polygon") {
      var yellowSurveyNumberBoundaries = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Farms Geometry" },
            geometry: {
              type: "Polygon",
              coordinates: yellowPolygon.geometry.coordinates,
            },
          },
        ],
      };
    } else if (yellowPolygon.geometry.type === "MultiPolygon") {
      var yellowSurveyNumberBoundaries = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Farms Geometry" },
            geometry: {
              type: "MultiPolygon",
              coordinates: yellowPolygon.geometry.coordinates,
            },
          },
        ],
      };
    }

    var centLocboundMap = L.geoJSON(yellowSurveyNumberBoundaries, {
      style: styleYellow,
    }).addTo(locmap);

    locmap.fitBounds(centLocboundMap.getBounds());
    locmap.setZoom(17);
    for (const geometryValue of surveyNumberDetails) {
      L.marker(
        [geometryValue.centroid.lat.value, geometryValue.centroid.lon.value],
        {
          icon: L.divIcon({
            className: "label",
            html: `<h1 style='color:#fff; font-size:10px'>${
              geometryValue.surveyLabel ? geometryValue.surveyLabel : "NA"
            }</h1>`,
          }),
        },
      ).addTo(locmap);
    }
  } else {
    L.marker(
      [
        surveyNumberDetails[0].centroid.lat.value,
        surveyNumberDetails[0].centroid.lon.value,
      ],
      {
        icon: L.icon({
          iconUrl: `${hdfcPin}`,
          iconSize: [30, 30],
        }),
      },
    ).addTo(locmap);
  }

  surveyNumberBoundaries.map((item) => {
    L.geoJSON(item, {
      style: styleRed,
    }).addTo(locmap);
  });
  var locboundMap = L.geoJSON(surveyNumberBoundaries, {
    style: styleRed,
  }).addTo(locmap);
  locmap.fitBounds(locboundMap.getBounds());
  locmap.setZoom(18);

  var ppidata = propEyeData.ppi_data;

  ppidata.map((details) => {
    console.log("details");

    $("#ppidata tbody").append(`
    <tr>
    <td>${details.average_land_area_rate}</td>
    <td class="capitalize">${details.average_sellable_area_rate}</td>
    <td><span>${details.city}</span></td>
    <td class="initial"><span>${details.maximum_land_area_rate}</span></td>
    <td><span>${details.maximum_sellable_area_rate}</span></td>
    <td ><span>${details.minimum_land_area_rate}</span></td>
</tr>`);
  });

  // Details of Survey Numbers
  var surveyNumberDetails = propEyeData.surveyNumberDetails;

  surveyNumberDetails.map((details) => {
    let convertObject = Object.entries(details.surveyDetails);
    let detailsValue = convertObject
      .map((item) => `${item[0]}-${item[1]}`)
      .toString();
    $("#surveyNumberDetails tbody").append(`
    <tr>
    <td>${details.surveyLabel || "NA"}</td>
    <td class="capitalize">${details.surveyDetails}</td>
    <td><span>${
      details.centroid.lat.value.toFixed(5) + "°,  " || "NA"
    }</span><span>${
      details.centroid.lon.value.toFixed(5) + "°" || "NA"
    }</span></td>
    <td class="initial"><span>${
      details.surveyArea + " Sq m" || "NA"
    }</span></td>
    <td><span>${
      details.inclusionPercentage ? details.inclusionPercentage + "%" : "NA"
    }</span></td>
    <td class="initial"><span>${
      details.deviation ? details.deviation + "m" : "NA"
    }</span></td>
</tr>`);
  });
  if (surveyNumberDetails.length === 1) {
    let propCat = document.getElementById("propCat");
    propCat.classList.add("naActive");
    let hdfcLocPin = document.getElementById("hdfcLocPin");
    hdfcLocPin.classList.remove("displayNone");
    const boxesList = document.querySelectorAll(".mapActive, .mapActive1");
    boxesList.forEach((box) => {
      box.classList.add("geoAre");
    });
  } else {
    let aPropCat = document.getElementById("aPropCat");
    propCat.classList.add("naActive");
    hdfcLocPin.classList.add("displayNone");
    // aPropCat.classList.add('aActive');
  }
  // Adjacent Land Details
  var adjacentLandDetails = propEyeData.adjacentLandDetails;
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
  var adjacentMap = L.map("adjacent-land-details", {
    // center: [
    //     surveyNumberDetails[0].centroid.lat.value,
    //     surveyNumberDetails[0].centroid.lon.value
    // ],
    zoomAnimation: false,
    zoom: 18,
    attributionControl: true,
    zoomControl: true,
    fadeAnimation: false,
  });

  // ).setView(
  //     [adjacentLandDetails[0].centroid.lat.value,
  //     adjacentLandDetails[0].centroid.lon.value], 12
  // );
  L.gridLayer
    .googleMutant({
      type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    })
    .addTo(adjacentMap);
  if (yellowPolygon?.geometry !== null) {
    if (yellowPolygon.geometry.type === "Polygon") {
      var yellowSurveyNumberBoundaries = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Farms Geometry" },
            geometry: {
              type: "Polygon",
              coordinates: yellowPolygon.geometry.coordinates,
            },
          },
        ],
      };
    } else if (yellowPolygon.geometry.type === "MultiPolygon") {
      var yellowSurveyNumberBoundaries = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Farms Geometry" },
            geometry: {
              type: "MultiPolygon",
              coordinates: yellowPolygon.geometry.coordinates,
            },
          },
        ],
      };
    }

    var adjCentLocboundMap = L.geoJSON(yellowSurveyNumberBoundaries, {
      style: adjStyleRed,
    }).addTo(adjacentMap);
    adjacentMap.fitBounds(adjCentLocboundMap.getBounds());
    adjacentMap.setZoom(17);
  } else {
    var surveyNumberBoundaries = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Farms Geometry" },
          geometry: {
            type: "MultiPolygon",
            coordinates: coordinates,
          },
        },
      ],
    };
    var adjCentLocboundMap = L.geoJSON(surveyNumberBoundaries, {
      style: styleRed,
    }).addTo(adjacentMap);
    // adjacentMap.fitBounds(adjCentLocboundMap.getBounds());
    // adjacentMap.setZoom(17);
  }

  const markers = [];
  for (let i in adjacentLandDetails) {
    var iconMarker = L.marker(
      [
        adjacentLandDetails[i].centroid.lat.value,
        adjacentLandDetails[i].centroid.lon.value,
      ],
      {
        icon: L.icon({
          iconUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${adjacentLandDetails[i].surveyLabel}|FFFFFF|000000`,
          iconSize: [25, 35],
        }),
      },
    ).addTo(adjacentMap);

    markers.push(iconMarker);
  }
  const markerLatLongCen = [[[]]];
  markers.map((markerLatLong) => {
    markerLatLongCen[0][0].push([
      markerLatLong._latlng.lng,
      markerLatLong._latlng.lat,
    ]);
  });
  // Adjacent Land Details icon Bounding Box
  var iconBoundaries = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Farms Geometry" },
        geometry: {
          type: "MultiPolygon",
          coordinates: markerLatLongCen,
        },
      },
    ],
  };
  var adjIconLocboundMap = L.geoJSON(iconBoundaries, {
    style: styleTransparent,
  }).addTo(adjacentMap);
  adjacentMap.fitBounds(adjIconLocboundMap.getBounds());
  adjacentMap.setZoom(18);
  // Table Data
  adjacentLandDetails.map((adjacentDetails) => {
    $("#adjacentLandDetails tbody").append(`
    <tr>
    <td>${adjacentDetails.surveyLabel || "NA"}</td>
    <td class="capitalize">${adjacentDetails?.surveyDetails || "NA"}</td>
    <td class="capitalize">${adjacentDetails.direction || "NA"}</td>
</tr>`);
  });
  // Distance To Nearest HDFC Ltd. Office
  //     var nearestOffices = propEyeData.nearestOffices;
  //     nearestOffices.map((nearestDetails) => {
  //         $("#nearestOffices tbody").append(`
  //     <tr>
  //     <td class="width-5">${nearestDetails.label || "NA"}</td>
  //     <td class="width-50 blue">${nearestDetails.name || "NA"}</td>
  //     <td class="width-50 lowercase"><span>${(nearestDetails.distance / 1000).toFixed(2) + " km" || "NA"
  //             }</span></td>
  // </tr>`);
  //     });
  //  Distance To Amenities In The Neighbourhood
  var amenities = propEyeData.amenities;
  document.getElementById("nearestSchoolName").textContent =
    amenities.nearestSchool.name;
  var nearestSchool = amenities.nearestSchool.distance / 1000;
  document.getElementById("nearestSchool").textContent =
    nearestSchool.toFixed(1);
  document.getElementById("nearestHospitalName").textContent =
    amenities.nearestHospital.name;
  var nearestHospital = amenities.nearestHospital.distance / 1000;
  document.getElementById("nearestHospital").textContent =
    nearestHospital.toFixed(1);
  document.getElementById("nearestUniversityName").textContent =
    amenities.nearestUniversity.name;
  var nearestUniversity = amenities.nearestUniversity.distance / 1000;
  document.getElementById("nearestUniversity").textContent =
    nearestUniversity.toFixed(1);
  document.getElementById("nearestHighwayName").textContent =
    amenities.nearestHighway.name;
  var nearestHighway = amenities.nearestHighway.distance / 1000;
  document.getElementById("nearestHighway").textContent =
    nearestHighway.toFixed(1);
  document.getElementById("nearestRoadRailName").textContent =
    amenities.nearestRoadRail.name;
  var nearestRoadRail = amenities.nearestRoadRail.distance / 1000;
  document.getElementById("nearestRoadRail").textContent =
    nearestRoadRail.toFixed(1);

  // Level Of Urbanization
  var urbanizationLevel = propEyeData.urbanizationLevel;

  // var propertyDetails = propEyeData.propertyDetails;
  //             // document.getElementById("state").innerHTML ="hello"
  //             for (var key in propertyDetails) {
  //                 if (propertyDetails.hasOwnProperty(key)) {
  //                     document.getElementById(key).innerHTML =propertyDetails[key] ;
  //                     // You can access the property using propertyDetails[key]
  //                     // For example: var value = propertyDetails[key] || "NA";
  //                 }
  //             }

  // Object.entries(urbanizationLevel).forEach((item) => {
  //     document.getElementById(item[0]).textContent =
  //         urbanizationLevel[`${item[0]}`] || "NA";
  // });

  for (var key in urbanizationLevel) {
    if (urbanizationLevel.hasOwnProperty(key)) {
      document.getElementById(key).textContent = urbanizationLevel[key] || "NA";
      // You can access the property using propertyDetails[key]
      // For example: var value = propertyDetails[key] || "NA";
    }
  }

  // Regional Parameters
  var regionalparameters = propEyeData.regionalParameters;
  document.getElementById("temperatureMin").textContent =
    regionalparameters.temperature.min || "NA";
  document.getElementById("temperatureMax").textContent =
    regionalparameters.temperature.max || "NA";
  document.getElementById("soilType").textContent =
    regionalparameters.soilType || "NA";
  document.getElementById("nearestWaterBody").textContent =
    regionalparameters.nearestWaterBody || "NA";

  // Water Conditions
  var waterConditions = propEyeData.waterConditions;
  var waterConditionsDate = waterConditions.state[0].district[0].subDistrict[0];
  document.getElementById("waterConditionsTeshsil").textContent =
    waterConditionsDate.name || "NA";
  // Rainfall Trend
  // iterate over all Data values
  const rainfallYears = [];
  Object.keys(waterConditionsDate.rainfall.yearlyData).map((keys) => {
    return rainfallYears.push(keys);
  });
  const rainfallValues = [];
  Object.values(waterConditionsDate.rainfall.yearlyData).map((values) => {
    return rainfallValues.push(values);
  });
  let rainfallTrendMin = Math.min(...rainfallValues) - 50;
  let rainfallTrendMax = Math.max(...rainfallValues) + 50;
  const rainfallTrendChart = $(`#rainfall-trend-water-conditions`);
  new Chart(rainfallTrendChart, {
    type: "bar",
    data: {
      labels: rainfallYears,
      datasets: [
        {
          label: "",
          data: rainfallValues,
          backgroundColor: "#91C3FF",
          borderColor: "#91C3FF",
          borderWidth: 1,
          barThickness: 30,
          family: "sf-pro-display",
          borderRadius: 3,
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      animation: {
        duration: 0, // general animation time
      },
      plugins: {
        legend: {
          display: false,
        },
        // Change options for ALL labels of THIS CHART
        datalabels: {
          display: false,
          anchor: "end",
          align: "end",
          font: {
            size: 8,
          },
          labels: {
            value: {
              color: "#3894FF",
              weight: "bold",
            },
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: "line",
              yMin: waterConditionsDate.rainfall.average,
              yMax: waterConditionsDate.rainfall.average,
              borderColor: "#474379",
              borderWidth: 2,
            },
            label1: {
              type: "label",
              yValue: waterConditionsDate.rainfall.average,
              backgroundColor: "transparent",
              color: "#474379",
              content: waterConditionsDate.rainfall.average,
              position: "end",
              // xAdjust: 300,
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
        },
      },
      scales: {
        y: {
          display: true,
          beginAtZero: false,
          min: rainfallTrendMin,
          max: rainfallTrendMax,
          grid: {
            borderDash: [5],
          },
          title: {
            display: true,
            text: ["Rainfall (mm)"],
            color: "#474379",
            font: {
              family: "sf-pro-display",
              size: 14,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // Groundwater Trend
  const groundWaterTrendChart = $(`#groundwater-trend-water-conditions`);
  // iterate over all Data values
  const groundWaterYears = [];
  Object.keys(waterConditionsDate.groundWater.yearlyData).map((keys) => {
    return groundWaterYears.push(keys);
  });
  const groundWateuValues = [];
  Object.values(waterConditionsDate.groundWater.yearlyData).map((values) => {
    return groundWateuValues.push(values);
  });

  let groundWaterMin = Math.min(...groundWateuValues) - 50;
  let groundWaterMax = Math.max(...groundWateuValues) + 50;
  new Chart(groundWaterTrendChart, {
    type: "bar",
    data: {
      labels: groundWaterYears,
      datasets: [
        {
          label: "",
          data: groundWateuValues,
          backgroundColor: "#88B1B3",
          borderColor: "#88B1B3",
          borderWidth: 1,
          barThickness: 30,
          family: "sf-pro-display",
          borderRadius: 3,
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        // Change options for ALL labels of THIS CHART
        datalabels: {
          display: false,
          anchor: "end",
          align: "end",
          font: {
            size: 8,
          },
          labels: {
            value: {
              color: "#88B1B3",
              weight: "bold",
            },
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: "line",
              yMin: waterConditionsDate.groundWater.average,
              yMax: waterConditionsDate.groundWater.average,
              borderColor: "#006666",
              borderWidth: 2,
            },
            label1: {
              type: "label",
              yValue: waterConditionsDate.groundWater.average,
              backgroundColor: "transparent",
              color: "#006666",
              content: waterConditionsDate.groundWater.average,
              position: "end",
              // xAdjust: 300,
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: groundWaterMin,
          max: groundWaterMax,
          grid: {
            borderDash: [5],
          },
          title: {
            display: true,
            text: ["Equivalent thickness of", "Groundwater (mm)"],
            color: "#474379",
            font: {
              family: "sf-pro-display",
              size: 14,
              fontColor: "#474379",
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}
