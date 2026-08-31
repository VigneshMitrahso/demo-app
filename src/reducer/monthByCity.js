import {
  GET_MONTH_BY_CITY_FAILURE,
  GET_MONTH_BY_CITY_SUCCESS,
  GET_MONTH_BY_CITY_REQUEST,
  RESET_MONTH_BY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingMonthByCity: false,
  error: false,
  status: "",
  monthByCityData: [],
};

const getMonthByCityType = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONTH_BY_CITY_REQUEST:
      return {
        ...state,
        isFetchingMonthByCity: true,
      };
    case GET_MONTH_BY_CITY_FAILURE:
      return {
        ...state,
        isFetchingMonthByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_MONTH_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingMonthByCity: false,
        error: false,
        status: action.data.status,
        monthByCityData: action.data.data.month,
        message: "Successfully Logged In",
      };

    case RESET_MONTH_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingMonthByCity: false,
        error: false,
        status: false,
        monthByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getMonthByCityType;
