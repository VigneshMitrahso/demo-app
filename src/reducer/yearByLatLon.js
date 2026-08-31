import {
  GET_YEAR_BY_LAT_LON_FAILURE,
  GET_YEAR_BY_LAT_LON_SUCCESS,
  GET_YEAR_BY_LAT_LON_REQUEST,
  RESET_YEAR_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingYearByLatLon: false,
  error: false,
  status: "",
  yearByLatLonData: [],
};

const getYearByLatLon = (state = initialState, action) => {
  switch (action.type) {
    case GET_YEAR_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingYearByLatLon: true,
      };
    case GET_YEAR_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingYearByLatLon: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_YEAR_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingYearByLatLon: false,
        error: false,
        status: action.data.status,
        yearByLatLonData: action.data.data.year,
        message: "Successfully Logged In",
      };

    case RESET_YEAR_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingYearByLatLon: false,
        error: false,
        status: false,
        yearByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getYearByLatLon;
