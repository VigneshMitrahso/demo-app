import React, { useState, useRef, useMemo, useEffect } from "react";
import { Form } from "react-bootstrap";
import { isEmpty, keys, min, sum } from "lodash";
import Slider from "react-slick";
import CustomAccordian from "./accordian";
import { useDispatch } from "react-redux";
import {
  getAvmData,
  updateAvmData,
} from "../../action/automationStateValuation";
import { _getStorageValue } from "../../comman/localStorage";
import { toast } from "react-toastify";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        paddingLeft: "30px",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        zIndex: 9999,
        paddingRight: "30px",
      }}
      onClick={onClick}
      disabled={false}
    />
  );
}
const Year = [
  2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
  2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
  2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039,
  2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050,
];

const buildingConfig = {
  "Floor No": "floor_no",
  "Sanction Usage": "sanction_usage",
  "Actual Usage": "actual_usage",
  "No of rooms": "no_of_rooms",
  "No of Kitchen": "no_of_kitchens",
  "Unit Configuration": "unit_configuration",
  "Occupancy Status": "occupancy_status",
  "Occupied By": "occupied_by",
  "Name of Tenants": "name_of_tenants",
  floor_no: "Floor No",
  sanction_usage: "Sanction Usage",
  actual_usage: "Actual Usage",
  no_of_rooms: "No of rooms",
  no_of_kitchens: "No of Kitchen",
  occupancy_status: "Occupancy Status",
  occupied_by: "Occupied By",
  name_of_tenants: "Name of Tenants",
  unit_configuration: "Unit Configuration",
};

const ValidationForm = ({ validationData, propertyData, ...props }) => {
  const dispatch = useDispatch();

  const [landRate, setLandRate] = useState(0);
  const [landArea, setLandArea] = useState(props.parentState.landArea);
  const [buaRate, setBuaRate] = useState(0);
  const [bua, setBua] = useState(props.parentState.bua);
  const [ConstructionArea, setConstructionArea] = useState(
    props.parentState.constructionArea,
  );
  const [violation, setViolations] = useState("");

  const [amenities, setAmenities] = useState("");

  const [year, setYear] = useState("NaN");

  let [progressData, setProgressData] = useState([
    {
      label: "Progress on Site in  %",
      key: "progress_on_site",
    },
    {
      label: "Type of Structure",
      key: "type_of_structure",
    },
    {
      label: "No of Floors",
      placeholder: "Enter",
      key: "no_of_floors",
    },
    // { label: "Structural configuration", placeholder: "Enter", key: "structural_configuration" },
    // { label: "Unit Configuration", placeholder: "Enter", key: "unit_configuration" }
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
    //   {
    //   label: "No. of Tenants",
    //   placeholder: "Enter",
    //   key: "no_of_tenants"
    // },
    {
      label: "Age of the Property (In Years)",
      placeholder: "Enter",
      key: "age_of_property",
    },

    // { label: "Occupancy Since", placeholder: "Enter", key: "occupied_since" }
  ]);

  const [isCaution, setIscaution] = useState("");

  const dropDownvalues = ["Yes", "No"];

  const [inputData, setInputData] = useState([
    {
      label: "Property Type*",
      placeholder: "Enter",
      value: props.propertyType,
      disabled: true,
      key: "property_type",
    },
    {
      label: "Project Name",
      placeholder: "Enter",
      value: validationData?.projectName ?? "",
      key: "project_name",
    },
    {
      label: "Unit Type*",
      value: props.unitType,
      placeholder: "Enter",
      disabled: !!props?.unitType ? true : false,
      key: "unit_type",
    },
    {
      label: "Property Limit",
      value: validationData?.propertyLimit ?? "",
      placeholder: "Enter",
      type: "select",
      key: "property_limit",
    },
    {
      label: "Road Width (ft)",
      placeholder: "Enter",
      key: "road_width",
    },
    {
      label: "Unit No.",
      placeholder: "Enter",
      value: validationData?.unitNo ?? "",
      key: "unit_no",
    },
    {
      label: "Property Address",
      value: "",
      placeholder: "Enter",
      key: "property_address",
    },
    // {
    //   label: "Landmark",
    //   placeholder: "Enter",
    //   value: "",
    //   key: "landmark"
    // },
    {
      label: "Land Classification",
      placeholder: "Enter",
      type: "select",
      key: "land_classification",
    },
    {
      label: "Type of City",
      value: props.parentState.typeofCity,
      placeholder: "Enter",
      key: "type_of_city",
      type: "select",
      disabled: true,
    },
    {
      label: "City",
      value: props.parentState.city,
      placeholder: "Enter",
      key: "city",
      type: "select",
      disabled: true,
    },
    {
      label: "Type of Project",
      value: "",
      placeholder: "Enter",
      key: "type_of_project",
      type: "select",
      options: ["Affordable", "Mid", "Luxury"],
      disabled: props.propertyType !== "RESIDENTIAL",
    },
    {
      label: "Block Name / No.",
      value: "",
      placeholder: "Enter",
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
    "Unit Configuration": "",
    "Occupancy Status": "",
    "Occupied By": "",
    "Name of Tenants": "",
  });
  const [isOpen, setOpen] = useState(false);
  const [isloading, setLoading] = useState(false);

  const [pdfData, setPdtData] = useState({ url: "", pdfStatus: "" });

  const [checklist, setChecklist] = useState([
    {
      key: "surrounding_area_dev_checked",
      label: "Surrounding area development is checked?",
    },
    {
      key: "virtual_desktop_valuation_criteria",
      label:
        "Is the property falling under virtual / desktop valuation criteria? ",
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
      key: "caution_areas_present",
      label: "Are there any Caution areas in and around the property ?",
    },
    {
      key: "violations_observed",
      label: "Are there any violations observed on site ?",
    },
  ]);

  const constructionCostData = useMemo(() => {
    let ResidentialRCC = {
      New: {
        "MMR / NCR": 2200,
        "Next 9": 2000,
        Others: 1800,
      },
      "1-5": {
        "MMR / NCR": 2035,
        "Next 9": 1850,
        Others: 1665,
      },
      "1-5": {
        "MMR / NCR": 1705,
        "Next 9": 1550,
        Others: 1395,
      },
      "15-30": {
        "MMR / NCR": 1210,
        "Next 9": 1100,
        Others: 990,
      },
      ">30": {
        "MMR / NCR": 880,
        "Next 9": 1100,
        Others: 720,
      },
    };

    let CommercialRCC = {
      New: {
        "MMR / NCR": 2400,
        "Next 9": 2200,
        Others: 2000,
      },
      "1-5": {
        "MMR / NCR": 2220,
        "Next 9": 2035,
        Others: 1850,
      },
      "1-5": {
        "MMR / NCR": 1860,
        "Next 9": 1705,
        Others: 1550,
      },
      "15-30": {
        "MMR / NCR": 1320,
        "Next 9": 1210,
        Others: 110,
      },
      ">30": {
        "MMR / NCR": 960,
        "Next 9": 880,
        Others: 880,
      },
    };

    let industrialRCC = {
      New: {
        "MMR / NCR": 1600,
        "Next 9": 1400,
        Others: 1300,
      },
      "1-5": {
        "MMR / NCR": 1480,
        "Next 9": 1295,
        Others: 1202.5,
      },
      "1-5": {
        "MMR / NCR": 1240,
        "Next 9": 1085,
        Others: 1007.5,
      },
      "15-30": {
        "MMR / NCR": 880,
        "Next 9": 770,
        Others: 715,
      },
      ">30": {
        "MMR / NCR": 640,
        "Next 9": 560,
        Others: 520,
      },
    };

    let ResidentialLoadBearing = {
      New: {
        "MMR / NCR": 1800,
        "Next 9": 1600,
        Others: 1400,
      },
      "1-5": {
        "MMR / NCR": 1665,
        "Next 9": 1480,
        Others: 1295,
      },
      "1-5": {
        "MMR / NCR": 1395,
        "Next 9": 1240,
        Others: 1085,
      },
      "15-30": {
        "MMR / NCR": 990,
        "Next 9": 880,
        Others: 770,
      },
      ">30": {
        "MMR / NCR": 720,
        "Next 9": 640,
        Others: 560,
      },
    };

    let industrialSteelStructure = {
      New: {
        "MMR / NCR": 2000,
        "Next 9": 1800,
        Others: 1500,
      },
      "1-5": {
        "MMR / NCR": 1850,
        "Next 9": 1665,
        Others: 1388,
      },
      "1-5": {
        "MMR / NCR": 1550,
        "Next 9": 1395,
        Others: 1163,
      },
      "15-30": {
        "MMR / NCR": 1100,
        "Next 9": 990,
        Others: 825,
      },
      "> 30": {
        "MMR / NCR": 800,
        "Next 9": 720,
        Others: 600,
      },
    };

    let PropertyType = props.propertyType;
    let typeOfCity = inputData[8].value || "";
    let city = inputData[7].value || "";
    let structure = progressData[1].value || "";
    let ageOfProperty = occupancy[0].value;

    // Load Bearing
    // Steel Structure

    let dynamicObj = {};

    if (structure == "RCC") {
      if (PropertyType === "RESIDENTIAL") {
        dynamicObj = ResidentialRCC;
      } else if (PropertyType === "COMMERCIAL") {
        dynamicObj = CommercialRCC;
      } else if (PropertyType === "INDUSTRIAL") {
        dynamicObj = industrialRCC;
      }
    } else if (structure === "Load Bearing") {
      if (PropertyType === "RESIDENTIAL") {
        dynamicObj = ResidentialLoadBearing;
      }
    } else if (structure === "Steel Structure") {
      if (PropertyType === "INDUSTRIAL") {
        dynamicObj = industrialSteelStructure;
      }
    }

    let constOFConstruction = dynamicObj?.[ageOfProperty]?.[typeOfCity] || 0;

    if (
      props.unitType === "FLAT" ||
      props.unitType === "OFFICE" ||
      props.unitType === "RETAIL"
    ) {
      constOFConstruction = 0;
    }

    return constOFConstruction;
  }, [
    props.propertyType,
    inputData[8].value,
    inputData[7].value,
    progressData[1].value,
    occupancy[0].value,
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 5,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 3, infinite: false },
      },
    ],
  };

  const intializingData = (response) => {
    const data = response[0];
    setPdtData({ url: data.pdf_file_url, pdfStatus: data.pdf_status });

    setViolations(data.violation_details);

    let keyData = {
      property_type: props.propertyType,
      unit_type: props?.unitType,
      unit_no: validationData?.unitNo,
      property_limit: validationData?.propertyLimit,
      project_name: validationData?.projectName,
      type_of_city: props.parentState.typeofCity,
      city: props.parentState.city,
    };

    let inputvalues = inputData.map((each) => {
      let value = data[each.key];
      if (!!keyData[each.key]) {
        value = keyData[each.key];
      }
      return { ...each, value: value };
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

    buildConfig = [...buildConfig, {}];

    setBuildingDataSource(buildConfig);
    setYear(data.occupied_since);
    setAmenities(data.amenities);

    setLandRate(data.land_rate_inr_sqft);
    // setLandArea(data.land_area_sqft)
    setBuaRate(data.builtup_rate_inr_sqft);
    // setBua(data.builtup_area_sqft)

    if (!!props.parentState.bua == false) {
      setBua(data.builtup_area_sqft);
    }

    if (!!props.parentState.landArea === false) {
      setLandArea(data.data.land_area_sqft);
    }
  };

  const getPropertyData = (defaultFlag = false) => {
    _getStorageValue("USER_ID").then((userId) => {
      dispatch(
        getAvmData(
          userId,
          props.parentState.requestID,
          props.propertyType,
          props.unitType,
          onSuccess,
          onFailure,
        ),
      );
    });
    const onSuccess = (response) => {
      if (!!response.data) {
        if (defaultFlag) {
          const data = response.data.data[0];

          setPdtData({ url: data.pdf_file_url, pdfStatus: data.pdf_status });
        } else {
          intializingData(response.data);
        }
      }
    };

    const onFailure = (response) => {};
  };

  useEffect(() => {
    getPropertyData();
  }, [props.parentState.requestID]);

  const downloadPdf = () => {
    if (pdfData.pdfStatus === "success") {
      const a = document.createElement("a");
      a.href = pdfData.url;
      a.click();
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setBuildingDetails({
      "Floor No": "",
      Usage: "",
      "No of rooms": "",
      "No of Kitchen": "",
      "Unit Configuration": "",
      "Occupancy Status": "",
      "Occupied By": "",
      "Name of Tenants": "",
    });
  };

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

  const onChageProgressData = (e, index) => {
    let inputValue = e.target.value;
    let outputData = progressData.map((md, i) => {
      if (index === i) {
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

  const suggestedRates = useMemo(() => {
    let results = Object.keys(props.propEdge);

    if (
      results &&
      results.length > 0 &&
      propertyData.hasOwnProperty("sale_tst_average_rate_0_2km") &&
      propertyData.hasOwnProperty("icic_sale_average_rate_0_2km") &&
      propertyData.hasOwnProperty("market_sale_average_rate")
    ) {
      const {
        sale_tst_average_rate_0_2km,
        tst_average_rate_0_2km,
        icic_sale_average_rate_0_2km,
        icic_land_average_rate_0_2km,
        market_land_average_rate,
        market_sale_average_rate,
      } = propertyData;
      const {
        IndividualDataForLands_IndependentBuildings,
        IndividualDataForCommercial,
        IndividualDataForResidentialFlats,
        IndividualDataForResidentialVillas_RowHouses,
        ProjectDataForLands,
        ProjectDataForCommercial,
        ProjectDataForIndependentFloor,
        ProjectDataForResidentialFlats,
        ProjectDataForResidentialVillas_RowHouses,
      } = props.propEdge;

      // const getCount = (list = []) => {
      //   let count = 0;
      //   list.forEach((eacah) => {
      //     if (eacah > 0 && !!eacah) {
      //       count = count + 1;
      //     }
      //   });
      //   return count;
      // };

      const avgDataGetCount = (...test) => {
        const removeZero = test.filter((value) => {
          return value > 0;
        });
        const marginValue = !isEmpty(removeZero)
          ? sum(removeZero) / removeZero.length
          : 0;

        const upperBoundary = marginValue * 1.5;
        const lowerBoundary = marginValue * 0.5;
        const rangeData = removeZero.filter((val) => {
          return val >= lowerBoundary && val <= upperBoundary;
        });

        const finalValue = !isEmpty(rangeData)
          ? sum(rangeData) / rangeData.length
          : 0;

        return finalValue;
      };

      const tst_land_average_rate_0_2km = tst_average_rate_0_2km;

      const residentialLandRate = () => {
        let suggestedLandRate = 0;

        const icici = icic_land_average_rate_0_2km;
        const tst = tst_land_average_rate_0_2km;
        const mkt = market_land_average_rate;

        // let avgLandRate2km =
        //   (icic_land_average_rate_0_2km +
        //     IndividualDataForLands_IndependentBuildings.WtAvgRate2KM +
        //     ProjectDataForLands.WtAvgRate2KM +
        //     market_land_average_rate +
        //     tst_land_average_rate_0_2km) /
        //   getCount([
        //     icic_land_average_rate_0_2km,
        //     IndividualDataForLands_IndependentBuildings.WtAvgRate2KM,
        //     ProjectDataForLands.WtAvgRate2KM,
        //     market_land_average_rate,
        //     tst_land_average_rate_0_2km,
        //   ]);
        // suggestedLandRate = avgLandRate2km;

        suggestedLandRate = avgDataGetCount(
          icici,
          IndividualDataForLands_IndependentBuildings?.WtAvgRate2KM,
          ProjectDataForLands?.WtAvgRate2KM,
          tst,
          mkt,
        );

        if (isNaN(suggestedLandRate)) {
          suggestedLandRate = 0;
        }
        return suggestedLandRate;
      };

      const residentialSaleRate = () => {
        let suggestedLandRate = 0;
        if (
          isEmpty(ProjectDataForResidentialVillas_RowHouses) ||
          isEmpty(IndividualDataForResidentialVillas_RowHouses)
        ) {
          return suggestedLandRate;
        }

        const icici = icic_sale_average_rate_0_2km;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate;

        // let avgLandRate2km =
        //   (icic_sale_average_rate_0_2km +
        //     (ProjectDataForResidentialVillas_RowHouses[
        //       inputData[10].value
        //     ]?.WtAvgRate2KM || 0) +
        //     (IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM ||
        //       0) +
        //     sale_tst_average_rate_0_2km +
        //     market_sale_average_rate) /
        //   getCount([
        //     icic_sale_average_rate_0_2km,
        //     ProjectDataForResidentialVillas_RowHouses[
        //       inputData[10].value
        //     ]?.WtAvgRate2KM || 0,
        //     IndividualDataForResidentialVillas_RowHouses?.WtAvgRate2KM ||
        //       0,
        //     sale_tst_average_rate_0_2km,
        //     market_sale_average_rate,
        //   ]);

        suggestedLandRate = avgDataGetCount(
          icici,
          ProjectDataForResidentialVillas_RowHouses[inputData[10].value]
            ?.WtAvgRate2KM,
          IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM,
          tst,
          mkt,
        );
        if (isNaN(suggestedLandRate)) {
          suggestedLandRate = 0;
        }
        return suggestedLandRate;
      };

      const residentialFlatSaleRate = () => {
        let suggestedSaleRate = 0;

        const icici = icic_sale_average_rate_0_2km;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate;

        // let avgSaleRate2km =
        //   (sale_tst_average_rate_0_2km +
        //     icic_sale_average_rate_0_2km +
        //     market_sale_average_rate +
        //     IndividualDataForResidentialFlats.WtAvgRate2KM +
        //     ProjectDataForResidentialFlats.WtAvgRate2KM) /
        //   getCount([
        //     sale_tst_average_rate_0_2km,
        //     icic_sale_average_rate_0_2km,
        //     market_sale_average_rate,
        //     IndividualDataForResidentialFlats.WtAvgRate2KM,
        //     ProjectDataForResidentialFlats.WtAvgRate2KM,
        //   ]);

        suggestedSaleRate = avgDataGetCount(
          icici,
          IndividualDataForResidentialFlats.WtAvgRate2KM,
          ProjectDataForResidentialFlats.WtAvgRate2KM,
          tst,
          mkt,
        );

        if (isNaN(suggestedSaleRate)) {
          suggestedSaleRate = 0;
        }
        return suggestedSaleRate;
      };

      const residentialIndependentHouseSalesRate = () => {
        let suggestedSaleRate = "";

        const icici = 0;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate + market_land_average_rate;

        // let avgSaleRate2km =
        //   (sale_tst_average_rate_0_2km +
        //     IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM +
        //     (ProjectDataForResidentialVillas_RowHouses[inputData[10].value]
        //       ?.WtAvgRate2KM || 0) +
        //     market_sale_average_rate +
        //     market_land_average_rate) /
        //   getCount([
        //     sale_tst_average_rate_0_2km,
        //     IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM,
        //     ProjectDataForResidentialVillas_RowHouses[inputData[10].value]
        //       ?.WtAvgRate2KM || 0,
        //     market_sale_average_rate,
        //     market_land_average_rate,
        //   ]);

        suggestedSaleRate = avgDataGetCount(
          icici,
          IndividualDataForResidentialVillas_RowHouses.WtAvgRate2KM,
          ProjectDataForResidentialVillas_RowHouses[inputData[10].value]
            ?.WtAvgRate2KM,
          tst,
          mkt,
        );

        if (isNaN(suggestedSaleRate)) {
          suggestedSaleRate = 0;
        }

        return suggestedSaleRate;
      };

      const commercialLandRate = () => {
        let suggestedLandRate = "";
        const icici = icic_land_average_rate_0_2km;
        const pe = 0;
        const tst = 0;
        const mkt = market_land_average_rate;

        // let avgLandRate2km =
        //   (icic_land_average_rate_0_2km + market_land_average_rate) /
        //   getCount([icic_land_average_rate_0_2km, market_land_average_rate]);

        suggestedLandRate = avgDataGetCount(icici, pe, tst, mkt);

        if (isNaN(suggestedLandRate)) {
          suggestedLandRate = 0;
        }

        return suggestedLandRate;
      };

      const commercialOfficeRate = () => {
        let suggestedSaleRate = 0;

        const icici = icic_sale_average_rate_0_2km;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate;

        // let avgSaleRate2km =
        //   (sale_tst_average_rate_0_2km +
        //     icic_sale_average_rate_0_2km +
        //     market_sale_average_rate +
        //     ProjectDataForCommercial.WtAvgOfficeRate2KM +
        //     IndividualDataForCommercial.WtAvgRateOffice2KM) /
        //   getCount([
        //     sale_tst_average_rate_0_2km,
        //     icic_sale_average_rate_0_2km,
        //     market_sale_average_rate,
        //     ProjectDataForCommercial.WtAvgOfficeRate2KM,
        //     IndividualDataForCommercial.WtAvgRateOffice2KM,
        //   ]);
        suggestedSaleRate = avgDataGetCount(
          icici,
          ProjectDataForCommercial.WtAvgOfficeRate2KM,
          IndividualDataForCommercial.WtAvgRateOffice2KM,
          tst,
          mkt,
        );
        if (isNaN(suggestedSaleRate)) {
          suggestedSaleRate = 0;
        }

        return suggestedSaleRate;
      };

      const commercialIndipendentBuildingSaleRate = () => {
        let suggestedSaleRate = 0;

        const icici = icic_sale_average_rate_0_2km;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate;

        // let avgSaleRate2km =
        //   (sale_tst_average_rate_0_2km +
        //     icic_sale_average_rate_0_2km +
        //     +market_sale_average_rate +
        //     ProjectDataForCommercial.WtAvgOfficeRate2KM +
        //     IndividualDataForCommercial.WtAvgRateOffice2KM +
        //     ProjectDataForCommercial.WtAvgRetailRate2KM +
        //     IndividualDataForCommercial.WtAvgRateRetail2KM) /
        //   getCount([
        //     sale_tst_average_rate_0_2km,
        //     icic_sale_average_rate_0_2km,
        //     market_sale_average_rate,
        //     ProjectDataForCommercial.WtAvgOfficeRate2KM,
        //     IndividualDataForCommercial.WtAvgRateOffice2KM,
        //     ProjectDataForCommercial.WtAvgRetailRate2KM,
        //     IndividualDataForCommercial.WtAvgRateRetail2KM,
        //   ]);
        suggestedSaleRate = avgDataGetCount(
          icici,
          ProjectDataForCommercial.WtAvgOfficeRate2KM,
          IndividualDataForCommercial.WtAvgRateOffice2KM,
          ProjectDataForCommercial.WtAvgRetailRate2KM,
          IndividualDataForCommercial.WtAvgRateRetail2KM,
          tst,
          mkt,
        );

        if (isNaN(suggestedSaleRate)) {
          suggestedSaleRate = 0;
        }

        return suggestedSaleRate;
      };

      const commercialRetailRate = () => {
        let suggestedSaleRate = 0;

        const icici = icic_sale_average_rate_0_2km;
        const tst = sale_tst_average_rate_0_2km;
        const mkt = market_sale_average_rate;

        // let avgSaleRate2km =
        //   (sale_tst_average_rate_0_2km +
        //     icic_sale_average_rate_0_2km +
        //     market_sale_average_rate +
        //     ProjectDataForCommercial.WtAvgRetailRate2KM +
        //     IndividualDataForCommercial.WtAvgRateRetail2KM) /
        //   getCount([
        //     sale_tst_average_rate_0_2km,
        //     icic_sale_average_rate_0_2km,
        //     market_sale_average_rate,
        //     ProjectDataForCommercial.WtAvgRetailRate2KM,
        //     IndividualDataForCommercial.WtAvgRateRetail2KM,
        //   ]);
        suggestedSaleRate = avgDataGetCount(
          icici,
          ProjectDataForCommercial.WtAvgRetailRate2KM,
          IndividualDataForCommercial.WtAvgRateRetail2KM,
          tst,
          mkt,
        );

        if (isNaN(suggestedSaleRate)) {
          suggestedSaleRate = 0;
        }

        return suggestedSaleRate;
      };

      let avgMapOptions = [
        {
          propertyType: "residential",
          unitType: "land",
          saleRate: residentialSaleRate(),
          landRate: residentialLandRate(),
        },
        {
          propertyType: "residential",
          unitType: "flat",
          saleRate: residentialFlatSaleRate(),
          landRate: residentialLandRate(),
        },
        {
          propertyType: "residential",
          unitType: "independent house",
          saleRate: residentialIndependentHouseSalesRate(),
          landRate: residentialLandRate(),
        },
        {
          propertyType: "commercial",
          unitType: "land",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "commercial",
          unitType: "office",
          saleRate: commercialOfficeRate(),
          landRate: commercialLandRate(),
        },
        {
          propertyType: "commercial",
          unitType: "retail",
          saleRate: commercialRetailRate(),
          landRate: commercialLandRate(),
        },
        {
          propertyType: "commercial",
          unitType: "independent building",
          saleRate: commercialIndipendentBuildingSaleRate(),
          landRate: commercialLandRate(),
        },
        {
          propertyType: "industrial",
          unitType: "land",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "industrial",
          unitType: "unit",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "warehouses",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "hotels",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "malls",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "cinema halls",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "educational institute",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "hospital",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
        {
          propertyType: "specialised property",
          unitType: "function hall/marriage garden",
          saleRate: "N/A",
          landRate: commercialLandRate(),
        },
      ];

      let propertyType = props.propertyType.toLowerCase();
      let unitType = props?.unitType.toLowerCase();

      let selectedList = avgMapOptions.filter(
        (fd) => fd.propertyType === propertyType && fd.unitType == unitType,
      );
      selectedList = selectedList[0];

      let resultSaleRate = Math.round(selectedList.saleRate);
      let resultLandRate = Math.round(selectedList.landRate);

      return {
        suggestedSaleRate: isNaN(resultSaleRate) ? "N/A" : resultSaleRate,
        suggestedLandRate: isNaN(resultLandRate) ? "N/A" : resultLandRate,
      };
    } else {
      return {
        suggestedSaleRate: "N/A",
        suggestedLandRate: "N/A",
      };
    }
  }, [propertyData, validationData, inputData[10].value, props.propEdge]);

  const saveAvmReport = () => {
    let palyloadData = {
      request_code: props.parentState.requestID,
      // "unit_configuration": "3BHK",
      fair_market_value: totalFAirArea,
      total_land_rate: totalLandRate,
      total_built_up_rate: totalBuiltUpRate,
      building_configuration: buildingDataSource.map((mapData) => {
        let keyname = Object.keys(mapData);
        let values = {};
        keyname.forEach((md) => {
          values = { ...values, [buildingConfig[md]]: mapData[md] };
        });
        return values;
      }),
      land_area_sqft: landArea,
      land_rate_inr_sqft: landRate,
      builtup_area_sqft: bua,
      builtup_rate_inr_sqft: buaRate,
      violation_details: violation,
      amenities: amenities,
      latitude: propertyData?.latitude,
      longitude: propertyData?.longitude,
      construction_area: ConstructionArea,
      construction_cost: constructionCostData,
      total_in_inr:
        props.unitType === "FLAT" ||
        props.unitType === "OFFICE" ||
        props.unitType === "RETAIL"
          ? totalSellableRate
          : totalLandRate + totalConstructionCost,
    };

    inputData.forEach((each) => {
      palyloadData = { ...palyloadData, [each.key]: each.value };
    });

    boundries.forEach((each) => {
      palyloadData = { ...palyloadData, [each.key]: each.value };
    });

    occupancy.forEach((each) => {
      palyloadData = { ...palyloadData, [each.key]: each.value };
    });

    progressData.forEach((each) => {
      palyloadData = { ...palyloadData, [each.key]: each.value };
    });

    checklist.forEach((each) => {
      palyloadData = { ...palyloadData, [each.key]: each.value };
    });

    palyloadData = { ...palyloadData, occupied_since: year };

    setLoading(true);
    _getStorageValue("USER_ID").then((userId) => {
      dispatch(updateAvmData(userId, palyloadData, onSuccess, onFailure));
    });
    const onSuccess = (response) => {
      setLoading(false);
      if (!!response.data) {
        toast.success(
          "The report is being generated. Please check back after some time.",
          {
            position: toast.POSITION.BOTTOM_CENTER,
          },
        );
        getPropertyData(true);
      } else {
      }
    };
    const onFailure = (response) => {
      setLoading(false);
    };
  };

  const totalConstructionCost = useMemo(() => {
    return constructionCostData * ConstructionArea + Number(amenities);
  }, [constructionCostData, ConstructionArea, amenities]);

  const totalSellableRate = useMemo(() => {
    return bua * buaRate + Number(amenities);
  }, [buaRate, bua, amenities]);

  return (
    <>
      <div
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          display: "flex",
          padding: 10,
        }}
      >
        <div>
          <span className="normal-text">REQ ID :</span>
          <span>
            <b>{props.parentState.requestID}</b>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{ marginRight: 10, cursor: "pointer" }}
            className="report-download "
            onClick={() => {
              saveAvmReport();
            }}
          >
            {isloading ? (
              <div className="loader-circle-v1"></div>
            ) : (
              <span style={{ color: "white" }}>Submit</span>
            )}
          </div>
          {/* <div
            style={{
              opacity: pdfData.pdfStatus !== "success" ? 0.5 : 1,
              cursor: "pointer",
            }}
            className="report-download"
            onClick={downloadPdf}
          >
            <span style={{ color: "white" }}>Download Report</span>
          </div> */}
        </div>
      </div>
      <div className="valuation-form-container" style={{ overflow: "auto" }}>
        <div className="static-height">
          <div className="">
            <CustomAccordian title="Property Details" toOpen={true}>
              <div className="acc-inner-content">
                {inputData.map((data, index) => {
                  if (index % 2 == 0) {
                    return (
                      <div className="d-flex space-between avm-field">
                        {!!inputData[index + 1] &&
                          !!inputData[index + 1].type &&
                          inputData[index + 1].label ==
                            "Land Classification" && (
                            <div className="search-element width-45">
                              <label>{inputData[index + 1].label}</label>
                              <select
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                onChange={(e) => {
                                  onChangeInput(e, index + 1);
                                }}
                                {...inputData[index + 1]}
                              >
                                <option value="NaN" label="Select" />
                                <option
                                  value="Residential"
                                  label="Residential"
                                />
                                <option value="Commercial" label="Commercial" />
                                <option value="Industrial" label="Industrial" />
                                <option value="Mixed" label="Mixed" />
                                <option value="Others" label="Others" />
                              </select>
                            </div>
                          )}

                        {!!inputData[index] &&
                          !!inputData[index].type &&
                          inputData[index].label == "Type of Project" && (
                            <div className="search-element width-45">
                              <label>{inputData[index].label}</label>
                              <select
                                className="avm-select"
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                onChange={(e) => {
                                  onChangeInput(e, index);
                                }}
                                {...inputData[index]}
                              >
                                <option value="NaN" label="Select" />
                                {inputData[index].options.map((md) => {
                                  return <option value={md} label={md} />;
                                })}
                              </select>
                            </div>
                          )}
                        {!!inputData[index] &&
                          !!inputData[index].type == false && (
                            <div className="search-element width-45">
                              <label>{inputData[index].label}</label>
                              <Form.Control
                                type={
                                  inputData[index].key === "road_width"
                                    ? "number"
                                    : "text"
                                }
                                value={inputData[index].value}
                                onChange={(e) => {
                                  onChangeInput(e, index);
                                }}
                                {...inputData[index]}
                              />
                            </div>
                          )}

                        {!!inputData[index] &&
                          !!inputData[index]?.type &&
                          inputData[index]?.label == "Type of City" && (
                            <div className="search-element width-45">
                              <label>{inputData[index].label}</label>

                              <select
                                className="avm-select"
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                onChange={(e) => {
                                  onChangeInput(e, index);
                                }}
                                {...inputData[index]}
                              >
                                <option value="NaN" label="Select" />
                                <option value="MMR / NCR" label="MMR / NCR" />
                                <option value="Next 9" label="Next 9" />
                                <option value="Others" label="Others" />
                              </select>
                            </div>
                          )}

                        {!!inputData[index + 1] &&
                          !!inputData[index + 1].type &&
                          inputData[index + 1].label == "City" && (
                            <div className="search-element width-45">
                              <label>{inputData[index + 1].label}</label>
                              <select
                                className="avm-select"
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                onChange={(e) => {
                                  onChangeInput(e, index + 1);
                                }}
                                {...inputData[index + 1]}
                                disabled={true}
                              >
                                <option value="NaN" label="Select" />
                                {props.parentState.cityDropDown.map((md) => {
                                  return <option value={md} label={md} />;
                                })}
                              </select>
                            </div>
                          )}

                        {!!inputData[index + 1] &&
                          !!inputData[index + 1].type == false && (
                            <div className="search-element width-45">
                              <label>{inputData[index + 1].label}</label>
                              <Form.Control
                                type="text"
                                value={inputData[index + 1].value}
                                onChange={(e) => {
                                  onChangeInput(e, index + 1);
                                }}
                                {...inputData[index + 1]}
                              />
                            </div>
                          )}

                        {!!inputData[index + 1] &&
                          !!inputData[index + 1].type &&
                          inputData[index + 1].label == "Property Limit" && (
                            <div className="search-element width-45">
                              <label>{inputData[index + 1].label}</label>
                              <select
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                onChange={(e) => {
                                  onChangeInput(e, index + 1);
                                }}
                                {...inputData[index + 1]}
                              >
                                <option value="NaN" label="Select" />
                                <option
                                  value="Municipal Corporation"
                                  label="Municipal Corporation"
                                />
                                <option
                                  value="Development Authority"
                                  label="Development Authority"
                                />
                                <option
                                  value="Gram Panchayat"
                                  label="Gram Panchayat"
                                />
                              </select>
                            </div>
                          )}
                      </div>
                    );
                  }
                })}
              </div>
            </CustomAccordian>

            <CustomAccordian title="Boundaries as per Site">
              <div className="acc-inner-content">
                {boundries.map((data, index) => {
                  if (index % 2 == 0) {
                    return (
                      <div className="d-flex space-between avm-field">
                        <div className="search-element width-45">
                          <label>{boundries[index].label}</label>
                          <Form.Control
                            type="text"
                            value={boundries[index].value}
                            onChange={(e) => {
                              onChangeBoundaries(e, index);
                            }}
                            {...boundries[index]}
                          />
                        </div>
                        <div className="search-element width-45">
                          <label>{boundries[index + 1].label}</label>
                          <Form.Control
                            type="text"
                            value={boundries[index + 1].value}
                            onChange={(e) => {
                              onChangeBoundaries(e, index + 1);
                            }}
                            {...boundries[index + 1]}
                          />
                        </div>
                      </div>
                    );
                  }
                })}

                {occupancy.map((data, index) => {
                  return (
                    <div className="d-flex space-between avm-field">
                      {/* {!!occupancy[index + 1]?.label && <div className="search-element width-45">
                          <label>{occupancy[index + 1]?.label}</label>
                          <Form.Control
                            type="text"
                            value={occupancy[index + 1].value}
                            onChange={(e) => {
                              onChangeOccupancy(e, index + 1);
                            }}
                            {...occupancy[index + 1]}
                          />
                        </div>} */}

                      {occupancy[index]?.label ===
                        "Age of the Property (In Years)" && (
                        <div className="search-element width-45">
                          <label>Age of Property (In Years)</label>
                          <select
                            style={{
                              borderBottomColor: "#ebebeb",
                              borderTop: "none",
                              borderRight: "none",
                              borderLeft: "none",
                              color: "gray",
                            }}
                            value={occupancy[index].value}
                            onChange={(e) => {
                              onChangeOccupancy(e, index);
                            }}
                            disabled={props.unitType === "LAND"}
                          >
                            <option value="NaN" label="Select" />
                            <option value={"New"} label={"New"} />
                            <option value={"1-5"} label={"1-5"} />
                            <option value={"5-15"} label={"5-15"} />
                            <option value={"15-30"} label={"15-30"} />
                            <option value={">30"} label={">30"} />
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CustomAccordian>

            <CustomAccordian title="Building Configuration">
              <div className="table-private" style={{}}>
                <table className="avm building-configuration" border="1">
                  <thead className="sticky-head">
                    <tr>
                      <th>Floor No</th>
                      <th>Sanction Usage</th>
                      <th>Actual Usage</th>
                      <th>No of rooms</th>
                      <th>No of Kitchen </th>
                      <th>Unit Configuration</th>

                      <th>Occupancy Status</th>
                      <th>Occupied By</th>
                      <th>Name of Tenants</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {buildingDataSource && buildingDataSource.length > 0 ? (
                      buildingDataSource.map((details, index) => {
                        return (
                          <tr class="">
                            {details && Object.keys(details).length == 0 ? (
                              keys(buildingDetails).map((item, index) => {
                                return (
                                  <td>
                                    {item === "Occupancy Status" ? (
                                      <div
                                        style={{ width: "100%" }}
                                        className="customer-details-sec"
                                      >
                                        <div
                                          className="down-arrow "
                                          style={{ width: "100%" }}
                                        >
                                          <select
                                            value={buildingDetails[item]}
                                            onChange={(e) => {
                                              let inputValue = e.target.value;
                                              let updatedValues = {};
                                              keys(buildingDetails).forEach(
                                                (each) => {
                                                  if (each === item) {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]: inputValue,
                                                    };
                                                  } else {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]:
                                                        buildingDetails[each],
                                                    };
                                                  }
                                                },
                                              );
                                              if (
                                                updatedValues[
                                                  "Occupancy Status"
                                                ] === "Vacant"
                                              ) {
                                                updatedValues = {
                                                  ...updatedValues,
                                                  ["Occupied By"]: "NaN",
                                                };
                                              }
                                              if (
                                                updatedValues[
                                                  "Occupancy Status"
                                                ] === "Under Construction"
                                              ) {
                                                updatedValues = {
                                                  ...updatedValues,
                                                  ["Occupied By"]: "NaN",
                                                };
                                              }
                                              setBuildingDetails(updatedValues);
                                            }}
                                            className="customer-desc"
                                            style={{ width: "100%" }}
                                          >
                                            <option
                                              value="NaN"
                                              label="Select"
                                            />
                                            <option
                                              value="Occupied"
                                              label="Occupied"
                                            />
                                            <option
                                              value="Vacant"
                                              label="Vacant"
                                            />
                                            <option
                                              value="Under Construction"
                                              label="Under Construction"
                                            />
                                          </select>
                                        </div>
                                      </div>
                                    ) : item === "Occupied By" ? (
                                      <div
                                        style={{ width: "100%" }}
                                        className="customer-details-sec"
                                      >
                                        <div
                                          className="down-arrow "
                                          style={{ width: "100%" }}
                                        >
                                          <select
                                            value={buildingDetails[item]}
                                            disabled={
                                              buildingDetails[
                                                "Occupancy Status"
                                              ] === "Vacant" ||
                                              buildingDetails[
                                                "Occupancy Status"
                                              ] == "Under Construction"
                                            }
                                            onChange={(e) => {
                                              let inputValue = e.target.value;
                                              // let updatedValues =buildingDetails;
                                              // updatedValues[item] = updatedValues[item] + inputValue;
                                              let updatedValues = {};
                                              keys(buildingDetails).forEach(
                                                (each) => {
                                                  if (each === item) {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]: inputValue,
                                                    };
                                                  } else {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]:
                                                        buildingDetails[each],
                                                    };
                                                  }
                                                },
                                              );
                                              setBuildingDetails(updatedValues);
                                            }}
                                            className="customer-desc"
                                            style={{ width: "100%" }}
                                          >
                                            <option
                                              value="NaN"
                                              label="Select"
                                            />
                                            <option
                                              value="Seller"
                                              label="Seller"
                                            />
                                            {/* <option value="Third-Party" label="Third-Party" /> */}
                                            <option
                                              value="Tenant"
                                              label="Tenant"
                                            />
                                            <option
                                              value="Self Occupied"
                                              label="Self Occupied"
                                            />
                                            {/* <option value="Under Construction" label="Under Construction" /> */}
                                            {/* <option value="Vacant" label="Vacant" /> */}
                                          </select>
                                        </div>
                                      </div>
                                    ) : item === "Sanction Usage" ||
                                      item === "Actual Usage" ? (
                                      <div
                                        style={{ width: "100%" }}
                                        className="customer-details-sec"
                                      >
                                        <div
                                          className="down-arrow "
                                          style={{ width: "100%" }}
                                        >
                                          <select
                                            value={buildingDetails[item]}
                                            onChange={(e) => {
                                              let inputValue = e.target.value;
                                              // let updatedValues =buildingDetails;
                                              // updatedValues[item] = updatedValues[item] + inputValue;
                                              let updatedValues = {};
                                              keys(buildingDetails).forEach(
                                                (each) => {
                                                  if (each === item) {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]: inputValue,
                                                    };
                                                  } else {
                                                    updatedValues = {
                                                      ...updatedValues,
                                                      [each]:
                                                        buildingDetails[each],
                                                    };
                                                  }
                                                },
                                              );
                                              setBuildingDetails(updatedValues);
                                            }}
                                            className="customer-desc"
                                            style={{ width: "100%" }}
                                          >
                                            <option
                                              value="NaN"
                                              label="Select"
                                            />
                                            <option
                                              value="Residential"
                                              label="Residential"
                                            />
                                            <option
                                              value="Commercial"
                                              label="Commercial"
                                            />
                                            <option
                                              value="Industrial"
                                              label="Industrial"
                                            />
                                            <option
                                              value="Specialized"
                                              label="Specialized"
                                            />
                                          </select>
                                        </div>
                                      </div>
                                    ) : (
                                      <Form.Control
                                        style={{ width: 100 }}
                                        value={buildingDetails[item]}
                                        onChange={(e) => {
                                          let inputValue = e.target.value;
                                          // let updatedValues =buildingDetails;
                                          // updatedValues[item] = updatedValues[item] + inputValue;
                                          let updatedValues = {};
                                          keys(buildingDetails).forEach(
                                            (each) => {
                                              if (each === item) {
                                                updatedValues = {
                                                  ...updatedValues,
                                                  [each]: inputValue,
                                                };
                                              } else {
                                                updatedValues = {
                                                  ...updatedValues,
                                                  [each]: buildingDetails[each],
                                                };
                                              }
                                            },
                                          );
                                          setBuildingDetails(updatedValues);
                                        }}
                                        type="text"
                                        placeholder="Enter"
                                      />
                                    )}
                                  </td>
                                );
                              })
                            ) : (
                              <>
                                <td>{details["Floor No"] || "NA"}</td>
                                <td>{details["Sanction Usage"] || "NA"}</td>
                                <td>{details["Actual Usage"] || "NA"}</td>
                                <td>{details["No of rooms"] || "NA"}</td>
                                <td>{details["No of Kitchen"] || "NA"}</td>
                                <td>{details["Unit Configuration"] || "NA"}</td>
                                <td>{details["Occupancy Status"] || "NA"}</td>
                                <td>{details["Occupied By"] || "NA"}</td>
                                <td>{details["Name of Tenants"] || "NA"}</td>
                              </>
                            )}
                            <td>
                              {
                                <div className="add-Button">
                                  {details &&
                                    Object.keys(details).length == 0 && (
                                      <button
                                        style={{
                                          width: 100,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={() => {
                                          let removedbuildSource =
                                            buildingDataSource.filter(
                                              (fd) => keys(fd).length > 0,
                                            );
                                          setBuildingDataSource([
                                            ...removedbuildSource,
                                            { ...buildingDetails },
                                            {},
                                          ]);
                                          setBuildingDetails({
                                            "Floor No": "",
                                            "Sanction Usage": "",
                                            "Actual Usage": "",
                                            "No of rooms": "",
                                            "No of Kitchen": "",
                                            "Unit Configuration": "",
                                            "Occupancy Status": "",
                                            "Occupied By": "",
                                            "Name of Tenants": "",
                                          });
                                        }}
                                      >
                                        {"Add"}
                                      </button>
                                    )}
                                  {details &&
                                    Object.keys(details).length > 0 && (
                                      <button
                                        style={{
                                          width: 100,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={() => {
                                          let updatedData =
                                            buildingDataSource.filter(
                                              (fd, key) => key !== index,
                                            );
                                          setBuildingDataSource(updatedData);
                                        }}
                                      >
                                        {"Delete"}
                                      </button>
                                    )}
                                </div>
                              }
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colspan="8">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="acc-inner-content" style={{ marginTop: 20 }}>
                {progressData.map((data, index) => {
                  if (index % 2 === 0) {
                    return (
                      <div
                        className="d-flex space-between avm-field"
                        key={index}
                      >
                        {!!progressData[index] && (
                          <div className="search-element width-45">
                            <label>{progressData[index].label}</label>
                            <select
                              style={{
                                borderBottomColor: "#ebebeb",
                                borderTop: "none",
                                borderRight: "none",
                                borderLeft: "none",
                                color: "gray",
                              }}
                              value={progressData[index].value || ""}
                              onChange={(e) => {
                                onChageProgressData(e, index);
                              }}
                            >
                              <option value="NaN" label="Select" />
                              {[...Array(101).keys()].map((num) => (
                                <option
                                  key={num}
                                  value={num}
                                  label={String(num)}
                                />
                              ))}
                            </select>
                          </div>
                        )}
                        {!!progressData[index + 1] &&
                          (progressData[index + 1].label ===
                          "Type of Structure" ? (
                            <div className="search-element width-45">
                              <label>{progressData[index + 1].label}</label>
                              <select
                                style={{
                                  borderBottomColor: "#ebebeb",
                                  borderTop: "none",
                                  borderRight: "none",
                                  borderLeft: "none",
                                  color: "gray",
                                }}
                                value={progressData[index + 1].value || ""}
                                onChange={(e) => {
                                  onChageProgressData(e, index + 1);
                                }}
                              >
                                <option value="NaN" label="Select" />
                                <option value="Composite" label="Composite" />
                                <option
                                  value="Load Bearing"
                                  label="Load Bearing"
                                />
                                <option value="RCC" label="RCC" />
                                <option
                                  value="Steel Structure"
                                  label="Steel Structure"
                                />
                              </select>
                            </div>
                          ) : (
                            <div className="search-element width-45">
                              <label>{progressData[index + 1].label}</label>
                              <Form.Control
                                type="text"
                                placeholder={
                                  progressData[index + 1].placeholder || "Enter"
                                }
                                value={progressData[index + 1].value || ""}
                                onChange={(e) => {
                                  onChageProgressData(e, index + 1);
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    );
                  }
                })}
              </div>
            </CustomAccordian>

            <CustomAccordian title="Valuation Summary">
              <div className="acc-inner-content" style={{ marginTop: 20 }}>
                {
                  <>
                    <div className="d-flex space-between avm-field">
                      <div className="search-element width-45">
                        <label>{"Suggested Land Rate (in INR/sqft)"}</label>
                        <Form.Control
                          value={
                            suggestedRates.suggestedLandRate
                              ? parseFloat(
                                  suggestedRates.suggestedLandRate,
                                ).toLocaleString("en-US")
                              : ""
                          }
                          type="text"
                          style={{ backgroundColor: "gold" }}
                          placeholder="Enter"
                          disabled={true}
                        />
                      </div>
                      <div className="search-element width-45">
                        <label>{"Suggested Sale Rate (in INR/sqft)"}</label>
                        <Form.Control
                          value={
                            suggestedRates.suggestedSaleRate
                              ? parseFloat(
                                  suggestedRates.suggestedSaleRate,
                                ).toLocaleString("en-US")
                              : ""
                          }
                          style={{ backgroundColor: "gold" }}
                          type="text"
                          placeholder="Enter"
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="d-flex space-between avm-field">
                      <div className="search-element width-45">
                        <label>{"Land Area (in sqft)"}</label>
                        <Form.Control
                          value={
                            landArea
                              ? parseFloat(landArea).toLocaleString("en-US")
                              : ""
                          }
                          type="text"
                          placeholder="Enter"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            setLandArea(rawValue);
                          }}
                          disabled={
                            validationData.selectedCategory == "builtup"
                          }
                        />
                      </div>

                      <div className="search-element width-45">
                        <label>{"Sellable Area (in sqft)"}</label>
                        <Form.Control
                          value={
                            bua ? parseFloat(bua).toLocaleString("en-US") : ""
                          }
                          type="text"
                          placeholder="Enter"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            setBua(rawValue);
                          }}
                          disabled={validationData.selectedCategory == "land"}
                        />
                      </div>
                    </div>

                    <div className="d-flex space-between avm-field">
                      <div className="search-element width-45">
                        <label>{"Land Rate (in INR/sqft)"}</label>
                        <Form.Control
                          value={
                            landRate
                              ? parseFloat(landRate).toLocaleString("en-US")
                              : ""
                          }
                          type="text"
                          placeholder="Enter"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            setLandRate(rawValue);
                          }}
                          disabled={
                            validationData.selectedCategory == "builtup"
                          }
                        />
                      </div>
                      <div className="search-element width-45">
                        <label>{"Sellable Rate (in INR/sqft)"}</label>
                        <Form.Control
                          value={
                            buaRate
                              ? parseFloat(buaRate).toLocaleString("en-US")
                              : ""
                          }
                          type="text"
                          placeholder="Enter"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            setBuaRate(rawValue);
                          }}
                          disabled={validationData.selectedCategory == "land"}
                        />
                      </div>
                    </div>
                  </>
                }

                <div className="d-flex space-between avm-field">
                  <div className="width-45">
                    <div className="search-element">
                      <label>{"Construction Area (in sqft)"}</label>
                      <Form.Control
                        value={
                          ConstructionArea
                            ? parseFloat(ConstructionArea).toLocaleString(
                                "en-US",
                              )
                            : "" || 0
                        }
                        type="text"
                        placeholder="Enter"
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          setConstructionArea(rawValue);
                        }}
                        disabled={
                          props.unitType === "FLAT" ||
                          props.unitType === "OFFICE" ||
                          props.unitType === "RETAIL"
                            ? true
                            : false
                        }
                      />
                    </div>

                    <div className="search-element" style={{ marginTop: 20 }}>
                      <label>{"Construction Cost (in INR / sqft)"}</label>
                      <Form.Control
                        value={
                          constructionCostData
                            ? parseFloat(constructionCostData).toLocaleString(
                                "en-US",
                              )
                            : ""
                        }
                        type="text"
                        placeholder="Enter"
                        disabled={true}
                      />
                    </div>
                    {props.unitType === "FLAT" ||
                    props.unitType === "OFFICE" ||
                    props.unitType === "RETAIL" ? (
                      <div style={{ marginTop: 20 }} className="search-element">
                        <label>{"Total (in INR)"}</label>
                        <Form.Control
                          value={
                            totalSellableRate
                              ? parseFloat(totalSellableRate).toLocaleString(
                                  "en-US",
                                )
                              : ""
                          }
                          type="text"
                          placeholder="Enter"
                          disabled={true}
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className="search-element"
                          style={{ marginTop: 20 }}
                        >
                          <label>{"Total Value for Land (in INR)"}</label>
                          <Form.Control
                            value={
                              totalLandRate
                                ? parseFloat(totalLandRate).toLocaleString(
                                    "en-US",
                                  )
                                : ""
                            }
                            type="text"
                            placeholder="Enter"
                            disabled={true}
                          />
                        </div>

                        <div
                          className="search-element"
                          style={{ marginTop: 20 }}
                        >
                          <label>
                            {"Total Value for Construction (in INR)"}
                          </label>
                          <Form.Control
                            value={
                              totalConstructionCost
                                ? parseFloat(
                                    totalConstructionCost,
                                  ).toLocaleString("en-US")
                                : ""
                            }
                            type="text"
                            placeholder="Enter"
                            disabled={true}
                          />
                        </div>

                        <div
                          className="search-element"
                          style={{ marginTop: 20 }}
                        >
                          <label>{"Total (in INR)"}</label>
                          <Form.Control
                            value={
                              totalLandRate + totalConstructionCost
                                ? parseFloat(
                                    totalLandRate + totalConstructionCost,
                                  ).toLocaleString("en-US")
                                : ""
                            }
                            type="text"
                            placeholder="Enter"
                            disabled={true}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="width-45">
                    <div className="search-element">
                      <label>{"Amenities (cost / per unit)"}</label>
                      <Form.Control
                        value={
                          amenities
                            ? parseFloat(amenities).toLocaleString("en-US")
                            : ""
                        }
                        type="text"
                        placeholder="Enter"
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          setAmenities(rawValue);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CustomAccordian>

            <CustomAccordian title="Images">
              <div className="acc-inner-content">
                <Slider
                  {...settings}
                  style={{ marginBottom: 30 }}
                  className="report-download-lick"
                >
                  {props.parentState?.imageDetailsArr &&
                    props.parentState.imageDetailsArr.length > 0 &&
                    props.parentState.imageDetailsArr.map((data) => {
                      return (
                        <div
                          className={`down-load-img-report`}
                          style={{ paddingRight: 10 }}
                        >
                          <img
                            className="customer-downlod-image"
                            src={data.download_url}
                            alt=""
                          />
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </CustomAccordian>
            <CustomAccordian title="Checklist">
              <div className="acc-inner-content">
                {checklist.map((data) => {
                  return (
                    <div
                      style={{ flex: 1, alignItems: "center" }}
                      className="d-flex space-between"
                    >
                      <div className="search-element " style={{ flex: 8 }}>
                        <label>{data.label}</label>
                      </div>
                      <div style={styles.container}>
                        {dropDownvalues.map((option) => {
                          let flag = false;
                          if (option == "Yes" && data.value) {
                            flag = true;
                          } else if (option == "No" && data.value == false) {
                            flag = true;
                          } else {
                            flag = false;
                          }
                          return (
                            <div
                              key={option}
                              style={styles.option(flag)}
                              onClick={() =>
                                handleSelectionChange(data.key, option)
                              }
                            >
                              {option}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {checklist[5].value && (
                  <div className="d-flex space-between avm-field">
                    <div style={{ width: "100%" }} className="search-element ">
                      <label>{"Violation Detail"}</label>
                      <Form.Control
                        value={violation}
                        type="text"
                        placeholder="Enter"
                        onChange={(e) => {
                          setViolations(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {isCaution == "Yes" && (
                  <div
                    style={{ flex: 1, alignItems: "center" }}
                    className="d-flex space-between layout-pad"
                  >
                    <div className="search-element " style={{ flex: 8 }}>
                      <label>
                        {"if yes, what is the type of caution area observed ?"}
                      </label>
                    </div>

                    <div className="search-element" style={{ flex: 2 }}>
                      <div className="down-arrow">
                        <select>
                          <option value="NaN" label="Select" />
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CustomAccordian>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidationForm;
