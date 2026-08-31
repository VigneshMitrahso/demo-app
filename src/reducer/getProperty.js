import {
  GET_PROPERTY_BY_LAT_LNG_FAILURE,
  GET_PROPERTY_BY_LAT_LNG_SUCCESS,
  GET_PROPERTY_BY_LAT_LNG_REQUEST,
  RESET_PROPERTY_BY_LAT_LNG_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingProperty: false,
  error: false,
  status: "",
  propertyData: [],
};

const getProperty = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_BY_LAT_LNG_REQUEST:
      return {
        ...state,
        isFetchingProperty: true,
      };
    case GET_PROPERTY_BY_LAT_LNG_FAILURE:
      return {
        ...state,
        isFetchingProperty: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_PROPERTY_BY_LAT_LNG_SUCCESS:
      return {
        ...state,
        isFetchingProperty: false,
        error: false,
        status: action.data.status,
        propertyData: action.data.data.property_type,
        message: "Successfully Logged In",
      };

    case RESET_PROPERTY_BY_LAT_LNG_SUCCESS:
      return {
        ...state,
        isFetchingProperty: false,
        error: false,
        status: false,
        propertyData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getProperty;
