import {
  GET_PROPERTY_STATE_CITY_FAILURE,
  GET_PROPERTY_STATE_CITY_SUCCESS,
  GET_PROPERTY_STATE_CITY_REQUEST,
  RESET_PROPERTY_STATE_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingPropertyByCity: false,
  error: false,
  status: "",
  propertyByCityData: [],
};

const getPropertyByCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_STATE_CITY_REQUEST:
      return {
        ...state,
        isFetchingPropertyByCity: true,
      };
    case GET_PROPERTY_STATE_CITY_FAILURE:
      return {
        ...state,
        isFetchingPropertyByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_PROPERTY_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingPropertyByCity: false,
        error: false,
        status: action.data.status,
        propertyByCityData: action.data.data.property_type,
        message: "Successfully Logged In",
      };

    case RESET_PROPERTY_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingPropertyByCity: false,
        error: false,
        status: false,
        propertyByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getPropertyByCity;
