import {
  GET_RATE_LIMT_BY_CITY_FAILURE,
  GET_RATE_LIMT_BY_CITY_SUCCESS,
  GET_RATE_LIMT_BY_CITY_REQUEST,
  RESET_RATE_LIMT_BY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  rateLimitByCityData: [],
};

const getRateLimitByCityType = (state = initialState, action) => {
  switch (action.type) {
    case GET_RATE_LIMT_BY_CITY_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_RATE_LIMT_BY_CITY_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_RATE_LIMT_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        rateLimitByCityData: action.data.data.rate_limit,
        message: "Successfully Logged In",
      };

    case RESET_RATE_LIMT_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        rateLimitByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getRateLimitByCityType;
