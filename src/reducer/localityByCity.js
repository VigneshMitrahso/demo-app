import {
  GET_LOCALITY_CITY_FAILURE,
  GET_LOCALITY_CITY_SUCCESS,
  GET_LOCALITY_CITY_REQUEST,
  RESET_LOCALITY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingLocalByCity: false,
  error: false,
  status: "",
  localityByCityData: [],
};

const getLocalityByCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCALITY_CITY_REQUEST:
      return {
        ...state,
        isFetchingLocalByCity: true,
      };
    case GET_LOCALITY_CITY_FAILURE:
      return {
        ...state,
        isFetchingLocalByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_LOCALITY_CITY_SUCCESS:
      var dataValue = action.data.data.locality;
      // var lastremove = dataValue.pop();

      // dataValue.push({ id: 1, name: "All Locality"})

      return {
        ...state,
        isFetchingLocalByCity: false,
        error: false,
        status: action.data.status,
        localityByCityData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_LOCALITY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingLocalByCity: false,
        error: false,
        status: false,
        localityByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getLocalityByCity;
