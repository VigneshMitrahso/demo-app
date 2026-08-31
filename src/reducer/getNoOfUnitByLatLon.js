import {
  GET_NO_OF_UNIT_BY_LAT_LON_FAILURE,
  GET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
  GET_NO_OF_UNIT_BY_LAT_LON_REQUEST,
  RESET_NO_OF_UNIT_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  noOfUnitByLatLonData: [],
};

const noOfUnitByLatLon = (state = initialState, action) => {
  switch (action.type) {
    case GET_NO_OF_UNIT_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_NO_OF_UNIT_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_NO_OF_UNIT_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        noOfUnitByLatLonData: action.data.data.number_of_units,
        message: "Successfully Logged In",
      };

    case RESET_NO_OF_UNIT_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        noOfUnitByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default noOfUnitByLatLon;
