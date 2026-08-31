import {
  GET_UNIT_TYPE_BY_LAT_LON_FAILURE,
  GET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
  GET_UNIT_TYPE_BY_LAT_LON_REQUEST,
  RESET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingUnitType: false,
  error: false,
  status: "",
  unitTypeData: [],
};

const getUnitType = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNIT_TYPE_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_UNIT_TYPE_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_UNIT_TYPE_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        unitTypeData: action.data.data.unit_type,
        message: "Successfully Logged In",
      };

    case RESET_UNIT_TYPE_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        unitTypeData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getUnitType;
