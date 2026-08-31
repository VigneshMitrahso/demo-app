import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  valuationStateUser,
  getAVMVData,
  getCategorytList,
} from "../../action/automationStateValuation";
import {
  cityReset,
  valuationCityUser,
} from "../../action/automationCityValuation";

import {
  approvalValuationUser,
  resetapprovalValuationUser,
} from "../../action/getAutomatedValuation";
import {
  buildingNameUser,
  resetbuildingNameUser,
} from "../../action/getBuildingName";
import { _getStorageValue } from "../../comman/localStorage";

import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from "react-google-places-autocomplete";

// css
import "./valuation-filter.css";

import { compose } from "redux";
import { GoogleApiWrapper } from "google-maps-react";
import { GOOGLE_MAP_API_KEY } from "../../comman/constants";

import { SplitScreen } from "./splitscreen";
import { isEmpty } from "lodash";
import Autocomplete from "./autoComplete";
import { USER_ID, AES_KEY } from "../../comman/constants";

import { encryptStatic, decryptStatic } from "../../comman/decodeEncodeData";
import { bankDataUser } from "../../action/bankData";
import { reportUser } from "../../action/reportUser";
import { getImageUrlUser } from "../../action/getImageUrl";

const horizontalLabels = {
  0: "0",
  1: "100",
  2: "200",
  3: "300",
  4: "400",
  5: "500",
  6: "600",
  7: "700",
  8: "800",
  9: "900",
  10: "1000",
};
const nextNineCities = [
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkatta",
  "Bangalore",
  "Ahmedabad",
  "Surat",
  "Indore",
  "Chandigarh",
];
const mumbaiCities = ["Mumbai", "Delhi"];
const otherCities = [
  "Lucknow",
  "Jaipur",
  "Rajkot",
  "Ludhiana",
  "Mysore",
  "Coimbatore",
  "Vadodara",
  "Raipur",
  "Nagpur",
  "Amritsar",
  "Patna",
  "Vishakapatnam",
  "Udaipur",
  "Agra",
  "Others",
];
class ValuationFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swapFilter: "type1",
      proTypeIS: props?.selectedTypes?.propType ?? "",
      unitTypeIs: props?.selectedTypes?.unitType ?? "",
      isValidation: false,
      latitude: "",
      longitude: "",
      avmurl: "",
      propertyDetailsData: {},
      propertyList: [],
      propertyType: "",
      unitType: "",
      propertyFetching: false,
      unitTypeFetching: false,
      unitTypeList: [],
      selectedCategory: [],
      isShowSubmit: true,
      propertyLimitList: [
        { label: "Municipal Corporation", value: "Municipal Corporation" },
        { label: "Development Authority", value: "Development Authority" },
        { label: "Gram Panchayat", value: "Gram Panchayat" },
      ],
      propertyDetails: {
        unitNo: "",
        buildingName: "",
        location: "",
        ageOfProperty: "",
        sellableArea: "",
        landArea: "",
        bua: "",
        selectedCategory: "",
        latitude: "",
        longitude: "",
        propertyLimit: "",
        projectName: "",
        constructionArea: "",
      },
      unitTypeData: "",
      showReport: false,
      selectedState: "",
      selectedCity: "",
      propEdge: "",
      propEdgeLocation: [],
      propEdgeLocationValue: "",
      propEdgeLocationId: "",
      propEdgeProjectid: "",
      selectedPropertyType: "",
      selectedUnitType: "",
      requestID: "",
      lat: 0,
      long: 0,
      mobile_numbers: "",
      imageDetailsArr: [],
      projectName: "",
      searchReqLoader: false,
      landRate: "",
      landArea: "",
      constructionArea: "",
      buaRate: "",
      bua: "",
      typeofCity: "",
      city: "",
      cityDropDown: mumbaiCities,
    };
  }
  // const [landRate, setLandRate] = useState(0);
  // const [landArea, setLandArea] = useState(validationData?.landArea ?? 0);
  // const [buaRate, setBuaRate] = useState(0);
  // const [bua, setBua] = useState(validationData.bua || 0);
  componentDidUpdate(prevProps, prevState) {
    if (this.state.swapFilter !== prevState.swapFilter) {
      this.getPropertyList();
    }
  }

  componentDidMount() {
    this.getPropEdgeLocation();
    _getStorageValue("USER_ID").then((userId) => {
      this.props.valuationStateUser(userId, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      this.setState({ isFetchingState: false });
    };

    const onFailure = (response) => {
      this.setState({ isFetchingState: false });
    };
    this.getPropertyList();
  }

  // State Data
  onLocationChange(event) {
    this.setState({ propEdgeLocationId: event.target.value });
  }

  updateProjectId = (data) => {
    this.setState({
      propEdgeProjectid: data.projectId,
      projectName: data.projectName,
    });
    this.getPropEdgeDataByID(data.projectId);
  };

  // Valuations onclick

  // onPropertyChange = (item) => {
  //   let data = []
  //   if (item !== "") {
  //     this.setState({ proTypeIS: item })
  //     if (item == "Residential") {
  //       data = [{ value: "", label: "Select Unit Type" }, { label: "Land", value: "Land" }, { label: "Flat", value: "Flat" }, { label: "Independent House", value: "Independent House" }];
  //     } else if (item == "Commercial") {
  //       data = [{ value: "", label: "Select Unit Type" }, { label: "Land", value: "Land" }, { label: "Office", value: "Office" }, { label: "Retail", value: "Retail" }, { label: "Independent Building", value: "Independent Building" }];
  //     } else if (item == "Industrial") {
  //       data = [{ value: "", label: "Select Unit Type" }, { label: "Land", value: "Land" }, { label: "Unit", value: "Unit" }];
  //     } else if (item == "Specialised property") {
  //       data = [{ value: "", label: "Select Unit Type" }, { label: "Hospital", value: "Hospital" }, { label: "Function Hall/Marriage Garden", value: "Function Hall/Marriage Garden" }, { label: "Educational Institute", value: "Educational Institute" }, { label: "Cinema Halls", value: "Cinema Halls" }, { label: "Malls", value: "Malls" }, { label: "Hotels", value: "Hotels" }, { label: "Warehouses", value: "Warehouses" }];
  //     }
  //     this.setState({ unitType: data, unitTypeIs: "" }, () => { });
  //   }
  // }

  getPlacesID(e) {
    var placeid = e.value.description;
    geocodeByAddress(placeid).then((results) => {
      const { geometry } = results[0];
      const { bounds, location, viewport } = geometry;
      const locLat = location.lat();
      const locLong = location.lng();
      const north =
        bounds?.getNorthEast().lat() ?? viewport.getNorthEast().lat();
      const east =
        bounds?.getNorthEast().lng() ?? viewport.getNorthEast().lng();
      const south =
        bounds?.getSouthWest().lat() ?? viewport.getSouthWest().lat();
      const west =
        bounds?.getSouthWest().lng() ?? viewport.getSouthWest().lng();

      this.setState({
        avmurl: `south=${south.toFixed(6)}&north=${north.toFixed(
          6,
        )}&west=${west.toFixed(6)}&east=${east.toFixed(
          6,
        )}&search_from=locality`,
        latitude: locLat,
        longitude: locLong,
      });
    });
  }

  swapFilterType(type) {
    this.setState({
      swapFilter: type,
      propertyDetailsData: {},
      isShowSubmit: true,
      latitude: "",
      longitude: "",
      propertyList: [],
      unitTypeList: [],
      selectedPropertyType: "",
      selectedUnitType: "",
      isFetchingState: false,
      typeofCity: "",
      city: "",
    });
  }

  async getLatLng(cityName) {
    const apiKey = GOOGLE_MAP_API_KEY; // Replace with your actual API key from Google Cloud Console
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cityName,
    )}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        this.setState({ latitude: latitude, longitude: longitude });

        return { latitude, longitude };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  getAVMDataByscreen = (userId, url, onSuccess, onFailure, type) => {
    this.props.getAVMVData(userId, url, onSuccess, onFailure, type);
  };

  approveValidationState = async (data) => {
    this.setState({ isFetchingState: true });
    let propertyType =
      this.state.propertyList.filter(
        (fd) => fd.id === this.state.propertyType,
      )?.[0]?.name ?? "";

    if (this.state.swapFilter == "type1") {
      if (
        !!this.state.latitude &&
        !!this.state.longitude &&
        this.state.mobile_numbers &&
        !!this.state.selectedPropertyType &&
        !!this.state.selectedUnitType &&
        !!this.state.typeofCity &&
        !!this.state.city &&
        !!this.state.landArea &&
        !!this.state.bua
      ) {
        this.setState({ isShowSubmit: false });
        // ["tst", "icici", "market"].forEach((md) => {
        _getStorageValue("USER_ID").then((userId) => {
          let url = `latitude=${this.state.latitude}&longitude=${this.state.longitude}&property_type=${propertyType}&unit_type=${this.state.unitTypeData}&city_type_name=${this.state.city}&land_area_value=${this.state.landArea}`;
          if (
            this.state.constructionArea &&
            this.state.constructionArea === 0
          ) {
            url = `${url}&construction_area=${this.state.constructionArea}`;
          }
          // tst
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=tst`,
            onSuccess,
            onFailure,
            "tst",
          );
          // icici
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=icici`,
            onSuccess,
            onFailure,
            "icici",
          );
          // market
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=market`,
            onSuccess,
            onFailure,
            "market",
          );
          // let url = `latitude=${this.state.latitude}&longitude=${this.state.longitude}&property_type=${propertyType}&unit_type=${this.state.unitTypeData}&city_type_name=${this.state.city}&land_area_value=${this.state.landArea}&window_screen=${md}`;
          // this.props.getAVMVData(userId, url, onSuccess, onFailure);
        });
        // });
        this.setState({ showReport: true });
        this.getPropEdgeData(this.state.latitude, this.state.longitude);
        const onSuccess = (response) => {
          this.setState({
            isFetchingState: false,
            showReport: true,
            propertyDetailsData: {
              ...this.state.propertyDetailsData,
              ...response.data[0],
            },
          });
        };
        const onFailure = (response) => {
          this.setState({ isFetchingState: false });
        };
      } else {
        this.setState({ isFetchingState: false });
        if (this.state.mobile_numbers === "") {
          toast.error("Please enter Request id", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (
          !!this.state.latitude == false ||
          !!this.state.longitude == false
        ) {
          toast.error("Please enter latitude and longitude", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (
          !!this.state.typeofCity == false ||
          !!this.state.city == false
        ) {
          toast.error("Please choose city ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedPropertyType == "") {
          toast.error("Please select property type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedUnitType == "") {
          toast.error("Please select unit type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.landArea == "") {
          toast.error("Please enter land area ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.bua == "") {
          toast.error("Please enter builtUp area ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    } else if (this.state.swapFilter == "type2") {
      if (
        !!this.state.latitude &&
        !!this.state.longitude &&
        !!this.state.mobile_numbers &&
        !!this.state.selectedPropertyType &&
        !!this.state.selectedUnitType &&
        !!this.state.typeofCity &&
        !!this.state.city &&
        !!this.state.landArea &&
        !!this.state.bua
      ) {
        // this.setState({ isShowSubmit: false });
        this.setState({ isShowSubmit: false });
        this.getPropEdgeData(this.state.latitude, this.state.longitude);

        // ["tst", "icici", "market"].forEach((mapData) => {
        _getStorageValue("USER_ID").then((userId) => {
          let url = `latitude=${this.state.latitude}&longitude=${this.state.longitude}&property_type=${propertyType}&unit_type=${this.state.unitTypeData}&city_type_name=${this.state.city}&land_area_value=${this.state.landArea}`;
          if (
            this.state.constructionArea &&
            this.state.constructionArea === 0
          ) {
            url = `${url}&construction_area=${this.state.constructionArea}`;
          }
          // tst
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=tst`,
            onSuccess,
            onFailure,
            "tst",
          );
          // icici
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=icici`,
            onSuccess,
            onFailure,
            "icici",
          );
          // market
          this.getAVMDataByscreen(
            userId,
            `${url}&window_screen=market`,
            onSuccess,
            onFailure,
            "market",
          );
          // this.props.getAVMVData(userId, url, onSuccess, onFailure);
        });
        // });
        const onSuccess = (response) => {
          this.setState({
            isFetchingState: false,
            showReport: true,
            propertyDetailsData: {
              ...this.state.propertyDetailsData,
              ...response.data[0],
            },
          });
          // this.getPropertyList();
        };
        const onFailure = (response) => {
          this.setState({ isFetchingState: false });
        };
      } else {
        this.setState({ isFetchingState: false });
        if (this.state.mobile_numbers === "") {
          toast.error("Please enter Request id", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (
          !!this.state.latitude == false ||
          !!this.state.longitude == false
        ) {
          toast.error("Please choose locality", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (
          !!this.state.typeofCity == false ||
          !!this.state.city == false
        ) {
          toast.error("Please choose city ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedPropertyType == "") {
          toast.error("Please select property type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedUnitType == "") {
          toast.error("Please select unit type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.landArea == "") {
          toast.error("Please enter land area ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.bua == "") {
          toast.error("Please enter builtUp area ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    } else if (this.state.swapFilter == "type3") {
      // this.setState({ isShowSubmit: false });
      if (
        !!this.state.propEdgeLocationId &&
        !!this.state.propEdgeProjectid &&
        !!this.state.mobile_numbers !== "" &&
        !!this.state.selectedPropertyType &&
        !!this.state.selectedUnitType &&
        !!this.state.typeofCity &&
        !!this.state.city
      ) {
        this.setState({ isShowSubmit: false });
        const coordinates = await this.getLatLng(this.state.projectName);
        if (!!coordinates) {
          // ["tst", "icici", "market"].forEach((md) => {
          _getStorageValue("USER_ID").then((userId) => {
            let url = `latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&property_type=${propertyType}&unit_type=${this.state.unitTypeData}&city_type_name=${this.state.city}&land_area_value=${this.state.landArea}`;
            if (
              this.state.constructionArea &&
              this.state.constructionArea === 0
            ) {
              url = `${url}&construction_area=${this.state.constructionArea}`;
            }
            // this.props.getAVMVData(userId, url, onSuccess, onFailure);
            // tst
            this.getAVMDataByscreen(
              userId,
              `${url}&window_screen=tst`,
              onSuccess,
              onFailure,
              "tst",
            );
            // icici
            this.getAVMDataByscreen(
              userId,
              `${url}&window_screen=icici`,
              onSuccess,
              onFailure,
              "icici",
            );
            // market
            this.getAVMDataByscreen(
              userId,
              `${url}&window_screen=market`,
              onSuccess,
              onFailure,
              "market",
            );
          });
          // });
        } else {
          toast.error("Latitude & Longitude not found", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          this.setState({ isFetchingState: false });
        }
        const onSuccess = (response) => {
          this.setState({
            isFetchingState: false,
            showReport: true,
            propertyDetailsData: {
              ...this.state.propertyDetailsData,
              ...response.data[0],
            },
          });
        };
        const onFailure = (response) => {
          this.setState({ isFetchingState: false });
        };
      } else {
        this.setState({ isFetchingState: false });
        if (this.state.mobile_numbers === "") {
          toast.error("Please enter Request id", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.propEdgeLocationId == "") {
          toast.error("Please select location", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.propEdgeProjectid == "") {
          toast.error("Please select project", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (
          !!this.state.typeofCity == false ||
          !!this.state.city == false
        ) {
          toast.error("Please choose city ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedPropertyType == "") {
          toast.error("Please select property type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.selectedUnitType == "") {
          toast.error("Please select unit type", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (this.state.bua == "") {
          toast.error("Please enter builtUp area ", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }
  };

  getPropEdgeData = (lat, long) => {
    fetch(
      "https://crmpapsrv.propequity.in/ICICI_PriceAnalytics.svc/GetPriceAnalytics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic aWNpY2ktcHJpY2UtYW5hbHl0aWNzLWF1dGg6QzU0Qzc0RTQtQjVBQy00Q0ZGLUJBMzktODZBRUY4OEI3QzM2",
          Accept: "application/json",
        },
        body: JSON.stringify({
          filters: {
            ProjectId: "",
            Latitude: lat,
            Longitude: long,
            Radius: "3",
            DataType: "json",
          },
          userCredential: {
            ClientName: "ICICIPriceAnalytics",
            Password: "AC61B268-2EEF-408F-89CC-E5C46532AB5D",
          },
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((respoonse) => {
        if (respoonse.Title === "Internal Server Error") {
          this.setState({ propEdge: "" });
        } else {
          this.setState({ propEdge: respoonse });
        }
      })
      .catch((error) => {});
  };

  getPropEdgeDataByID = (id) => {
    fetch(
      "https://crmpapsrv.propequity.in/ICICI_PriceAnalytics.svc/GetPriceAnalytics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic aWNpY2ktcHJpY2UtYW5hbHl0aWNzLWF1dGg6QzU0Qzc0RTQtQjVBQy00Q0ZGLUJBMzktODZBRUY4OEI3QzM2",
          Accept: "application/json",
        },
        body: JSON.stringify({
          filters: {
            ProjectId: id,
            Radius: "3",
            DataType: "json",
          },
          userCredential: {
            ClientName: "ICICIPriceAnalytics",
            Password: "AC61B268-2EEF-408F-89CC-E5C46532AB5D",
          },
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((respoonse) => {
        if (respoonse.Title === "Internal Server Error") {
          this.setState({ propEdge: "" });
        } else {
          this.setState({ propEdge: respoonse });
        }
      })
      .catch((error) => {});
  };

  getPropertyList = () => {
    this.setState({ propertyFetching: true });

    _getStorageValue("USER_ID").then((userId) => {
      this.props.getCategorytList(userId, 0, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      this.setState({ propertyFetching: false, propertyList: response.data });
    };
    const onFailure = (response) => {
      this.setState({ propertyFetching: false });
    };
  };

  onPropertyChange = (id) => {
    this.setState({ selectedPropertyType: id, constructionArea: "" });
    let propertyTypeData = this.state.propertyList.filter(
      (fd) => fd.id === id,
    )[0];
    this.setState({
      unitTypeFetching: true,
      propertyType: id,
      propertyTypeData: propertyTypeData.name,
    });
    _getStorageValue("USER_ID").then((userId) => {
      this.props.getCategorytList(userId, id, onSuccess, onFailure);
    });
    const onSuccess = (response) => {
      this.setState({ unitTypeFetching: false, unitTypeList: response.data });
    };
    const onFailure = (response) => {
      this.setState({ unitTypeFetching: false });
    };
  };

  onUnitTypeChange = (id) => {
    this.setState({ unitType: id, selectedUnitType: id, constructionArea: "" });
    let selectedUnitTypeDetail = this.state.unitTypeList.filter(
      (fd) => fd.id === id,
    )[0];
    this.setState({
      unitTypeData: selectedUnitTypeDetail.name,
      selectedCategory: selectedUnitTypeDetail.category_type,
      propertyDetails: {
        ...this.state.propertyDetails,
        selectedCategory: selectedUnitTypeDetail.category_type,
      },
    });
  };

  updatePropertyDetails = (e, label, defaultNumber = false) => {
    let value = e.target.value;
    if (
      (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(value) && defaultNumber) ||
      value === ""
    ) {
      this.setState({
        propertyDetails: { ...this.state.propertyDetails, [label]: value },
      });
    } else if (!defaultNumber) {
      this.setState({
        propertyDetails: { ...this.state.propertyDetails, [label]: value },
      });
    }
  };

  searchReqId() {
    const failiurApiCall = (response) => {
      this.setState({ searchReqLoader: false });
      if (!!response.message) {
        toast.warning(response.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        this.setState({
          lat: 0,
          long: 0,
          mobile_numbers: "",
        });
      }
    };

    const successLatLonCall = (response) => {
      this.setState({ searchReqLoader: false });

      if (!response.message) {
        _getStorageValue(AES_KEY).then((key) => {
          this.setState({
            lat: response[0].latitude,
            long: response[0].longitude,
            mobile_numbers: decryptStatic(response[0].mobile_number, key),
          });
        });
      } else {
        toast.warning("Data Not Found", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };

    const successCall = (response) => {
      var slidLength = response.data.image_details;

      if (slidLength.length !== 0) {
        var dummyArr = [{}, {}, {}, {}, {}, {}];

        if (slidLength.length === 1) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 2) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 3) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 4) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 5) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length === 6) {
          var sliderValue = [...slidLength, ...dummyArr];
        } else if (slidLength.length >= 7) {
          var sliderValue = [...slidLength, ...dummyArr];
        }

        // sliderValue.sort(function (a, b) {
        //   return (a.selected === false) - (b.selected === false);
        // });

        sliderValue.sort(function (x, y) {
          // true values first
          return x.selected === y.selected ? 0 : x.selected ? -1 : 1;
          // false values first
          // return (x === y)? 0 : x? 1 : -1;
        });
        this.setState({
          imageDetailsArr: sliderValue,
        });
      } else {
        this.setState({
          imageDetailsArr: [],
        });
      }
    };

    const { requestID } = this.state;

    var trimValue = requestID.replace(" ", "", "g");
    _getStorageValue(AES_KEY).then((key) => {
      if (trimValue !== "") {
        this.setState({ searchReqLoader: true });
        var dataValue = encryptStatic(trimValue, key);
        _getStorageValue(USER_ID).then((userId) => {
          const successCallApi = () => {
            this.props.reportUser(
              userId,
              dataValue,
              successLatLonCall,
              failiurApiCall,
            );
            this.props.getImageUrlUser(
              userId,
              dataValue,
              successCall,
              failiurApiCall,
            );
          };

          this.props.bankDataUser(
            userId,
            dataValue,
            successCallApi,
            failiurApiCall,
          );
        });
      } else {
        toast.warning("Please Enter the REQ-ID", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  getPropEdgeLocation = (lat, long) => {
    fetch(
      "https://crmpapsrv.propequity.in/ICICI_PriceAnalytics.svc/GetLocationList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic aWNpY2ktcHJpY2UtYW5hbHl0aWNzLWF1dGg6QzU0Qzc0RTQtQjVBQy00Q0ZGLUJBMzktODZBRUY4OEI3QzM2",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userCredential: {
            ClientName: "ICICIPriceAnalytics",
            Password: "AC61B268-2EEF-408F-89CC-E5C46532AB5D",
          },
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((respoonse) => {
        this.setState({ propEdgeLocation: respoonse.LocationList });
      })
      .catch((error) => {
        this.setState({ propEdgeLocation: [] });
      });
  };

  render() {
    const {
      isFetchingState,
      swapFilter,
      propertyDetails,
      showReport,
      propertyDetailsData,
      propEdgeLocation,
      landArea,
      constructionArea,
      landRate,
      buaRate,
      bua,
    } = this.state;

    const suggestions = [];

    const icons = {
      RESIDENTIAL: require("../../assets/images/residential.png"),
      COMMERCIAL: require("../../assets/images/commercial.png"),
      INDUSTRIAL: require("../../assets/images/industrial.png"),
      "SPECIALISED PROPERTY": require("../../assets/images/specialized.png"),
    };

    const propertyUnit = () => {
      return (
        <>
          <div className="d-flex space-between ">
            <div className="search-element width-45">
              <label style={{ color: "#FFFFFF" }}>{"Type of City *"}</label>
              {/* <Form.Control
                          value={landArea ?? ""}
                          type="text"
                          placeholder="Enter"
                          style={{ opacity: propertyDetails.selectedCategory == "builtup" ? 0.5 : 1 }}
                          onChange={(e) => {
                            // setLandArea(e.target.value);
                            this.setState({ landArea: e.target.value })
                          }}
                          disabled={propertyDetails.selectedCategory == "builtup"}
                        /> */}
              <select
                onChange={(e) => {
                  this.setState({ typeofCity: e.target.value });
                  if (e.target.value === "MMR / NCR") {
                    this.setState({ cityDropDown: mumbaiCities, city: "" });
                  } else if (e.target.value === "Next 9") {
                    this.setState({
                      cityDropDown: nextNineCities,
                      city: "",
                    });
                  } else if (e.target.value === "Others") {
                    this.setState({ cityDropDown: otherCities, city: "" });
                  }
                }}
                value={this.state.typeofCity}
              >
                <option value="NaN" label="Select" />
                <option value="MMR / NCR" label="MMR / NCR" />
                <option value="Next 9" label="Next 9" />
                <option value="Others" label="Others" />
              </select>
            </div>
            <div style={{}} className="search-element width-45">
              <label style={{ color: "#FFFFFF" }}>{"City *"}</label>

              <select
                onChange={(e) => {
                  this.setState({ city: e.target.value });
                }}
                value={this.state.city}
              >
                <option value="NaN" label="Select" />
                {this.state.cityDropDown
                  .slice()
                  .sort()
                  .map((md) => (
                    <option key={md} value={md}>
                      {md}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="d-flex space-between">
            <div className="search-element" style={{ width: "100%" }}>
              {this.state.propertyList.length !== 0 && (
                <label style={{ color: "#FFFFFF" }}>Property Type *</label>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 20,
                }}
              >
                {this.state.propertyList.map((data) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "10px",
                      backgroundColor: "#FEFEFE",
                      borderRadius: "16px",
                      padding: "12px",
                      width: "138px",
                      height: "74px",
                      cursor: "pointer",
                      color:
                        this.state.selectedPropertyType === data.id
                          ? "#033B6C"
                          : "gray",
                      fontSize: "12px",
                      border:
                        this.state.selectedPropertyType === data.id
                          ? "2px solid #033B6C"
                          : "none",
                    }}
                    onClick={() => this.onPropertyChange(data.id)}
                  >
                    <img src={icons[data.name]} alt="resident-lial" />
                    <div>
                      {data.name === "SPECIALISED PROPERTY"
                        ? "SPECIALISED"
                        : data.name}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ width: "100%", marginTop: 25, marginBottom: 10 }}>
                {this.state.unitTypeList.length !== 0 && (
                  <label style={{ color: "#FFFFFF" }}>Unit Type *</label>
                )}
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {this.state.unitTypeList.map((data) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "10px",
                        backgroundColor: "#FEFEFE",
                        borderRadius: "8px",
                        padding: "8px",
                        minWidth: "50px",
                        height: "32px",
                        cursor: "pointer",
                        color:
                          this.state.selectedUnitType === data.id
                            ? "#033B6C"
                            : "gray",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        border:
                          this.state.selectedUnitType === data.id
                            ? "2px solid #033B6C"
                            : "none",
                      }}
                      onClick={() => this.onUnitTypeChange(data.id)}
                    >
                      <div>{data.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };
    return (
      <>
        {!showReport ? (
          <div style={{ width: "100%", display: "flex" }}>
            <div
              style={{
                marginTop: 106,
                width: "34%",
                marginLeft: "40px",
                paddingRight: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    paddingLeft: 23,
                    justifyContent: "start",
                    width: 200,
                  }}
                  className="swap-filter"
                >
                  <label
                    className={"active-filter"}
                    style={{ width: 200 }}
                    onClick={() => {
                      this.props.history.push("/customer-connect");
                    }}
                  >
                    <div style={{ color: "white" }}>Customer Connect</div>
                  </label>
                </div>
                <div
                  style={{ paddingLeft: 23, justifyContent: "end" }}
                  className="swap-filter"
                >
                  <label
                    className={"active-filter"}
                    style={{ width: 200 }}
                    onClick={() => {
                      this.props.history.push("/avm-report");
                    }}
                  >
                    <div style={{ color: "white" }}>Report</div>
                  </label>
                </div>
              </div>
              <div style={{ padding: 23, marginTop: 12 }}>
                <div style={{ marginBottom: 10 }}>Request ID</div>
                <div style={{ position: "relative" }}>
                  <input
                    value={this.state.requestID}
                    onChange={(e) =>
                      this.setState({
                        requestID: e.target.value.toUpperCase().trim(),
                      })
                    }
                    placeholder="Enter"
                    class="search-key form-control"
                    style={{ width: "50%", border: "1px solid #C1BDBD" }}
                  />

                  {this.state.mobile_numbers && (
                    <img
                      style={{ position: "absolute", right: 10, bottom: 11 }}
                      src={require("../../assets/images/requesttick.png")}
                    />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    onClick={() => this.searchReqId()}
                    style={{
                      minWidth: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      border: "1px solid  #033B6C",
                      color: "#033B6C",
                      padding: 5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        justifyContent: "center",
                      }}
                    >
                      {this.state.searchReqLoader ? (
                        <div className="loaderblack"></div>
                      ) : (
                        "Search"
                      )}
                    </div>
                  </button>
                </div>
              </div>
              {this.state.mobile_numbers && (
                <div
                  className="valuation-filter-list"
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    gap: 14,
                    border: "1px solid #C1BDBD",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "gray" }}>Phone Number:</span>
                    <span>{this.state.mobile_numbers || ""}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "gray" }}>Latitude:</span>
                    <span>{Number(this.state.lat).toFixed(5) || ""}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "gray" }}>Longitude:</span>
                    <span>{Number(this.state.long).toFixed(5) || ""}</span>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 106,
                borderLeft: "1px solid #DEDEDE",
                height: 670,
              }}
            ></div>

            <div className="automated-sections" style={{ width: "60%" }}>
              <div className="automated-valuation-filter">
                <div className="filter-sections" style={{ width: "100%" }}>
                  {/* <embed src={require("./essay.pdf")} type="application/pdf" width="100%" height="600px" /> */}
                  <div className="swap-filter">
                    <label
                      className={swapFilter === "type1" ? "active-filter" : ""}
                      onClick={() => {
                        this.swapFilterType("type1");
                      }}
                    >
                      <h2
                        className={
                          swapFilter === "type1"
                            ? "active-filter-title"
                            : "filter-title"
                        }
                      >
                        Search based on
                      </h2>
                      <div
                        style={{
                          color: swapFilter === "type1" ? "white" : "#033B6C",
                        }}
                      >
                        Coordinate
                      </div>
                    </label>
                    <label
                      className={swapFilter === "type2" ? "active-filter" : ""}
                      onClick={() => {
                        this.swapFilterType("type2");
                      }}
                    >
                      <h2
                        className={
                          swapFilter === "type2"
                            ? "active-filter-title"
                            : "filter-title"
                        }
                      >
                        Search based on
                      </h2>
                      <div
                        style={{
                          color: swapFilter === "type2" ? "white" : "#033B6C",
                        }}
                      >
                        Locality
                      </div>
                    </label>
                    <label
                      className={swapFilter === "type3" ? "active-filter" : ""}
                      onClick={() => {
                        this.swapFilterType("type3");
                      }}
                    >
                      <h2
                        className={
                          swapFilter === "type3"
                            ? "active-filter-title"
                            : "filter-title"
                        }
                      >
                        Search based on
                      </h2>
                      <div
                        style={{
                          color: swapFilter === "type3" ? "white" : "#033B6C",
                        }}
                      >
                        Project Name
                      </div>
                    </label>
                  </div>
                  <div className="valuation-filter-list">
                    {swapFilter === "type1" ? (
                      <div style={{ padding: 20 }} className="">
                        <div className="search-element">
                          <label style={{ color: "#FFFFFF" }}>Latitude*</label>
                          <Form.Control
                            value={this.state.latitude}
                            onChange={(e) => {
                              const formattedText = e.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              if (formattedText.length > 2) {
                                this.setState({
                                  latitude:
                                    formattedText.substring(0, 2) +
                                    "." +
                                    formattedText.substring(2),
                                });
                              } else {
                                this.setState({ latitude: formattedText });
                              }
                            }}
                            type="text"
                            placeholder="Enter"
                            maxLength="9"
                          />
                        </div>
                        <div className="search-element">
                          <label style={{ color: "#FFFFFF" }}>Longitude*</label>
                          <Form.Control
                            value={this.state.longitude}
                            onChange={(e) => {
                              const formattedText = e.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              if (formattedText.length > 2) {
                                this.setState({
                                  longitude:
                                    formattedText.substring(0, 2) +
                                    "." +
                                    formattedText.substring(2),
                                });
                              } else {
                                this.setState({ longitude: formattedText });
                              }
                            }}
                            type="text"
                            placeholder="Enter"
                            maxLength="9"
                          />
                        </div>
                        {propertyUnit()}
                        {/* {this.state.isShowSubmit && <div style={{ alignItems: "center", display: "flex", justifyContent: "center" }} className="filter-Button">
                        <button
                          onClick={() => {
                            this.approveValidationState();
                          }}
                          style={{ minWidth: 100, alignItems: "center", justifyContent: "center" }}
                        >
                          {isFetchingState ? <div className="loader-circle-v1"></div> : "Submit"}

                        </button>
                      </div>} */}
                      </div>
                    ) : swapFilter === "type2" ? (
                      <div style={{ padding: 20 }} className="">
                        <div className="search-element">
                          <label style={{ color: "#FFFFFF" }}>Locality*</label>
                          <GooglePlacesAutocomplete
                            apiKey={GOOGLE_MAP_API_KEY}
                            selectProps={{
                              placeholder: (
                                <span style={{ color: "#696B72" }}>Enter</span>
                              ),
                              onChange: (e) => {
                                this.getPlacesID(e);
                              },
                            }}
                            ref={this.googleSelectField}
                          />
                        </div>

                        {propertyUnit()}
                        {/* {this.state.isShowSubmit && <div style={{ alignItems: "center", display: "flex", justifyContent: "center" }} className="filter-Button">
                        <button
                          onClick={() => {
                            this.approveValidationState();
                          }}
                          style={{ minWidth: 100, alignItems: "center", justifyContent: "center" }}
                        >
                          {isFetchingState ? <div className="loader-circle-v1"></div> : "Submit"}
                        </button>
                      </div>} */}
                      </div>
                    ) : swapFilter === "type3" ? (
                      <div style={{ padding: 20 }} className="">
                        <div className="search-element">
                          <label style={{ color: "#FFFFFF" }}>Location </label>
                          <div className="down-arrow">
                            <select
                              value={this.state.propEdgeLocationId}
                              onChange={(e) => this.onLocationChange(e)}
                            >
                              <option value="NaN" label="Select City" />
                              {!!propEdgeLocation &&
                                propEdgeLocation.map((data, key) => {
                                  return (
                                    <option
                                      key={data.id}
                                      value={data.LocationId}
                                      label={data.LocationName}
                                    />
                                  );
                                })}
                            </select>
                          </div>
                        </div>
                        {!!this.state.propEdgeLocationId && (
                          <div className="search-element">
                            <label style={{ color: "#FFFFFF" }}>Project </label>
                            <Autocomplete
                              suggestions={suggestions}
                              propEdgeLocationId={this.state.propEdgeLocationId}
                              updateProjectId={this.updateProjectId}
                            />
                          </div>
                        )}
                        {this.state.propEdgeProjectid && propertyUnit()}

                        {/* {this.state.isShowSubmit && <div style={{ alignItems: "center", display: "flex", justifyContent: "center" }} className="filter-Button">
                        <button
                          onClick={() => {
                            this.approveValidationState();
                          }}
                          style={{ minWidth: 100, alignItems: "center", justifyContent: "center" }}
                        >
                          {isFetchingState ? <div className="loader-circle-v1"></div> : "Submit"}
                        </button>
                      </div>} */}
                      </div>
                    ) : null}

                    <div className="heading-validation" />
                    {/* <div className="d-flex" >
                      <div className="search-element width-45">
                        <label style={{ color: '#FFFFFF' }}>Unit No.</label>
                        <Form.Control
                          value={propertyDetails.unitNo}
                          onChange={(e) => {
                            this.updatePropertyDetails(e, "unitNo")
                          }}
                          type="text"
                          placeholder="Enter"
                        />
                      </div>
                      <div className="search-element width-45">
                        <label style={{ color: '#FFFFFF' }}>Property Limit</label>
                        <div className="down-arrow">
                          <select
                            value={propertyDetails.propertyLimit}
                            onChange={(e) => {
                              this.updatePropertyDetails(e, "propertyLimit");
                            }}
                          >
                            <option value="NaN" label="Select" />
                            {this.state.propertyLimitList.map(data => (<option value={data.value} label={data.label} />))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 20 }} className="" >
                      <div className="search-element width-45">
                        <label style={{ color: '#FFFFFF' }}>Project Name</label>
                        <Form.Control
                          value={propertyDetails.projectName}
                          onChange={(e) => {
                            this.updatePropertyDetails(e, "projectName")
                          }}
                          type="text"
                          placeholder="Enter"
                        />
                      </div>
                    </div> */}

                    {
                      <>
                        <div
                          style={{ paddingLeft: 20 }}
                          className="d-flex space-between "
                        >
                          <div className="search-element width-45">
                            <label style={{ color: "#FFFFFF" }}>
                              {"Land Area (in sqft)*"}
                            </label>
                            <Form.Control
                              value={landArea ?? ""}
                              type="number"
                              placeholder="Enter"
                              onChange={(e) => {
                                // setLandArea(e.target.value);
                                this.setState({ landArea: e.target.value });
                              }}
                              // disabled={propertyDetails.selectedCategory == "builtup"}
                            />
                          </div>
                          <div style={{}} className="search-element width-45">
                            <label style={{ color: "#FFFFFF" }}>
                              {"Sellable Area (in sqft)*"}
                            </label>
                            <Form.Control
                              value={bua}
                              type="number"
                              placeholder="Enter"
                              onChange={(e) => {
                                this.setState({ bua: e.target.value });
                              }}
                              // disabled={propertyDetails.selectedCategory == "land"}
                            />
                          </div>
                          {/* <div className="search-element width-45">
                        <label  style={{ color: '#FFFFFF' }}>{"Land Rate (in INR/sqft)"}</label>
                        <Form.Control
                          value={landRate}
                          type="text"
                          style={{ opacity: propertyDetails.selectedCategory == "builtup" ? 0.5 : 1 }}
                          placeholder="Enter"
                          onChange={(e) => {
                            this.setState({ landRate: e.target.value })
                          }}
                          disabled={propertyDetails.selectedCategory == "builtup"}
                        />
                      </div> */}
                        </div>
                        <div
                          className="d-flex space-between "
                          style={{ paddingLeft: 20 }}
                        >
                          <div className="search-element width-45">
                            <label style={{ color: "#FFFFFF" }}>
                              {"Construction Area (in sqft)*"}
                            </label>
                            <Form.Control
                              value={constructionArea}
                              type="number"
                              // style={{
                              //   opacity:
                              //     propertyDetails.selectedCategory == "land"
                              //       ? 0.5
                              //       : 1,
                              // }}
                              placeholder="Enter"
                              onChange={(e) => {
                                this.setState({
                                  constructionArea: e.target.value,
                                });
                              }}
                              // disabled={
                              //   propertyDetails.selectedCategory !== "land"
                              // }
                            />
                          </div>
                        </div>
                      </>
                    }

                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      className="filter-Button"
                    >
                      <button
                        className="avm-button"
                        onClick={() => {
                          // if (!isEmpty(this.state.propertyDetailsData)) {
                          //   this.setState({ showReport: true })
                          // }
                          this.approveValidationState();
                        }}
                      >
                        {isFetchingState ? (
                          <div className="loader-circle-v1"></div>
                        ) : (
                          "Report"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ height: 80 }}></div>
            <div style={{ width: "99vw" }}>
              <SplitScreen
                propEdge={this.state.propEdge}
                validationData={propertyDetails}
                unitType={this.state.unitTypeData}
                propertyType={this.state.propertyTypeData}
                propertyData={propertyDetailsData}
                parentState={{ ...this.state }}
              />
            </div>
          </>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  isFetchingApprovalValuation:
    state.getApprovalValuation.isFetchingApprovalValuation,
  approvalAnalyticsData: state.getApprovalValuation.approvalAnalyticsData,
  approvalValuationData: state.getApprovalValuation.approvalValuationData,
  stateData: state.stateRequested.stateData,
  cityNameData: state.cityRequested.cityNameData,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      approvalValuationUser: approvalValuationUser,
      resetapprovalValuationUser: resetapprovalValuationUser,
      buildingNameUser: buildingNameUser,
      resetbuildingNameUser: resetbuildingNameUser,
      valuationStateUser: valuationStateUser,
      valuationCityUser: valuationCityUser,
      cityReset: cityReset,
      getAVMVData: getAVMVData,
      getCategorytList: getCategorytList,
      bankDataUser: bankDataUser,
      reportUser: reportUser,
      getImageUrlUser: getImageUrlUser,
    },
    dispatch,
  );
}

const enhance = compose(
  GoogleApiWrapper({
    apiKey: GOOGLE_MAP_API_KEY,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);
export default enhance(ValuationFilter);
