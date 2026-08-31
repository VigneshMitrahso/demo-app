import React, { Component } from "react";

// plugins
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form, Accordion, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Slider from "react-rangeslider";
import { Multiselect } from "multiselect-react-dropdown";
import { Range as OriginalRange } from "rc-slider";
import styled from "styled-components";
import "react-rangeslider/lib/index.css";
import "rc-slider/assets/index.css";
import GooglePlacesAutocomplete, {
  getLatLng,
  geocodeByAddress,
} from "react-google-places-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";
// function
import { _getStorageValue } from "../../comman/localStorage";
import { categoryTypeStateCityUser } from "../../action/categoryTypeStateCity";
import { builderUser } from "../../action/getBuilder";
import { projectNameUser } from "../../action/getProjectName";
import { cityUser } from "../../action/getCity";
import {
  propertyByLatLonUser,
  resetpropertyByLatLonUser,
} from "../../action/getProperty";
import {
  unitTypeByLatLonUser,
  resetunitTypeByLatLonUser,
} from "../../action/getUnitType";
import {
  builderByLatLonUser,
  resetbuilderByLatLonUser,
} from "../../action/getBuilderByLatLon";
import {
  approvalByLatLonUser,
  resetapprovalByLatLonUser,
} from "../../action/getApprovalNoByLatLong";
import {
  projectByLatLonUser,
  resetprojectByLatLonUser,
} from "../../action/getProjectNameByLatLon";
import {
  getStateByRadiusUser,
  resetStateByRadiusUSer,
  getLocationByProperty,
} from "../../action/getStatesByRadius";
import { agencyUser, resetagencyUser } from "../../action/getAgency";
import {
  propertyByCityUser,
  resetpropertyByCityUser,
} from "../../action/getPropertyByCity";
import {
  approvalByCityUser,
  resetapprovalByCityUser,
} from "../../action/getApprovalBycity";
import {
  getStateByRegionUser,
  resetStateByRegionUSer,
  getByReq,
} from "../../action/getSearchByRegion";
import {
  categoryTypeUser,
  categoryTypeResetUser,
  getCategoryTypeResult,
} from "../../action/categoryType";
import {
  unitTypeByStateCityUser,
  resetunitTypeByStateCityUser,
} from "../../action/getUnitTypeByStateCity";
import {
  yearByLatLonUser,
  resetyearByLatLonUser,
} from "../../action/yearByLatLon";
import {
  yearByStateCityUser,
  resetyearByStateCityUser,
} from "../../action/yearByCity";
import {
  monthByStateCityUser,
  resetmonthByStateCityUser,
} from "../../action/monthByCity";
import {
  completedByStateCityUser,
  resetcompletedByStateCityUser,
} from "../../action/completedBycity";
import {
  monthByLatLonUser,
  resetmonthByLatLonUser,
} from "../../action/monthByLatLong";
import {
  completedByLatLonUser,
  resetcompletedByLatLonUser,
} from "../../action/completedByLatLon";
import {
  noOfUnitByCityUser,
  resetnoOfUnitByCityUser,
} from "../../action/getNoOfUnitByCity";
import {
  noOfUnitByLatLonUser,
  resetnoOfUnitByLatLonUser,
} from "../../action/getNoOfUnitByLatLon";
import { resetgridUser } from "../../action/getGrid";
import {
  rateLimitByStateCityUser,
  resetrateLimitByStateCityUser,
} from "../../action/rateLimtByCity";
import {
  searchCityUserAction,
  resetsearchCityUserUser,
} from "../../action/searchCity";
import { barByZoneUser, resetbarByZoneUser } from "../../action/barByzone";
import {
  barByLocalityUser,
  resetbarByLocalityUser,
} from "../../action/barByLocality";

// constant
import { GOOGLE_MAP_API_KEY, USER_ID } from "../../comman/constants";
import { getUserId } from "../../comman/localStorage";

// css
import "./filter.css";
import { compose } from "redux";
import { Category } from "@material-ui/icons";
import { filter, find, includes, isEmpty } from "lodash";

const horizontalLabels = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "10",
  7: "20",
};

const Range = styled(OriginalRange)``;

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      radius: 0,
      radiusState: false,
      case2State: "",
      case1CategoryId: "",
      case2CategoryId: "",
      case1CategoryTypeSelected: "",
      case2CategoryTypeSelected: "",
      case1PropertyId: [],
      case1UnitType: [],
      case1Project: [],
      case1Builder: [],
      case1ApprovalName: [],
      case1Year: [],
      case1Month: [],
      case2City: "",
      case2PropertyId: [],
      case2UnitType: [],
      case2ApprovalName: [],
      case2Project: [],
      case2Builder: [],
      case2Year: [],
      case2Month: [],
      collapse1: false,
      collapse2: false,
      collapse3: false,
      collapse4: false,
      branchBank: true,
      agencyLocation: true,
      projectSetNumber: true,
      projectSetRate: true,
      individualSetAge: true,
      individualSetRate: true,
      individualProjSetRate: true,
      individualProjSetNumber: true,
      individualProjSetAge: true,
      // check befor its true
      //
      cProjectSetNumber: true,
      cProjectSetRate: true,
      cIndividualSetRate: true,
      cIndividualSetAge: true,
      cProjecIndividualtSetNumber: true,
      cProjecIndividualSetAge: true,
      cProjectIndividualSetRate: true,
      //
      gridShowHide: true,
      multipleSelectStatus: false,
      case2Zone: "",
      case2Locality: "",
      categoryGetValueUrlByCity: "",
      categoryGetValueUrlByLatLong: "",
      unitTypeGetValueByCity: "",
      unitTypeGetValueByCLatLong: "",
      // multiple slider
      min: 0,
      max: 100000,
      minLandRate1: 0,
      maxLandRate1: 100000,
      minSellableRate1: 0,
      maxSellableRate1: 100000,
      minLandRate2: 0,
      maxLandRate2: 100000,
      minSellableRate2: 0,
      maxSellableRate2: 100000,
      minAppRate1: 0,
      maxAppRate1: 100000,
      minAppRate2: 0,
      maxAppRate2: 100000,
      minBoundLand1: 0,
      maxBoundLand1: 100000,
      minBoundSellable1: 0,
      maxBoundSellable1: 100000,
      minBoundApp1: 0,
      maxBoundApp1: 100000,
      minBoundLand2: 0,
      maxBoundLand2: 100000,
      minBoundSellable2: 0,
      maxBoundSellable2: 100000,
      minBoundApp2: 0,
      maxBoundApp2: 100000,
      minBound: 0,
      maxBound: 100000,
      minCase2: 0,
      maxCase2: 100000,
      minBoundCase2: 0,
      maxBoundCase2: 100000,
      minCase1Age: 0,
      maxCase1Age: 100,
      minBoundCase1Age: 0,
      maxBoundCase1Age: 100,
      minCase2Age: 0,
      maxCase2Age: 100,
      minBoundCase2Age: 0,
      maxBoundCase2Age: 100,
      minCase1Percent: 0,
      maxCase1Percent: 100,
      minBoundCase1Percent: 0,
      maxBoundCase1Percent: 100,
      minCase2Percent: 0,
      maxCase2Percent: 100,
      minBoundCase2Percent: 0,
      maxBoundCase2Percent: 100,
      minCase1Unit: 0,
      maxCase1Unit: 5000,
      minBoundCase1Unit: 0,
      maxBoundCase1Unit: 5000,
      minCase2Unit: 0,
      maxCase2Unit: 5000,
      minBoundCase2Unit: 0,
      maxBoundCase2Unit: 5000,
      searchStateid: "",
      searchStatename: "",
      searchCityname: "",
      searchCityid: "",
      searchStateArr: [],
      searchCityArr: [],
      showAge1: false,
      showRate1: false,
      showAge2: false,
      showRate2: false,
      showAppRate1: false,
      showAppRate2: false,
      showUnits1: false,
      showUnits2: false,
      // case1Loader: false,
      // case2Loader: false,
      urlString: "",
      payloadData: {},
      userId: "",
      updateFilter: false,
      showGoogleField: true,
      CategoryREQ: "",
      REQId: "",
    };
    this.case1Category1 = React.createRef();
    this.propertCase1type1 = React.createRef();
    this.unitTypeCase1Type1 = React.createRef();
    this.yearCae1Type1 = React.createRef();
    this.monthCase1Type1 = React.createRef();
    this.propertyCase1Type2 = React.createRef();
    this.unitTypeCase1Type2 = React.createRef();
    this.approvalCase1 = React.createRef();
    this.projectCase1 = React.createRef();
    this.builderCas1 = React.createRef();
    this.yearCae1Type2 = React.createRef();
    this.monthCase1Type2 = React.createRef();
    this.categoryCase2Type = React.createRef();
    this.propertCase2type1 = React.createRef();
    this.unitTypeCase2Type1 = React.createRef();
    this.yearCae2Type1 = React.createRef();
    this.monthCase2Type1 = React.createRef();
    this.propertCase2Type2 = React.createRef();
    this.unitTypeCase2Type2 = React.createRef();
    this.approvalCase2 = React.createRef();
    this.projectCase2 = React.createRef();
    this.builderCas2 = React.createRef();
    this.yearCae2Type2 = React.createRef();
    this.monthCase2Type2 = React.createRef();
    this.googleSelectField = React.createRef();
  }

  handleChange = ([min, max]) => {
    this.setState({ min, max });
  };

  handleChangeCase2 = ([minCase2, maxCase2]) => {
    this.setState({ minCase2, maxCase2 });
  };

  handleCase1Age = ([minCase1Age, maxCase1Age]) => {
    this.setState({ minCase1Age, maxCase1Age });
  };

  handleCase2Age = ([minCase2Age, maxCase2Age]) => {
    this.setState({ minCase2Age, maxCase2Age });
  };

  handleCase1Percent = ([minCase1Percent, maxCase1Percent]) => {
    this.setState({ minCase1Percent, maxCase1Percent });
  };

  handleCase2Percent = ([minCase2Percent, maxCase2Percent]) => {
    this.setState({ minCase2Percent, maxCase2Percent });
  };

  handleCase1Unit = ([minCase1Unit, maxCase1Unit]) => {
    this.setState({ minCase1Unit, maxCase1Unit });
  };

  handleCase2Unit = ([minCase2Unit, maxCase2Unit]) => {
    this.setState({ minCase2Unit, maxCase2Unit });
  };
  handleCaseLand1 = ([minLandRate1, maxLandRate1]) => {
    this.setState({ minLandRate1, maxLandRate1 });
  };
  handleCaseLand2 = ([minLandRate2, maxLandRate2]) => {
    this.setState({ minLandRate2, maxLandRate2 });
  };
  handleCaseSellable1 = ([minSellableRate1, maxSellableRate1]) => {
    this.setState({ minSellableRate1, maxSellableRate1 });
  };
  handleCaseSellable2 = ([minSellableRate2, maxSellableRate2]) => {
    this.setState({ minSellableRate2, maxSellableRate2 });
  };
  handleCaseApp1 = ([minAppRate1, maxAppRate1]) => {
    this.setState({ minAppRate1, maxAppRate1 });
  };
  handleCaseApp2 = ([minAppRate2, maxAppRate2]) => {
    this.setState({ minAppRate2, maxAppRate2 });
  };
  componentWillMount() {
    const { branchDataUrlState } = this.props;

    // _getStorageValue(USER_ID).then((userId) => {
    //   this.props.agencyUser(userId, "0", "0", branchDataUrlState);
    // });
  }

  getCase1Latitude(e) {
    // var latValid = e.target.value;
    // if (latValid === "") {
    // } else {
    const coordinatesRegex = /^[0-9.]+$/;
    if (coordinatesRegex.test(e.target.value) || e.target.value == "") {
      const formattedText = e.target.value.replace(/[^\d]/g, "");
      if (formattedText.length > 2) {
        this.setState({
          latitude:
            formattedText.substring(0, 2) + "." + formattedText.substring(2),
          radius: "",
        });
      } else {
        this.setState({
          latitude: formattedText,
          radius: "",
        });
      }
      console.log("lat", formattedText.length);
      // }
      const { case1CategoryTypeSelected } = this.state;
      if (case1CategoryTypeSelected.length !== 0) {
        if (!!this.case1Category1?.current) {
          this.case1Category1.current.resetSelectedValues();
        }
        this.setState({
          case1CategoryTypeSelected: [],
          case1CategoryId: "",
        });
      }
    }
  }

  getCase1Longitude(e) {
    // var longValid = e.target.value;
    // if (longValid === "") {
    // } else {
    const coordinatesRegex = /^[0-9.]+$/;
    if (coordinatesRegex.test(e.target.value) || e.target.value == "") {
      const formattedText = e.target.value.replace(/[^\d]/g, "");
      if (formattedText.length > 2) {
        this.setState({
          longitude:
            formattedText.substring(0, 2) + "." + formattedText.substring(2),
          radius: "",
        });
      } else {
        this.setState({
          longitude: formattedText,
          radius: "",
        });
      }
      // }
      const { case1CategoryTypeSelected } = this.state;

      if (case1CategoryTypeSelected.length !== 0) {
        this.case1Category1.current.resetSelectedValues();
        this.setState({
          case1CategoryTypeSelected: [],
          case1CategoryId: "",
        });
      }
    }
  }

  getCase1Radius(e) {
    const { latitude, longitude } = this.state;

    // if (latitude === "" && longitude === "") {
    // } else
    if (e === 6) {
      this.setState({
        radius: 10,
        radiusState: true,
      });
    } else if (e === 7) {
      this.setState({
        radius: 20,
        radiusState: true,
      });
    } else {
      this.setState({
        radius: e,
        radiusState: true,
      });
    }
  }

  getCas1Cerdential(e) {
    const { latitude, longitude, radius, case1CategoryTypeSelected } =
      this.state;

    if (case1CategoryTypeSelected.length !== 0) {
      if (!!this.case1Category1?.current) {
        this.case1Category1.current.resetSelectedValues();
      }
      this.setState({
        case1CategoryTypeSelected: [],
        case1CategoryId: "",
      });
    }
    if (latitude === "" || longitude === "") {
      this.setState({
        radius: 0,
      });
      toast.warning("Please Enter Latitude and Longitude", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.propertyByLatLonLoaderCallBack();
        this.props.categoryTypeUser(
          userId,
          latitude,
          longitude,
          radius,
          function () {},
        );
      });
    }
    this.setState({
      multipleSelectStatus: false,
    });
  }

  case1CategorySelect(e) {
    console.log("line 455");
    var categoryId = e.target.value;
    const {
      latitude,
      longitude,
      radius,
      case1ApprovalName,
      case1CategoryId,
      case1Project,
      case1Builder,
      case1PropertyId,
      case1UnitType,
      case1Year,
      case1Month,
    } = this.state;

    if (case1ApprovalName.length !== 0) {
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1PropertyId.length !== 0) {
      this.propertCase1type1.current.resetSelectedValues();
      this.setState({
        case1PropertyId: [],
      });
    }

    if (case1UnitType.length !== 0) {
      this.unitTypeCase1Type1.current.resetSelectedValues();
      this.setState({
        case1UnitType: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (categoryId === "INDIVIDUAL") {
      this.setState({
        case1CategoryId: "1",
        minCase1Age: 0,
        maxCase1Age: 100,
      });
    } else {
      this.setState({
        case1CategoryId: "2",
        minCase1Age: 0,
        maxCase1Age: 100,
      });
    }

    // if (categoryId.length === 2) {
    //   this.setState({
    //     case1CategoryId: "3",
    //     minCase1Age: 0,
    //     maxCase1Age: 100,
    //   });
    // } else if (categoryId.length === 0) {
    //   this.setState({
    //     case1CategoryId: "",
    //   });
    // } else {
    //   for (let list in categoryId) {
    //     if (categoryId[list].name === "INDIVIDUAL") {
    //       this.setState({
    //         case1CategoryId: "1",
    //         minCase1Age: 0,
    //         maxCase1Age: 100,
    //       });
    //     } else {
    //       this.setState({
    //         case1CategoryId: "2",
    //         minCase1Age: 0,
    //         maxCase1Age: 100,
    //       });
    //     }
    //   }
    // }

    this.setState({
      case1CategoryTypeSelected: e.target.value,
      cProjectSetNumber: true,
      cProjectSetRate: true,
      cIndividualSetRate: true,
      cIndividualSetAge: true,
      cProjecIndividualtSetNumber: true,
      cProjecIndividualSetAge: true,
      cProjectIndividualSetRate: true,
      showAge1: false,
      showUnits1: false,
      showRate1: false,
      showAppRate1: false,
    });

    var propertyStr = e.target.value;
    // for (let listCat in e) {
    //   propertyArr.push(e[listCat].name);
    // }
    this.setState({
      categoryGetValueUrlByLatLong: propertyStr,
    });

    if (propertyStr.length > 0 || case1CategoryId === "2") {
      console.log("line 631", propertyStr);

      _getStorageValue(USER_ID).then((userId) => {
        this.props.propertyByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          propertyStr,
          function () {},
          this.state.urlString,
        );
        // this.props.unitTypeByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   function () { },
        //   this.state.urlString,
        // );
        // this.props.approvalByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   function () { },
        //   this.state.urlString,
        // );
        // this.props.projectByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   function () { },
        //   this.state.urlString,
        // );
        // this.props.builderByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   function () { },
        //   this.state.urlString,
        // );
        // this.props.yearByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   function () { },
        //   this.state.urlString,
        // );
        // this.props.monthByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   propertyArr.toString().replace(/,/g, "%2C"),
        //   // function () { },
        //   this.state.urlString,
        // );

        // if(this.state.urlString!==""){
        //   this.showCase1();
        // }
      });
    } else {
      console.log("line 631");
      _getStorageValue(USER_ID).then((userId) => {
        this.props.propertyByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          propertyStr,
          function () {},
        );
        //   this.props.unitTypeByLatLonUser(
        //     userId,
        //     latitude,
        //     longitude,
        //     radius,
        //     propertyArr.toString().replace(/,/g, "%2C"),
        //     function () { }
        //   );
        //   this.props.yearByLatLonUser(
        //     userId,
        //     latitude,
        //     longitude,
        //     radius,
        //     propertyArr.toString().replace(/,/g, "%2C"),
        //     function () { }
        //   );
        //   this.props.monthByLatLonUser(
        //     userId,
        //     latitude,
        //     longitude,
        //     radius,
        //     propertyArr.toString().replace(/,/g, "%2C"),
        //   );
      });
    }
  }

  // case1CategoryRemove(e) {
  //   var categoryId = e;

  //   const {
  //     latitude,
  //     longitude,
  //     radius,
  //     case1ApprovalName,
  //     case1CategoryId,
  //     case1Project,
  //     case1Builder,
  //     case1PropertyId,
  //     case1UnitType,
  //     case1Year,
  //     case1Month,
  //   } = this.state;

  //   if (case1ApprovalName.length !== 0) {
  //     this.approvalCase1.current.resetSelectedValues();
  //     this.setState({
  //       case1ApprovalName: [],
  //     });
  //   }

  //   if (case1Project.length !== 0) {
  //     this.projectCase1.current.resetSelectedValues();
  //     this.setState({
  //       case1Project: [],
  //     });
  //   }

  //   if (case1Builder.length !== 0) {
  //     this.builderCas1.current.resetSelectedValues();
  //     this.setState({
  //       case1Builder: [],
  //     });
  //   }

  //   if (case1PropertyId.length !== 0) {
  //     this.propertCase1type1.current.resetSelectedValues();
  //     this.setState({
  //       case1PropertyId: [],
  //     });
  //   }

  //   if (case1UnitType.length !== 0) {
  //     this.unitTypeCase1Type1.current.resetSelectedValues();
  //     this.setState({
  //       case1UnitType: [],
  //     });
  //   }

  //   if (case1Year.length !== 0) {
  //     !!this.yearCae1Type1.current &&
  //       this.yearCae1Type1.current.resetSelectedValues();
  //     this.setState({
  //       case1Year: [],
  //     });
  //   }

  //   if (case1Month.length !== 0) {
  //     !!this.monthCase1Type1.current &&
  //       this.monthCase1Type1.current.resetSelectedValues();
  //     this.setState({
  //       case1Month: [],
  //     });
  //   }

  //   if (categoryId.length === 2) {
  //     this.setState({
  //       case1CategoryId: "2",
  //       minCase1Age: 0,
  //       maxCase1Age: 100,
  //     });
  //   } else if (categoryId.length === 0) {
  //     this.setState({
  //       case1CategoryId: "",
  //     });
  //   } else {
  //     for (let list in categoryId) {
  //       if (categoryId[list].name === "INDIVIDUAL") {
  //         this.setState({
  //           case1CategoryId: "1",
  //           minCase1Age: 0,
  //           maxCase1Age: 100,
  //         });
  //       } else {
  //         this.setState({
  //           case1CategoryId: "2",
  //           minCase1Age: 0,
  //           maxCase1Age: 100,
  //         });
  //       }
  //     }
  //   }

  //   this.setState({
  //     case1CategoryTypeSelected: e,
  //     cProjectSetNumber: true,
  //     cProjectSetRate: true,
  //     cIndividualSetRate: true,
  //     cIndividualSetAge: true,
  //     cProjecIndividualtSetNumber: true,
  //     cProjecIndividualSetAge: true,
  //     cProjectIndividualSetRate: true,
  //     showAge1: false,
  //     showUnits1: false,
  //     showRate1: false,
  //     showAppRate1: false,
  //   });

  //   var propertyArr = [];
  //   for (let listCat in e) {
  //     propertyArr.push(e[listCat].name);
  //   }
  //   this.setState({
  //     categoryGetValueUrlByLatLong: propertyArr.toString().replace(/,/g, "%2C"),
  //   });
  //   if (propertyArr.length > 1 || case1CategoryId === "2") {
  //     _getStorageValue(USER_ID).then((userId) => {
  //       this.props.propertyByLatLonUser(
  //         userId,
  //         latitude,
  //         longitude,
  //         radius,
  //         propertyArr.toString().replace(/,/g, "%2C"),
  //         function () {},
  //         this.state.urlString
  //       );
  //       // this.props.unitTypeByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString
  //       // );
  //       // this.props.approvalByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString

  //       // );
  //       // this.props.projectByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString
  //       // );
  //       // this.props.builderByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString

  //       // );
  //       // this.props.yearByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString
  //       // );
  //       // this.props.monthByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   // function () { },
  //       //   this.state.urlString
  //       // );

  //       // if(this.state.urlString!==""){
  //       //   this.showCase1();

  //       // }
  //     });
  //   } else {
  //     _getStorageValue(USER_ID).then((userId) => {
  //       this.props.propertyByLatLonUser(
  //         userId,
  //         latitude,
  //         longitude,
  //         radius,
  //         propertyArr.toString().replace(/,/g, "%2C"),
  //         function () {},
  //         this.state.urlString
  //       );
  //       // this.props.unitTypeByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString
  //       // );
  //       // this.props.yearByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   function () { },
  //       //   this.state.urlString
  //       // );
  //       // this.props.monthByLatLonUser(
  //       //   userId,
  //       //   latitude,
  //       //   longitude,
  //       //   radius,
  //       //   propertyArr.toString().replace(/,/g, "%2C"),
  //       //   this.state.urlString
  //       // );
  //     });
  //   }
  // }

  case1PropertySelect(e) {
    this.setState({
      case1PropertyId: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1PropertyId,
      case1UnitType,
      case1Year,
      case1Month,
    } = this.state;

    if (case1ApprovalName.length !== 0) {
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1UnitType.length !== 0) {
      this.unitTypeCase1Type1.current.resetSelectedValues();
      this.setState({
        case1UnitType: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (categoryGetValueUrlByLatLong !== "") {
      var unitTypeArr = [];
      for (let listCat in e) {
        unitTypeArr.push(e[listCat].name);
      }
      // category_type=INDIUDAL&property_type=COMMERCIAL&
      var unitType =
        categoryGetValueUrlByLatLong +
        "&property_type=" +
        unitTypeArr.toString().replace(/,/g, "%2C");
      this.setState({
        unitTypeGetValueByCity: unitType,
      });
      if (case1CategoryId === "1") {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            unitType,
            function () {},
            this.state.urlString,
          );
          // this.props.yearByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString

          // );
          // this.props.monthByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   this.state.urlString
          // );
        });
      } else {
        console.log("line 988");
        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            unitType,
            function () {},
            this.state.urlString,
          );
          // this.props.approvalByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.projectByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.builderByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.yearByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.monthByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   // function () { },
          //   this.state.urlString
          // );

          // if(this.state.urlString!==""){
          //   this.showCase1();
          // }
        });
      }
    }
  }

  case1PropertyRemove(e) {
    this.setState({
      case1PropertyId: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1ApprovalName,
      case1CategoryId,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
    } = this.state;

    if (case1ApprovalName.length !== 0) {
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1UnitType.length !== 0) {
      this.unitTypeCase1Type1.current.resetSelectedValues();
      this.setState({
        case1UnitType: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (categoryGetValueUrlByLatLong !== "") {
      var unitTypeArr = [];
      for (let listCat in e) {
        unitTypeArr.push(e[listCat].name);
      }

      var unitType =
        categoryGetValueUrlByLatLong +
        "&property_type=" +
        unitTypeArr.toString().replace(/,/g, "%2C");

      this.setState({
        unitTypeGetValueByCity: unitType,
      });
      if (case1CategoryId === "1") {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            unitType,
            function () {},
            this.state.urlString,
          );
          // this.props.yearByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { }
          // );
          // this.props.monthByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          // );
        });
      } else {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            unitType,
            function () {},
            this.state.urlString,
          );
          // this.props.approvalByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.projectByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString
          // );
          // this.props.builderByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString

          // );
          // this.props.yearByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   function () { },
          //   this.state.urlString

          // );
          // this.props.monthByLatLonUser(
          //   userId,
          //   latitude,
          //   longitude,
          //   radius,
          //   unitType,
          //   this.state.urlString
          // );

          // if(this.state.urlString!==""){
          //   this.showCase1();
          // }
        });
      }
    }
  }

  case1UnitTypeSelect(e) {
    console.log("line 1186");
    this.setState({
      case1UnitType: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryId,
      case1CategoryTypeSelected,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;
    if (case1ApprovalName.length !== 0) {
      console.log("line 1207");
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (case1CategoryId === "1") {
      var valueType = "";
      var valueArr = [];
      for (let listCat in e) {
        valueArr.push(e[listCat].name);
      }

      if (unitTypeGetValueByCity !== "") {
        valueType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      } else {
        if (case1CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case1CategoryTypeSelected) {
          //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          valueType =
            case1CategoryTypeSelected +
            "&unit_type=" +
            valueArr.toString().replace(/,/g, "%2C");
        }
      }
      this.setState({
        unitTypeGetValueByCity: valueType,
      });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.yearByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          valueType,
          successCallBackYearByLatLon,
          this.state.urlString,
        );
      });

      const successCallBackYearByLatLon = () => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.monthByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            valueType,
            this.state.urlString,
          );
        });
      };
      console.log("line 1291");
    } else {
      var approvalType = "";
      var approvalArr = [];
      for (let listCat in e) {
        approvalArr.push(e[listCat].name);
      }
      console.log("line 1298");
      if (unitTypeGetValueByCity !== "") {
        approvalType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          approvalArr.toString().replace(/,/g, "%2C");
      } else {
        if (case1CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case1CategoryTypeSelected) {
          //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          approvalType =
            case1CategoryTypeSelected +
            "&unit_type=" +
            approvalArr.toString().replace(/,/g, "%2C");
        }
      }
      this.setState({
        unitTypeGetValueByCity: approvalType,
      });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.approvalByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          approvalType,
          function () {},
          this.state.urlString,
        );
        // this.props.projectByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString

        // );
        // this.props.builderByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString

        // );
        // this.props.yearByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString
        // );
        // this.props.monthByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   // function () { },
        //   this.state.urlString
        // );
        // if(this.state.urlString!==""){
        //   this.showCase1();

        // }
      });
    }
  }

  case1UnitTypeRemove(e) {
    this.setState({
      case1UnitType: e,
    });
    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;
    if (case1ApprovalName.length !== 0) {
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (case1CategoryId === "1") {
      var valueType = "";
      var valueArr = [];
      for (let listCat in e) {
        valueArr.push(e[listCat].name);
      }

      if (unitTypeGetValueByCity !== "") {
        valueType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      } else {
        if (case1CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case1CategoryTypeSelected) {
          //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          valueType =
            case1CategoryTypeSelected +
            "&unit_type=" +
            valueArr.toString().replace(/,/g, "%2C");
        }
      }
      this.setState({
        unitTypeGetValueByCity: valueType,
      });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.yearByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          valueType,
          successCallBackYearByLatLon,
          this.state.urlString,
        );
      });

      const successCallBackYearByLatLon = () => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.monthByLatLonUser(
            userId,
            latitude,
            longitude,
            radius,
            valueType,
            this.state.urlString,
          );
        });
      };
    } else {
      var approvalType = "";
      var approvalArr = [];
      for (let listCat in e) {
        approvalArr.push(e[listCat].name);
      }

      if (unitTypeGetValueByCity !== "") {
        approvalType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          approvalArr.toString().replace(/,/g, "%2C");
      } else {
        if (case1CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case1CategoryTypeSelected) {
          //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          approvalType =
            case1CategoryTypeSelected +
            "&unit_type=" +
            approvalArr.toString().replace(/,/g, "%2C");
        }
      }
      this.setState({
        unitTypeGetValueByCity: approvalType,
      });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.approvalByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          approvalType,
          function () {},
          this.state.urlString,
        );
        // this.props.projectByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString

        // );
        // this.props.builderByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString

        // );
        // this.props.yearByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   function () { },
        //   this.state.urlString

        // );
        // this.props.monthByLatLonUser(
        //   userId,
        //   latitude,
        //   longitude,
        //   radius,
        //   approvalType,
        //   this.state.urlString
        // );
        // if(this.state.urlString!==""){
        //   this.showCase1();

        // }
      });
    }
  }

  case1ApprovalSelect(e) {
    this.setState({
      case1ApprovalName: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;
    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }
    var projectType = "";
    var getProjectArr = [];
    for (let listCat in e) {
      getProjectArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      projectType =
        unitTypeGetValueByCity +
        "&approval_number=" +
        getProjectArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        projectType =
          case1CategoryTypeSelected +
          "&approval_number=" +
          getProjectArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: projectType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.projectByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        projectType,
        function () {},
        this.state.urlString,
      );
      // this.props.builderByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   function () { },
      //   this.state.urlString
      // );
      // this.props.yearByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   function () { },
      //   this.state.urlString
      // );
      // this.props.monthByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   // function () { },
      //   this.state.urlString
      // );
      // if(this.state.urlString!==""){
      //   this.showCase1();

      // }
    });
  }

  getPlacesID(e) {
    var placeid = e.value.description;
    geocodeByAddress(placeid).then((results) => {
      // getLatLng(results[0])
      console.log("results77", results);
      // console.log("results77",results[0].geometry.bounds.Oa.hi)
      const { geometry } = results[0];
      const { bounds, location, viewport } = geometry;

      console.log("bounds", location.lng());
      console.log("bounds", location.lng());
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

      let payloadData = {
        locLat,
        locLong,
        north,
        east,
        south,
        west,
      };

      _getStorageValue(USER_ID).then((userId) => {
        // this.props.propertyByLatLonLoaderCallBack();
        // get category
        this.props.getCategoryTypeResult(userId, payloadData);

        // property
        // this.props.getLocationByProperty(
        //   userId,
        //   payloadData,
        //   onSuccessCallBackRadius,
        //   onFailuerCallBackRadius
        // )
      });

      // const onSuccessCallBackRadius = () => {
      //   this.props.case1LoaderCloseCallBack();
      // };

      // const onFailuerCallBackRadius = () => {
      //   this.props.case1LoaderCloseCallBack();
      // };
      this.setState({
        payloadData: payloadData,
        urlString: `&south=${parseFloat(south).toFixed(6)}&north=${parseFloat(
          north,
        ).toFixed(6)}&west=${parseFloat(west).toFixed(6)}&east=${parseFloat(
          east,
        ).toFixed(6)}&googlesearch=true`,
        longitude: parseFloat(locLong).toFixed(6),
        latitude: parseFloat(locLat).toFixed(6),
      });
      // this.props.cas1Submit(cerdintial);
      // this.props.zoomDragCrentential(postDataType);
      // this.props.zoomDragCrentential({ lat: locLat,
      //   lng: locLong,});
      var centroid = {
        lat: locLat,
        lng: locLong,
        zoom: 8,
      };

      this.props.centerMapByData(centroid);
      // this.props.getCategoryTypeResult(payloadData)
    });

    // .then(({ lat, lng }) => {
    //   // this.props.geoCentroid({ lat, lng });
    // });
  }

  case1ApprovalRemove(e) {
    this.setState({
      case1ApprovalName: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryId,
      case1ApprovalName,
      case1CategoryTypeSelected,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;
    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    var projectType = "";
    var getProjectArr = [];
    for (let listCat in e) {
      getProjectArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      projectType =
        unitTypeGetValueByCity +
        "&approval_number=" +
        getProjectArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        projectType =
          case1CategoryTypeSelected +
          "&approval_number=" +
          getProjectArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: projectType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.projectByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        projectType,
        function () {},
        this.state.urlString,
      );
      // this.props.builderByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   function () { },
      //   this.state.urlString

      // );
      // this.props.yearByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   function () { },
      //   this.state.urlString

      // );
      // this.props.monthByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   projectType,
      //   // function () { }
      //   this.state.urlString

      // );
      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });
  }

  case1ProjectSelect(e) {
    this.setState({
      case1Project: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }
    var buildType = "";
    var getBuildArr = [];
    for (let listCat in e) {
      getBuildArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      buildType =
        unitTypeGetValueByCity +
        "&project_name=" +
        getBuildArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        buildType =
          case1CategoryTypeSelected +
          "&project_name=" +
          getBuildArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: buildType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.builderByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        buildType,
        function () {},
        this.state.urlString,
      );
      // this.props.yearByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   buildType,
      //   function () { },
      //   this.state.urlString
      // );
      // this.props.monthByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   buildType,
      //   this.state.urlString
      //   // function () { }
      // );
      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });
  }

  case1ProjectRemove(e) {
    this.setState({
      case1Project: e,
    });
    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;

    if (case1Builder.length !== 0) {
      this.setState({
        case1Builder: [],
      });
      this.builderCas1.current.resetSelectedValues();
    }

    if (case1Year.length !== 0) {
      this.setState({
        case1Year: [],
      });
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
    }

    if (case1Month.length !== 0) {
      this.setState({
        case1Month: [],
      });
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
    }

    var buildType = "";
    var getBuildArr = [];
    for (let listCat in e) {
      getBuildArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      buildType =
        unitTypeGetValueByCity +
        "&project_name=" +
        getBuildArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        buildType =
          case1CategoryTypeSelected +
          "&project_name=" +
          getBuildArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: buildType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.builderByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        buildType,
        function () {},
        this.state.urlString,
      );
      // this.props.yearByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   buildType,
      //   function () { },
      //   this.state.urlString
      // );
      // this.props.monthByLatLonUser(
      //   userId,
      //   latitude,
      //   longitude,
      //   radius,
      //   buildType,
      //   this.state.urlString
      //   // function () { }
      // );

      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });
  }

  case1BuilderSelect(e) {
    this.setState({
      case1Builder: e,
    });

    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }
    var yearMonthType = "";
    var getYearMonthArr = [];
    for (let listCat in e) {
      getYearMonthArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      yearMonthType =
        unitTypeGetValueByCity +
        "&buildergroup_name=" +
        getYearMonthArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        yearMonthType =
          case1CategoryTypeSelected +
          "&buildergroup_name=" +
          getYearMonthArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: yearMonthType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.yearByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        yearMonthType,
        successCallBackYearByLatLon,
        this.state.urlString,
      );
      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });

    const successCallBackYearByLatLon = () => {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.monthByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          yearMonthType,
          this.state.urlString,
          // successCallBackYearByLatLon
        );
      });
    };
  }

  case1BuilderRemove(e) {
    this.setState({
      case1Builder: e,
    });
    const {
      latitude,
      longitude,
      radius,
      categoryGetValueUrlByLatLong,
      case1CategoryTypeSelected,
      case1CategoryId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      unitTypeGetValueByCity,
    } = this.state;

    if (case1Year.length !== 0) {
      if (!!this?.yearCae1Type1?.current) {
        this.yearCae1Type1.current.resetSelectedValues();
      }
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      if (!!this.monthCase1Type1?.current) {
        this.monthCase1Type1.current.resetSelectedValues();
      }
      this.setState({
        case1Month: [],
      });
    }
    var yearMonthType = "";
    var getYearMonthArr = [];
    for (let listCat in e) {
      getYearMonthArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      yearMonthType =
        unitTypeGetValueByCity +
        "&buildergroup_name=" +
        getYearMonthArr.toString().replace(/,/g, "%2C");
    } else {
      if (case1CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case1CategoryTypeSelected) {
        //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        yearMonthType =
          case1CategoryTypeSelected +
          "&buildergroup_name=" +
          getYearMonthArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: yearMonthType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.yearByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        yearMonthType,
        successCallBackYearByLatLon,
        this.state.urlString,
      );
      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });

    const successCallBackYearByLatLon = () => {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.monthByLatLonUser(
          userId,
          latitude,
          longitude,
          radius,
          yearMonthType,
          // successCallBackYearByLatLon
          this.state.urlString,
        );
      });
    };
  }

  case1YearSelect(e) {
    this.setState({
      case1Year: e,
    });
    const {
      latitude,
      longitude,
      radius,
      case1CategoryTypeSelected,
      case1Month,
      case1Year,
      case1PropertyId,
      case1UnitType,
      case1Builder,
      case1Project,
      case1ApprovalName,
      min,
      max,
      minCase1Age,
      maxCase1Age,
      minCase1Percent,
      maxCase1Percent,
      minCase1Unit,
      maxCase1Unit,
      showUnits1,
      showAge1,
      showRate1,
      showAppRate1,
      minLandRate1,
      maxLandRate1,
      minSellableRate1,
      maxSellableRate1,
      minAppRate1,
      maxAppRate1,
    } = this.state;

    var postDataType = {
      radiusKmData: radius,
      lat: latitude,
      lng: longitude,
    };

    var propertyUrls = ``;
    //category type if selected
    if (case1CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case1CategoryTypeSelected) {
      //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      // var urlCategory = cateStr.replace(/,/g, "%2C");

      propertyUrls += case1CategoryTypeSelected;

      postDataType = Object.assign(
        { categoryTypeId: case1CategoryTypeSelected },
        postDataType,
      );
    }

    // Property type if specified
    if (case1PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case1PropertyId) {
        propertyArr.push(case1PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();
      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");
      propertyUrls += urlProperty;
      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if specified
    if (case1UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case1UnitType) {
        unitArr.push(case1UnitType[list].name.toString());
      }
      var unitStr = "";
      var unitStr = unitArr.toString();
      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }
    //builder group name
    if (case1Builder.length !== 0) {
      var builderArr = [];
      for (let list in case1Builder) {
        builderArr.push(case1Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name
    if (case1Project.length !== 0) {
      var projectArr = [];
      for (let list in case1Project) {
        projectArr.push(case1Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number
    if (case1ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case1ApprovalName) {
        approvalArr.push(case1ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;
      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }
    // year if specified
    var yearArr = [];
    for (let list in e) {
      yearArr.push(e[list].name.toString());
    }

    var yearStr = "";
    var yearStr = yearArr.toString();

    var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

    propertyUrls += urlYear;

    postDataType = Object.assign({ year: urlYear }, postDataType);

    _getStorageValue(USER_ID).then((userId) => {
      this.props.monthByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        propertyUrls,
        this.state.urlString,
      );
      // if(this.state.urlString!=""){
      //   this.showCase1();
      // }
    });
  }

  case1YearRemove(e) {
    this.setState({
      case1Year: e,
    });
    const {
      latitude,
      longitude,
      radius,
      case1CategoryTypeSelected,
      case1Month,
      case1Year,
      case1PropertyId,
      case1UnitType,
      case1Builder,
      case1Project,
      case1ApprovalName,
      min,
      max,
      minCase1Age,
      maxCase1Age,
      minCase1Percent,
      maxCase1Percent,
      minCase1Unit,
      maxCase1Unit,
      showUnits1,
      showAge1,
      showRate1,
      showAppRate1,
      minLandRate1,
      maxLandRate1,
      minSellableRate1,
      maxSellableRate1,
      minAppRate1,
      maxAppRate1,
    } = this.state;

    var postDataType = {
      radiusKmData: radius,
      lat: latitude,
      lng: longitude,
    };

    var propertyUrls = ``;
    //category type if selected
    if (case1CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case1CategoryTypeSelected) {
      //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      // var urlCategory = cateStr.replace(/,/g, "%2C");

      propertyUrls += case1CategoryTypeSelected;

      postDataType = Object.assign(
        { categoryTypeId: case1CategoryTypeSelected },
        postDataType,
      );
    }

    // Property type if specified
    if (case1PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case1PropertyId) {
        propertyArr.push(case1PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();

      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");

      propertyUrls += urlProperty;

      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if specified
    if (case1UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case1UnitType) {
        unitArr.push(case1UnitType[list].name.toString());
      }
      var unitStr = "";
      var unitStr = unitArr.toString();
      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }
    //builder group name
    if (case1Builder.length !== 0) {
      var builderArr = [];
      for (let list in case1Builder) {
        builderArr.push(case1Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name
    if (case1Project.length !== 0) {
      var projectArr = [];
      for (let list in case1Project) {
        projectArr.push(case1Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number
    if (case1ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case1ApprovalName) {
        approvalArr.push(case1ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;
      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }
    // year if specified
    var yearArr = [];
    for (let list in e) {
      yearArr.push(e[list].name.toString());
    }

    var yearStr = "";
    var yearStr = yearArr.toString();

    var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

    propertyUrls += urlYear;

    postDataType = Object.assign({ year: urlYear }, postDataType);

    _getStorageValue(USER_ID).then((userId) => {
      this.props.monthByLatLonUser(
        userId,
        latitude,
        longitude,
        radius,
        propertyUrls,
        this.state.urlString,
      );
    });
  }

  case1MonthSelect(e) {
    this.setState({
      case1Month: e,
    });
  }

  case1MonthRemove(e) {
    this.setState({
      case1Month: e,
    });
  }

  validationCase1() {
    // this.setState({
    //   case1Loader: true,
    // });

    this.props.case1LoaderCallBack();

    const {
      latitude,
      longitude,
      radius = 0,
      case1CategoryTypeSelected,
    } = this.state;

    var latValid = latitude !== "";
    var longValid = longitude !== "";
    var radiusValid = radius !== 0;
    var case1CateValid = case1CategoryTypeSelected.length > 0;

    var validCase1 = latValid && longValid && radiusValid && case1CateValid;

    if (!validCase1) {
      toast.warning("Please Select the Values", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.props.case1LoaderCloseCallBack();
    } else {
      this.showCase1();
    }
  }

  showCase1() {
    //state and vars declaration
    const {
      latitude,
      longitude,
      radius,
      case1CategoryTypeSelected,
      case1Month,
      case1Year,
      case1PropertyId,
      case1UnitType,
      case1Builder,
      case1Project,
      case1ApprovalName,
      min,
      max,
      minCase1Age,
      maxCase1Age,
      minCase1Percent,
      maxCase1Percent,
      minCase1Unit,
      maxCase1Unit,
      showUnits1,
      showAge1,
      showRate1,
      showAppRate1,
      minLandRate1,
      maxLandRate1,
      minSellableRate1,
      maxSellableRate1,
      minAppRate1,
      maxAppRate1,
    } = this.state;

    var radiusKm = parseInt(`${radius}000`);

    var cerdintial = {
      km: radiusKm,
      lat: latitude,
      lng: longitude,
    };

    var postDataType = {
      radiusKmData: radius,
      lat: latitude,
      lng: longitude,
    };

    var propertyUrls = ``;
    //category type if selected
    if (case1CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case1CategoryTypeSelected) {
      //   cateArr.push(case1CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      var urlCategory = `?category_type=` + case1CategoryTypeSelected;

      propertyUrls += urlCategory;

      postDataType = Object.assign(
        { categoryTypeId: urlCategory },
        postDataType,
      );
    }

    // Property type if specified
    if (case1PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case1PropertyId) {
        propertyArr.push(case1PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();

      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");

      propertyUrls += urlProperty;

      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if specified
    if (case1UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case1UnitType) {
        unitArr.push(case1UnitType[list].name.toString());
      }
      var unitStr = "";
      var unitStr = unitArr.toString();
      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }

    // year if specified
    if (case1Year.length !== 0) {
      var yearArr = [];
      for (let list in case1Year) {
        yearArr.push(case1Year[list].name.toString());
      }

      var yearStr = "";
      var yearStr = yearArr.toString();

      var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

      propertyUrls += urlYear;

      postDataType = Object.assign({ year: urlYear }, postDataType);
    }

    // month if specified
    if (case1Month.length !== 0) {
      var monthArr = [];
      for (let list in case1Month) {
        monthArr.push(case1Month[list].name);
      }
      var monthStr = monthArr.toString();
      var urlMonth = `&month=` + monthStr.replace(/,/g, "%2C");
      propertyUrls += urlMonth;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign({ month: urlMonth }, postDataType);
    }

    // if(minCase1Percent!==0){
    // var minMaxCompletedUrl = `&completed=${minCase1Percent}%2C${maxCase1Percent}`;
    // propertyUrls += minMaxCompletedUrl;
    // postDataType = Object.assign({ dataSelected: true }, postDataType);
    // postDataType = Object.assign(
    //   { minMaxCompletedPercUrl: minMaxCompletedUrl },
    //   postDataType
    // );
    // }

    //setting completed %, age, number of units and rates
    if (showAge1) {
      var minMaxAgeIndivalUrl = `&age=${minCase1Age}%2C${maxCase1Age}`;
      propertyUrls += minMaxAgeIndivalUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxAgeUrl: minMaxAgeIndivalUrl },
        postDataType,
      );
    }
    if (showUnits1) {
      var minMaxUrl = `&number_of_units=${minCase1Unit}%2C${maxCase1Unit}&rate=${min}%2C${max}`;
      propertyUrls += minMaxUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign({ minMaxLimtUrl: minMaxUrl }, postDataType);
    }
    if (showRate1) {
      var minMaxLandAndSellableUrl = `&landarea_rate=${minLandRate1}%2C${maxLandRate1}&sellable_rate=${minSellableRate1}%2C${maxSellableRate1}`;
      propertyUrls += minMaxLandAndSellableUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxLandSellableUrl: minMaxLandAndSellableUrl },
        postDataType,
      );
    }
    if (showAppRate1) {
      var minMaxAppRateUrl = `&appraised_rate=${minAppRate1}%2C${maxAppRate1}`;
      propertyUrls += minMaxAppRateUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxAppUrl: minMaxAppRateUrl },
        postDataType,
      );
    }

    //builder group name
    if (case1Builder.length !== 0) {
      var builderArr = [];
      for (let list in case1Builder) {
        builderArr.push(case1Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name
    if (case1Project.length !== 0) {
      var projectArr = [];
      for (let list in case1Project) {
        projectArr.push(case1Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number
    if (case1ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case1ApprovalName) {
        approvalArr.push(case1ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;
      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }

    //lat long bounds
    if (this.state.urlString == "") {
      var getBound = this.getBoundsFromLatLng(latitude, longitude, 3);
      propertyUrls +=
        "&bbox=" +
        getBound.lon_min +
        "%2C" +
        getBound.lat_min +
        "%2C" +
        getBound.lon_max +
        "%2C" +
        getBound.lat_max +
        "&zoom-level=13";
    }
    //API CALL
    _getStorageValue(USER_ID).then((userId) => {
      this.props.getStateByRadiusUser(
        userId,
        latitude,
        longitude,
        radius,
        propertyUrls,
        onSuccessCallBackRadius,
        onFailuerCallBackRadius,
        this.state.urlString,
      );
    });

    const onSuccessCallBackRadius = () => {
      this.props.case1LoaderCloseCallBack();
    };

    const onFailuerCallBackRadius = () => {
      this.props.case1LoaderCloseCallBack();
    };

    this.props.cas1Submit(cerdintial);
    this.props.zoomDragCrentential(postDataType);
  }

  getCase2SelectState(e) {
    this.props.resetStateByRegionUSer();
    this.props.resetMapData();
    const { case2CategoryTypeSelected } = this.state;

    const { stateData } = this.props;

    var stateId = e.target.value;

    var centerData = stateData.find((e) => e.id == stateId);

    var centerDataCoor = JSON.parse(centerData.centroid);

    var centroid = {
      lat: centerDataCoor.coordinates[1],
      lng: centerDataCoor.coordinates[0],
      zoom: 7,
    };

    this.props.centerMapByData(centroid);
    this.props.resetbarByLocalityUser();

    this.setState({
      case2State: stateId,
      case2Zone: "NaN",
      case2Locality: "NaN",
    });

    if (case2CategoryTypeSelected.length > 0) {
      this.setState({
        case2CategoryTypeSelected: "",
        case2CategoryId: "",
      });
    }

    _getStorageValue(USER_ID).then((userId) => {
      const cityUrl = `${userId}/state/${stateId}/city`;
      this.props.cityUser(cityUrl);
    });
  }

  getCase2City(e) {
    const { case2State, case2CategoryTypeSelected } = this.state;

    this.props.resetStateByRegionUSer();
    this.props.resetMapData();
    var cityId = e.target.value;

    const { cityNameData } = this.props;

    var centerData = cityNameData.find((e) => e.id == cityId);

    var centerDataCoor = JSON.parse(centerData.centroid);

    var centroid = {
      lat: centerDataCoor.coordinates[1],
      lng: centerDataCoor.coordinates[0],
      zoom: 8,
    };

    this.props.centerMapByData(centroid);
    this.props.resetbarByLocalityUser();
    this.setState({
      case2City: cityId,
      case2Zone: "NaN",
      case2Locality: "NaN",
    });

    if (case2CategoryTypeSelected.length > 0) {
      this.setState({
        case2CategoryTypeSelected: "",
        case2CategoryId: "",
      });
    }

    this.props.propertyByCityLoaderCallBack();
    // _getStorageValue(USER_ID).then((userId) => {
    //   this.props.barByZoneUser(userId, case2State, cityId, successCallBackZone);
    // });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.barByLocalityUser(
        userId,
        case2State,
        cityId,
        successCallBackBarLoc,
      );
    });

    const successCallBackBarLoc = (response) => {
      // var zoneData = response.data.zone.length;

      // if (zoneData === 0) {
      //   setTimeout(() => {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.categoryTypeStateCityUser(
          userId,
          case2State,
          cityId,
          "",
          function () {},
        );
      });
      //     }, 500);
      //   }
    };
  }

  // not used below code
  // getCase2Zone(e) {
  //   var zoneId = e.target.value;

  //   this.props.resetStateByRegionUSer();
  //   this.props.resetMapData();
  //   const { zoneByCityBarDataArr } = this.state;

  //   // var centerData =  zoneByCityBarDataArr.find(e => e.id == zoneId);

  //   // var centerDataCoor = JSON.parse(centerData.centroid)

  //   // var centroid = { lat: centerDataCoor.coordinates[1], lng: centerDataCoor.coordinates[0], zoom: 9 };

  //   // this.props.centerMapByData(centroid);

  //   this.setState({
  //     case2Zone: zoneId,
  //     case2Locality: "NaN",
  //   });

  //   const { case2State, case2City } = this.state;

  //   // if (case2CategoryTypeSelected.length !== 0) {
  //   //
  //   //   this.setState({
  //   //     case2CategoryTypeSelected: [],
  //   //     case2CategoryId: "",
  //   //   });
  //   // }

  //   _getStorageValue(USER_ID).then((userId) => {
  //     this.props.barByLocalityUser(
  //       userId,
  //       case2State,
  //       case2City,
  //       successCallBackBarLoc
  //     );
  //   });

  //   const successCallBackBarLoc = (response) => {
  //     // var localityCheck = response.data.locality.length;
  //     // if (localityCheck) {
  //     var zoneCategoryUrl = "&zone=" + zoneId.toString().replace(/,/g, "%2C");
  //     _getStorageValue(USER_ID).then((userId) => {
  //       this.props.categoryTypeStateCityUser(
  //         userId,
  //         case2State,
  //         case2City,
  //         zoneCategoryUrl,
  //         function () {}
  //       );
  //     });
  //     // }
  //   };
  // }

  getCase2Locality(e) {
    var case2Loc = e.target.value;

    this.props.resetStateByRegionUSer();
    this.props.resetMapData();
    this.setState({
      case2Locality: case2Loc,
    });

    const { case2State, case2City, case2CategoryTypeSelected } = this.state;
    if (case2CategoryTypeSelected.length > 0) {
      !!this.categoryCase2Type.current &&
        this.setState({
          case2CategoryTypeSelected: "",
          case2CategoryId: "",
        });
    }

    var zoneCategoryUrl =
      case2Loc !== "NaN"
        ? "&pincode=" + case2Loc.toString().replace(/,/g, "%2C")
        : "";
    _getStorageValue(USER_ID).then((userId) => {
      console.log("zoneCategoryUrl", zoneCategoryUrl);
      this.props.categoryTypeStateCityUser(
        userId,
        case2State,
        case2City,
        zoneCategoryUrl,
        function () {},
      );
    });
  }

  case2CategorySelect(e) {
    this.props.resetpropertyByCityUser();
    const {
      case2State,
      case2City,
      case2Locality,
      case2CategoryId,
      case2PropertyId,
      case2UnitType,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;
    var categoryId = e.target.value;
    console.log("************** case2City", e, case2CategoryId);
    if (categoryId === "INDIVIDUAL") {
      this.setState({
        case2CategoryId: "1",
        minCase2Age: 0,
        maxCase2Age: 100,
      });
    } else {
      this.setState({
        case2CategoryId: "2",
        minCase2Age: 0,
        maxCase2Age: 100,
      });
    }
    // if (categoryId.length === 2) {
    //   this.setState({
    //     case2CategoryId: "3",
    //     minCase2Age: 0,
    //     maxCase2Age: 100,
    //   });
    // } else if (categoryId.length === 0) {
    //   this.setState({
    //     case1CategoryId: "",
    //   });
    // } else {
    //   for (let list in categoryId) {
    //     if (categoryId[list].name === "INDIVIDUAL") {
    //       this.setState({
    //         case2CategoryId: "1",
    //         minCase2Age: 0,
    //         maxCase2Age: 100,
    //       });
    //     } else {
    //       this.setState({
    //         case2CategoryId: "2",
    //         minCase2Age: 0,
    //         maxCase2Age: 100,
    //       });
    //     }
    //   }
    // }

    this.setState({
      case2CategoryTypeSelected: e.target.value,
      showAge2: false,
      showUnits2: false,
      showRate1: false,
      showAppRate2: false,
      showRate2: false,
      projectSetNumber: true,
      projectSetRate: true,
      individualSetAge: true,
      individualSetRate: true,
      individualProjSetRate: true,
      individualProjSetNumber: true,
      individualProjSetAge: true,
    });

    var propertyStr = e.target.value;
    // for (let listCat in e) {
    //   propertyArr.push(e[listCat].name);
    // }
    console.log("propertyArr case2City", propertyStr, case2CategoryId);
    if (case2Locality !== "NaN" && case2Locality !== "") {
      var zoneLocaPropertyUrl = propertyStr + "&pincode=" + case2Locality;
      if (propertyStr.length > 0 || case2CategoryId === "2") {
        this.setState({
          categoryGetValueUrlByCity: zoneLocaPropertyUrl,
        });
        _getStorageValue(USER_ID).then((userId) => {
          this.props.propertyByCityUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.approvalByCityUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.projectNameUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.builderUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            zoneLocaPropertyUrl,
            function () {},
          );
        });
      }
      // else {
      //   this.setState({
      //     categoryGetValueUrlByCity: zoneLocaPropertyUrl,
      //   });
      //   _getStorageValue(USER_ID).then((userId) => {
      //     this.props.propertyByCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       zoneLocaPropertyUrl,
      //       function () {}
      //     );
      //     this.props.unitTypeByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       zoneLocaPropertyUrl,
      //       function () {}
      //     );
      //     this.props.yearByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       zoneLocaPropertyUrl,
      //       function () {}
      //     );
      //     this.props.monthByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       zoneLocaPropertyUrl,
      //       function () {}
      //     );
      //   });
      // }
    } else {
      if (propertyStr.length > 0 || case2CategoryId === "2") {
        this.setState({
          categoryGetValueUrlByCity: propertyStr,
        });
        _getStorageValue(USER_ID).then((userId) => {
          this.props.propertyByCityUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.approvalByCityUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.projectNameUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.builderUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            propertyStr,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            propertyStr,
          );
        });
      }
      // else {
      //   this.setState({
      //     categoryGetValueUrlByCity: propertyStr,
      //   });
      //   _getStorageValue(USER_ID).then((userId) => {
      //     this.props.propertyByCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       propertyStr,
      //       function () {}
      //     );
      //     this.props.unitTypeByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       propertyStr,
      //       function () {}
      //     );
      //     this.props.yearByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       propertyStr,
      //       function () {}
      //     );
      //     this.props.monthByStateCityUser(
      //       userId,
      //       case2State,
      //       case2City,
      //       propertyStr
      //     );
      //   });
      // }
    }

    if (case2PropertyId.length !== 0) {
      this.propertCase2type1.current.resetSelectedValues();
      this.setState({
        case2PropertyId: [],
      });
    }

    if (case2UnitType.length !== 0) {
      this.unitTypeCase2Type1.current.resetSelectedValues();
      this.setState({
        case2UnitType: [],
      });
    }

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }
  }

  // case2CategoryRemove(e) {
  //   var categoryId = e;
  //   this.props.resetpropertyByCityUser();
  //   const {
  //     case2State,
  //     case2City,
  //     case2Locality,
  //     case2CategoryId,
  //     case2PropertyId,
  //     case2UnitType,
  //     case2Year,
  //     case2Month,
  //     case2ApprovalName,
  //     case2Project,
  //     case2Builder,
  //   } = this.state;

  //   if (categoryId.length === 2) {
  //     this.setState({
  //       case2CategoryId: "2",
  //     });
  //   } else if (categoryId.length === 0) {
  //     this.setState({
  //       case2CategoryId: "",
  //     });
  //   } else {
  //     for (let list in categoryId) {
  //       if (categoryId[list].name === "INDIVIDUAL") {
  //         this.setState({
  //           case2CategoryId: "1",
  //         });
  //       } else {
  //         this.setState({
  //           case2CategoryId: "2",
  //           minCase2Age: 0,
  //           maxCase2Age: 100,
  //         });
  //       }
  //     }
  //   }

  //   this.restCategroy();

  //   this.setState({
  //     case2CategoryTypeSelected: e,
  //     showAge2: false,
  //     showUnits2: false,
  //     showRate1: false,
  //     showAppRate2: false,
  //     showRate2: false,
  //     projectSetNumber: true,
  //     projectSetRate: true,
  //     individualSetAge: true,
  //     individualSetRate: true,
  //     individualProjSetRate: true,
  //     individualProjSetNumber: true,
  //     individualProjSetAge: true,
  //   });

  //   var propertyArr = [];
  //   for (let listCat in e) {
  //     propertyArr.push(e[listCat].name);
  //   }

  //   if (case2Locality !== "NaN" && case2Locality !== "") {
  //     var zoneLocaPropertyUrl =
  //       propertyArr.toString().replace(/,/g, "%2C") +
  //       "&locality=" +
  //       case2Locality;
  //     if (case2CategoryId === "1") {
  //       this.setState({
  //         categoryGetValueUrlByCity: zoneLocaPropertyUrl,
  //       });

  //       _getStorageValue(USER_ID).then((userId) => {
  //         this.props.propertyByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.unitTypeByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.yearByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.monthByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //       });
  //     } else {
  //       this.setState({
  //         categoryGetValueUrlByCity: zoneLocaPropertyUrl,
  //       });

  //       _getStorageValue(USER_ID).then((userId) => {
  //         this.props.propertyByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.unitTypeByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.approvalByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.projectNameUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.builderUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.yearByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //         this.props.monthByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           zoneLocaPropertyUrl,
  //           function () {}
  //         );
  //       });
  //     }
  //   } else {
  //     if (case2CategoryId === "1") {
  //       this.setState({
  //         categoryGetValueUrlByCity: propertyArr
  //           .toString()
  //           .replace(/,/g, "%2C"),
  //       });
  //       _getStorageValue(USER_ID).then((userId) => {
  //         this.props.propertyByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.unitTypeByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.yearByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.monthByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C")
  //         );
  //       });
  //     } else {
  //       this.setState({
  //         categoryGetValueUrlByCity: propertyArr
  //           .toString()
  //           .replace(/,/g, "%2C"),
  //       });
  //       _getStorageValue(USER_ID).then((userId) => {
  //         this.props.propertyByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.unitTypeByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.approvalByCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.projectNameUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.builderUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.yearByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C"),
  //           function () {}
  //         );
  //         this.props.monthByStateCityUser(
  //           userId,
  //           case2State,
  //           case2City,
  //           propertyArr.toString().replace(/,/g, "%2C")
  //         );
  //       });
  //     }
  //   }

  //   if (case2PropertyId.length !== 0) {
  //     this.propertCase2type1.current.resetSelectedValues();
  //     this.setState({
  //       case2PropertyId: [],
  //     });
  //   }

  //   if (case2UnitType.length !== 0) {
  //     this.unitTypeCase2Type1.current.resetSelectedValues();
  //     this.setState({
  //       case2UnitType: [],
  //     });
  //   }

  //   if (case2Year.length !== 0) {
  //     this.yearCae2Type1.current.resetSelectedValues();
  //     this.setState({
  //       case2Year: [],
  //     });
  //   }

  //   if (case2Month.length !== 0) {
  //     this.monthCase2Type1.current.resetSelectedValues();
  //     this.setState({
  //       case2Month: [],
  //     });
  //   }

  //   if (case2ApprovalName.length !== 0) {
  //     this.approvalCase2.current.resetSelectedValues();
  //     this.setState({
  //       case2ApprovalName: [],
  //     });
  //   }

  //   if (case2Project.length !== 0) {
  //     this.projectCase2.current.resetSelectedValues();
  //     this.setState({
  //       case2Project: [],
  //     });
  //   }

  //   if (case2Builder.length !== 0) {
  //     this.builderCas2.current.resetSelectedValues();
  //     this.setState({
  //       case2Builder: [],
  //     });
  //   }
  // }

  case2PropertySelect(e) {
    this.props.resetunitTypeByStateCityUser();
    this.setState({
      case2PropertyId: e,
    });

    const { categoryGetValueUrlByCity } = this.state;
    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2UnitType,
      case2Year,
      case2Month,
      case2CategoryId,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;
    if (case2UnitType.length !== 0) {
      this.unitTypeCase2Type1.current.resetSelectedValues();
      this.setState({
        case2UnitType: [],
      });
    }

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (categoryGetValueUrlByCity !== "") {
      if (case2CategoryId === "1") {
        var unitTypeArr = [];
        for (let listCat in e) {
          unitTypeArr.push(e[listCat].name);
        }

        var unitType =
          categoryGetValueUrlByCity +
          "&property_type=" +
          unitTypeArr.toString().replace(/,/g, "%2C");

        this.setState({
          unitTypeGetValueByCity: unitType,
        });

        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
        });
      } else {
        var unitTypeArr = [];
        for (let listCat in e) {
          unitTypeArr.push(e[listCat].name);
        }

        var unitType =
          categoryGetValueUrlByCity +
          "&property_type=" +
          unitTypeArr.toString().replace(/,/g, "%2C");

        this.setState({
          unitTypeGetValueByCity: unitType,
        });

        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.approvalByCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.projectNameUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.builderUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
        });
      }
    }
  }

  case2PropertyRemove(e) {
    this.props.resetunitTypeByStateCityUser();
    this.setState({
      case2PropertyId: e,
    });
    const {
      categoryGetValueUrlByCity,
      case2UnitType,
      case2Year,
      case2State,
      case2City,
      case2Month,
      case2CategoryId,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2UnitType.length !== 0) {
      this.unitTypeCase2Type1.current.resetSelectedValues();
      this.setState({
        case2UnitType: [],
      });
    }

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (categoryGetValueUrlByCity !== "") {
      if (case2CategoryId === "1") {
        var unitTypeArr = [];
        for (let listCat in e) {
          unitTypeArr.push(e[listCat].name);
        }

        var unitType =
          categoryGetValueUrlByCity +
          "&property_type=" +
          unitTypeArr.toString().replace(/,/g, "%2C");

        this.setState({
          unitTypeGetValueByCity: unitType,
        });

        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
        });
      } else {
        var unitTypeArr = [];
        for (let listCat in e) {
          unitTypeArr.push(e[listCat].name);
        }

        var unitType =
          categoryGetValueUrlByCity +
          "&property_type=" +
          unitTypeArr.toString().replace(/,/g, "%2C");

        this.setState({
          unitTypeGetValueByCity: unitType,
        });

        _getStorageValue(USER_ID).then((userId) => {
          this.props.unitTypeByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.approvalByCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.projectNameUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.builderUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.yearByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            unitType,
            function () {},
          );
        });
      }
    }
  }

  case2UnitTypeSelect(e) {
    this.props.resetyearByStateCityUser();
    this.setState({
      case2UnitType: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      case2CategoryTypeSelected,
      unitTypeGetValueByCity,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (case2CategoryId === "1") {
      var valueArr = [];
      for (let listCat in e) {
        valueArr.push(e[listCat].name);
      }
      if (unitTypeGetValueByCity !== "") {
        var valueType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      } else {
        // if (case2CategoryTypeSelected.length > 0) {
        //   var cateArr = [];
        //   for (let list in case2CategoryTypeSelected) {
        //     cateArr.push(case2CategoryTypeSelected[list].name.toString());
        //   }
        //   var cateStr = "";
        //   var cateStr = cateArr.toString();
        //   var urlCategory = cateStr.replace(/,/g, "%2C");
        // }
        var valueType =
          case2CategoryTypeSelected +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      }

      _getStorageValue(USER_ID).then((userId) => {
        this.props.yearByStateCityUser(
          userId,
          case2State,
          case2City,
          valueType,
          successCallBackYear,
        );
      });

      this.setState({
        unitTypeGetValueByCity: valueType,
      });

      const successCallBackYear = () => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            valueType,
            function () {},
          );
        });
      };
    } else {
      var getApproveType = "";
      var getApproveArr = [];
      for (let listCat in e) {
        getApproveArr.push(e[listCat].name);
      }
      if (unitTypeGetValueByCity !== "") {
        getApproveType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          getApproveArr.toString().replace(/,/g, "%2C");
      } else {
        if (case2CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case2CategoryTypeSelected) {
          //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          getApproveType =
            case2CategoryTypeSelected +
            "&unit_type=" +
            getApproveArr.toString().replace(/,/g, "%2C");
        }
      }

      _getStorageValue(USER_ID).then((userId) => {
        this.props.approvalByCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.projectNameUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.builderUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.yearByStateCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.monthByStateCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
      });
    }
  }

  case2UnitTypeRemove(e) {
    this.props.resetyearByStateCityUser();
    this.setState({
      case2UnitType: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      unitTypeGetValueByCity,
      case2CategoryTypeSelected,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (case2CategoryId === "1") {
      var valueArr = [];
      for (let listCat in e) {
        valueArr.push(e[listCat].name);
      }
      if (unitTypeGetValueByCity !== "") {
        var valueType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      } else {
        // if (case2CategoryTypeSelected.length > 0) {
        //   var cateArr = [];
        //   for (let list in case2CategoryTypeSelected) {
        //     cateArr.push(case2CategoryTypeSelected[list].name.toString());
        //   }
        //   var cateStr = "";
        //   var cateStr = cateArr.toString();
        //   var urlCategory = cateStr.replace(/,/g, "%2C");
        // }
        var valueType =
          case2CategoryTypeSelected +
          "&unit_type=" +
          valueArr.toString().replace(/,/g, "%2C");
      }

      _getStorageValue(USER_ID).then((userId) => {
        this.props.yearByStateCityUser(
          userId,
          case2State,
          case2City,
          valueType,
          successCallBackYear,
        );
      });

      this.setState({
        unitTypeGetValueByCity: valueType,
      });

      const successCallBackYear = () => {
        _getStorageValue(USER_ID).then((userId) => {
          this.props.monthByStateCityUser(
            userId,
            case2State,
            case2City,
            valueType,
            function () {},
          );
        });
      };
    } else {
      var getApproveArr = [];
      var getApproveType = "";
      for (let listCat in e) {
        getApproveArr.push(e[listCat].name);
      }
      if (unitTypeGetValueByCity !== "") {
        getApproveType =
          unitTypeGetValueByCity +
          "&unit_type=" +
          getApproveArr.toString().replace(/,/g, "%2C");
      } else {
        if (case2CategoryTypeSelected.length > 0) {
          // var cateArr = [];
          // for (let list in case2CategoryTypeSelected) {
          //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
          // }
          // var cateStr = "";
          // var cateStr = cateArr.toString();
          // var urlCategory = cateStr.replace(/,/g, "%2C");
          getApproveType =
            case2CategoryTypeSelected +
            "&unit_type=" +
            getApproveArr.toString().replace(/,/g, "%2C");
        }
      }

      _getStorageValue(USER_ID).then((userId) => {
        this.props.approvalByCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.projectNameUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.builderUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.yearByStateCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
        this.props.monthByStateCityUser(
          userId,
          case2State,
          case2City,
          getApproveType,
          function () {},
        );
      });
    }
  }

  case2ApprovalSelect(e) {
    this.setState({
      case2ApprovalName: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      case2CategoryTypeSelected,
      unitTypeGetValueByCity,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }
    var approvalType = "";
    var getProjectArr = [];
    for (let listCat in e) {
      getProjectArr.push(e[listCat].name);
    }
    if (unitTypeGetValueByCity !== "") {
      approvalType =
        unitTypeGetValueByCity +
        "&approval_number=" +
        getProjectArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        approvalType =
          case2CategoryTypeSelected +
          "&approval_number=" +
          getProjectArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: approvalType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.projectNameUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.builderUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
    });
  }

  case2ApprovalRemove(e) {
    this.setState({
      case2ApprovalName: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      unitTypeGetValueByCity,
      case2CategoryTypeSelected,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }
    var approvalType = "";
    var getProjectArr = [];
    for (let listCat in e) {
      getProjectArr.push(e[listCat].name);
    }

    if (unitTypeGetValueByCity !== "") {
      approvalType =
        unitTypeGetValueByCity +
        "&approval_number=" +
        getProjectArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        approvalType =
          case2CategoryTypeSelected +
          "&approval_number=" +
          getProjectArr.toString().replace(/,/g, "%2C");
      }
    }

    this.setState({
      unitTypeGetValueByCity: approvalType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.projectNameUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.builderUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        approvalType,
        function () {},
      );
    });
  }

  case2ProjectSelect(e) {
    this.setState({
      case2Project: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      unitTypeGetValueByCity,
      categoryGetValueUrlByCity,
      case2CategoryTypeSelected,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }
    var projectType = "";
    var getBuliderArr = [];
    for (let listCat in e) {
      getBuliderArr.push(e[listCat].name);
    }
    if (unitTypeGetValueByCity !== "") {
      projectType =
        unitTypeGetValueByCity +
        "&project_name=" +
        getBuliderArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        projectType =
          case2CategoryTypeSelected +
          "&project_name=" +
          getBuliderArr.toString().replace(/,/g, "%2C");
      }
    }
    this.setState({
      unitTypeGetValueByCity: projectType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.builderUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
    });
  }

  case2ProjectRemove(e) {
    this.setState({
      case2Project: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      unitTypeGetValueByCity,
      case2CategoryTypeSelected,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }
    var projectType = "";
    var getBuliderArr = [];
    for (let listCat in e) {
      getBuliderArr.push(e[listCat].name);
    }
    if (unitTypeGetValueByCity !== "") {
      projectType =
        unitTypeGetValueByCity +
        "&project_name=" +
        getBuliderArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        projectType =
          case2CategoryTypeSelected +
          "&project_name=" +
          getBuliderArr.toString().replace(/,/g, "%2C");
      }
    }
    this.setState({
      unitTypeGetValueByCity: projectType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.builderUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        projectType,
        function () {},
      );
    });
  }

  case2BuilderSelect(e) {
    this.setState({
      case2Builder: e,
    });

    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      case2CategoryTypeSelected,
      unitTypeGetValueByCity,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }
    var builderType = "";
    var getYearMonthArr = [];
    for (let listCat in e) {
      getYearMonthArr.push(e[listCat].name);
    }
    if (unitTypeGetValueByCity !== "") {
      builderType =
        unitTypeGetValueByCity +
        "&buildergroup_name=" +
        getYearMonthArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        builderType =
          case2CategoryTypeSelected +
          "&buildergroup_name=" +
          getYearMonthArr.toString().replace(/,/g, "%2C");
      }
    }
    this.setState({
      unitTypeGetValueByCity: builderType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        builderType,
        successCallBackYear,
      );
    });

    const successCallBackYear = () => {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.monthByStateCityUser(
          userId,
          case2State,
          case2City,
          builderType,
          function () {},
        );
      });
    };
  }

  case2BuilderRemove(e) {
    this.setState({
      case2Builder: e,
    });
    const {
      case2State,
      case2City,
      case2Zone,
      case2Locality,
      case2CategoryId,
      unitTypeGetValueByCity,
      case2CategoryTypeSelected,
      categoryGetValueUrlByCity,
      case2Year,
      case2Month,
      case2ApprovalName,
      case2Project,
      case2Builder,
    } = this.state;

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    var builderType = "";
    var getYearMonthArr = [];
    for (let listCat in e) {
      getYearMonthArr.push(e[listCat].name);
    }
    if (unitTypeGetValueByCity !== "") {
      builderType =
        unitTypeGetValueByCity +
        "&buildergroup_name=" +
        getYearMonthArr.toString().replace(/,/g, "%2C");
    } else {
      if (case2CategoryTypeSelected.length > 0) {
        // var cateArr = [];
        // for (let list in case2CategoryTypeSelected) {
        //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
        // }
        // var cateStr = "";
        // var cateStr = cateArr.toString();
        // var urlCategory = cateStr.replace(/,/g, "%2C");
        builderType =
          case2CategoryTypeSelected +
          "&buildergroup_name=" +
          getYearMonthArr.toString().replace(/,/g, "%2C");
      }
    }
    this.setState({
      unitTypeGetValueByCity: builderType,
    });

    _getStorageValue(USER_ID).then((userId) => {
      this.props.yearByStateCityUser(
        userId,
        case2State,
        case2City,
        builderType,
        successCallBackYear,
      );
    });

    const successCallBackYear = () => {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.monthByStateCityUser(
          userId,
          case2State,
          case2City,
          builderType,
          function () {},
        );
      });
    };
  }

  case2YearSelect(e) {
    this.setState({
      case2Year: e,
    });
    const {
      case2State,
      case2City,
      case2Zone,
      case2Month,
      case2Year,
      case2CategoryTypeSelected,
      case2PropertyId,
      case2UnitType,
      case2ApprovalName,
      case2Builder,
      case2Project,
      minCase2,
      maxCase2,
      minCase2Age,
      maxCase2Age,
      minCase2Percent,
      maxCase2Percent,
      minCase2Unit,
      maxCase2Unit,
      gridShowHide,
      case2Locality,
      showUnits2,
      showAge2,
      showRate2,
      showAppRate2,
      minLandRate2,
      maxLandRate2,
      minSellableRate2,
      maxSellableRate2,
      minAppRate2,
      maxAppRate2,
    } = this.state;

    var postDataType = {
      state: case2State,
      city: case2City,
    };

    var propertyUrls = ``;

    //Category type selected
    if (case2CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case2CategoryTypeSelected) {
      //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      // var urlCategory = cateStr.replace(/,/g, "%2C");

      propertyUrls += case2CategoryTypeSelected;

      postDataType = Object.assign(
        { categoryTypeId: case2CategoryTypeSelected },
        postDataType,
      );
    }

    //Property type if selected
    if (case2PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case2PropertyId) {
        propertyArr.push(case2PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();

      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");

      propertyUrls += urlProperty;

      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if selected
    if (case2UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case2UnitType) {
        unitArr.push(case2UnitType[list].name.toString());
      }

      var unitStr = "";
      var unitStr = unitArr.toString();

      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }

    //year if selected
    if (case2Year.length !== 0) {
      var yearArr = [];
      for (let list in case2Year) {
        yearArr.push(case2Year[list].name.toString());
      }

      var yearStr = "";
      var yearStr = yearArr.toString();

      var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

      propertyUrls += urlYear;

      postDataType = Object.assign({ year: urlYear }, postDataType);
    }
    //builder group name if specified
    if (case2Builder.length !== 0) {
      var builderArr = [];
      for (let list in case2Builder) {
        builderArr.push(case2Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name if specified
    if (case2Project.length !== 0) {
      var projectArr = [];
      for (let list in case2Project) {
        projectArr.push(case2Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number if specified
    if (case2ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case2ApprovalName) {
        approvalArr.push(case2ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;

      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }

    //Zone and Locality if selected
    if (case2Locality !== "NaN") {
      propertyUrls += "&pincode=" + case2Locality;

      postDataType = Object.assign(
        { case2Locality: "&pincode=" + case2Locality },
        postDataType,
      );
    }
    // else if (case2Zone !== "NaN") {
    //   propertyUrls += "&zone=" + case2Zone;

    //   postDataType = Object.assign(
    //     { case2Zone: "&zone=" + case2Zone },
    //     postDataType
    //   );
    // }
    //year if selected

    var yearArr = [];
    for (let list in e) {
      yearArr.push(e[list].name.toString());
    }

    var yearStr = "";
    var yearStr = yearArr.toString();

    var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

    propertyUrls += urlYear;

    postDataType = Object.assign({ year: urlYear }, postDataType);

    _getStorageValue(USER_ID).then((userId) => {
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        propertyUrls,
      );
    });
  }

  case2YearRemove(e) {
    this.setState({
      case2Year: e,
    });
    const {
      case2State,
      case2City,
      case2Zone,
      case2Month,
      case2Year,
      case2CategoryTypeSelected,
      case2PropertyId,
      case2UnitType,
      case2ApprovalName,
      case2Builder,
      case2Project,
      minCase2,
      maxCase2,
      minCase2Age,
      maxCase2Age,
      minCase2Percent,
      maxCase2Percent,
      minCase2Unit,
      maxCase2Unit,
      gridShowHide,
      case2Locality,
      showUnits2,
      showAge2,
      showRate2,
      showAppRate2,
      minLandRate2,
      maxLandRate2,
      minSellableRate2,
      maxSellableRate2,
      minAppRate2,
      maxAppRate2,
    } = this.state;

    var postDataType = {
      state: case2State,
      city: case2City,
    };

    var propertyUrls = ``;

    //Category type selected
    if (case2CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case2CategoryTypeSelected) {
      //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      // var urlCategory = cateStr.replace(/,/g, "%2C");

      propertyUrls += case2CategoryTypeSelected;

      postDataType = Object.assign(
        { categoryTypeId: case2CategoryTypeSelected },
        postDataType,
      );
    }

    //Property type if selected
    if (case2PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case2PropertyId) {
        propertyArr.push(case2PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();

      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");

      propertyUrls += urlProperty;

      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if selected
    if (case2UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case2UnitType) {
        unitArr.push(case2UnitType[list].name.toString());
      }

      var unitStr = "";
      var unitStr = unitArr.toString();

      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }

    //year if selected
    if (case2Year.length !== 0) {
      var yearArr = [];
      for (let list in case2Year) {
        yearArr.push(case2Year[list].name.toString());
      }

      var yearStr = "";
      var yearStr = yearArr.toString();

      var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

      propertyUrls += urlYear;

      postDataType = Object.assign({ year: urlYear }, postDataType);
    }
    //builder group name if specified
    if (case2Builder.length !== 0) {
      var builderArr = [];
      for (let list in case2Builder) {
        builderArr.push(case2Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name if specified
    if (case2Project.length !== 0) {
      var projectArr = [];
      for (let list in case2Project) {
        projectArr.push(case2Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number if specified
    if (case2ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case2ApprovalName) {
        approvalArr.push(case2ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;

      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }

    //Zone and Locality if selected
    if (case2Locality !== "NaN") {
      propertyUrls += "&locality=" + case2Locality;

      postDataType = Object.assign(
        { case2Locality: "&locality=" + case2Locality },
        postDataType,
      );
    }
    // else if (case2Zone !== "NaN") {
    //   propertyUrls += "&zone=" + case2Zone;

    //   postDataType = Object.assign(
    //     { case2Zone: "&zone=" + case2Zone },
    //     postDataType
    //   );
    // }
    //year if selected

    var yearArr = [];
    for (let list in e) {
      yearArr.push(e[list].name.toString());
    }

    var yearStr = "";
    var yearStr = yearArr.toString();

    var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

    propertyUrls += urlYear;

    postDataType = Object.assign({ year: urlYear }, postDataType);

    _getStorageValue(USER_ID).then((userId) => {
      this.props.monthByStateCityUser(
        userId,
        case2State,
        case2City,
        propertyUrls,
      );
    });
  }

  case2MonthSelect(e) {
    this.setState({
      case2Month: e,
    });
  }

  case2MonthRemove(e) {
    this.setState({
      case2Month: e,
    });
  }

  onSearchStateSelected(e) {
    if (e[0].key === "city") {
      var sliptStateCity = e[0].name.split(",");
      var sliptStateId = e[0].id.split(",");

      this.setState({
        searchStateid: parseInt(sliptStateId[1]),
        searchStatename: sliptStateCity[1],
        searchCityname: sliptStateCity[0],
        searchCityid: parseInt(sliptStateId[0]),
        case2State: parseInt(sliptStateId[1]),
        case2City: parseInt(sliptStateId[0]),
      });

      _getStorageValue(USER_ID).then((userId) => {
        this.props.categoryTypeStateCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.projectNameUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.builderUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.approvalByCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.propertyByCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.unitTypeByStateCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.yearByStateCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
        this.props.monthByStateCityUser(
          userId,
          parseInt(sliptStateId[1]),
          parseInt(sliptStateId[0]),
        );
      });
    } else {
      this.setState({
        searchStateid: e[0].id,
        searchStatename: e[0].name,
        case2State: e[0].id,
      });
      _getStorageValue(USER_ID).then((userId) => {
        const cityUrl = `${userId}/state/${e[0].id}/city`;
        this.props.cityUser(cityUrl);
      });
    }
  }

  onSearchStateRemoved(e) {
    this.setState({
      searchStateid: "",
      searchStatename: "",
      searchCityname: "",
      searchCityid: "",
      case2State: "",
      case2City: "",
    });
  }

  validationCase2() {
    this.props.case2LocalCallBack();
    const { case2State, case2City, case2CategoryTypeSelected } = this.state;

    var stateValid = case2State !== "";
    var cityValid = case2City !== "";
    var case2CateValid = case2CategoryTypeSelected.length > 0;

    var validCase2 = stateValid && cityValid && case2CateValid;

    if (!validCase2) {
      toast.warning("Please Select the Values", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.props.case2LocalCloaseCallBack();
    } else {
      this.showCase2();
    }
  }

  showCase2() {
    //state declaration
    const {
      case2State,
      case2City,
      case2Zone,
      case2Month,
      case2Year,
      case2CategoryTypeSelected,
      case2PropertyId,
      case2UnitType,
      case2ApprovalName,
      case2Builder,
      case2Project,
      minCase2,
      maxCase2,
      minCase2Age,
      maxCase2Age,
      minCase2Percent,
      maxCase2Percent,
      minCase2Unit,
      maxCase2Unit,
      gridShowHide,
      case2Locality,
      showUnits2,
      showAge2,
      showRate2,
      showAppRate2,
      minLandRate2,
      maxLandRate2,
      minSellableRate2,
      maxSellableRate2,
      minAppRate2,
      maxAppRate2,
    } = this.state;

    const { cityNameData } = this.props;

    var selectObject = cityNameData.find(
      (obj) => obj.id === parseInt(case2City),
    );
    var postDataType = {
      state: case2State,
      city: case2City,
    };

    var propertyUrls = ``;

    //Category type selected
    if (case2CategoryTypeSelected.length > 0) {
      // var cateArr = [];
      // for (let list in case2CategoryTypeSelected) {
      //   cateArr.push(case2CategoryTypeSelected[list].name.toString());
      // }
      // var cateStr = "";
      // var cateStr = cateArr.toString();

      var urlCategory = `?category_type=` + case2CategoryTypeSelected;

      propertyUrls += urlCategory;

      postDataType = Object.assign(
        { categoryTypeId: urlCategory },
        postDataType,
      );
    }

    //Property type if selected
    if (case2PropertyId.length !== 0) {
      var propertyArr = [];
      for (let list in case2PropertyId) {
        propertyArr.push(case2PropertyId[list].name.toString());
      }
      var propertyStr = "";
      var propertyStr = propertyArr.toString();

      var urlProperty = `&property_type=` + propertyStr.replace(/,/g, "%2C");

      propertyUrls += urlProperty;

      postDataType = Object.assign({ propertyId: urlProperty }, postDataType);
    }

    //unit type if selected
    if (case2UnitType.length !== 0) {
      var unitArr = [];
      for (let list in case2UnitType) {
        unitArr.push(case2UnitType[list].name.toString());
      }

      var unitStr = "";
      var unitStr = unitArr.toString();

      var urlUnit = `&unit_type=` + unitStr.replace(/,/g, "%2C");

      propertyUrls += urlUnit;

      postDataType = Object.assign({ unitName: urlUnit }, postDataType);
    }

    //year if selected
    if (case2Year.length !== 0) {
      var yearArr = [];
      for (let list in case2Year) {
        yearArr.push(case2Year[list].name.toString());
      }

      var yearStr = "";
      var yearStr = yearArr.toString();

      var urlYear = `&year=` + yearStr.replace(/,/g, "%2C");

      propertyUrls += urlYear;

      postDataType = Object.assign({ year: urlYear }, postDataType);
    }

    //month if selected
    if (case2Month.length !== 0) {
      var monthArr = [];
      for (let list in case2Month) {
        monthArr.push(case2Month[list].name);
      }
      var monthStr = monthArr.toString();
      var urlMonth = `&month=` + monthStr.replace(/,/g, "%2C");
      propertyUrls += urlMonth;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign({ month: urlMonth }, postDataType);
    }

    //setting completed %, age, number of units and rates
    // var minMaxCompletedUrl = `&completed=${minCase2Percent}%2C${maxCase2Percent}`;
    // propertyUrls += minMaxCompletedUrl;
    // postDataType = Object.assign({ dataSelected: true }, postDataType);
    // postDataType = Object.assign(
    //   { minMaxCompletedPercUrl: minMaxCompletedUrl },
    //   postDataType
    // );

    if (showAge2) {
      var minMaxAgeIndivalUrl = `&age=${minCase2Age}%2C${maxCase2Age}`;
      propertyUrls += minMaxAgeIndivalUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxAgeUrl: minMaxAgeIndivalUrl },
        postDataType,
      );
    }
    if (showUnits2) {
      var minMaxUrl = `&number_of_units=${minCase2Unit}%2C${maxCase2Unit}`;
      propertyUrls += minMaxUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign({ minMaxLimtUrl: minMaxUrl }, postDataType);
    }
    if (showRate2) {
      var minMaxLandAndSellableUrl = `&landarea_rate=${minLandRate2}%2C${maxLandRate2}&sellable_rate=${minSellableRate2}%2C${maxSellableRate2}`;
      propertyUrls += minMaxLandAndSellableUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxLandSellableUrl: minMaxLandAndSellableUrl },
        postDataType,
      );
    }
    if (showAppRate2) {
      var minMaxAppRateUrl = `&appraised_rate=${minAppRate2}%2C${maxAppRate2}`;
      propertyUrls += minMaxAppRateUrl;
      postDataType = Object.assign({ dataSelected: true }, postDataType);
      postDataType = Object.assign(
        { minMaxAppUrl: minMaxAppRateUrl },
        postDataType,
      );
    }

    //builder group name if specified
    if (case2Builder.length !== 0) {
      var builderArr = [];
      for (let list in case2Builder) {
        builderArr.push(case2Builder[list].name.toString());
      }
      var builderStr = "";
      var builderStr = builderArr.toString();

      var urlBuilder = `&buildergroup_name=` + builderStr.replace(/,/g, "%2C");

      propertyUrls += urlBuilder;

      postDataType = Object.assign({ builderGroup: urlBuilder }, postDataType);
    }

    //project name if specified
    if (case2Project.length !== 0) {
      var projectArr = [];
      for (let list in case2Project) {
        projectArr.push(case2Project[list].name.toString());
      }
      var projectStr = "";
      var projectStr = projectArr.toString();

      var urlProjectName = `&project_name=` + projectStr.replace(/,/g, "%2C");

      propertyUrls += urlProjectName;

      postDataType = Object.assign(
        { projectName: urlProjectName },
        postDataType,
      );
    }

    //approval number if specified
    if (case2ApprovalName.length !== 0) {
      var approvalArr = [];
      for (let list in case2ApprovalName) {
        approvalArr.push(case2ApprovalName[list].name.toString());
      }
      var approvalStr = "";
      var approvalStr = approvalArr.toString();

      var urlAproval = `&approval_number=` + approvalStr.replace(/,/g, "%2C");

      propertyUrls += urlAproval;

      postDataType = Object.assign(
        { approvalNumber: urlAproval },
        postDataType,
      );
    }

    //Zone and Locality if selected
    if (case2Locality !== "NaN") {
      propertyUrls += "&pincode=" + case2Locality;

      postDataType = Object.assign(
        { case2Locality: "&pincode=" + case2Locality },
        postDataType,
      );
    }
    // else if (case2Zone !== "NaN") {
    //   propertyUrls += "&zone=" + case2Zone;

    //   postDataType = Object.assign(
    //     { case2Zone: "&zone=" + case2Zone },
    //     postDataType
    //   );
    // }

    // Grid layer if selected
    if (gridShowHide) {
      this.props.showHideGrid(false);
    } else {
      this.props.showHideGrid(true);
    }

    this.props.zoomDragCrentential(postDataType);

    _getStorageValue(USER_ID).then((userId) => {
      this.props.getStateByRegionUser(
        userId,
        case2State,
        case2City,
        propertyUrls,
        succesCallBackRegion,
        failurCallBackRegion,
      );
    });

    const succesCallBackRegion = (response) => {
      var centerData = response.data.centroid;
      var centroid = {
        lat: centerData.latitude,
        lng: centerData.longitude,
        zoom: 13,
      };
      this.props.centerMapByData(centroid);
      this.props.case2LocalCloaseCallBack();
    };

    const failurCallBackRegion = () => {
      this.props.case2LocalCloaseCallBack();
    };
  }

  showCase4() {
    this.props.case2LocalCallBack();
    const { CategoryREQ, REQId } = this.state;

    var category_REQ = CategoryREQ !== "";
    var REQ_Id = REQId !== "";

    var validCase = category_REQ && REQ_Id;

    if (!validCase) {
      toast.warning("Please fill all the fields", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.getByReq(
          userId,
          CategoryREQ,
          REQId,
          onSuccessCallBackRegion,
          onFailureCallBackRegion,
        );
      });
    }

    const onSuccessCallBackRegion = (data) => {
      console.log("Valid cendroid", data);
      var centerData = data.data.entries[0];
      var centroid = {
        lat: centerData.latitude,
        lng: centerData.longitude,
        zoom: 15,
      };
      this.props.centerMapByData(centroid);
      this.props.case2LocalCloaseCallBack();
    };

    const onFailureCallBackRegion = (data) => {
      console.log("errormessage", data);
      toast.warning(data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      this.props.case2LocalCloaseCallBack();
    };
  }

  getBoundsFromLatLng(lat, lng, radiusInKm) {
    var lat_change = radiusInKm / 111.2;
    var lon_change = Math.abs(Math.cos(lat * (Math.PI / 180)));
    var bounds = {
      lat_min: lat - lat_change,
      lon_min: lng - lon_change,
      lat_max: lat + lat_change,
      lon_max: lng + lon_change,
    };
    return bounds;
  }

  branchOff() {
    const { branchBank } = this.state;

    this.setState({
      branchBank: !branchBank,
    });

    this.props.branchStatusCallBack();
    setTimeout(() => {
      this.getCase3OnOF();
    }, 200);
  }

  agencyOff() {
    const { agencyLocation } = this.state;

    this.setState({
      agencyLocation: !agencyLocation,
    });

    this.props.angencyStatusCallBack();

    setTimeout(() => {
      this.getCase3OnOF();
    }, 200);
  }

  getCase3OnOF() {
    const { branchBank, agencyLocation } = this.state;

    const { branchDataUrlState } = this.props;

    var userId = getUserId();

    if (branchBank === false && agencyLocation === true) {
      // _getStorageValue(USER_ID).then((userId) => {
      this.props.agencyUser(userId, "1", "0", branchDataUrlState);
      // });
    } else if (branchBank === true && agencyLocation === true) {
      // _getStorageValue(USER_ID).then((userId) => {
      // this.props.agencyUser(userId, "0", "0", branchDataUrlState);
      this.props.resetagencyUser();
      // });
    } else if (branchBank === true && agencyLocation === false) {
      // _getStorageValue(USER_ID).then((userId) => {
      this.props.agencyUser(userId, "0", "1", branchDataUrlState);
      // });
    } else if (branchBank === false && agencyLocation === false) {
      // _getStorageValue(USER_ID).then((userId) => {
      this.props.agencyUser(userId, "1", "1", branchDataUrlState);
      // });
    }
  }

  restCategroy() {
    this.setState({
      case1ApprovalName: [],
      case1Year: [],
      case1Month: [],
      min: 0,
      max: 100000,
      minLandRate1: 0,
      maxLandRate1: 100000,
      minSellableRate1: 0,
      maxSellableRate1: 100000,
      minLandRate2: 0,
      maxLandRate2: 100000,
      minSellableRate2: 0,
      maxSellableRate2: 100000,
      minAppRate1: 0,
      maxAppRate1: 100000,
      minAppRate2: 0,
      maxAppRate2: 100000,
      minBoundLand1: 0,
      maxBoundLand1: 100000,
      minBoundSellable1: 0,
      maxBoundSellable1: 100000,
      minBoundApp1: 0,
      maxBoundApp1: 100000,
      minBoundLand2: 0,
      maxBoundLand2: 100000,
      minBoundSellable2: 0,
      maxBoundSellable2: 100000,
      minBoundApp2: 0,
      maxBoundApp2: 100000,
      minBound: 0,
      maxBound: 100000,
      minCase2: 0,
      maxCase2: 100000,
      minBoundCase2: 0,
      maxBoundCase2: 100000,
      minCase1Age: 0,
      maxCase1Age: 100,
      minBoundCase1Age: 0,
      maxBoundCase1Age: 100,
      minCase2Age: 0,
      maxCase2Age: 100,
      minBoundCase2Age: 0,
      maxBoundCase2Age: 100,
      minCase1Percent: 0,
      maxCase1Percent: 100,
      minBoundCase1Percent: 0,
      maxBoundCase1Percent: 100,
      minCase2Percent: 0,
      maxCase2Percent: 100,
      minBoundCase2Percent: 0,
      maxBoundCase2Percent: 100,
      minCase1Unit: 0,
      maxCase1Unit: 5000,
      minBoundCase1Unit: 0,
      maxBoundCase1Unit: 5000,
      minCase2Unit: 0,
      maxCase2Unit: 5000,
      minBoundCase2Unit: 0,
      maxBoundCase2Unit: 5000,
      categoryGetValueUrlByCity: "",
      categoryGetValueUrlByLatLong: "",
      unitTypeGetValueByCity: "",
      unitTypeGetValueByCLatLong: "",
    });

    const {
      case1PropertyId,
      case2PropertyId,
      case1UnitType,
      case2UnitType,
      case1ApprovalName,
      case1Builder,
      case1Project,
      case1Month,
      case1Year,
      case2Project,
      case2ApprovalName,
      case2Builder,
      case2Year,
      case2Month,
    } = this.state;

    if (case1ApprovalName.length !== 0) {
      this.approvalCase1.current.resetSelectedValues();
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      this.projectCase1.current.resetSelectedValues();
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      this.builderCas1.current.resetSelectedValues();
      this.setState({
        case1Builder: [],
      });
    }

    if (case1PropertyId.length !== 0) {
      this.propertCase1type1.current.resetSelectedValues();
      this.setState({
        case1PropertyId: [],
      });
    }

    if (case1UnitType.length !== 0) {
      this.unitTypeCase1Type1.current.resetSelectedValues();
      this.setState({
        case1UnitType: [],
      });
    }

    if (case1Year.length !== 0) {
      !!this.yearCae1Type1.current &&
        this.yearCae1Type1.current.resetSelectedValues();
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      !!this.monthCase1Type1.current &&
        this.monthCase1Type1.current.resetSelectedValues();
      this.setState({
        case1Month: [],
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (case2PropertyId.length !== 0) {
      this.propertCase2type1.current.resetSelectedValues();
      this.setState({
        case2PropertyId: [],
      });
    }

    if (case2UnitType.length !== 0) {
      this.unitTypeCase2Type1.current.resetSelectedValues();
      this.setState({
        case2UnitType: [],
      });
    }

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }
  }

  resetValue() {
    this.resetMap();
    this.setState({
      CategoryREQ: "",
      REQId: "",
      latitude: "",
      longitude: "",
      radius: 0,
      case2State: "",
      case1CategoryId: "",
      case2CategoryId: "",
      case1ApprovalName: [],
      case1Year: [],
      case1Month: [],
      case2City: "",
      case2Zone: "NaN",
      case2Locality: "NaN",
      min: 0,
      max: 100000,
      minLandRate1: 0,
      maxLandRate1: 100000,
      minSellableRate1: 0,
      maxSellableRate1: 100000,
      minLandRate2: 0,
      maxLandRate2: 100000,
      minSellableRate2: 0,
      maxSellableRate2: 100000,
      minAppRate1: 0,
      maxAppRate1: 100000,
      minAppRate2: 0,
      maxAppRate2: 100000,
      minBoundLand1: 0,
      maxBoundLand1: 100000,
      minBoundSellable1: 0,
      maxBoundSellable1: 100000,
      minBoundApp1: 0,
      maxBoundApp1: 100000,
      minBoundLand2: 0,
      maxBoundLand2: 100000,
      minBoundSellable2: 0,
      maxBoundSellable2: 100000,
      minBoundApp2: 0,
      maxBoundApp2: 100000,
      minBound: 0,
      maxBound: 100000,
      minCase2: 0,
      maxCase2: 100000,
      minBoundCase2: 0,
      maxBoundCase2: 100000,
      minCase1Age: 0,
      maxCase1Age: 100,
      minBoundCase1Age: 0,
      maxBoundCase1Age: 100,
      minCase2Age: 0,
      maxCase2Age: 100,
      minBoundCase2Age: 0,
      maxBoundCase2Age: 100,
      minCase1Percent: 0,
      maxCase1Percent: 100,
      minBoundCase1Percent: 0,
      maxBoundCase1Percent: 100,
      minCase2Percent: 0,
      maxCase2Percent: 100,
      minBoundCase2Percent: 0,
      maxBoundCase2Percent: 100,
      minCase1Unit: 0,
      maxCase1Unit: 5000,
      minBoundCase1Unit: 0,
      maxBoundCase1Unit: 5000,
      minCase2Unit: 0,
      maxCase2Unit: 5000,
      minBoundCase2Unit: 0,
      maxBoundCase2Unit: 5000,
      showAge1: false,
      showRate1: false,
      showAge2: false,
      showRate2: false,
      showAppRate1: false,
      showAppRate2: false,
      showUnits1: false,
      showUnits2: false,
      urlString: "",
      payloadData: {},
      userId: "",
      updateFilter: false,
    });

    const {
      case2CategoryTypeSelected,
      case1CategoryTypeSelected,
      case1PropertyId,
      case2PropertyId,
      case1UnitType,
      case2UnitType,
      case1ApprovalName,
      case1Builder,
      case1Project,
      case1Month,
      case1Year,
      case2Project,
      case2ApprovalName,
      case2Builder,
      case2Year,
      case2Month,
      gridShowHide,
    } = this.state;

    if (case1CategoryTypeSelected.length > 0) {
      // this.case1Category1.current.resetSelectedValues();
      if (!!this.case1Category1?.current) {
        this.case1Category1.current.resetSelectedValues();
      }
      this.setState({
        case1CategoryTypeSelected: "",
      });
    }

    if (case1ApprovalName.length !== 0) {
      if (!!this.approvalCase1?.current) {
        this.approvalCase1.current.resetSelectedValues();
      }
      this.setState({
        case1ApprovalName: [],
      });
    }

    if (case1Project.length !== 0) {
      if (!!this?.projectCase1?.current) {
        this.projectCase1.current.resetSelectedValues();
      }
      this.setState({
        case1Project: [],
      });
    }

    if (case1Builder.length !== 0) {
      if (this?.builderCas1?.current) {
        this.builderCas1.current.resetSelectedValues();
      }
      this.setState({
        case1Builder: [],
      });
    }

    if (case1PropertyId.length !== 0) {
      if (!!this.propertCase1type1.current) {
        this.propertCase1type1.current.resetSelectedValues();
      }

      this.setState({
        case1PropertyId: [],
      });
    }

    if (case1UnitType.length !== 0) {
      if (!!this.unitTypeCase1Type1.current) {
        this.unitTypeCase1Type1.current.resetSelectedValues();
      }
      this.setState({
        case1UnitType: [],
      });
    }

    if (case1Year.length !== 0) {
      if (!!this.yearCae1Type1.current) {
        this.yearCae1Type1.current.resetSelectedValues();
      }
      this.setState({
        case1Year: [],
      });
    }

    if (case1Month.length !== 0) {
      if (!!this.monthCase1Type1.current) {
        this.monthCase1Type1.current.resetSelectedValues();
      }
      this.setState({
        case1Month: [],
      });
    }

    if (case2CategoryTypeSelected.length > 0) {
      this.setState({
        case2CategoryTypeSelected: "",
      });
    }

    if (case2ApprovalName.length !== 0) {
      this.approvalCase2.current.resetSelectedValues();
      this.setState({
        case2ApprovalName: [],
      });
    }

    if (case2Project.length !== 0) {
      this.projectCase2.current.resetSelectedValues();
      this.setState({
        case2Project: [],
      });
    }

    if (case2Builder.length !== 0) {
      this.builderCas2.current.resetSelectedValues();
      this.setState({
        case2Builder: [],
      });
    }

    if (case2PropertyId.length !== 0) {
      this.propertCase2type1.current.resetSelectedValues();
      this.setState({
        case2PropertyId: [],
      });
    }

    if (case2UnitType.length !== 0) {
      this.unitTypeCase2Type1.current.resetSelectedValues();
      this.setState({
        case2UnitType: [],
      });
    }

    if (case2Year.length !== 0) {
      this.yearCae2Type1.current.resetSelectedValues();
      this.setState({
        case2Year: [],
      });
    }

    if (case2Month.length !== 0) {
      this.monthCase2Type1.current.resetSelectedValues();
      this.setState({
        case2Month: [],
      });
    }

    this.setState({
      gridShowHide: true,
    });

    this.props.showHideGrid(true);
    this.props.propertyAppriselHide();

    this.props.resetStateByRegionUSer();
    this.props.resetStateByRadiusUSer();
    this.props.resetgridUser();

    this.props.resetMapData();
    this.props.cas1Submit({});
    this.props.resizeMapData();
    this.props.categoryTypeResetUser();
    this.resetMap();
  }

  resetMap() {
    this.props.resetbarByZoneUser();
    this.props.resizeMapData();
    this.props.resetpropertyByLatLonUser();
    this.props.resetunitTypeByLatLonUser();
    this.props.resetbuilderByLatLonUser();
    this.props.resetapprovalByLatLonUser();
    this.props.resetprojectByLatLonUser();
    this.props.resetpropertyByCityUser();
    this.props.resetStateByRegionUSer();
    this.props.resetStateByRadiusUSer();
    this.props.resetapprovalByCityUser();
    this.props.categoryTypeResetUser();
    this.props.resetunitTypeByStateCityUser();
    this.props.resetyearByLatLonUser();
    this.props.resetyearByStateCityUser();
    this.props.resetmonthByStateCityUser();
    this.props.resetmonthByLatLonUser();
    this.props.resetcompletedByStateCityUser();
    this.props.resetcompletedByLatLonUser();
    this.props.resetnoOfUnitByCityUser();
    this.props.resetrateLimitByStateCityUser();
    this.props.resetnoOfUnitByLatLonUser();
    this.props.resetsearchCityUserUser();
    this.props.resetbarByLocalityUser();
  }

  gridOff() {
    const { gridShowHide } = this.state;

    this.setState({
      gridShowHide: !gridShowHide,
    });

    this.props.showHideGrid(gridShowHide);
  }
  setAge1() {
    const { showAge1, cIndividualSetAge, cProjecIndividualSetAge } = this.state;
    this.setState({
      showAge1: !showAge1,
      cIndividualSetAge: !cIndividualSetAge,
      cProjecIndividualSetAge: !cProjecIndividualSetAge,
    });
  }
  setAge2(type) {
    const { showAge2, individualSetAge, individualProjSetAge } = this.state;
    if (type === "iPSA") {
      this.setState({
        showAge2: !showAge2,
        individualProjSetAge: !individualProjSetAge,
      });
    } else {
      this.setState({
        showAge2: !showAge2,
        individualSetAge: !individualSetAge,
      });
    }
  }
  setRate1() {
    const { showRate1, cIndividualSetRate } = this.state;
    this.setState({
      showRate1: !showRate1,
      cIndividualSetRate: !cIndividualSetRate,
    });
  }
  setRate2(type) {
    const { showRate2, individualSetRate, individualProjSetRate } = this.state;
    if (type === "ipsr") {
      this.setState({
        showRate2: !showRate2,
        individualProjSetRate: !individualProjSetRate,
      });
    } else {
      this.setState({
        showRate2: !showRate2,
        individualSetRate: !individualSetRate,
      });
    }
  }
  setAppRate1() {
    const { showAppRate1, cProjectSetRate, cProjectIndividualSetRate } =
      this.state;
    this.setState({
      showAppRate1: !showAppRate1,
      cProjectSetRate: !cProjectSetRate,
      cProjectIndividualSetRate: !cProjectIndividualSetRate,
    });
  }
  setAppRate2(type) {
    const { showAppRate2, projectSetRate, individualProjSetRate } = this.state;
    if (type === "ipsr") {
      this.setState({
        showAppRate2: !showAppRate2,
        individualProjSetRate: !individualProjSetRate,
      });
    } else {
      this.setState({
        showAppRate2: !showAppRate2,
        projectSetRate: !projectSetRate,
      });
    }
  }
  setUnits1() {
    const { showUnits1, cProjectSetNumber, cProjecIndividualtSetNumber } =
      this.state;
    this.setState({
      showUnits1: !showUnits1,
      cProjectSetNumber: !cProjectSetNumber,
      cProjecIndividualtSetNumber: !cProjecIndividualtSetNumber,
    });
  }
  setUnits2(type) {
    const { showUnits2, projectSetNumber, individualProjSetNumber } =
      this.state;
    if (type === "idpr") {
      this.setState({
        showUnits2: !showUnits2,
        individualProjSetNumber: !individualProjSetNumber,
      });
    } else {
      this.setState({
        showUnits2: !showUnits2,
        projectSetNumber: !projectSetNumber,
      });
    }
  }
  proprtyAppraiseShow() {
    const { propertyAppraiseRate } = this.state;

    this.setState({
      propertyAppraiseRate: !propertyAppraiseRate,
    });

    this.props.showHideGrid(this.state.gridShowHide);
  }

  searcchForCity(e) {
    if (e.length > 3) {
      _getStorageValue(USER_ID).then((userId) => {
        this.props.searchCityUserAction(userId, e);
      });
    }
  }

  render() {
    const {
      latitude,
      longitude,
      radius,
      radiusState,
      case1CategoryId,
      case1PropertyId,
      case1ApprovalName,
      case1Project,
      case1Builder,
      case1UnitType,
      case1Year,
      case1Month,
      collapse1,
      collapse2,
      collapse3,
      collapse4,
      case2State,
      case2CategoryId,
      case2PropertyId,
      case2UnitType,
      case2ApprovalName,
      case2Project,
      case2Builder,
      case2City,
      case2Year,
      case2Month,
      case1CategoryTypeSelected,
      case2CategoryTypeSelected,
      branchBank,
      agencyLocation,
      projectSetNumber,
      individualSetAge,
      individualSetRate,
      individualProjSetRate,
      individualProjSetNumber,
      individualProjSetAge,
      cProjectSetNumber,
      cProjectSetRate,
      cIndividualSetRate,
      cIndividualSetAge,
      cProjecIndividualtSetNumber,
      cProjecIndividualSetAge,
      cProjectIndividualSetRate,
      projectSetRate,
      minBoundLand1,
      maxBoundLand1,
      minBoundSellable1,
      maxBoundSellable1,
      minBoundApp1,
      maxBoundApp1,
      minBoundLand2,
      maxBoundLand2,
      minBoundSellable2,
      maxBoundSellable2,
      minBoundApp2,
      maxBoundApp2,
      min,
      minBound,
      max,
      maxBound,
      minCase2,
      minBoundCase2,
      maxCase2,
      maxBoundCase2,
      minCase1Age,
      minBoundCase1Age,
      maxCase1Age,
      maxBoundCase1Age,
      minCase2Age,
      minBoundCase2Age,
      maxCase2Age,
      maxBoundCase2Age,
      minCase1Percent,
      minBoundCase1Percent,
      maxCase1Percent,
      maxBoundCase1Percent,
      minCase2Percent,
      minBoundCase2Percent,
      maxCase2Percent,
      maxBoundCase2Percent,
      minCase1Unit,
      minBoundCase1Unit,
      maxCase1Unit,
      maxBoundCase1Unit,
      minCase2Unit,
      minBoundCase2Unit,
      maxCase2Unit,
      maxBoundCase2Unit,
      multipleSelectStatus,
      gridShowHide,
      searchStateid,
      searchStatename,
      searchCityname,
      searchCityid,
      case2Loader,
      case1Loader,
      case2Zone,
      case2Locality,
      minAppRate1,
      maxAppRate1,
      minAppRate2,
      maxAppRate2,
      minLandRate1,
      maxLandRate1,
      minSellableRate1,
      maxSellableRate1,
      minLandRate2,
      maxLandRate2,
      minSellableRate2,
      maxSellableRate2,
      showAge1,
      showRate1,
      showAge2,
      showRate2,
      showAppRate1,
      showAppRate2,
      showUnits1,
      showUnits2,
    } = this.state;

    const {
      stateData,
      builderData,
      projectNameData,
      cityNameData,
      categoryTypeData,
      propertyData,
      unitTypeData,
      builderByLatLonData,
      approvalByLatLonData,
      projectByLatLonData,
      approvalByCityData,
      categoryTypeStateCityData,
      propertyByCityData,
      unitTypeByCityData,
      yearByCityData,
      yearByLatLonData,
      monthByCityData,
      monthData,
      barData,
      completedByCityData,
      completedByLatLonData,
      noOfUnitByCityData,
      noOfUnitByLatLonData,
      rateLimitByCityData,
      isFetchingCategory,
      isFetchingCatestate,
      searchCityData,
      isFetchingProperty,
      isFetchingUnitType,
      isFetchingApprovalByLatLon,
      isFetchingProjectByLatLon,
      isFetchingBuilderByLatLon,
      isFetchingPropertyByCity,
      isFetchingUnitTypeByCity,
      isFetchingApprovalByCity,
      isFetchingProjectNameByCity,
      isFetchingBuliderByCity,
      zoneByCityBarData,
      isFetchingAgencyBranch,
      isFetchingState,
      isFetchingCity,
      isFetchingZone,
      isFetchingLocal,
      isFetchingYearByCity,
      isFetchingMonthByCity,
      isFetchingYearByLatLon,
      isFetchingMonthByLatLong,
      propertyAppraiseRate,
    } = this.props;

    if (zoneByCityBarData.length !== 0) {
      var zoneByCityBarDataArr = zoneByCityBarData;
    } else {
      var zoneByCityBarDataArr = [{ id: 1, name: "No Data" }];
    }

    // if (!isEmpty(barData)) {
    //   var barDataArr = barData;
    // } else {
    //   barDataArr = [];
    // }

    console.log("categoryTypeData", categoryTypeData);

    return (
      <React.Fragment>
        <div>
          <div className="filter-sec">
            <div className="filter-collape">
              <div className="filter-collapse-Body hegt0 top0">
                <div className="filter-body flex-box-card">
                  <div className="search-element case1-sec">
                    <label> Bank Location </label>
                    <BootstrapSwitchButton
                      checked={branchBank}
                      value={branchBank}
                      onlabel="Off"
                      onstyle="danger"
                      offlabel="On"
                      offstyle="success"
                      style="w-10 mx-2"
                      onChange={(branch) => {
                        this.branchOff(branch);
                      }}
                    />
                  </div>

                  <div className="search-element case1-sec">
                    <label> Agency Location</label>
                    <BootstrapSwitchButton
                      checked={agencyLocation}
                      value={agencyLocation}
                      onlabel="Off"
                      onstyle="danger"
                      offlabel="On"
                      offstyle="success"
                      style="w-30 mx-2"
                      onChange={(checked) => {
                        this.agencyOff(checked);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Accordion flush>
              {/* Search based on Location */}
              <Card className="maxHeight">
                <div className="filter-collape">
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="2"
                  >
                    <div
                      className="filter-collapse-heading"
                      onClick={() => {
                        this.setState({
                          collapse3: !collapse3,
                          collapse1: false,
                          collapse2: false,
                          collapse4: false,
                        });
                        this.resetMap();
                        this.resetValue();
                        // this.props.resizeMapData();
                      }}
                    >
                      <h6> Search based on Locality </h6>
                    </div>
                  </Accordion.Toggle>
                  {this.state.collapse3 && (
                    <Accordion.Collapse eventKey="2">
                      <div
                        className={`new-filter-collapse-Body search-region  ${
                          collapse3 ? "show" : "hide"
                        }`}
                      >
                        <div className="filter-body">
                          <div className="search-element drop-up">
                            <label>
                              Location <span className="manditary">*</span>
                              <span>
                                <h6>Google location enabled</h6>
                                <img
                                  src={require("../../assets/images/icons.png")}
                                  alt="icon"
                                />
                              </span>
                            </label>
                            {this.state.showGoogleField && (
                              <GooglePlacesAutocomplete
                                apiKey={GOOGLE_MAP_API_KEY}
                                selectProps={{
                                  onChange: (e) => {
                                    this.resetValue();
                                    this.getPlacesID(e);
                                  },
                                }}
                                ref={this.googleSelectField}
                              />
                            )}
                          </div>
                          <div className="search-element drop-up">
                            <label>
                              Category Type <span className="manditary">*</span>
                              <span>
                                <h6>Multiple Selection Enabled</h6>
                                <img
                                  src={require("../../assets/images/icons.png")}
                                  alt="icon"
                                />
                              </span>
                            </label>
                            <div className="down-arrow">
                              {/* <Multiselect
                                options={categoryTypeData}
                                onSelect={(e) => {
                                  this.case1CategorySelect(e);
                                }}
                                onRemove={(e) => {
                                  this.case1CategoryRemove(e);
                                }}
                                selectionLimit={1}
                                value={case1CategoryTypeSelected}
                                displayValue="name"
                                ref={this.case1Category1}
                                disable={categoryTypeData.length === 0}
                              /> */}
                              <select
                                value={case1CategoryTypeSelected}
                                onChange={(e) => {
                                  this.case1CategorySelect(e);
                                }}
                                disable={isEmpty(categoryTypeData)}
                              >
                                <option value="NaN" label="Select" />
                                {categoryTypeData.map((data, key) => {
                                  return (
                                    <option
                                      key={data.id}
                                      value={data.name}
                                      label={data.name}
                                    />
                                  );
                                })}
                              </select>
                              <img
                                src={require("../../assets/images/down-arrow.png")}
                                alt="down-arroe"
                              />
                              {isFetchingCategory ? (
                                <div className="loader-cate"></div>
                              ) : null}
                            </div>
                          </div>
                          {
                            <>
                              {(() => {
                                if (case1CategoryId === "1") {
                                  return (
                                    <div>
                                      <div className="search-element">
                                        <label>
                                          Property Type
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={propertyData}
                                            onSelect={(e) => {
                                              this.case1PropertySelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1PropertyRemove(e);
                                            }}
                                            displayValue="name"
                                            value={case1PropertyId}
                                            ref={this.propertCase1type1}
                                            disable={propertyData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingProperty ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>

                                      <div className="search-element">
                                        <label>
                                          Unit Type
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={unitTypeData}
                                            onSelect={(e) => {
                                              this.case1UnitTypeSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1UnitTypeRemove(e);
                                            }}
                                            displayValue="name"
                                            value={case1UnitType}
                                            ref={this.unitTypeCase1Type1}
                                            disable={unitTypeData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="month"
                                          />
                                          {isFetchingUnitType ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <>
                                          <div className="search-element">
                                            <label>
                                              Property Entered On
                                              <span>
                                                <h6>
                                                  Multiple Selection Enabled
                                                </h6>
                                                <img
                                                  src={require("../../assets/images/icons.png")}
                                                  alt="icon"
                                                />
                                              </span>
                                            </label>
                                            <div className="calender">
                                              <div className="down-arrow calender-width">
                                                <Multiselect
                                                  options={yearByLatLonData}
                                                  displayValue="name"
                                                  placeholder="Year"
                                                  value={case1Year}
                                                  onSelect={(e) => {
                                                    this.case1YearSelect(e);
                                                  }}
                                                  onRemove={(e) => {
                                                    this.case1YearRemove(e);
                                                  }}
                                                  ref={this.yearCae1Type1}
                                                  disable={
                                                    yearByLatLonData.length ===
                                                    0
                                                  }
                                                />
                                                <img
                                                  src={require("../../assets/images/down-arrow.png")}
                                                  alt="month"
                                                />
                                                {isFetchingYearByLatLon ? (
                                                  <div className="loader-cate"></div>
                                                ) : null}
                                              </div>
                                              <div className="down-arrow calender-width">
                                                <Multiselect
                                                  options={monthData}
                                                  displayValue="name"
                                                  placeholder="Month"
                                                  value={case1Month}
                                                  onSelect={(e) => {
                                                    this.case1MonthSelect(e);
                                                  }}
                                                  onRemove={(e) => {
                                                    this.case1MonthRemove(e);
                                                  }}
                                                  ref={this.monthCase1Type1}
                                                  disable={
                                                    monthData.length === 0
                                                  }
                                                />
                                                <img
                                                  src={require("../../assets/images/down-arrow.png")}
                                                  alt="month"
                                                />
                                                {isFetchingMonthByLatLong ? (
                                                  <div className="loader-cate"></div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="search-element case2-sec ">
                                            <label> Set Age </label>
                                            <BootstrapSwitchButton
                                              checked={cIndividualSetAge}
                                              value={cIndividualSetAge}
                                              onlabel="Off"
                                              onstyle="danger"
                                              offlabel="On"
                                              offstyle="success"
                                              style="w-10 mx-2"
                                              onChange={(ageVal) => {
                                                this.setAge1(ageVal);
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}

                                      {showAge1 && (
                                        <div className="search-element ">
                                          <label>Property Age</label>
                                          <div className="view-value">
                                            {/* <span>
                                      {minCase1Age} - {maxCase1Age}
                                    </span> */}
                                            <Form.Control
                                              value={minCase1Age}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase1Age: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase1Age}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase1Age: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>

                                          <Range
                                            marks={{
                                              [minBoundCase1Age]: "0",
                                              [maxBoundCase1Age]: "100",
                                            }}
                                            step={1}
                                            min={minBoundCase1Age}
                                            max={maxBoundCase1Age}
                                            allowCross={false}
                                            value={[minCase1Age, maxCase1Age]}
                                            onChange={this.handleCase1Age}
                                          />
                                        </div>
                                      )}
                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element case2-sec ">
                                          <label> Set Rate </label>
                                          <BootstrapSwitchButton
                                            checked={cIndividualSetRate}
                                            value={cIndividualSetRate}
                                            onlabel="Off"
                                            onstyle="danger"
                                            offlabel="On"
                                            offstyle="success"
                                            style="w-10 mx-2"
                                            onChange={(rateVal) => {
                                              this.setRate1(rateVal);
                                            }}
                                          />
                                        </div>
                                      )}
                                      {showRate1 && (
                                        <div>
                                          <div className="search-element">
                                            <label> Land Rate Limit</label>
                                            <div className="view-value">
                                              {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                              <Form.Control
                                                value={minLandRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    minLandRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="min"
                                              />
                                              <Form.Control
                                                value={maxLandRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    maxLandRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="max"
                                              />
                                            </div>
                                            <Range
                                              marks={{
                                                [minBoundLand1]: "0",
                                                [maxBoundLand1]: "100000",
                                              }}
                                              step={1000}
                                              min={minBoundLand1}
                                              max={maxBoundLand1}
                                              allowCross={false}
                                              value={[
                                                minLandRate1,
                                                maxLandRate1,
                                              ]}
                                              onChange={this.handleCaseLand1}
                                            />
                                          </div>
                                          <div className="search-element">
                                            <label> Sellable Rate Limit</label>
                                            <div className="view-value">
                                              {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                              <Form.Control
                                                value={minSellableRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    minSellableRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="min"
                                              />
                                              <Form.Control
                                                value={maxSellableRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    maxSellableRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="max"
                                              />
                                            </div>
                                            <Range
                                              marks={{
                                                [minBoundSellable1]: "0",
                                                [maxBoundSellable1]: "100000",
                                              }}
                                              step={1000}
                                              min={minBoundSellable1}
                                              max={maxBoundSellable1}
                                              allowCross={false}
                                              value={[
                                                minSellableRate1,
                                                maxSellableRate1,
                                              ]}
                                              onChange={
                                                this.handleCaseSellable1
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                } else if (case1CategoryId === "2") {
                                  return (
                                    <div>
                                      <div className="search-element">
                                        <label>
                                          Property Type
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={propertyData}
                                            onSelect={(e) => {
                                              this.case1PropertySelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1PropertyRemove(e);
                                            }}
                                            displayValue="name"
                                            value={case1PropertyId}
                                            ref={this.propertCase1type1}
                                            disable={propertyData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingProperty ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>

                                      {case1CategoryTypeSelected !== "LVT" && (
                                        <>
                                          <div className="search-element">
                                            <label>
                                              Unit Type
                                              <span>
                                                <h6>
                                                  Multiple Selection Enabled
                                                </h6>
                                                <img
                                                  src={require("../../assets/images/icons.png")}
                                                  alt="icon"
                                                />
                                              </span>
                                            </label>
                                            <div className="down-arrow">
                                              <Multiselect
                                                options={unitTypeData}
                                                onSelect={(e) => {
                                                  this.case1UnitTypeSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case1UnitTypeRemove(e);
                                                }}
                                                displayValue="name"
                                                value={case1UnitType}
                                                ref={this.unitTypeCase1Type1}
                                                disable={
                                                  unitTypeData.length === 0
                                                }
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="down-arroe"
                                              />
                                              {isFetchingUnitType ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                          </div>

                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element">
                                              <label>
                                                Approval Number
                                                <span>
                                                  <h6>
                                                    Multiple Selection Enabled
                                                  </h6>
                                                  <img
                                                    src={require("../../assets/images/icons.png")}
                                                    alt="icon"
                                                  />
                                                </span>
                                              </label>
                                              <div className="down-arrow">
                                                <Multiselect
                                                  options={approvalByLatLonData}
                                                  displayValue="name"
                                                  onSelect={(e) => {
                                                    this.case1ApprovalSelect(e);
                                                  }}
                                                  onRemove={(e) => {
                                                    this.case1ApprovalRemove(e);
                                                  }}
                                                  value={case1ApprovalName}
                                                  ref={this.approvalCase1}
                                                  disable={
                                                    approvalByLatLonData.length ===
                                                    0
                                                  }
                                                />
                                                <img
                                                  src={require("../../assets/images/down-arrow.png")}
                                                  alt="down-arroe"
                                                />
                                                {isFetchingApprovalByLatLon ? (
                                                  <div className="loader-cate"></div>
                                                ) : null}
                                              </div>
                                            </div>
                                          )}

                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element">
                                              <label>
                                                Project Name
                                                <span>
                                                  <h6>
                                                    Multiple Selection Enabled
                                                  </h6>
                                                  <img
                                                    src={require("../../assets/images/icons.png")}
                                                    alt="icon"
                                                  />
                                                </span>
                                              </label>
                                              <div className="down-arrow">
                                                <Multiselect
                                                  options={projectByLatLonData}
                                                  displayValue="name"
                                                  onSelect={(e) => {
                                                    this.case1ProjectSelect(e);
                                                  }}
                                                  onRemove={(e) => {
                                                    this.case1ProjectRemove(e);
                                                  }}
                                                  value={case1Project}
                                                  ref={this.projectCase1}
                                                  disable={
                                                    projectByLatLonData.length ===
                                                    0
                                                  }
                                                />
                                                <img
                                                  src={require("../../assets/images/down-arrow.png")}
                                                  alt="down-arroe"
                                                />
                                                {isFetchingProjectByLatLon ? (
                                                  <div className="loader-cate"></div>
                                                ) : null}
                                              </div>
                                            </div>
                                          )}

                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element">
                                              <label>
                                                Builder Groups
                                                <span>
                                                  <h6>
                                                    Multiple Selection Enabled
                                                  </h6>
                                                  <img
                                                    src={require("../../assets/images/icons.png")}
                                                    alt="icon"
                                                  />
                                                </span>
                                              </label>
                                              <div className="down-arrow bulider-sec">
                                                <Multiselect
                                                  options={builderByLatLonData}
                                                  displayValue="name"
                                                  value={case1Builder}
                                                  onSelect={(e) => {
                                                    this.case1BuilderSelect(e);
                                                  }}
                                                  onRemove={(e) => {
                                                    this.case1BuilderRemove(e);
                                                  }}
                                                  ref={this.builderCas1}
                                                  disable={
                                                    builderByLatLonData.length ===
                                                    0
                                                  }
                                                />
                                                <img
                                                  src={require("../../assets/images/down-arrow.png")}
                                                  alt="down-arroe"
                                                />
                                                {isFetchingBuilderByLatLon ? (
                                                  <div className="loader-cate"></div>
                                                ) : null}
                                              </div>
                                            </div>
                                          )}

                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element">
                                              <label>
                                                Property Entered On
                                                <span>
                                                  <h6>
                                                    Multiple Selection Enabled
                                                  </h6>
                                                  <img
                                                    src={require("../../assets/images/icons.png")}
                                                    alt="icon"
                                                  />
                                                </span>
                                              </label>
                                              <div className="calender">
                                                <div className="down-arrow calender-width">
                                                  <Multiselect
                                                    options={yearByLatLonData}
                                                    displayValue="name"
                                                    placeholder="Year"
                                                    value={case1Year}
                                                    onSelect={(e) => {
                                                      this.case1YearSelect(e);
                                                    }}
                                                    onRemove={(e) => {
                                                      this.case1YearRemove(e);
                                                    }}
                                                    ref={this.yearCae1Type1}
                                                    disable={
                                                      yearByLatLonData.length ===
                                                      0
                                                    }
                                                  />
                                                  <img
                                                    src={require("../../assets/images/down-arrow.png")}
                                                    alt="month"
                                                  />
                                                  {isFetchingYearByLatLon ? (
                                                    <div className="loader-cate"></div>
                                                  ) : null}
                                                </div>
                                                <div className="down-arrow calender-width">
                                                  <Multiselect
                                                    options={monthData}
                                                    displayValue="name"
                                                    placeholder="Month"
                                                    value={case1Month}
                                                    onSelect={(e) => {
                                                      this.case1MonthSelect(e);
                                                    }}
                                                    onRemove={(e) => {
                                                      this.case1MonthRemove(e);
                                                    }}
                                                    ref={this.monthCase1Type1}
                                                    disable={
                                                      monthData.length === 0
                                                    }
                                                  />
                                                  <img
                                                    src={require("../../assets/images/down-arrow.png")}
                                                    alt="month"
                                                  />
                                                  {isFetchingMonthByLatLong ? (
                                                    <div className="loader-cate"></div>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element">
                                              <label>Completed (%)</label>
                                              <div className="view-value">
                                                {/* <span>
                                      {minCase1Percent} - {maxCase1Percent}
                                    </span> */}
                                                <Form.Control
                                                  value={minCase1Percent}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      minCase1Percent: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="min"
                                                />
                                                <Form.Control
                                                  value={maxCase1Percent}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      maxCase1Percent: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="max"
                                                />
                                              </div>
                                              <Range
                                                marks={{
                                                  [minBoundCase1Percent]: "0",
                                                  [maxBoundCase1Percent]: "100",
                                                }}
                                                step={1}
                                                min={minBoundCase1Percent}
                                                max={maxBoundCase1Percent}
                                                allowCross={false}
                                                value={[
                                                  minCase1Percent,
                                                  maxCase1Percent,
                                                ]}
                                                onChange={
                                                  this.handleCase1Percent
                                                }
                                              />
                                            </div>
                                          )}
                                          {case1CategoryTypeSelected === "CRFG"
                                            ? null
                                            : case1CategoryTypeSelected !==
                                                "MARKET TRANSACTION" && (
                                                <div className="search-element case2-sec ">
                                                  <label>
                                                    Set Number Of Units
                                                  </label>
                                                  <BootstrapSwitchButton
                                                    checked={cProjectSetNumber}
                                                    value={cProjectSetNumber}
                                                    onlabel="Off"
                                                    onstyle="danger"
                                                    offlabel="On"
                                                    offstyle="success"
                                                    style="w-10 mx-2"
                                                    onChange={(unitVal) => {
                                                      this.setUnits1(unitVal);
                                                    }}
                                                  />
                                                </div>
                                              )}
                                          {showUnits1 && (
                                            <div className="search-element">
                                              <label>Number Of Units</label>

                                              <div className="view-value">
                                                {/* <span>
                                      {minCase1Unit} - {maxCase1Unit}
                                    </span> */}
                                                <Form.Control
                                                  value={minCase1Unit}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      minCase1Unit: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="min"
                                                />
                                                <Form.Control
                                                  value={maxCase1Unit}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      maxCase1Unit: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="max"
                                                />
                                              </div>
                                              <Range
                                                marks={{
                                                  [minBoundCase1Unit]: "0",
                                                  [maxBoundCase1Unit]: "5000",
                                                }}
                                                step={100}
                                                min={minBoundCase1Unit}
                                                max={maxBoundCase1Unit}
                                                allowCross={false}
                                                value={[
                                                  minCase1Unit,
                                                  maxCase1Unit,
                                                ]}
                                                onChange={this.handleCase1Unit}
                                              />
                                            </div>
                                          )}
                                          {case1CategoryTypeSelected !==
                                            "MARKET TRANSACTION" && (
                                            <div className="search-element case2-sec ">
                                              <label> Set Rate</label>
                                              <BootstrapSwitchButton
                                                checked={cProjectSetRate}
                                                value={cProjectSetRate}
                                                onlabel="Off"
                                                onstyle="danger"
                                                offlabel="On"
                                                offstyle="success"
                                                style="w-10 mx-2"
                                                onChange={(rateVal) => {
                                                  this.setAppRate1(rateVal);
                                                }}
                                              />
                                            </div>
                                          )}
                                          {showAppRate1 && (
                                            <div className="search-element">
                                              <label>
                                                Appraised Rate Limit
                                              </label>
                                              <div className="view-value">
                                                {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                                <Form.Control
                                                  value={minAppRate1}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      minAppRate1: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="min"
                                                />
                                                <Form.Control
                                                  value={maxAppRate1}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      maxAppRate1: parseInt(
                                                        e.target.value,
                                                      ),
                                                    });
                                                  }}
                                                  className="wid45"
                                                  type="number"
                                                  placeholder="max"
                                                />
                                              </div>
                                              <Range
                                                marks={{
                                                  [minBoundApp1]: "0",
                                                  [maxBoundApp1]: "100000",
                                                }}
                                                step={1000}
                                                min={minBoundApp1}
                                                max={maxBoundApp1}
                                                allowCross={false}
                                                value={[
                                                  minAppRate1,
                                                  maxAppRate1,
                                                ]}
                                                onChange={this.handleCaseApp1}
                                              />
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  );
                                } else if (case1CategoryId === "3") {
                                  return (
                                    <div>
                                      <div className="search-element">
                                        <label>
                                          Property Type
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={propertyData}
                                            onSelect={(e) => {
                                              this.case1PropertySelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1PropertyRemove(e);
                                            }}
                                            displayValue="name"
                                            value={case1PropertyId}
                                            ref={this.propertCase1type1}
                                            disable={propertyData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingProperty ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>

                                      <div className="search-element">
                                        <label>
                                          Unit Type
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={unitTypeData}
                                            onSelect={(e) => {
                                              this.case1UnitTypeSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1UnitTypeRemove(e);
                                            }}
                                            displayValue="name"
                                            value={case1UnitType}
                                            ref={this.unitTypeCase1Type1}
                                            disable={unitTypeData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingUnitType ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element">
                                          <label>
                                            Approval Number
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow">
                                            <Multiselect
                                              options={approvalByLatLonData}
                                              displayValue="name"
                                              onSelect={(e) => {
                                                this.case1ApprovalSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1ApprovalRemove(e);
                                              }}
                                              value={case1ApprovalName}
                                              ref={this.approvalCase1}
                                              disable={
                                                approvalByLatLonData.length ===
                                                0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingApprovalByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>
                                      )}

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element">
                                          <label>
                                            Project Name
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow">
                                            <Multiselect
                                              options={projectByLatLonData}
                                              displayValue="name"
                                              onSelect={(e) => {
                                                this.case1ProjectSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1ProjectRemove(e);
                                              }}
                                              value={case1Project}
                                              ref={this.projectCase1}
                                              disable={
                                                projectByLatLonData.length === 0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingProjectByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>
                                      )}

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element">
                                          <label>
                                            Builder Groups
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow bulider-sec">
                                            <Multiselect
                                              options={builderByLatLonData}
                                              displayValue="name"
                                              value={case1Builder}
                                              onSelect={(e) => {
                                                this.case1BuilderSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1BuilderRemove(e);
                                              }}
                                              ref={this.builderCas1}
                                              disable={
                                                builderByLatLonData.length === 0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingBuilderByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>
                                      )}

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element">
                                          <label>
                                            Property Entered On
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="calender">
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={yearByLatLonData}
                                                displayValue="name"
                                                placeholder="Year"
                                                value={case1Year}
                                                onSelect={(e) => {
                                                  this.case1YearSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case1YearRemove(e);
                                                }}
                                                ref={this.yearCae1Type1}
                                                disable={
                                                  yearByLatLonData.length === 0
                                                }
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingYearByLatLon ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={monthData}
                                                displayValue="name"
                                                placeholder="Month"
                                                value={case1Month}
                                                onSelect={(e) => {
                                                  this.case1MonthSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case1MonthRemove(e);
                                                }}
                                                ref={this.monthCase1Type1}
                                                disable={monthData.length === 0}
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingMonthByLatLong ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element">
                                          <label>Completed (%)</label>
                                          <div className="view-value">
                                            {/* <span>
                                        {minCase1Percent} - {maxCase1Percent}
                                      </span> */}
                                            <Form.Control
                                              value={minCase1Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase1Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase1Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase1Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>
                                          <Range
                                            marks={{
                                              [minBoundCase1Percent]: "0",
                                              [maxBoundCase1Percent]: "100",
                                            }}
                                            step={1}
                                            min={minBoundCase1Percent}
                                            max={maxBoundCase1Percent}
                                            allowCross={false}
                                            value={[
                                              minCase1Percent,
                                              maxCase1Percent,
                                            ]}
                                            onChange={this.handleCase1Percent}
                                          />
                                        </div>
                                      )}

                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element case2-sec ">
                                          <label> Set Number Of Units </label>
                                          <BootstrapSwitchButton
                                            checked={
                                              cProjecIndividualtSetNumber
                                            }
                                            value={cProjecIndividualtSetNumber}
                                            onlabel="Off"
                                            onstyle="danger"
                                            offlabel="On"
                                            offstyle="success"
                                            style="w-10 mx-2"
                                            onChange={(unitVal) => {
                                              this.setUnits1(unitVal);
                                            }}
                                          />
                                        </div>
                                      )}

                                      {showUnits1 && (
                                        <div className="search-element">
                                          <label>Number Of Units</label>

                                          <div className="view-value">
                                            {/* <span>
                                        {minCase1Unit} - {maxCase1Unit}
                                      </span> */}
                                            <Form.Control
                                              value={minCase1Unit}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase1Unit: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase1Unit}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase1Unit: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>
                                          <Range
                                            marks={{
                                              [minBoundCase1Unit]: "0",
                                              [maxBoundCase1Unit]: "5000",
                                            }}
                                            step={100}
                                            min={minBoundCase1Unit}
                                            max={maxBoundCase1Unit}
                                            allowCross={false}
                                            value={[minCase1Unit, maxCase1Unit]}
                                            onChange={this.handleCase1Unit}
                                          />
                                        </div>
                                      )}
                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element case2-sec ">
                                          <label> Set Age </label>
                                          <BootstrapSwitchButton
                                            checked={cProjecIndividualSetAge}
                                            value={cProjecIndividualSetAge}
                                            onlabel="Off"
                                            onstyle="danger"
                                            offlabel="On"
                                            offstyle="success"
                                            style="w-10 mx-2"
                                            onChange={(ageVal) => {
                                              this.setAge1(ageVal);
                                            }}
                                          />
                                        </div>
                                      )}

                                      {showAge1 && (
                                        <div className="search-element ">
                                          <label>Property Age</label>
                                          <div className="view-value">
                                            {/* <span>
                                      {minCase1Age} - {maxCase1Age}
                                    </span> */}
                                            <Form.Control
                                              value={minCase1Age}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase1Age: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase1Age}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase1Age: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>

                                          <Range
                                            marks={{
                                              [minBoundCase1Age]: "0",
                                              [maxBoundCase1Age]: "100",
                                            }}
                                            step={1}
                                            min={minBoundCase1Age}
                                            max={maxBoundCase1Age}
                                            allowCross={false}
                                            value={[minCase1Age, maxCase1Age]}
                                            onChange={this.handleCase1Age}
                                          />
                                        </div>
                                      )}
                                      {case1CategoryTypeSelected !==
                                        "MARKET TRANSACTION" && (
                                        <div className="search-element case2-sec ">
                                          <label> Set Rate</label>
                                          <BootstrapSwitchButton
                                            checked={cProjectIndividualSetRate}
                                            value={cProjectIndividualSetRate}
                                            onlabel="Off"
                                            onstyle="danger"
                                            offlabel="On"
                                            offstyle="success"
                                            style="w-10 mx-2"
                                            onChange={(rateVal) => {
                                              this.setAppRate1(rateVal);
                                            }}
                                          />
                                        </div>
                                      )}
                                      {showAppRate1 && (
                                        <>
                                          <div className="search-element">
                                            <label>Appraised Rate Limit</label>
                                            <div className="view-value">
                                              {/* <span>
                                        ₹ {min} - ₹ {max}
                                      </span> */}
                                              <Form.Control
                                                value={minAppRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    minAppRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="min"
                                              />
                                              <Form.Control
                                                value={maxAppRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    maxAppRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="max"
                                              />
                                            </div>
                                            <Range
                                              marks={{
                                                [minBoundApp1]: "0",
                                                [maxBoundApp1]: "100000",
                                              }}
                                              step={1000}
                                              min={minBoundApp1}
                                              max={maxBoundApp1}
                                              allowCross={false}
                                              value={[minAppRate1, maxAppRate1]}
                                              onChange={this.handleCaseApp1}
                                            />
                                          </div>
                                          <div className="search-element">
                                            <label> Land Rate Limit</label>
                                            <div className="view-value">
                                              {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                              <Form.Control
                                                value={minLandRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    minLandRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="min"
                                              />
                                              <Form.Control
                                                value={maxLandRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    maxLandRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="max"
                                              />
                                            </div>
                                            <Range
                                              marks={{
                                                [minBoundLand1]: "0",
                                                [maxBoundLand1]: "100000",
                                              }}
                                              step={1000}
                                              min={minBoundLand1}
                                              max={maxBoundLand1}
                                              allowCross={false}
                                              value={[
                                                minLandRate1,
                                                maxLandRate1,
                                              ]}
                                              onChange={this.handleCaseLand1}
                                            />
                                          </div>
                                          <div className="search-element">
                                            <label> Sellable Rate Limit</label>
                                            <div className="view-value">
                                              {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                              <Form.Control
                                                value={minSellableRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    minSellableRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="min"
                                              />
                                              <Form.Control
                                                value={maxSellableRate1}
                                                onChange={(e) => {
                                                  this.setState({
                                                    maxSellableRate1: parseInt(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="wid45"
                                                type="number"
                                                placeholder="max"
                                              />
                                            </div>
                                            <Range
                                              marks={{
                                                [minBoundSellable1]: "0",
                                                [maxBoundSellable1]: "100000",
                                              }}
                                              step={1000}
                                              min={minBoundSellable1}
                                              max={maxBoundSellable1}
                                              allowCross={false}
                                              value={[
                                                minSellableRate1,
                                                maxSellableRate1,
                                              ]}
                                              onChange={
                                                this.handleCaseSellable1
                                              }
                                            />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                }
                              })()}
                            </>
                          }

                          <div className="filter-Button">
                            <button
                              onClick={() => {
                                console.log(
                                  "this.googleSelectField",
                                  this.googleSelectField,
                                );
                                // this.googleSelectField.current.value=""
                                this.resetValue();
                                this.setState(
                                  { showGoogleField: false },
                                  () => {
                                    this.setState({ showGoogleField: true });
                                  },
                                );
                              }}
                              className="report"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                // this.showCase1();
                                // this.validationCase1();
                                // if(this.state.case1CategoryId!==""){
                                //   this.setState({updateFilter:true});
                                // }
                                this.showCase1();
                              }}
                            >
                              {case1Loader ? (
                                <div className="loader"></div>
                              ) : null}
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </Accordion.Collapse>
                  )}
                </div>
              </Card>
              {/* Search based on ID */}
              <Card className="maxHeight">
                <div className="filter-collape">
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="3"
                  >
                    <div
                      className="filter-collapse-heading"
                      onClick={() => {
                        this.setState({
                          collapse4: !collapse4,
                          collapse1: false,
                          collapse2: false,
                          collapse3: false,
                        });
                        this.resetMap();
                        this.resetValue();
                        // this.props.resizeMapData();
                      }}
                    >
                      <h6> Search based on ID</h6>
                    </div>
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey="3">
                    <div
                      className={`new-filter-collapse-Body search-region  ${
                        collapse4 ? "show" : "hide"
                      }`}
                    >
                      <div className="filter-body">
                        <div className="search-element">
                          <label>
                            Category <span>*</span>
                          </label>
                          <div className="down-arrow">
                            <select
                              value={this.state.CategoryREQ}
                              onChange={(e) => {
                                console.log("event", e.target.value);
                                this.setState({
                                  CategoryREQ: e.target.value,
                                  REQId: "",
                                });
                              }}
                            >
                              <option value="" label="Select" />
                              <option
                                value={"INDIVIDUAL"}
                                label={"Individual"}
                              />
                              <option value={"APF"} label={"Project"} />
                            </select>
                          </div>
                          {!!this.state.CategoryREQ && (
                            <div className="search-element">
                              <label>
                                {this.state.CategoryREQ === "INDIVIDUAL"
                                  ? "REQ ID"
                                  : "Approval No"}
                                <span>*</span>
                              </label>
                              <Form.Control
                                value={this.state.REQId}
                                onChange={(e) => {
                                  this.setState({
                                    REQId: e.target.value,
                                  });
                                }}
                                type="text"
                                placeholder={
                                  this.state.CategoryREQ === "INDIVIDUAL"
                                    ? "REQ ID"
                                    : "Approval No"
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="filter-Button">
                          <button
                            onClick={() => {
                              this.resetValue();
                              // this.closeModal();
                            }}
                            className="report"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => {
                              // this.showCase1();
                              // this.validationCase1();
                              // if(this.state.case1CategoryId!==""){
                              //   this.setState({updateFilter:true});
                              // }
                              this.showCase4();
                            }}
                          >
                            {case1Loader ? (
                              <div className="loader"></div>
                            ) : null}
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Collapse>
                </div>
              </Card>
              {/* Search based on Region */}
              <Card>
                <div className="filter-collape">
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="1"
                  >
                    <div
                      className="filter-collapse-heading"
                      onClick={() => {
                        // this.setState({
                        //   collapse2: !collapse2,
                        // });
                        // this.resetMap();
                        this.setState(
                          {
                            collapse2: !collapse2,
                            collapse1: false,
                            collapse3: false,
                            collapse4: false,
                            radius: 0,
                            longitude: "",
                            latitude: "",
                            urlString: "",
                            updateFilter: false,
                            case2State: "",
                            case2City: "",
                          },
                          () => {
                            this.resetMap();
                          },
                        );
                        this.resetValue();
                      }}
                    >
                      <h6> Search based on Region </h6>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <div
                      className={`filter-collapse-Body search-region  ${
                        collapse2 ? "show" : "hide"
                      }`}
                    >
                      <div className="filter-body">
                        {/* <div className="search-element">
                          <label>Search</label>
                          <div className="down-arrow black-search ">
                            <Multiselect
                              onSearch={(e) => {
                                this.searcchForCity(e);
                              }}
                              onSelect={(e) => {
                                this.onSearchStateSelected(e);
                              }}
                              onRemove={(e) => {
                                this.onSearchStateRemoved(e);
                              }}
                              displayValue="name"
                              placeholder="Search"
                              options={searchCityData}
                              selectionLimit={1}
                              disable={true}
                            />
                          </div>
                        </div> */}
                        <div className="search-element">
                          <label>
                            State <span>*</span>
                          </label>
                          <div className="down-arrow">
                            <select
                              value={case2State}
                              onChange={(e) => {
                                this.getCase2SelectState(e);
                              }}
                            >
                              <option value="NaN" label="Select" />
                              {searchStatename !== "" ? (
                                <option
                                  value={searchStateid}
                                  label={searchStatename}
                                />
                              ) : null}
                              {stateData.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.id}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            {isFetchingState ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div>

                        <div className="search-element">
                          <label>
                            City <span>*</span>
                          </label>
                          <div className="down-arrow">
                            <select
                              value={case2City}
                              onChange={(e) => {
                                this.getCase2City(e);
                              }}
                            >
                              <option value="NaN" label="Select" />
                              {searchCityname !== "" ? (
                                <option
                                  value={searchCityid}
                                  label={searchCityname}
                                />
                              ) : null}
                              {cityNameData.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.id}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            {isFetchingCity ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div>

                        <div className="switch-btn">
                          <div className="search-element case2-sec ">
                            <label> Grid </label>
                            <BootstrapSwitchButton
                              checked={gridShowHide}
                              value={gridShowHide}
                              onlabel="Off"
                              onstyle="danger"
                              offlabel="On"
                              offstyle="success"
                              style="w-30 mx-2"
                              onChange={(grid) => {
                                this.gridOff(grid);
                              }}
                            />
                          </div>

                          <div className="search-element case2-sec ">
                            <label> Rate {propertyAppraiseRate} </label>
                            <BootstrapSwitchButton
                              checked={propertyAppraiseRate}
                              value={propertyAppraiseRate}
                              onlabel="Off"
                              onstyle="danger"
                              offlabel="On"
                              offstyle="success"
                              style="w-10 mx-2"
                              onChange={(pgrid) => {
                                this.props.proprtyAppraiseRateCallBack(pgrid);
                              }}
                            />
                          </div>
                        </div>
                        {/* <div className="search-element">
                          <label>Zone</label>
                          <div className="down-arrow">
                            <select
                              value={case2Zone}
                              onChange={(e) => {
                                this.getCase2Zone(e);
                              }}
                            >
                              <option value="NaN" label="Select" />

                              {zoneByCityBarDataArr.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.name}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            {isFetchingZone ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div> */}

                        <div className="search-element">
                          <label>Pincode </label>
                          <div className="down-arrow">
                            <select
                              value={case2Locality}
                              onChange={(e) => {
                                this.getCase2Locality(e);
                              }}
                              disabled={isEmpty(barData)}
                            >
                              <option value="NaN" label="Select" />
                              {barData.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.name}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            {isFetchingLocal ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div>

                        <div className="search-element drop-up">
                          <label>
                            Category Type
                            <span className="manditary">*</span>
                            <span>
                              <h6>Multiple Selection Enabled</h6>
                              <img
                                src={require("../../assets/images/icons.png")}
                                alt="icon"
                              />
                            </span>
                          </label>
                          <div className="down-arrow">
                            {/* <Multiselect
                              onSelect={(e) => {
                                this.case2CategorySelect(e);
                              }}
                              onRemove={(e) => {
                                this.case2CategoryRemove(e);
                              }}
                              options={categoryTypeStateCityData}
                              displayValue="name"
                              value={case2CategoryTypeSelected}
                              ref={this.categoryCase2Type}
                              disable={multipleSelectStatus}
                            /> */}
                            <select
                              value={case2CategoryTypeSelected}
                              onChange={(e) => {
                                this.case2CategorySelect(e);
                              }}
                              disabled={isEmpty(categoryTypeStateCityData)}
                            >
                              <option value="NaN" label="Select" />
                              {categoryTypeStateCityData.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.name}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            <img
                              src={require("../../assets/images/down-arrow.png")}
                              alt="down-arroe"
                            />
                            {isFetchingCatestate ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div>

                        {(() => {
                          if (case2CategoryId === "1") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyByCityData}
                                      displayValue="name"
                                      value={case2PropertyId}
                                      onSelect={(e) => {
                                        this.case2PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case2PropertyRemove(e);
                                      }}
                                      ref={this.propertCase2type1}
                                      disable={multipleSelectStatus}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingPropertyByCity ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="search-element">
                                  <label>
                                    Unit Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={unitTypeByCityData}
                                      displayValue="name"
                                      value={case2UnitType}
                                      onSelect={(e) => {
                                        this.case2UnitTypeSelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case2UnitTypeRemove(e);
                                      }}
                                      ref={this.unitTypeCase2Type1}
                                      disable={multipleSelectStatus}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingUnitTypeByCity ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="search-element">
                                  <label>
                                    Property Entered On
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="calender">
                                    <div className="down-arrow calender-width">
                                      <Multiselect
                                        options={yearByCityData}
                                        displayValue="name"
                                        placeholder="Year"
                                        value={case2Year}
                                        onSelect={(e) => {
                                          this.case2YearSelect(e);
                                        }}
                                        onRemove={(e) => {
                                          this.case2YearRemove(e);
                                        }}
                                        ref={this.yearCae2Type1}
                                        disable={multipleSelectStatus}
                                      />
                                      <img
                                        src={require("../../assets/images/down-arrow.png")}
                                        alt="month"
                                      />
                                      {isFetchingYearByCity ? (
                                        <div className="loader-cate"></div>
                                      ) : null}
                                    </div>
                                    <div className="down-arrow calender-width">
                                      <Multiselect
                                        options={monthByCityData}
                                        displayValue="name"
                                        placeholder="Month"
                                        value={case2Month}
                                        onSelect={(e) => {
                                          this.case2MonthSelect(e);
                                        }}
                                        onRemove={(e) => {
                                          this.case2MonthRemove(e);
                                        }}
                                        ref={this.monthCase2Type1}
                                        disable={multipleSelectStatus}
                                      />
                                      <img
                                        src={require("../../assets/images/down-arrow.png")}
                                        alt="month"
                                      />
                                      {isFetchingMonthByCity ? (
                                        <div className="loader-cate"></div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                                <div className="search-element case2-sec ">
                                  <label> Set Age </label>
                                  <BootstrapSwitchButton
                                    checked={individualSetAge}
                                    value={individualSetAge}
                                    onlabel="Off"
                                    onstyle="danger"
                                    offlabel="On"
                                    offstyle="success"
                                    style="w-10 mx-2"
                                    onChange={(ageVal) => {
                                      this.setAge2(ageVal);
                                    }}
                                  />
                                </div>

                                {showAge2 && (
                                  <div className="search-element ">
                                    <label>Property Age</label>
                                    <div className="view-value">
                                      {/* <span>
                                      {minCase2Age} - {maxCase2Age}
                                    </span> */}
                                      <Form.Control
                                        value={minCase2Age}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase2Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase2Age}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase2Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>

                                    <Range
                                      marks={{
                                        [minBoundCase2Age]: "0",
                                        [maxBoundCase2Age]: "100",
                                      }}
                                      step={1}
                                      min={minBoundCase2Age}
                                      max={maxBoundCase2Age}
                                      allowCross={false}
                                      value={[minCase2Age, maxCase2Age]}
                                      onChange={this.handleCase2Age}
                                    />
                                  </div>
                                )}
                                <div className="search-element case2-sec ">
                                  <label> Set Rate </label>
                                  <BootstrapSwitchButton
                                    checked={individualSetRate}
                                    value={individualSetRate}
                                    onlabel="Off"
                                    onstyle="danger"
                                    offlabel="On"
                                    offstyle="success"
                                    style="w-10 mx-2"
                                    onChange={(rateVal) => {
                                      this.setRate2(rateVal);
                                    }}
                                  />
                                </div>
                                {showRate2 && (
                                  <div>
                                    <div className="search-element">
                                      <label>Land Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {minCase2} - ₹ {maxCase2}
                                    </span> */}
                                        <Form.Control
                                          value={minLandRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              minLandRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxLandRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              maxLandRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundLand2]: "0",
                                          [maxBoundLand2]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundLand2}
                                        max={maxBoundLand2}
                                        allowCross={false}
                                        value={[minLandRate2, maxLandRate2]}
                                        onChange={this.handleCaseLand2}
                                      />
                                    </div>
                                    <div className="search-element">
                                      <label>Sellable Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {minCase2} - ₹ {maxCase2}
                                    </span> */}
                                        <Form.Control
                                          value={minSellableRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              minSellableRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxSellableRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              maxSellableRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundSellable2]: "0",
                                          [maxBoundSellable2]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundSellable2}
                                        max={maxBoundSellable2}
                                        allowCross={false}
                                        value={[
                                          minSellableRate2,
                                          maxSellableRate2,
                                        ]}
                                        onChange={this.handleCaseSellable2}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (case2CategoryId === "2") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  {/* propertyType */}
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyByCityData}
                                      displayValue="name"
                                      value={case2PropertyId}
                                      onSelect={(e) => {
                                        this.case2PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case2PropertyRemove(e);
                                      }}
                                      ref={this.propertCase2type1}
                                      disable={multipleSelectStatus}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingPropertyByCity ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                {case2CategoryTypeSelected !== "LVT" && (
                                  <>
                                    <div className="search-element">
                                      <label>
                                        Unit Type
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="down-arrow">
                                        <Multiselect
                                          options={unitTypeByCityData}
                                          displayValue="name"
                                          value={case2UnitType}
                                          onSelect={(e) => {
                                            this.case2UnitTypeSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case2UnitTypeRemove(e);
                                          }}
                                          ref={this.unitTypeCase2Type1}
                                          disable={multipleSelectStatus}
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="down-arroe"
                                        />
                                        {isFetchingUnitTypeByCity ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>
                                    {case2CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <div className="search-element">
                                        <label>
                                          Approval Number
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow">
                                          <Multiselect
                                            options={approvalByCityData}
                                            displayValue="name"
                                            value={case2ApprovalName}
                                            onSelect={(e) => {
                                              this.case2ApprovalSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case2ApprovalRemove(e);
                                            }}
                                            ref={this.approvalCase2}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingApprovalByCity ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>
                                    )}
                                    {case2CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <div className="search-element">
                                        <label>
                                          Project Name
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow project-name">
                                          <Multiselect
                                            options={projectNameData}
                                            displayValue="name"
                                            value={case2Project}
                                            onSelect={(e) => {
                                              this.case2ProjectSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case2ProjectRemove(e);
                                            }}
                                            ref={this.projectCase2}
                                            disable={multipleSelectStatus}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingProjectNameByCity ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>
                                    )}
                                    {case2CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <div className="search-element">
                                        <label>
                                          Builder Groups
                                          <span>
                                            <h6>Multiple Selection Enabled</h6>
                                            <img
                                              src={require("../../assets/images/icons.png")}
                                              alt="icon"
                                            />
                                          </span>
                                        </label>
                                        <div className="down-arrow bulider-sec">
                                          <Multiselect
                                            options={builderData}
                                            displayValue="name"
                                            value={case2Builder}
                                            onSelect={(e) => {
                                              this.case2BuilderSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case2BuilderRemove(e);
                                            }}
                                            ref={this.builderCas2}
                                            disable={multipleSelectStatus}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="down-arroe"
                                          />
                                          {isFetchingBuliderByCity ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>
                                    )}
                                    {case2CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <>
                                        <div className="search-element">
                                          <label>
                                            Property Entered On
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="calender">
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={yearByCityData}
                                                displayValue="name"
                                                placeholder="Year"
                                                value={case2Year}
                                                onSelect={(e) => {
                                                  this.case2YearSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case2YearRemove(e);
                                                }}
                                                ref={this.yearCae2Type1}
                                                disable={multipleSelectStatus}
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingYearByCity ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={monthByCityData}
                                                displayValue="name"
                                                placeholder="Month"
                                                value={case2Month}
                                                onSelect={(e) => {
                                                  this.case2MonthSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case2MonthRemove(e);
                                                }}
                                                ref={this.monthCase2Type1}
                                                disable={multipleSelectStatus}
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingMonthByCity ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="search-element">
                                          <label>Completed (%)</label>
                                          <div className="view-value">
                                            {/* <span>
                                      {minCase2Percent} - {maxCase2Percent}
                                    </span> */}
                                            <Form.Control
                                              value={minCase2Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase2Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase2Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase2Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>
                                          <Range
                                            marks={{
                                              [minBoundCase2Percent]: `${minBoundCase2Percent}`,
                                              [maxBoundCase2Percent]: `${maxBoundCase2Percent}`,
                                            }}
                                            step={1}
                                            min={minBoundCase2Percent}
                                            max={maxBoundCase2Percent}
                                            allowCross={false}
                                            value={[
                                              minCase2Percent,
                                              maxCase2Percent,
                                            ]}
                                            onChange={this.handleCase2Percent}
                                          />
                                        </div>
                                      </>
                                    )}
                                    {case2CategoryTypeSelected === "CRFG"
                                      ? null
                                      : case2CategoryTypeSelected !==
                                          "MARKET TRANSACTION" && (
                                          <div className="search-element case2-sec ">
                                            <label> Set Number Of Units </label>
                                            <BootstrapSwitchButton
                                              checked={projectSetNumber}
                                              value={projectSetNumber}
                                              onlabel="Off"
                                              onstyle="danger"
                                              offlabel="On"
                                              offstyle="success"
                                              style="w-10 mx-2"
                                              onChange={(unitVal) => {
                                                this.setUnits2(unitVal);
                                              }}
                                            />
                                          </div>
                                        )}
                                    {showUnits2 && (
                                      <div className="search-element">
                                        <label>Number Of Units</label>

                                        <div className="view-value">
                                          {/* <span>
                                      {minCase2Unit} - {maxCase2Unit}
                                    </span> */}
                                          <Form.Control
                                            value={minCase2Unit}
                                            onChange={(e) => {
                                              this.setState({
                                                minCase2Unit: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="min"
                                          />
                                          <Form.Control
                                            value={maxCase2Unit}
                                            onChange={(e) => {
                                              this.setState({
                                                maxCase2Unit: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="max"
                                          />
                                        </div>
                                        <Range
                                          marks={{
                                            [minBoundCase2Unit]: "0",
                                            [maxBoundCase2Unit]: "5000",
                                          }}
                                          step={100}
                                          min={minBoundCase2Unit}
                                          max={maxBoundCase2Unit}
                                          allowCross={false}
                                          value={[minCase2Unit, maxCase2Unit]}
                                          onChange={this.handleCase2Unit}
                                        />
                                      </div>
                                    )}
                                    {case2CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <div className="search-element case2-sec ">
                                        <label> Set Rate </label>
                                        <BootstrapSwitchButton
                                          checked={projectSetRate}
                                          value={projectSetRate}
                                          onlabel="Off"
                                          onstyle="danger"
                                          offlabel="On"
                                          offstyle="success"
                                          style="w-10 mx-2"
                                          onChange={(rateVal) => {
                                            this.setAppRate2(rateVal);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {showAppRate2 && (
                                      <div className="search-element">
                                        <label>Appraised Rate Limit</label>
                                        <div className="view-value">
                                          {/* <span>
                                      ₹ {minCase2} - ₹ {maxCase2}
                                    </span> */}
                                          <Form.Control
                                            value={minAppRate2}
                                            onChange={(e) => {
                                              this.setState({
                                                minAppRate2: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="min"
                                          />
                                          <Form.Control
                                            value={maxAppRate2}
                                            onChange={(e) => {
                                              this.setState({
                                                maxAppRate2: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="max"
                                          />
                                        </div>
                                        <Range
                                          marks={{
                                            [minBoundApp2]: "0",
                                            [maxBoundApp2]: "100000",
                                          }}
                                          step={1000}
                                          min={minBoundApp2}
                                          max={maxBoundApp2}
                                          allowCross={false}
                                          value={[minAppRate2, maxAppRate2]}
                                          onChange={this.handleCaseApp2}
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          } else if (case2CategoryId === "3") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  {/* propertyType */}
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyByCityData}
                                      displayValue="name"
                                      value={case2PropertyId}
                                      onSelect={(e) => {
                                        this.case2PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case2PropertyRemove(e);
                                      }}
                                      ref={this.propertCase2type1}
                                      disable={multipleSelectStatus}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingPropertyByCity ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="search-element">
                                  <label>
                                    Unit Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={unitTypeByCityData}
                                      displayValue="name"
                                      value={case2UnitType}
                                      onSelect={(e) => {
                                        this.case2UnitTypeSelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case2UnitTypeRemove(e);
                                      }}
                                      ref={this.unitTypeCase2Type1}
                                      disable={multipleSelectStatus}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingUnitTypeByCity ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element">
                                    <label>
                                      Approval Number
                                      <span>
                                        <h6>Multiple Selection Enabled</h6>
                                        <img
                                          src={require("../../assets/images/icons.png")}
                                          alt="icon"
                                        />
                                      </span>
                                    </label>
                                    <div className="down-arrow">
                                      <Multiselect
                                        options={approvalByCityData}
                                        displayValue="name"
                                        value={case2ApprovalName}
                                        onSelect={(e) => {
                                          this.case2ApprovalSelect(e);
                                        }}
                                        onRemove={(e) => {
                                          this.case2ApprovalRemove(e);
                                        }}
                                        ref={this.approvalCase2}
                                      />
                                      <img
                                        src={require("../../assets/images/down-arrow.png")}
                                        alt="down-arroe"
                                      />
                                      {isFetchingApprovalByCity ? (
                                        <div className="loader-cate"></div>
                                      ) : null}
                                    </div>
                                  </div>
                                )}

                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element">
                                    <label>
                                      Project Name
                                      <span>
                                        <h6>Multiple Selection Enabled</h6>
                                        <img
                                          src={require("../../assets/images/icons.png")}
                                          alt="icon"
                                        />
                                      </span>
                                    </label>
                                    <div className="down-arrow project-name">
                                      <Multiselect
                                        options={projectNameData}
                                        displayValue="name"
                                        value={case2Project}
                                        onSelect={(e) => {
                                          this.case2ProjectSelect(e);
                                        }}
                                        onRemove={(e) => {
                                          this.case2ProjectRemove(e);
                                        }}
                                        ref={this.projectCase2}
                                        disable={multipleSelectStatus}
                                      />
                                      <img
                                        src={require("../../assets/images/down-arrow.png")}
                                        alt="down-arroe"
                                      />
                                      {isFetchingProjectNameByCity ? (
                                        <div className="loader-cate"></div>
                                      ) : null}
                                    </div>
                                  </div>
                                )}

                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element">
                                    <label>
                                      Builder Groups
                                      <span>
                                        <h6>Multiple Selection Enabled</h6>
                                        <img
                                          src={require("../../assets/images/icons.png")}
                                          alt="icon"
                                        />
                                      </span>
                                    </label>
                                    <div className="down-arrow bulider-sec">
                                      <Multiselect
                                        options={builderData}
                                        displayValue="name"
                                        value={case2Builder}
                                        onSelect={(e) => {
                                          this.case2BuilderSelect(e);
                                        }}
                                        onRemove={(e) => {
                                          this.case2BuilderRemove(e);
                                        }}
                                        ref={this.builderCas2}
                                        disable={multipleSelectStatus}
                                      />
                                      <img
                                        src={require("../../assets/images/down-arrow.png")}
                                        alt="down-arroe"
                                      />
                                      {isFetchingBuliderByCity ? (
                                        <div className="loader-cate"></div>
                                      ) : null}
                                    </div>
                                  </div>
                                )}

                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element">
                                    <label>
                                      Property Entered On
                                      <span>
                                        <h6>Multiple Selection Enabled</h6>
                                        <img
                                          src={require("../../assets/images/icons.png")}
                                          alt="icon"
                                        />
                                      </span>
                                    </label>
                                    <div className="calender">
                                      <div className="down-arrow calender-width">
                                        <Multiselect
                                          options={yearByCityData}
                                          displayValue="name"
                                          placeholder="Year"
                                          value={case2Year}
                                          onSelect={(e) => {
                                            this.case2YearSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case2YearRemove(e);
                                          }}
                                          ref={this.yearCae2Type1}
                                          disable={multipleSelectStatus}
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="month"
                                        />
                                        {isFetchingYearByCity ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                      <div className="down-arrow calender-width">
                                        <Multiselect
                                          options={monthByCityData}
                                          displayValue="name"
                                          placeholder="Month"
                                          value={case2Month}
                                          onSelect={(e) => {
                                            this.case2MonthSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case2MonthRemove(e);
                                          }}
                                          ref={this.monthCase2Type1}
                                          disable={multipleSelectStatus}
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="month"
                                        />
                                        {isFetchingMonthByCity ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element">
                                    <label>Completed (%)</label>
                                    <div className="view-value">
                                      {/* <span>
                                        {minCase2Percent} - {maxCase2Percent}
                                      </span> */}
                                      <Form.Control
                                        value={minCase2Percent}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase2Percent: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase2Percent}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase2Percent: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>
                                    <Range
                                      marks={{
                                        [minBoundCase2Percent]: `${minBoundCase2Percent}`,
                                        [maxBoundCase2Percent]: `${maxBoundCase2Percent}`,
                                      }}
                                      step={1}
                                      min={minBoundCase2Percent}
                                      max={maxBoundCase2Percent}
                                      allowCross={false}
                                      value={[minCase2Percent, maxCase2Percent]}
                                      onChange={this.handleCase2Percent}
                                    />
                                  </div>
                                )}
                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element case2-sec ">
                                    <label> Set Number Of Units </label>
                                    <BootstrapSwitchButton
                                      checked={individualProjSetNumber}
                                      value={individualProjSetNumber}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(unitVal) => {
                                        this.setUnits2("idpr", unitVal);
                                      }}
                                    />
                                  </div>
                                )}
                                {showUnits2 && (
                                  <div className="search-element">
                                    <label>Number Of Units</label>

                                    <div className="view-value">
                                      {/* <span>
                                        {minCase2Unit} - {maxCase2Unit}
                                      </span> */}
                                      <Form.Control
                                        value={minCase2Unit}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase2Unit: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase2Unit}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase2Unit: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>
                                    <Range
                                      marks={{
                                        [minBoundCase2Unit]: "0",
                                        [maxBoundCase2Unit]: "5000",
                                      }}
                                      step={100}
                                      min={minBoundCase2Unit}
                                      max={maxBoundCase2Unit}
                                      allowCross={false}
                                      value={[minCase2Unit, maxCase2Unit]}
                                      onChange={this.handleCase2Unit}
                                    />
                                  </div>
                                )}
                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element case2-sec ">
                                    <label> Set Age </label>
                                    <BootstrapSwitchButton
                                      checked={individualProjSetAge}
                                      value={individualProjSetAge}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(ageVal) => {
                                        this.setAge2("iPSA", ageVal);
                                      }}
                                    />
                                  </div>
                                )}
                                {showAge2 && (
                                  <div className="search-element ">
                                    <label>Property Age</label>
                                    <div className="view-value">
                                      {/* <span>
                                      {minCase2Age} - {maxCase2Age}
                                    </span> */}
                                      <Form.Control
                                        value={minCase2Age}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase2Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase2Age}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase2Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>

                                    <Range
                                      marks={{
                                        [minBoundCase2Age]: "0",
                                        [maxBoundCase2Age]: "100",
                                      }}
                                      step={1}
                                      min={minBoundCase2Age}
                                      max={maxBoundCase2Age}
                                      allowCross={false}
                                      value={[minCase2Age, maxCase2Age]}
                                      onChange={this.handleCase2Age}
                                    />
                                  </div>
                                )}
                                {case2CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element case2-sec ">
                                    <label> Set Rate </label>
                                    <BootstrapSwitchButton
                                      checked={individualProjSetRate}
                                      value={individualProjSetRate}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(rateVal) => {
                                        this.setAppRate2("ipsr", rateVal);
                                        this.setRate2("ipsr", rateVal);
                                      }}
                                    />
                                  </div>
                                )}
                                {showAppRate2 && (
                                  <>
                                    <div className="search-element">
                                      <label>Appraised Rate Limit</label>
                                      <div className="view-value">
                                        <Form.Control
                                          value={minAppRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              minAppRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxAppRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              maxAppRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundApp2]: "0",
                                          [maxBoundApp2]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundApp2}
                                        max={maxBoundApp2}
                                        allowCross={false}
                                        value={[minAppRate2, maxAppRate2]}
                                        onChange={this.handleCaseApp2}
                                      />
                                    </div>

                                    <div className="search-element">
                                      <label>Land Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {minCase2} - ₹ {maxCase2}
                                    </span> */}
                                        <Form.Control
                                          value={minLandRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              minLandRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxLandRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              maxLandRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundLand2]: "0",
                                          [maxBoundLand2]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundLand2}
                                        max={maxBoundLand2}
                                        allowCross={false}
                                        value={[minLandRate2, maxLandRate2]}
                                        onChange={this.handleCaseLand2}
                                      />
                                    </div>
                                    <div className="search-element">
                                      <label>Sellable Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {minCase2} - ₹ {maxCase2}
                                    </span> */}
                                        <Form.Control
                                          value={minSellableRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              minSellableRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxSellableRate2}
                                          onChange={(e) => {
                                            this.setState({
                                              maxSellableRate2: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundSellable2]: "0",
                                          [maxBoundSellable2]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundSellable2}
                                        max={maxBoundSellable2}
                                        allowCross={false}
                                        value={[
                                          minSellableRate2,
                                          maxSellableRate2,
                                        ]}
                                        onChange={this.handleCaseSellable2}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          }
                        })()}

                        <div className="filter-Button">
                          <button
                            onClick={() => {
                              this.resetValue();
                            }}
                            className="report"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => {
                              this.validationCase2();
                            }}
                          >
                            {/* {case2Loader ? (
                              <div className="loader"></div>
                            ) : null} */}
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Collapse>
                </div>
              </Card>
              {/* Search based on Coordinate */}
              <Card>
                <div className="filter-collape">
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="0"
                  >
                    <div
                      className="filter-collapse-heading"
                      onClick={() => {
                        this.setState(
                          {
                            collapse1: !collapse1,
                            collapse3: false,
                            collapse2: false,
                            collapse4: false,
                            radius: 0,
                            longitude: "",
                            latitude: "",
                            urlString: "",
                            updateFilter: false,
                            gridShowHide: true,
                          },
                          () => {
                            this.resetMap();
                          },
                        );
                        this.resetValue();
                        // this.props.resizeMapData();
                      }}
                    >
                      <h6> Search based on Coordinate </h6>
                    </div>
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey="0">
                    <div
                      className={`filter-collapse-Body  maxHeightCoordinates`}
                    >
                      <div className="filter-body">
                        <div className="search-element">
                          <label>
                            Latitude <span>*</span>
                          </label>
                          <Form.Control
                            value={latitude}
                            onChange={(e) => {
                              this.getCase1Latitude(e);
                            }}
                            type="text"
                            placeholder="latitude"
                            maxLength="8"
                          />
                        </div>

                        <div className="search-element">
                          <label>
                            Longitude <span>*</span>
                          </label>
                          <Form.Control
                            value={longitude}
                            onChange={(e) => {
                              this.getCase1Longitude(e);
                            }}
                            type="text"
                            placeholder="longitude"
                            maxLength="8"
                          />
                        </div>

                        <div className="search-element margin-btn-40 ">
                          <label>
                            Circle of Reference (km) <span>*</span>
                          </label>
                          {/* <div className="view-value">
                            <span>{radius} </span>
                          </div> */}
                          <Slider
                            min={0}
                            max={7}
                            step={1}
                            onChange={(e) => {
                              this.getCase1Radius(e);
                            }}
                            onChangeComplete={() => {
                              if (radiusState) {
                                this.getCas1Cerdential();
                              }
                            }}
                            value={radius}
                            labels={horizontalLabels}
                          />
                        </div>

                        <div className="search-element drop-up">
                          <label>
                            Category Type <span className="manditary">*</span>
                            <span>
                              <h6>Multiple Selection Enabled</h6>
                              <img
                                src={require("../../assets/images/icons.png")}
                                alt="icon"
                              />
                            </span>
                          </label>
                          <div className="down-arrow">
                            {/* <Multiselect
                              options={categoryTypeData}
                              onSelect={(e) => {
                                this.case1CategorySelect(e);
                              }}
                              onRemove={(e) => {
                                this.case1CategoryRemove(e);
                              }}
                              value={case1CategoryTypeSelected}
                              displayValue="name"
                              ref={this.case1Category1}
                              disable={categoryTypeData.length === 0}
                            /> */}
                            <select
                              value={case1CategoryTypeSelected}
                              onChange={(e) => {
                                this.case1CategorySelect(e);
                              }}
                              disable={
                                Boolean(isEmpty(categoryTypeData)) ||
                                isEmpty(longitude)
                              }
                            >
                              <option value="NaN" label="Select" />
                              {categoryTypeData.map((data, key) => {
                                return (
                                  <option
                                    key={data.id}
                                    value={data.name}
                                    label={data.name}
                                  />
                                );
                              })}
                            </select>
                            <img
                              src={require("../../assets/images/down-arrow.png")}
                              alt="down-arroe"
                            />
                            {isFetchingCategory ? (
                              <div className="loader-cate"></div>
                            ) : null}
                          </div>
                        </div>

                        {(() => {
                          if (case1CategoryId === "1") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyData}
                                      onSelect={(e) => {
                                        this.case1PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case1PropertyRemove(e);
                                      }}
                                      displayValue="name"
                                      value={case1PropertyId}
                                      ref={this.propertCase1type1}
                                      disable={propertyData.length === 0}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingProperty ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="search-element">
                                  <label>
                                    Unit Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={unitTypeData}
                                      onSelect={(e) => {
                                        this.case1UnitTypeSelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case1UnitTypeRemove(e);
                                      }}
                                      displayValue="name"
                                      value={case1UnitType}
                                      ref={this.unitTypeCase1Type1}
                                      disable={unitTypeData.length === 0}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="month"
                                    />
                                    {isFetchingUnitType ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                {case1CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <>
                                    <div className="search-element">
                                      <label>
                                        Property Entered On
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="calender">
                                        <div className="down-arrow calender-width">
                                          <Multiselect
                                            options={yearByLatLonData}
                                            displayValue="name"
                                            placeholder="Year"
                                            value={case1Year}
                                            onSelect={(e) => {
                                              this.case1YearSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1YearRemove(e);
                                            }}
                                            ref={this.yearCae1Type1}
                                            disable={
                                              yearByLatLonData.length === 0
                                            }
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="month"
                                          />
                                          {isFetchingYearByLatLon ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                        <div className="down-arrow calender-width">
                                          <Multiselect
                                            options={monthData}
                                            displayValue="name"
                                            placeholder="Month"
                                            value={case1Month}
                                            onSelect={(e) => {
                                              this.case1MonthSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1MonthRemove(e);
                                            }}
                                            ref={this.monthCase1Type1}
                                            disable={monthData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="month"
                                          />
                                          {isFetchingMonthByLatLong ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="search-element case2-sec ">
                                      <label> Set Age </label>
                                      <BootstrapSwitchButton
                                        checked={cIndividualSetAge}
                                        value={cIndividualSetAge}
                                        onlabel="Off"
                                        onstyle="danger"
                                        offlabel="On"
                                        offstyle="success"
                                        style="w-10 mx-2"
                                        onChange={(ageVal) => {
                                          this.setAge1(ageVal);
                                        }}
                                      />
                                    </div>
                                  </>
                                )}

                                {showAge1 && (
                                  <div className="search-element ">
                                    <label>Property Age</label>
                                    <div className="view-value">
                                      {/* <span>
                                      {minCase1Age} - {maxCase1Age}
                                    </span> */}
                                      <Form.Control
                                        value={minCase1Age}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase1Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase1Age}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase1Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>

                                    <Range
                                      marks={{
                                        [minBoundCase1Age]: "0",
                                        [maxBoundCase1Age]: "100",
                                      }}
                                      step={1}
                                      min={minBoundCase1Age}
                                      max={maxBoundCase1Age}
                                      allowCross={false}
                                      value={[minCase1Age, maxCase1Age]}
                                      onChange={this.handleCase1Age}
                                    />
                                  </div>
                                )}
                                {case1CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element case2-sec ">
                                    <label> Set Rate </label>
                                    <BootstrapSwitchButton
                                      checked={cIndividualSetRate}
                                      value={cIndividualSetRate}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(rateVal) => {
                                        this.setRate1(rateVal);
                                      }}
                                    />
                                  </div>
                                )}
                                {showRate1 && (
                                  <div>
                                    <div className="search-element">
                                      <label> Land Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                        <Form.Control
                                          value={minLandRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              minLandRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxLandRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              maxLandRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundLand1]: "0",
                                          [maxBoundLand1]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundLand1}
                                        max={maxBoundLand1}
                                        allowCross={false}
                                        value={[minLandRate1, maxLandRate1]}
                                        onChange={this.handleCaseLand1}
                                      />
                                    </div>
                                    <div className="search-element">
                                      <label> Sellable Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                        <Form.Control
                                          value={minSellableRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              minSellableRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxSellableRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              maxSellableRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundSellable1]: "0",
                                          [maxBoundSellable1]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundSellable1}
                                        max={maxBoundSellable1}
                                        allowCross={false}
                                        value={[
                                          minSellableRate1,
                                          maxSellableRate1,
                                        ]}
                                        onChange={this.handleCaseSellable1}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (case1CategoryId === "2") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyData}
                                      onSelect={(e) => {
                                        this.case1PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case1PropertyRemove(e);
                                      }}
                                      displayValue="name"
                                      value={case1PropertyId}
                                      ref={this.propertCase1type1}
                                      disable={propertyData.length === 0}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingProperty ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                {case1CategoryTypeSelected !== "LVT" && (
                                  <>
                                    <div className="search-element">
                                      <label>
                                        Unit Type
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="down-arrow">
                                        <Multiselect
                                          options={unitTypeData}
                                          onSelect={(e) => {
                                            this.case1UnitTypeSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case1UnitTypeRemove(e);
                                          }}
                                          displayValue="name"
                                          value={case1UnitType}
                                          ref={this.unitTypeCase1Type1}
                                          disable={unitTypeData.length === 0}
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="down-arroe"
                                        />
                                        {isFetchingUnitType ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>

                                    {case1CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <>
                                        <div className="search-element">
                                          <label>
                                            Approval Number
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow">
                                            <Multiselect
                                              options={approvalByLatLonData}
                                              displayValue="name"
                                              onSelect={(e) => {
                                                this.case1ApprovalSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1ApprovalRemove(e);
                                              }}
                                              value={case1ApprovalName}
                                              ref={this.approvalCase1}
                                              disable={
                                                approvalByLatLonData.length ===
                                                0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingApprovalByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>

                                        <div className="search-element">
                                          <label>
                                            Project Name
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow">
                                            <Multiselect
                                              options={projectByLatLonData}
                                              displayValue="name"
                                              onSelect={(e) => {
                                                this.case1ProjectSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1ProjectRemove(e);
                                              }}
                                              value={case1Project}
                                              ref={this.projectCase1}
                                              disable={
                                                projectByLatLonData.length === 0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingProjectByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>

                                        <div className="search-element">
                                          <label>
                                            Builder Groups
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="down-arrow bulider-sec">
                                            <Multiselect
                                              options={builderByLatLonData}
                                              displayValue="name"
                                              value={case1Builder}
                                              onSelect={(e) => {
                                                this.case1BuilderSelect(e);
                                              }}
                                              onRemove={(e) => {
                                                this.case1BuilderRemove(e);
                                              }}
                                              ref={this.builderCas1}
                                              disable={
                                                builderByLatLonData.length === 0
                                              }
                                            />
                                            <img
                                              src={require("../../assets/images/down-arrow.png")}
                                              alt="down-arroe"
                                            />
                                            {isFetchingBuilderByLatLon ? (
                                              <div className="loader-cate"></div>
                                            ) : null}
                                          </div>
                                        </div>

                                        <div className="search-element">
                                          <label>
                                            Property Entered On
                                            <span>
                                              <h6>
                                                Multiple Selection Enabled
                                              </h6>
                                              <img
                                                src={require("../../assets/images/icons.png")}
                                                alt="icon"
                                              />
                                            </span>
                                          </label>
                                          <div className="calender">
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={yearByLatLonData}
                                                displayValue="name"
                                                placeholder="Year"
                                                value={case1Year}
                                                onSelect={(e) => {
                                                  this.case1YearSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case1YearRemove(e);
                                                }}
                                                ref={this.yearCae1Type2}
                                                disable={
                                                  yearByLatLonData.length === 0
                                                }
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingYearByLatLon ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                            <div className="down-arrow calender-width">
                                              <Multiselect
                                                options={monthData}
                                                displayValue="name"
                                                placeholder="Month"
                                                value={case1Month}
                                                onSelect={(e) => {
                                                  this.case1MonthSelect(e);
                                                }}
                                                onRemove={(e) => {
                                                  this.case1MonthRemove(e);
                                                }}
                                                ref={this.monthCase1Type1}
                                                disable={monthData.length === 0}
                                              />
                                              <img
                                                src={require("../../assets/images/down-arrow.png")}
                                                alt="month"
                                              />
                                              {isFetchingMonthByLatLong ? (
                                                <div className="loader-cate"></div>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="search-element">
                                          <label>Completed (%)</label>
                                          <div className="view-value">
                                            {/* <span>
                                      {minCase1Percent} - {maxCase1Percent}
                                    </span> */}
                                            <Form.Control
                                              value={minCase1Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  minCase1Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="min"
                                            />
                                            <Form.Control
                                              value={maxCase1Percent}
                                              onChange={(e) => {
                                                this.setState({
                                                  maxCase1Percent: parseInt(
                                                    e.target.value,
                                                  ),
                                                });
                                              }}
                                              className="wid45"
                                              type="number"
                                              placeholder="max"
                                            />
                                          </div>
                                          <Range
                                            marks={{
                                              [minBoundCase1Percent]: "0",
                                              [maxBoundCase1Percent]: "100",
                                            }}
                                            step={1}
                                            min={minBoundCase1Percent}
                                            max={maxBoundCase1Percent}
                                            allowCross={false}
                                            value={[
                                              minCase1Percent,
                                              maxCase1Percent,
                                            ]}
                                            onChange={this.handleCase1Percent}
                                          />
                                        </div>
                                      </>
                                    )}
                                    {case1CategoryTypeSelected === "CRFG"
                                      ? null
                                      : case1CategoryTypeSelected !==
                                          "MARKET TRANSACTION" && (
                                          <div className="search-element case2-sec ">
                                            <label> Set Number Of Units </label>
                                            <BootstrapSwitchButton
                                              checked={cProjectSetNumber}
                                              value={cProjectSetNumber}
                                              onlabel="Off"
                                              onstyle="danger"
                                              offlabel="On"
                                              offstyle="success"
                                              style="w-10 mx-2"
                                              onChange={(unitVal) => {
                                                this.setUnits1(unitVal);
                                              }}
                                            />
                                          </div>
                                        )}
                                    {showUnits1 && (
                                      <div className="search-element">
                                        <label>Number Of Units</label>

                                        <div className="view-value">
                                          {/* <span>
                                      {minCase1Unit} - {maxCase1Unit}
                                    </span> */}
                                          <Form.Control
                                            value={minCase1Unit}
                                            onChange={(e) => {
                                              this.setState({
                                                minCase1Unit: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="min"
                                          />
                                          <Form.Control
                                            value={maxCase1Unit}
                                            onChange={(e) => {
                                              this.setState({
                                                maxCase1Unit: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="max"
                                          />
                                        </div>
                                        <Range
                                          marks={{
                                            [minBoundCase1Unit]: "0",
                                            [maxBoundCase1Unit]: "5000",
                                          }}
                                          step={100}
                                          min={minBoundCase1Unit}
                                          max={maxBoundCase1Unit}
                                          allowCross={false}
                                          value={[minCase1Unit, maxCase1Unit]}
                                          onChange={this.handleCase1Unit}
                                        />
                                      </div>
                                    )}
                                    {case1CategoryTypeSelected !==
                                      "MARKET TRANSACTION" && (
                                      <div className="search-element case2-sec ">
                                        <label> Set Rate</label>
                                        <BootstrapSwitchButton
                                          checked={cProjectSetRate}
                                          value={cProjectSetRate}
                                          onlabel="Off"
                                          onstyle="danger"
                                          offlabel="On"
                                          offstyle="success"
                                          style="w-10 mx-2"
                                          onChange={(rateVal) => {
                                            this.setAppRate1(rateVal);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {showAppRate1 && (
                                      <div className="search-element">
                                        <label>Appraised Rate Limit</label>
                                        <div className="view-value">
                                          {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                          <Form.Control
                                            value={minAppRate1}
                                            onChange={(e) => {
                                              this.setState({
                                                minAppRate1: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="min"
                                          />
                                          <Form.Control
                                            value={maxAppRate1}
                                            onChange={(e) => {
                                              this.setState({
                                                maxAppRate1: parseInt(
                                                  e.target.value,
                                                ),
                                              });
                                            }}
                                            className="wid45"
                                            type="number"
                                            placeholder="max"
                                          />
                                        </div>
                                        <Range
                                          marks={{
                                            [minBoundApp1]: "0",
                                            [maxBoundApp1]: "100000",
                                          }}
                                          step={1000}
                                          min={minBoundApp1}
                                          max={maxBoundApp1}
                                          allowCross={false}
                                          value={[minAppRate1, maxAppRate1]}
                                          onChange={this.handleCaseApp1}
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          } else if (case1CategoryId === "3") {
                            return (
                              <div>
                                <div className="search-element">
                                  <label>
                                    Property Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={propertyData}
                                      onSelect={(e) => {
                                        this.case1PropertySelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case1PropertyRemove(e);
                                      }}
                                      displayValue="name"
                                      value={case1PropertyId}
                                      ref={this.propertCase1type1}
                                      disable={propertyData.length === 0}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingProperty ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="search-element">
                                  <label>
                                    Unit Type
                                    <span>
                                      <h6>Multiple Selection Enabled</h6>
                                      <img
                                        src={require("../../assets/images/icons.png")}
                                        alt="icon"
                                      />
                                    </span>
                                  </label>
                                  <div className="down-arrow">
                                    <Multiselect
                                      options={unitTypeData}
                                      onSelect={(e) => {
                                        this.case1UnitTypeSelect(e);
                                      }}
                                      onRemove={(e) => {
                                        this.case1UnitTypeRemove(e);
                                      }}
                                      displayValue="name"
                                      value={case1UnitType}
                                      ref={this.unitTypeCase1Type1}
                                      disable={unitTypeData.length === 0}
                                    />
                                    <img
                                      src={require("../../assets/images/down-arrow.png")}
                                      alt="down-arroe"
                                    />
                                    {isFetchingUnitType ? (
                                      <div className="loader-cate"></div>
                                    ) : null}
                                  </div>
                                </div>

                                {case1CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <>
                                    <div className="search-element">
                                      <label>
                                        Approval Number
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="down-arrow">
                                        <Multiselect
                                          options={approvalByLatLonData}
                                          displayValue="name"
                                          onSelect={(e) => {
                                            this.case1ApprovalSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case1ApprovalRemove(e);
                                          }}
                                          value={case1ApprovalName}
                                          ref={this.approvalCase1}
                                          disable={
                                            approvalByLatLonData.length === 0
                                          }
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="down-arroe"
                                        />
                                        {isFetchingApprovalByLatLon ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>

                                    <div className="search-element">
                                      <label>
                                        Project Name
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="down-arrow">
                                        <Multiselect
                                          options={projectByLatLonData}
                                          displayValue="name"
                                          onSelect={(e) => {
                                            this.case1ProjectSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case1ProjectRemove(e);
                                          }}
                                          value={case1Project}
                                          ref={this.projectCase1}
                                          disable={
                                            projectByLatLonData.length === 0
                                          }
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="down-arroe"
                                        />
                                        {isFetchingProjectByLatLon ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>

                                    <div className="search-element">
                                      <label>
                                        Builder Groups
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="down-arrow bulider-sec">
                                        <Multiselect
                                          options={builderByLatLonData}
                                          displayValue="name"
                                          value={case1Builder}
                                          onSelect={(e) => {
                                            this.case1BuilderSelect(e);
                                          }}
                                          onRemove={(e) => {
                                            this.case1BuilderRemove(e);
                                          }}
                                          ref={this.builderCas1}
                                          disable={multipleSelectStatus}
                                        />
                                        <img
                                          src={require("../../assets/images/down-arrow.png")}
                                          alt="down-arroe"
                                        />
                                        {isFetchingBuilderByLatLon ? (
                                          <div className="loader-cate"></div>
                                        ) : null}
                                      </div>
                                    </div>

                                    <div className="search-element">
                                      <label>
                                        Property Entered On
                                        <span>
                                          <h6>Multiple Selection Enabled</h6>
                                          <img
                                            src={require("../../assets/images/icons.png")}
                                            alt="icon"
                                          />
                                        </span>
                                      </label>
                                      <div className="calender">
                                        <div className="down-arrow calender-width">
                                          <Multiselect
                                            options={yearByLatLonData}
                                            displayValue="name"
                                            placeholder="Year"
                                            value={case1Year}
                                            onSelect={(e) => {
                                              this.case1YearSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1YearRemove(e);
                                            }}
                                            ref={this.yearCae1Type2}
                                            disable={
                                              yearByLatLonData.length === 0
                                            }
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="month"
                                          />
                                          {isFetchingYearByLatLon ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                        <div className="down-arrow calender-width">
                                          <Multiselect
                                            options={monthData}
                                            displayValue="name"
                                            placeholder="Month"
                                            value={case1Month}
                                            onSelect={(e) => {
                                              this.case1MonthSelect(e);
                                            }}
                                            onRemove={(e) => {
                                              this.case1MonthRemove(e);
                                            }}
                                            ref={this.monthCase1Type1}
                                            disable={monthData.length === 0}
                                          />
                                          <img
                                            src={require("../../assets/images/down-arrow.png")}
                                            alt="month"
                                          />
                                          {isFetchingMonthByLatLong ? (
                                            <div className="loader-cate"></div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="search-element">
                                      <label>Completed (%)</label>
                                      <div className="view-value">
                                        {/* <span>
                                        {minCase1Percent} - {maxCase1Percent}
                                      </span> */}
                                        <Form.Control
                                          value={minCase1Percent}
                                          onChange={(e) => {
                                            this.setState({
                                              minCase1Percent: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxCase1Percent}
                                          onChange={(e) => {
                                            this.setState({
                                              maxCase1Percent: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundCase1Percent]: "0",
                                          [maxBoundCase1Percent]: "100",
                                        }}
                                        step={1}
                                        min={minBoundCase1Percent}
                                        max={maxBoundCase1Percent}
                                        allowCross={false}
                                        value={[
                                          minCase1Percent,
                                          maxCase1Percent,
                                        ]}
                                        onChange={this.handleCase1Percent}
                                      />
                                    </div>
                                    <div className="search-element case2-sec ">
                                      <label> Set Number Of Units </label>
                                      <BootstrapSwitchButton
                                        checked={cProjecIndividualtSetNumber}
                                        value={cProjecIndividualtSetNumber}
                                        onlabel="Off"
                                        onstyle="danger"
                                        offlabel="On"
                                        offstyle="success"
                                        style="w-10 mx-2"
                                        onChange={(unitVal) => {
                                          this.setUnits1(unitVal);
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                                {showUnits1 && (
                                  <div className="search-element">
                                    <label>Number Of Units</label>

                                    <div className="view-value">
                                      {/* <span>
                                        {minCase1Unit} - {maxCase1Unit}
                                      </span> */}
                                      <Form.Control
                                        value={minCase1Unit}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase1Unit: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase1Unit}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase1Unit: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>
                                    <Range
                                      marks={{
                                        [minBoundCase1Unit]: "0",
                                        [maxBoundCase1Unit]: "5000",
                                      }}
                                      step={100}
                                      min={minBoundCase1Unit}
                                      max={maxBoundCase1Unit}
                                      allowCross={false}
                                      value={[minCase1Unit, maxCase1Unit]}
                                      onChange={this.handleCase1Unit}
                                    />
                                  </div>
                                )}
                                {
                                  <div className="search-element case2-sec ">
                                    <label> Set Age </label>
                                    <BootstrapSwitchButton
                                      checked={cProjecIndividualSetAge}
                                      value={cProjecIndividualSetAge}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(ageVal) => {
                                        this.setAge1(ageVal);
                                      }}
                                    />
                                  </div>
                                }

                                {showAge1 && (
                                  <div className="search-element ">
                                    <label>Property Age</label>
                                    <div className="view-value">
                                      {/* <span>
                                      {minCase1Age} - {maxCase1Age}
                                    </span> */}
                                      <Form.Control
                                        value={minCase1Age}
                                        onChange={(e) => {
                                          this.setState({
                                            minCase1Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="min"
                                      />
                                      <Form.Control
                                        value={maxCase1Age}
                                        onChange={(e) => {
                                          this.setState({
                                            maxCase1Age: parseInt(
                                              e.target.value,
                                            ),
                                          });
                                        }}
                                        className="wid45"
                                        type="number"
                                        placeholder="max"
                                      />
                                    </div>

                                    <Range
                                      marks={{
                                        [minBoundCase1Age]: "0",
                                        [maxBoundCase1Age]: "100",
                                      }}
                                      step={1}
                                      min={minBoundCase1Age}
                                      max={maxBoundCase1Age}
                                      allowCross={false}
                                      value={[minCase1Age, maxCase1Age]}
                                      onChange={this.handleCase1Age}
                                    />
                                  </div>
                                )}
                                {case1CategoryTypeSelected !==
                                  "MARKET TRANSACTION" && (
                                  <div className="search-element case2-sec ">
                                    <label> Set Rate</label>
                                    <BootstrapSwitchButton
                                      checked={cProjectIndividualSetRate}
                                      value={cProjectIndividualSetRate}
                                      onlabel="Off"
                                      onstyle="danger"
                                      offlabel="On"
                                      offstyle="success"
                                      style="w-10 mx-2"
                                      onChange={(rateVal) => {
                                        this.setAppRate1(rateVal);
                                      }}
                                    />
                                  </div>
                                )}
                                {showAppRate1 && (
                                  <>
                                    <div className="search-element">
                                      <label>Appraised Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                        ₹ {min} - ₹ {max}
                                      </span> */}
                                        <Form.Control
                                          value={minAppRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              minAppRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxAppRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              maxAppRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundApp1]: "0",
                                          [maxBoundApp1]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundApp1}
                                        max={maxBoundApp1}
                                        allowCross={false}
                                        value={[minAppRate1, maxAppRate1]}
                                        onChange={this.handleCaseApp1}
                                      />
                                    </div>
                                    <div className="search-element">
                                      <label> Land Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                        <Form.Control
                                          value={minLandRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              minLandRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxLandRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              maxLandRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundLand1]: "0",
                                          [maxBoundLand1]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundLand1}
                                        max={maxBoundLand1}
                                        allowCross={false}
                                        value={[minLandRate1, maxLandRate1]}
                                        onChange={this.handleCaseLand1}
                                      />
                                    </div>
                                    <div className="search-element">
                                      <label> Sellable Rate Limit</label>
                                      <div className="view-value">
                                        {/* <span>
                                      ₹ {min} - ₹ {max}
                                    </span> */}
                                        <Form.Control
                                          value={minSellableRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              minSellableRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="min"
                                        />
                                        <Form.Control
                                          value={maxSellableRate1}
                                          onChange={(e) => {
                                            this.setState({
                                              maxSellableRate1: parseInt(
                                                e.target.value,
                                              ),
                                            });
                                          }}
                                          className="wid45"
                                          type="number"
                                          placeholder="max"
                                        />
                                      </div>
                                      <Range
                                        marks={{
                                          [minBoundSellable1]: "0",
                                          [maxBoundSellable1]: "100000",
                                        }}
                                        step={1000}
                                        min={minBoundSellable1}
                                        max={maxBoundSellable1}
                                        allowCross={false}
                                        value={[
                                          minSellableRate1,
                                          maxSellableRate1,
                                        ]}
                                        onChange={this.handleCaseSellable1}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          }
                        })()}

                        <div className="filter-Button">
                          <button
                            onClick={() => {
                              // this.closeModal();
                              this.resetValue();
                            }}
                            className="report"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => {
                              // this.showCase1();
                              this.validationCase1();
                            }}
                          >
                            {case1Loader ? (
                              <div className="loader"></div>
                            ) : null}
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Collapse>
                </div>
              </Card>



       
            </Accordion>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetchingState: state.getState.isFetchingState,
  isFetchingCity: state.getCityName.isFetchingCity,
  isFetchingCatestate: state.categoryTypeStateCity.isFetchingCatestate,
  isFetchingCategory: state.categoryType.isFetchingCategory,
  categoryTypeData: state.categoryType.categoryTypeData,
  isFetchingProperty: state.getProperty.isFetchingProperty,
  isFetchingUnitType: state.getUnitType.isFetchingUnitType,
  isFetchingApprovalByLatLon:
    state.getApprovalNoByLatLong.isFetchingApprovalByLatLon,
  isFetchingProjectByLatLon:
    state.getProjectNoByLatLong.isFetchingProjectByLatLon,
  isFetchingBuilderByLatLon:
    state.getBuilderByLatLong.isFetchingBuilderByLatLon,
  isFetchingUnitTypeByCity:
    state.getUnitByStateCityType.isFetchingUnitTypeByCity,
  isFetchingApprovalByCity: state.getApprovalNoByCity.isFetchingApprovalByCity,
  isFetchingBuliderByCity: state.getBuilder.isFetchingBuliderByCity,
  builderByLatLonData: state.getBuilderByLatLong.builderByLatLonData,
  approvalByLatLonData: state.getApprovalNoByLatLong.approvalByLatLonData,
  projectByLatLonData: state.getProjectNoByLatLong.projectByLatLonData,
  builderData: state.getBuilder.builderData,
  projectNameData: state.getProjectName.projectNameData,
  cityNameData: state.getCityName.cityNameData,
  propertyData: state.getProperty.propertyData,
  unitTypeData: state.getUnitType.unitTypeData,
  approvalByCityData: state.getApprovalNoByCity.approvalByCityData,
  categoryTypeStateCityData:
    state.categoryTypeStateCity.categoryTypeStateCityData,
  propertyByCityData: state.getPropertyByCity.propertyByCityData,
  unitTypeByCityData: state.getUnitByStateCityType.unitTypeByCityData,
  yearByLatLonData: state.getYearByLatLon.yearByLatLonData,
  yearByCityData: state.getYearByStateCity.yearByCityData,
  isFetchingYearByCity: state.getYearByStateCity.isFetchingYearByCity,
  monthByCityData: state.getMonthByCityType.monthByCityData,
  isFetchingMonthByCity: state.getMonthByCityType.isFetchingMonthByCity,
  monthData: state.getMonth.monthData,
  isFetchingMonthByLatLong: state.getMonth.isFetchingMonthByLatLong,
  completedByCityData: state.completedByCityType.completedByCityData,
  completedByLatLonData: state.completedByLatLon.completedByLatLonData,
  noOfUnitByCityData: state.noOfUnitByCity.noOfUnitByCityData,
  noOfUnitByLatLonData: state.noOfUnitByLatLon.noOfUnitByLatLonData,
  rateLimitByCityData: state.getRateLimitByCityType.rateLimitByCityData,
  searchCityData: state.searchCityUser.searchCityData,
  zoneByCityBarData: state.barByzone.zoneByCityBarData,
  isFetchingZone: state.barByzone.isFetchingZone,
  barData: state.barByLocality.barData,
  isFetchingLocal: state.barByLocality.isFetchingLocal,
  isFetchingProjectNameByCity: state.getProjectName.isFetchingProjectNameByCity,
  isFetchingYearByLatLon: state.getYearByLatLon.isFetchingYearByLatLon,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      categoryTypeUser: categoryTypeUser,
      categoryTypeStateCityUser: categoryTypeStateCityUser,
      builderUser: builderUser,
      projectNameUser: projectNameUser,
      cityUser: cityUser,
      propertyByLatLonUser: propertyByLatLonUser,
      unitTypeByLatLonUser: unitTypeByLatLonUser,
      builderByLatLonUser: builderByLatLonUser,
      approvalByLatLonUser: approvalByLatLonUser,
      projectByLatLonUser: projectByLatLonUser,
      getStateByRadiusUser: getStateByRadiusUser,
      agencyUser: agencyUser,
      propertyByCityUser: propertyByCityUser,
      approvalByCityUser: approvalByCityUser,
      getStateByRegionUser: getStateByRegionUser,
      unitTypeByStateCityUser: unitTypeByStateCityUser,
      yearByLatLonUser: yearByLatLonUser,
      yearByStateCityUser: yearByStateCityUser,
      resetStateByRegionUSer: resetStateByRegionUSer,
      resetStateByRadiusUSer: resetStateByRadiusUSer,
      resetgridUser: resetgridUser,
      monthByStateCityUser: monthByStateCityUser,
      resetunitTypeByStateCityUser: resetunitTypeByStateCityUser,
      monthByLatLonUser: monthByLatLonUser,
      completedByStateCityUser: completedByStateCityUser,
      completedByLatLonUser: completedByLatLonUser,
      noOfUnitByCityUser: noOfUnitByCityUser,
      noOfUnitByLatLonUser: noOfUnitByLatLonUser,
      rateLimitByStateCityUser: rateLimitByStateCityUser,
      searchCityUserAction: searchCityUserAction,
      barByZoneUser: barByZoneUser,
      barByLocalityUser: barByLocalityUser,
      resetpropertyByLatLonUser: resetpropertyByLatLonUser,
      resetunitTypeByLatLonUser: resetunitTypeByLatLonUser,
      resetbuilderByLatLonUser: resetbuilderByLatLonUser,
      resetapprovalByLatLonUser: resetapprovalByLatLonUser,
      resetprojectByLatLonUser: resetprojectByLatLonUser,
      resetpropertyByCityUser: resetpropertyByCityUser,
      resetapprovalByCityUser: resetapprovalByCityUser,
      categoryTypeResetUser: categoryTypeResetUser,
      resetyearByLatLonUser: resetyearByLatLonUser,
      resetyearByStateCityUser: resetyearByStateCityUser,
      resetmonthByStateCityUser: resetmonthByStateCityUser,
      resetcompletedByStateCityUser: resetcompletedByStateCityUser,
      resetmonthByLatLonUser: resetmonthByLatLonUser,
      resetcompletedByLatLonUser: resetcompletedByLatLonUser,
      resetnoOfUnitByCityUser: resetnoOfUnitByCityUser,
      resetnoOfUnitByLatLonUser: resetnoOfUnitByLatLonUser,
      resetrateLimitByStateCityUser: resetrateLimitByStateCityUser,
      resetsearchCityUserUser: resetsearchCityUserUser,
      resetbarByZoneUser: resetbarByZoneUser,
      resetbarByLocalityUser: resetbarByLocalityUser,
      resetagencyUser: resetagencyUser,
      getCategoryTypeResult: getCategoryTypeResult,
      getLocationByProperty: getLocationByProperty,
      getByReq: getByReq,
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
export default enhance(Filter);
