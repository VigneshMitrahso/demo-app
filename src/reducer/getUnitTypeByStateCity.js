import {
  GET_UNIT_TYPE_STATE_CITY_FAILURE,
  GET_UNIT_TYPE_STATE_CITY_SUCCESS,
  GET_UNIT_TYPE_STATE_CITY_REQUEST,
  RESET_UNIT_TYPE_STATE_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingUnitTypeByCity: false,
  error: false,
  status: "",
  unitTypeByCityData: [],
};

const getUnitByStateCityType = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNIT_TYPE_STATE_CITY_REQUEST:
      return {
        ...state,
        isFetchingUnitTypeByCity: true,
      };
    case GET_UNIT_TYPE_STATE_CITY_FAILURE:
      return {
        ...state,
        isFetchingUnitTypeByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_UNIT_TYPE_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitTypeByCity: false,
        error: false,
        status: action.data.status,
        unitTypeByCityData: action.data.data.unit_type,
        message: "Successfully Logged In",
      };

    case RESET_UNIT_TYPE_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitTypeByCity: false,
        error: false,
        status: false,
        unitTypeByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getUnitByStateCityType;
