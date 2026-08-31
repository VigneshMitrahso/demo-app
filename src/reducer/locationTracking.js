import {
  GET_LOCATION_TRAKING_FAILURE,
  GET_LOCATION_TRAKING_SUCCESS,
  GET_LOCATION_TRAKING_REQUEST,
  RESET_LOCATION_TRAKING_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingLocalTacking: false,
  error: false,
  status: "",
  locationTrackingData: [],
};

const getLocationTracking = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCATION_TRAKING_REQUEST:
      return {
        ...state,
        isFetchingLocalTacking: true,
      };
    case GET_LOCATION_TRAKING_FAILURE:
      return {
        ...state,
        isFetchingLocalTacking: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_LOCATION_TRAKING_SUCCESS:
      return {
        ...state,
        isFetchingLocalTacking: false,
        error: false,
        status: action.data.status,
        locationTrackingData: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_LOCATION_TRAKING_SUCCESS:
      return {
        ...state,
        isFetchingLocalTacking: false,
        error: false,
        status: false,
        locationTrackingData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getLocationTracking;
