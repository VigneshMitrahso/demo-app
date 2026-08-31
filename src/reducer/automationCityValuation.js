import {
  GET_VALUE_CITY_FAILURE,
  GET_VALUE_CITY_SUCCESS,
  GET_VALUE_CITY_REQUEST,
  RESET_VALUE_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingCity: false,
  error: false,
  status: "",
  cityNameData: [],
};

const cityRequested = (state = initialState, action) => {
  switch (action.type) {
    case GET_VALUE_CITY_REQUEST:
      return {
        ...state,
        isFetchingCity: true,
      };
    case GET_VALUE_CITY_FAILURE:
      return {
        ...state,
        isFetchingCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_VALUE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingCity: false,
        error: false,
        status: action.data.status,
        cityNameData: action.data.data.cities,
        message: "Successfully Logged In",
      };

    case RESET_VALUE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingCity: false,
        error: false,
        status: false,
        cityNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default cityRequested;
