import {
  GET_NO_OF_UNIT_BY_CITY_FAILURE,
  GET_NO_OF_UNIT_BY_CITY_SUCCESS,
  GET_NO_OF_UNIT_BY_CITY_REQUEST,
  RESET_NO_OF_UNIT_BY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  noOfUnitByCityData: [],
};

const noOfUnitByCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_NO_OF_UNIT_BY_CITY_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_NO_OF_UNIT_BY_CITY_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_NO_OF_UNIT_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        noOfUnitByCityData: action.data.data.number_of_units,
        message: "Successfully Logged In",
      };

    case RESET_NO_OF_UNIT_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        noOfUnitByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default noOfUnitByCity;
