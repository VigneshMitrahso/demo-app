import {
  GET_YEAR_STATE_CITY_FAILURE,
  GET_YEAR_STATE_CITY_SUCCESS,
  GET_YEAR_STATE_CITY_REQUEST,
  RESET_YEAR_STATE_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingYearByCity: false,
  error: false,
  status: "",
  yearByCityData: [],
};

const getYearByStateCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_YEAR_STATE_CITY_REQUEST:
      return {
        ...state,
        isFetchingYearByCity: true,
      };
    case GET_YEAR_STATE_CITY_FAILURE:
      return {
        ...state,
        isFetchingYearByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_YEAR_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingYearByCity: false,
        error: false,
        status: action.data.status,
        yearByCityData: action.data.data.year,
        message: "Successfully Logged In",
      };

    case RESET_YEAR_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingYearByCity: false,
        error: false,
        status: false,
        yearByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getYearByStateCity;
