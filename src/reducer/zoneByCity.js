import {
  GET_ZONE_CITY_FAILURE,
  GET_ZONE_CITY_SUCCESS,
  GET_ZONE_CITY_REQUEST,
  RESET_ZONE_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingZoneByCity: false,
  error: false,
  status: "",
  zoneByCityData: [],
};

const getZoneByCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_ZONE_CITY_REQUEST:
      return {
        ...state,
        isFetchingZoneByCity: true,
      };
    case GET_ZONE_CITY_FAILURE:
      return {
        ...state,
        isFetchingZoneByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_ZONE_CITY_SUCCESS:
      var dataValue = action.data.data.zone;

      // var lastremove = dataValue.pop();

      // dataValue.push({id: 1, name: "All Zone"})

      return {
        ...state,
        isFetchingZoneByCity: false,
        error: false,
        status: action.data.status,
        zoneByCityData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_ZONE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingZoneByCity: false,
        error: false,
        status: false,
        zoneByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getZoneByCity;
