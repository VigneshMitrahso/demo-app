import {
  GET_CITY_FAILURE,
  GET_CITY_SUCCESS,
  GET_CITY_REQUEST,
  RESET_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingCity: false,
  error: false,
  status: "",
  cityNameData: [],
};

const getCityName = (state = initialState, action) => {
  switch (action.type) {
    case GET_CITY_REQUEST:
      return {
        ...state,
        isFetchingCity: true,
      };
    case GET_CITY_FAILURE:
      return {
        ...state,
        isFetchingCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_CITY_SUCCESS:
      return {
        ...state,
        isFetchingCity: false,
        error: false,
        status: action.data.status,
        cityNameData:
          action.data?.data?.city ?? action?.data?.data?.Cities ?? [],
        message: "Successfully Logged In",
      };

    case RESET_CITY_SUCCESS:
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

export default getCityName;
