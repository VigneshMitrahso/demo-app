import React, { Suspense, useEffect, useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import Axios from "axios";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { find } from "lodash";
import { bindActionCreators, compose } from "redux";
import { GOOGLE_MAP_API_KEY } from "../../comman/constants";
import Loader from "../loader";

const iciciLogo = {
  url: require("../../assets/images/icicilogo.png"),
};

const locationPin = {
  url: require("../../assets/images/marker.png"),
};

const satsureLogo = {
  url: require("../../assets/images/satsure-new-logo.png"),
};

// const MapComp = React.lazy(() => import("././map"));

const buildingConfig = {
  "Floor No": "floor_no",
  "Sanction Usage": "sanction_usage",
  "Actual Usage": "actual_usage",
  "No of rooms": "no_of_rooms",
  "No of Kitchen": "no_of_kitchens",
  "Occupancy Status": "occupancy_status",
  "Occupied By": "occupied_by",
  "Name of Tenants": "name_of_tenants",
  name_of_tenants: "Name of Tenants",
  floor_no: "Floor No",
  sanction_usage: "Sanction Usage",
  actual_usage: "Actual Usage",
  no_of_rooms: "No of rooms",
  no_of_kitchens: "No of Kitchen",
  occupancy_status: "Occupancy Status",
  occupied_by: "Occupied By",
};

const DownloadReport = (props) => {
  const dispatch = useDispatch();
  const [sellableRate, setSellableRate] = useState(0);
  const [sellableArea, setSellableArea] = useState(0);

  const [landRate, setLandRate] = useState(0); // need to add in url
  const [landArea, setLandArea] = useState(0); // need to add in url
  const [buaRate, setBuaRate] = useState(0); // need to add in url
  const [bua, setBua] = useState(0); // need to add in url
  const [constructionCost, setConstructionCost] = useState(0);
  const [constructionArea, setConstructionArea] = useState(0);
  const [violationDetail, setViolationDetail] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [valuationSummary, setValuationSummary] = useState(null);
  const [latlong, setLatlong] = useState(null);

  const [year, setYear] = useState("NaN");

  const [headerData, setHeaderData] = useState([
    { label: "Request ID", key: "request_code", value: "" },
    { label: "Employee ID", key: "emp_id", value: "" },
    { label: "Employee Name", key: "emp_name", value: "" },
    { label: "Report generated on", key: "requested_on", value: "" },
  ]);

  let [progressData, setProgressData] = useState([
    {
      label: "Progress on Site in  %",
      key: "progress_on_site",
    },
    {
      label: "Type of Structure",
      key: "type_of_structure",
    },
    // {
    //   label: "Structural configuration",
    //   placeholder: "Enter",
    //   key: "structural_configuration",
    // },
    // {
    //   label: "Unit Configuration",
    //   placeholder: "Enter",
    //   key: "unit_configuration",
    // },
  ]);

  const [boundries, setBoundaries] = useState([
    {
      label: "East",
      placeholder: "Enter",
      key: "boundary_east",
    },
    {
      label: "North",
      placeholder: "Enter",
      key: "boundary_north",
    },
    {
      label: "West",
      placeholder: "Enter",
      key: "boundary_west",
    },
    {
      label: "South",
      placeholder: "Enter",
      key: "boundary_south",
    },
  ]);

  const [occupancy, setOccupancy] = useState([
    // {
    //   label: "No. of Tenants",
    //   placeholder: "Enter",
    //   key: "no_of_tenants",
    // },
    {
      label: "Age of the Property",
      placeholder: "Enter",
      key: "age_of_property",
    },
    // {
    //   label: "Residual Age",
    //   placeholder: "Enter",
    //   key: "residual_age",
    // },

    // { label: "Occupancy Since", placeholder: "Enter", key: "occupied_since" },
  ]);

  const [isCaution, setIscaution] = useState("");
  const [apiData, setApiData] = useState(null);

  const dropDownvalues = ["Yes", "No"];

  const [inputData, setInputData] = useState([
    {
      label: "Property Type*",
      placeholder: "Enter",
      value: "",
      disabled: true,
      key: "property_type",
    },
    {
      label: "Project Name",
      placeholder: "Enter",
      value: "",
      key: "project_name",
    },
    {
      label: "Unit Type*",
      value: "",
      placeholder: "Enter",
      disabled: false,
      key: "unit_type",
    },
    {
      label: "Property Limit",
      value: "",
      placeholder: "Enter",
      type: "select",
      key: "property_limit",
    },
    {
      label: "Road Width",
      placeholder: "Enter",
      key: "road_width",
    },
    {
      label: "Unit No.",
      placeholder: "Enter",
      value: "",
      key: "unit_no",
    },
    {
      label: "Property Address",
      value: "",
      placeholder: "Enter",
      key: "property_address",
    },
    {
      label: "Landmark",
      placeholder: "Enter",
      value: "",
      key: "landmark",
    },
    {
      label: "Land Classification",
      placeholder: "Enter",
      value: "",
      key: "land_classification",
    },
    {
      label: "City",
      placeholder: "Enter",
      value: "",
      key: "city",
    },
    {
      label: "Block Name",
      placeholder: "Enter",
      value: "",
      key: "block_name",
    },
  ]);
  const [buildingDataSource, setBuildingDataSource] = useState([{}]);
  const [buildingDetails, setBuildingDetails] = useState({
    "Floor No": "",
    "Sanction Usage": "",
    "Actual Usage": "",
    "No of rooms": "",
    "No of Kitchen": "",
    "Occupancy Status": "",
    "Occupied By": "",
    "Name of Tenants": "",
  });
  const [isOpen, setOpen] = useState(false);
  const [isloading, setLoading] = useState(false);

  const [checklist, setChecklist] = useState([
    {
      key: "surrounding_area_dev_checked",
      label: "Surrounding area development is checked?",
    },
    {
      key: "virtual_desktop_valuation_criteria",
      label:
        "Is the property falling under virtual or desktop valuation criteria? ",
    },
    {
      key: "society_name_board_available",
      label:
        "Is the society name board/property number board available on site? ",
    },
    {
      key: "property_demarcated",
      label: "Is the property demarcated on site?",
    },
    {
      key: "violations_observed",
      label: "Are there any violations observed on site ?",
    },
    {
      key: "caution_areas_present",
      label: "Are there any Caution areas in and around the property ?",
    },
  ]);

  const handleSelectionChange = (key, option) => {
    let updatedChekList = checklist.map((mapData) => {
      if (key === mapData.key) {
        let result = option === "Yes" ? true : false;
        return { ...mapData, value: result };
      } else {
        return mapData;
      }
    });
    setChecklist(updatedChekList);
  };

  const styles = {
    container: {
      display: "flex",
      border: "1px solid #D3D3D3",
      borderRadius: "5px",
      overflow: "hidden",
      width: "150px",
      height: "40px",
    },
    option: (isSelected) => ({
      flex: 1,
      textAlign: "center",
      padding: "10px",
      cursor: "pointer",
      backgroundColor: isSelected ? "#003366" : "#fff",
      color: isSelected ? "#fff" : "#333",
      borderRight: isSelected ? "none" : "1px solid #D3D3D3",
      borderLeft: isSelected ? "none" : "1px solid #D3D3D3",
    }),
  };

  const intializingData = (response) => {
    const data = response[0];
    setLatlong(
      data && data.latitude && data.latitude
        ? { lat: Number(data.latitude), long: Number(data.longitude) }
        : null,
    );

    let headervalues = headerData.map((each) => {
      return { ...each, value: data[each.key] };
    });
    setHeaderData(headervalues);
    let inputvalues = inputData.map((each) => {
      return { ...each, value: data[each.key] };
    });

    setInputData(inputvalues);
    let boundriesvalue = boundries.map((each) => {
      return { ...each, value: data[each.key] };
    });
    setBoundaries(boundriesvalue);
    let occupancyValues = occupancy.map((each) => {
      return { ...each, value: data[each.key] };
    });

    setOccupancy(occupancyValues);

    let progressValue = progressData.map((each) => {
      return { ...each, value: data[each.key] };
    });

    setProgressData(progressValue);
    let checklistValue = checklist.map((each) => {
      return { ...each, value: data[each.key] };
    });

    setChecklist(checklistValue);
    let buildConfig = data.building_configuration
      .filter((fd) => Object.keys(fd).length > 0)
      .map((mapData) => {
        let keyname = Object.keys(mapData);
        let values = {};
        keyname.forEach((md) => {
          values = { ...values, [buildingConfig[md]]: mapData[md] };
        });
        return values;
      });
    buildConfig = [...buildConfig];
    setBuildingDataSource(buildConfig);
    setYear(data.occupied_since);
    setLandRate(data.land_rate_inr_sqft);
    setBuaRate(data.builtup_rate_inr_sqft);
    setBua(data.builtup_area_sqft);
    setLandArea(data.land_area_sqft);
    setConstructionCost(data.construction_cost);
    setConstructionArea(data.construction_area);
    setViolationDetail(data.violation_details);
    setValuationSummary({
      amenities: data.amenities,
      total_in_inr: data.total_in_inr,
    });
  };

  const getPropertyData = async () => {
    let url = new URLSearchParams(props.location.search).get("jsonQueryUrl");
    let source = new URLSearchParams(props.location.search).get("source");
    let propertType = new URLSearchParams(props.location.search).get(
      "property_type",
    );
    let unitType = new URLSearchParams(props.location.search).get("unit_type");

    for (const param of new URLSearchParams(props.location.search)) {
      console.log(param);
    }

    const response = await Axios.get(
      `${url}&source=${source}&property_type=${propertType}&unit_type=${unitType}`,
      {
        headers: { "api-key": "e81d215a-0bec-42a7-9e3e-335fda72785a" },
      },
    );

    const onSuccess = (response) => {
      if (!!response.data.data) {
        intializingData(response.data.data);
        setApiData(response.data.data);
        let tenImages = response.data.data[0].image_urls.image_details.filter(
          (_, index) => index < 5,
        );
        setImgs(tenImages);
      }
    };

    onSuccess(response);
  };

  useEffect(() => {
    getPropertyData();
  }, []);

  const onChangeInput = (e, key) => {
    let inputValue = e.target.value;
    let outputData = inputData.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setInputData(outputData);
  };

  const onChangeBoundaries = (e, key) => {
    let inputValue = e.target.value;
    let outputData = boundries.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setBoundaries(outputData);
  };

  const onChangeOccupancy = (e, key) => {
    let inputValue = e.target.value;
    let outputData = occupancy.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setOccupancy(outputData);
  };

  const onChageProgressData = (e, key) => {
    let inputValue = e.target.value;
    let outputData = progressData.map((md, index) => {
      if (key === index) {
        return { ...md, value: inputValue };
      } else {
        return md;
      }
    });
    setProgressData(outputData);
  };

  const totalLandRate = useMemo(() => {
    return landArea * landRate;
  }, [landArea, landRate]);

  const totalBuiltUpRate = useMemo(() => {
    return bua * buaRate;
  }, [bua, buaRate]);

  const totalFAirArea = useMemo(() => {
    return totalLandRate + totalBuiltUpRate;
  }, [totalLandRate, totalBuiltUpRate]);

  const summarydata = useMemo(() => {
    return [
      {
        label: "Land Area (in sqft)",
        value: landArea,
      },
      {
        label: "Land Rate (in INR/sqft)",
        value: landRate,
      },
      { label: "Total Land Rate (in INR)", value: totalLandRate },
      { label: "Built up Area (in sqft)", value: bua },
      { label: "Built up rate (in INR/sqft)", value: buaRate },
      { label: "Total Built up Rate (in INR)", value: totalBuiltUpRate },
      { label: "Fair Market Value (in INR)", value: totalFAirArea },
    ];
  }, [totalLandRate, totalBuiltUpRate]);

  return (
    <>
      <div>
        <div className="propeye-report-section">
          <header className="property-report-header">
            <div className="header-content">
              <div className="pdf-header-logo">
                <img src={iciciLogo.url} alt="icici" />
              </div>
              <div className="header-text">
                <span>property report</span>
              </div>
            </div>
          </header>
          <section
            style={{
              marginLeft: 10,
              marginRight: 10,
              padding: 10,
              marginTop: 0,
            }}
            className="propeye-report-warppers avm-report"
          >
            <div className="property-detail-trend">
              <div
                className="property-detail-content"
                style={{ paddingTop: 50 }}
              >
                {/* <div
                  style={{ paddingTop: 50 }}
                  className="property-detail-title"
                >
                  PROPERTY DETAILS
                </div> */}
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  {headerData.map((data, index) => {
                    if (index % 4 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title font-size-14">
                              {headerData[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data font-size-14"
                              id="propertyid"
                            >
                              {headerData[index].value}
                            </div>
                          </div>
                          {!!headerData[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {headerData[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {headerData[index + 1].value}
                              </div>
                            </div>
                          )}
                          {!!headerData[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {headerData[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {headerData[index + 2].value}
                              </div>
                            </div>
                          )}
                          {!!headerData[index + 3] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title card-detail-inr-title font-size-14">
                                {headerData[index + 3].label}
                              </div>
                              <div
                                className="card-detail-inr-data card-detail-inr-title font-size-14"
                                id="propertyid"
                              >
                                {headerData[index + 3].value}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="property-detail-content">
                <div
                  style={{ paddingTop: 12 }}
                  className="property-detail-title font-size-16"
                >
                  PROPERTY DETAILS
                </div>
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr property-detail-content-inr-1"
                >
                  <div className="property-detail-content-inr-left">
                    <div className="inr-row">
                      <div className="inr-row-item">
                        <div className="font-size-14">Property type</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "property_type"])?.value ||
                            "-"}
                        </div>
                      </div>
                      <div className="inr-row-item">
                        <div className="font-size-14">Unit type</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "unit_type"])?.value || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="inr-row">
                      <div className="inr-row-item">
                        <div className="font-size-14">Unit No.</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "unit_no"])?.value || "-"}
                        </div>
                      </div>
                      <div className="inr-row-item">
                        <div className="font-size-14">Block name</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "block_name"])?.value || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="inr-row">
                      <div className="inr-row-item">
                        <div className="font-size-14">Project name</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "project_name"])?.value ||
                            "-"}
                        </div>
                      </div>
                      <div className="inr-row-item">
                        <div className="font-size-14">City</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "city"])?.value || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="inr-row inr-last-row">
                      <div className="inr-row-item">
                        <div className="font-size-14">Property address</div>
                        <div className="font-size-14">
                          {find(inputData, ["key", "property_address"])
                            ?.value || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="property-detail-content-inr-right">
                    <div className="inr-row">
                      <div className="inr--row-item">
                        <div className="font-size-14">Latitude :</div>
                        <div className="font-size-14">{latlong?.lat}</div>
                      </div>
                      <div className="inr--row-item">
                        <div className="font-size-14">Longitude :</div>
                        <div className="font-size-14">{latlong?.long}</div>
                      </div>
                    </div>
                    <div style={{ height: "calc(100% - 30px)" }}>
                      {/* <div className="property-map-div"> */}
                      {latlong && latlong.lat && latlong.long && (
                        <Map
                          google={props?.google}
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: 9999,
                          }}
                          containerStyle={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                          initialCenter={{
                            lat: latlong.lat,
                            lng: latlong.long,
                          }}
                          fullscreenControl={false}
                          mapTypeControl={false}
                          zoomControl={false}
                          panControl={false}
                          draggableCursor={null}
                          streetViewControl={false}
                          center={{ lat: latlong.lat, lng: latlong.long }}
                          mapType="satellite"
                        >
                          {(() => {
                            return (
                              <Marker
                                name={"location"}
                                // icon={locationPin}
                                position={{
                                  lat: latlong.lat,
                                  lng: latlong.long,
                                }}
                                style={{ height: 100, width: 100 }}
                                key={`maker${1}`}
                              ></Marker>
                            );
                          })()}
                        </Map>
                      )}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="property-detail-content">
                <div
                  style={{ paddingTop: 12 }}
                  className="property-detail-title"
                >
                  PROPERTY DETAILS
                </div>

                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  {inputData.map((data, index) => {
                    if (index % 4 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title">
                              {inputData[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data"
                              id="propertyid"
                            >
                              {inputData[index].value}
                            </div>
                          </div>
                          {!!inputData[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title">
                                {inputData[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data"
                                id="propertyid"
                              >
                                {inputData[index + 1].value}
                              </div>
                            </div>
                          )}
                          {!!inputData[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title">
                                {inputData[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data"
                                id="propertyid"
                              >
                                {inputData[index + 2].value}
                              </div>
                            </div>
                          )}
                          {!!inputData[index + 3] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title">
                                {inputData[index + 3].label}
                              </div>
                              <div
                                className="card-detail-inr-data"
                                id="propertyid"
                              >
                                {inputData[index + 3].value}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div> */}

              <div className="property-detail-content">
                <div className="property-detail-title font-size-16">
                  BOUNDARIES AS PER SITE
                </div>
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  {boundries.map((data, index) => {
                    if (index % 4 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title font-size-14">
                              {boundries[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data font-size-14"
                              id="propertyid"
                            >
                              {boundries[index].value || "-"}
                            </div>
                          </div>
                          {!!boundries[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {boundries[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {boundries[index + 1].value || "-"}
                              </div>
                            </div>
                          )}
                          {!!boundries[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {boundries[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {boundries[index + 2].value || "-"}
                              </div>
                            </div>
                          )}
                          {!!boundries[index + 3] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {boundries[index + 3].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {boundries[index + 3].value || "-"}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}

                  {occupancy.map((data, index) => {
                    if (index % 4 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title font-size-14">
                              {occupancy[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data font-size-14"
                              id="propertyid"
                            >
                              {occupancy[index].value || "-"}
                            </div>
                          </div>
                          {!!occupancy[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {occupancy[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {occupancy[index + 1].value}
                              </div>
                            </div>
                          )}
                          {!!occupancy[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {occupancy[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {occupancy[index + 2].value}
                              </div>
                            </div>
                          )}
                          {!!occupancy[index + 3] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {occupancy[index + 3].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {occupancy[index + 3].value}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              <div className="property-detail-content">
                <div className="property-detail-title font-size-16">
                  BUILDING CONFIGURATION
                </div>
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  {progressData.map((data, index) => {
                    if (index % 4 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title font-size-14">
                              {progressData[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data font-size-14"
                              id="propertyid"
                            >
                              {progressData[index].value}
                            </div>
                          </div>
                          {!!progressData[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {progressData[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {progressData[index + 1].value}
                              </div>
                            </div>
                          )}
                          {!!progressData[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {progressData[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {progressData[index + 2].value}
                              </div>
                            </div>
                          )}
                          {!!progressData[index + 3] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title font-size-14">
                                {progressData[index + 3].label}
                              </div>
                              <div
                                className="card-detail-inr-data font-size-14"
                                id="propertyid"
                              >
                                {progressData[index + 3].value}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                  <div
                    style={{ padding: 16, width: "100%" }}
                    className="price-table-div"
                  >
                    <table
                      style={{ width: "100%" }}
                      border="1"
                      id="prop-price-trend"
                    >
                      <thead>
                        <tr>
                          <th className="price-table-th font-size-14">
                            Floor No
                          </th>
                          <th className="price-table-th font-size-14">
                            Sanction Usage
                          </th>
                          <th className="price-table-th font-size-14">
                            Actual Usage
                          </th>
                          <th className="price-table-th font-size-14">
                            Occupancy Status
                          </th>
                          <th className="price-table-th font-size-14">
                            Occupied By
                          </th>
                          <th className="price-table-th font-size-14">
                            Name of tenants
                          </th>
                          {/* <th className="price-table-th">No of Kitchen</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {buildingDataSource.map((details) => {
                          return (
                            <tr>
                              <td className="price-table-td font-size-14">
                                {details["Floor No"]}
                              </td>
                              <td className="price-table-td font-size-14">
                                {details["Sanction Usage"]}
                              </td>
                              <td className="price-table-td font-size-14">
                                {details["Actual Usage"]}
                              </td>
                              <td className="price-table-td font-size-14">
                                {details["Occupancy Status"]}
                              </td>
                              <td className="price-table-td font-size-14">
                                {details["Occupied By"]}
                              </td>
                              <td className="price-table-td font-size-14">
                                {details["Name of Tenants"]}
                              </td>
                              {/* <td>{details["No of Kitchen"]}</td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="property-detail-content summary-data ">
                <div className="property-detail-title font-size-16">
                  VALUATION SUMMARY
                </div>
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  <div
                    style={{ padding: 16, width: "100%" }}
                    className="price-table-div"
                  >
                    <table
                      style={{ width: "100%" }}
                      border="1"
                      id="prop-price-trend"
                    >
                      <thead>
                        <tr>
                          <th className="price-table-th font-size-14">
                            Description
                          </th>
                          <th className="price-table-th font-size-14">
                            Area (in sqft)
                          </th>
                          <th className="price-table-th font-size-14">
                            Rate (in INR/sqft)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {buildingDataSource.map((details) => {
                          return (
                            <tr>
                              <td className="price-table-td">{details["Description"]}</td>
                              <td className="price-table-td">{details["Area"]}</td>
                              <td className="price-table-td">{details["Rate"]}</td>
                            </tr>
                          );
                        })} */}
                        <tr>
                          <td className="price-table-td font-size-14">Land</td>
                          <td className="price-table-td font-size-14">
                            {landArea || "-"}
                          </td>
                          <td className="price-table-td font-size-14">
                            {landRate || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="price-table-td font-size-14">
                            Construction
                          </td>
                          <td className="price-table-td font-size-14">
                            {constructionArea || "-"}
                          </td>
                          <td className="price-table-td font-size-14">
                            {constructionCost || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="price-table-td font-size-14">
                            Sellable
                          </td>
                          <td className="price-table-td font-size-14">
                            {bua || "-"}
                          </td>
                          <td className="price-table-td font-size-14">
                            {buaRate || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="property-detail-card-main detail-1">
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title font-size-14">
                        Amenities (cost/unit)
                      </div>
                      <div
                        className="card-detail-inr-data font-size-14"
                        id="propertyid"
                      >
                        {valuationSummary && valuationSummary.amenities
                          ? valuationSummary.amenities
                          : ""}
                      </div>
                    </div>
                    <div className="card-detail-inr">
                      <div className="card-detail-inr-title font-size-14">
                        Total (in INR)
                      </div>
                      <div
                        className="card-detail-inr-data font-size-14"
                        id="propertyid"
                      >
                        {valuationSummary && valuationSummary.total_in_inr
                          ? valuationSummary.total_in_inr
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  {summarydata.map((data, index) => {
                    if (index % 3 == 0) {
                      return (
                        <div className="property-detail-card-main detail-1">
                          <div className="card-detail-inr">
                            <div className="card-detail-inr-title">
                              {summarydata[index].label}
                            </div>
                            <div
                              className="card-detail-inr-data"
                              id="propertyid"
                            >
                              {summarydata[index].value}
                            </div>
                          </div>
                          {!!summarydata[index + 1] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title">
                                {summarydata[index + 1].label}
                              </div>
                              <div
                                className="card-detail-inr-data"
                                id="propertyid"
                              >
                                {summarydata[index + 1].value}
                              </div>
                            </div>
                          )}
                          {!!summarydata[index + 2] && (
                            <div className="card-detail-inr">
                              <div className="card-detail-inr-title">
                                {summarydata[index + 2].label}
                              </div>
                              <div
                                className="card-detail-inr-data"
                                id="propertyid"
                              >
                                {summarydata[index + 1].value}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div> */}
              </div>
              <div class="page-break"></div>
              <div className="property-detail-content imag-data">
                <div
                  style={{ paddingTop: 50 }}
                  className="property-detail-title font-size-16"
                >
                  Images
                </div>
                <div
                  style={{ width: "100%" }}
                  className="property-detail-content-inr"
                >
                  <div className="property-detail-card-main detail-1">
                    {imgs
                      .filter((fd, index) => index < 4)
                      .map((data, index) => {
                        return (
                          <>
                            <div className="card-detail-inr font-size-14">
                              <img
                                className="customer-downlod-image"
                                src={data.download_url}
                                alt="img"
                              />
                            </div>
                          </>
                        );
                      })}
                  </div>
                  {/* <div className="property-detail-card-main detail-1">
                    {imgs
                      .filter((fd, index) => index >= 5)
                      .map((data, index) => {
                        return (
                          <>
                            <div className="card-detail-inr">
                              <img
                                className="customer-downlod-image"
                                src={data.download_url}
                                alt="img"
                              />
                            </div>
                          </>
                        );
                      })}
                  </div> */}
                </div>
              </div>

              <div className="property-detail-content ">
                <div className="property-detail-title font-size-16">
                  Check list
                </div>
                <div style={{ width: "100%" }}>
                  <div className="property-detail-card-main detail-1">
                    {checklist.map((data) => {
                      return (
                        <div
                          style={{ flex: 1, alignItems: "center" }}
                          className="d-flex space-between"
                        >
                          <div
                            className="search-element download-report-search-element"
                            style={{ flex: 8 }}
                          >
                            <label className="font-size-14">{data.label}</label>
                          </div>
                          <div>
                            <div
                              className={
                                data.value
                                  ? "download-report-val-yes font-size-14"
                                  : "download-report-val-no font-size-14"
                              }
                            >
                              {data.value ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="property-detail-content ">
                <div className="property-detail-title font-size-16">
                  Violation Details
                </div>
                <div style={{ width: "100%" }}>
                  <div className="property-detail-card-main detail-1">
                    <div
                      style={{ flex: 1, alignItems: "center" }}
                      className="d-flex space-between"
                    >
                      <div
                        className="search-element download-report-search-element"
                        style={{ flex: 8 }}
                      >
                        <label className="font-size-14">
                          {violationDetail ? violationDetail : "-"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="property-detail-content report-prepared-text">
                <span className="font-size-14">Report Prepared by :</span>
                <span className="font-size-14">
                  {find(headerData, ["key", "emp_name"])?.value || "-"}
                </span>
              </div>
            </div>
          </section>
          <footer className="property-report-footer">
            <span className="">Powered By</span>
            <img src={satsureLogo.url} width={100} height={30} alt="satsure" />
          </footer>
        </div>
      </div>
    </>
  );
};
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

export default enhance(DownloadReport);
