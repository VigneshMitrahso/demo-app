import {
  GET_PPIPINCODE_SUCCESS,
  GET_PPIPINCODE_REQUEST,
  GET_PPIPINCODE_FAILURE,
  RESET_PPIPINCODE_SUCCESS,
  GET_PPIPROPRTY_SUCCESS,
  GET_PPIPROPRTY_REQUEST,
  GET_PPIPROPRTY_FAILURE,
  RESET_PPIPROPRTY_SUCCESS,
  GET_PPIUNIT_FAILURE,
  GET_PPIUNIT_SUCCESS,
  GET_PPIUNIT_REQUEST,
  RESET_PPIUNIT_SUCCESS,
  GET_PPIAGE_FAILURE,
  GET_PPIAGE_SUCCESS,
  GET_PPIAGE_REQUEST,
  RESET_PPIAGE_SUCCESS,
  GET_PPIANALYTICS_FAILURE,
  GET_PPIANALYTICS_SUCCESS,
  GET_PPIANALYTICS_REQUEST,
  RESET_PPIANALYTICS_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBarAnalytics: false,
  isFetchingPincode: false,
  isFetchingPropertTy: false,
  isFetchingUnitType: false,
  isFetchingAgeRange: false,
  error: false,
  status: "",
  ppiPincodeData: [],
  ppiPropertyTypeData: [],
  ppiUnitTypeData: [],
  ppiAgeRange: [],
  ppiAnalytics: [],
};

const getPPIName = (state = initialState, action) => {
  switch (action.type) {
    // Pincode
    case GET_PPIPINCODE_REQUEST:
      return {
        ...state,
        isFetchingPincode: true,
      };
    case GET_PPIPINCODE_FAILURE:
      return {
        ...state,
        isFetchingPincode: false,
        error: true,
        status: action.data.status,
        message: "Failed",
      };
    case GET_PPIPINCODE_SUCCESS:
      return {
        ...state,
        isFetchingPincode: false,
        error: false,
        status: action.data.status,
        ppiPincodeData: action.data.data.pincode,
        message: "Successfully",
      };
    case RESET_PPIPINCODE_SUCCESS:
      return {
        ...state,
        isFetchingPincode: false,
        error: false,
        status: false,
        ppiPincodeData: [],
        message: "Successfully",
      };
    //Property Type
    case GET_PPIPROPRTY_REQUEST:
      return {
        ...state,
        isFetchingPropertTy: true,
      };
    case GET_PPIPROPRTY_FAILURE:
      return {
        ...state,
        isFetchingPropertTy: false,
        error: true,
        status: action.data.status,
        message: "Failed",
      };
    case GET_PPIPROPRTY_SUCCESS:
      return {
        ...state,
        isFetchingPropertTy: false,
        error: false,
        status: action.data.status,
        ppiPropertyTypeData: action.data.data.zone,
        message: "Successfully",
      };
    case RESET_PPIPROPRTY_SUCCESS:
      return {
        ...state,
        isFetchingPropertTy: false,
        error: false,
        status: false,
        ppiPropertyTypeData: [],
        message: "Successfully",
      };
    //Unit Type
    case GET_PPIUNIT_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_PPIUNIT_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Failed",
      };
    case GET_PPIUNIT_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        ppiUnitTypeData: action.data.data.region,
        message: "Successfully",
      };
    case RESET_PPIUNIT_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        ppiUnitTypeData: [],
        message: "Successfully",
      };
    //Age Range
    case GET_PPIAGE_REQUEST:
      return {
        ...state,
        isFetchingAgeRange: true,
      };
    case GET_PPIAGE_FAILURE:
      return {
        ...state,
        isFetchingAgeRange: false,
        error: true,
        status: action.data.status,
        message: "Failed",
      };
    case GET_PPIAGE_SUCCESS:
      return {
        ...state,
        isFetchingAgeRange: false,
        error: false,
        status: action.data.status,
        ppiAgeRange: action.data.data.age_range,
        message: "Successfully",
      };
    case RESET_PPIAGE_SUCCESS:
      return {
        ...state,
        isFetchingAgeRange: false,
        error: false,
        status: false,
        ppiAgeRange: [],
        message: "Successfully",
      };
    // Ppi Bar Analytics
    case GET_PPIANALYTICS_REQUEST:
      return {
        ...state,
        isFetchingBarAnalytics: true,
      };
    case GET_PPIANALYTICS_FAILURE:
      return {
        ...state,
        isFetchingBarAnalytics: false,
        error: true,
        status: action.data.status,
        message: "Failed",
      };
    case GET_PPIANALYTICS_SUCCESS:
      return {
        ...state,
        isFetchingBarAnalytics: false,
        error: false,
        status: action.data.status,
        ppiAnalytics: action.data.data.entries,
        message: "Successfully",
      };
    case RESET_PPIANALYTICS_SUCCESS:
      return {
        ...state,
        isFetchingBarAnalytics: false,
        error: false,
        status: false,
        ppiAnalytics: [],
        message: "Successfully",
      };
    default:
      return state;
  }
};

export default getPPIName;
