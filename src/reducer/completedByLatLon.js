import {
  GET_COMPLETED_BY_LAT_LON_FAILURE,
  GET_COMPLETED_BY_LAT_LON_SUCCESS,
  GET_COMPLETED_BY_LAT_LON_REQUEST,
  RESET_COMPLETED_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  completedByLatLonData: [],
};

const completedByLatLon = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPLETED_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_COMPLETED_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_COMPLETED_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        completedByLatLonData: action.data.data.completed,
        message: "Successfully Logged In",
      };

    case RESET_COMPLETED_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        completedByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default completedByLatLon;
