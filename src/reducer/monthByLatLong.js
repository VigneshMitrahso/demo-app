import {
  GET_MONTH_BY_LAT_LON_FAILURE,
  GET_MONTH_BY_LAT_LON_SUCCESS,
  GET_MONTH_BY_LAT_LON_REQUEST,
  RESET_MONTH_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingMonthByLatLong: false,
  error: false,
  status: "",
  monthData: [],
};

const getMonth = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONTH_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingMonthByLatLong: true,
      };
    case GET_MONTH_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingMonthByLatLong: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_MONTH_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingMonthByLatLong: false,
        error: false,
        status: action.data.status,
        monthData: action.data.data.month,
        message: "Successfully Logged In",
      };

    case RESET_MONTH_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingMonthByLatLong: false,
        error: false,
        status: false,
        monthData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getMonth;
