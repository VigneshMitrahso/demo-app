import {
  GET_BAR_ZONE_FAILURE,
  GET_BAR_ZONE_SUCCESS,
  GET_BAR_ZONE_REQUEST,
  RESET_BAR_ZONE_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingZone: false,
  error: false,
  status: "",
  zoneByCityBarData: [],
};

const barByzone = (state = initialState, action) => {
  switch (action.type) {
    case GET_BAR_ZONE_REQUEST:
      return {
        ...state,
        isFetchingZone: true,
      };
    case GET_BAR_ZONE_FAILURE:
      return {
        ...state,
        isFetchingZone: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BAR_ZONE_SUCCESS:
      return {
        ...state,
        isFetchingZone: false,
        error: false,
        status: action.data.status,
        zoneByCityBarData: action.data.data.zone,
        message: "Successfully Logged In",
      };

    case RESET_BAR_ZONE_SUCCESS:
      return {
        ...state,
        isFetchingZone: false,
        error: false,
        status: false,
        zoneByCityBarData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default barByzone;
