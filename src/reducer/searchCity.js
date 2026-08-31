import {
  GET_SEARCH_KEY_FAILURE,
  GET_SEARCH_KEY_SUCCESS,
  GET_SEARCH_KEY_REQUEST,
  RESET_SEARCH_KEY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingSearchCity: false,
  error: false,
  status: "",
  searchCityData: [],
};

const searchCityUser = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCH_KEY_REQUEST:
      return {
        ...state,
        isFetchingSearchCity: true,
      };
    case GET_SEARCH_KEY_FAILURE:
      return {
        ...state,
        isFetchingSearchCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_SEARCH_KEY_SUCCESS:
      var stateCityArr = action.data.data.cities;

      var stateArr = action.data.data.states;

      var states = [];

      var stateCity = [];

      for (let list in stateCityArr) {
        var stateCityStr = `${stateCityArr[list].city},${stateCityArr[list].state}`;
        var stateCityID = `${stateCityArr[list].city_id},${stateCityArr[list].state_id}`;
        var Obj = {
          name: stateCityStr,
          id: stateCityID,
          key: "city",
        };
        stateCity.push(Obj);
      }

      for (let list1 in stateArr) {
        var stateName = stateArr[list1].state;
        var stateid = stateArr[list1].state_id;
        var Obj = {
          name: stateName,
          id: stateid,
          key: "state",
        };
        states.push(Obj);
      }

      var statesCitiesValue = [...states, ...stateCity];

      return {
        ...state,
        isFetchingSearchCity: false,
        error: false,
        status: action.data.status,
        searchCityData: statesCitiesValue,
        message: "Successfully Logged In",
      };

    case RESET_SEARCH_KEY_SUCCESS:
      return {
        ...state,
        isFetchingSearchCity: false,
        error: false,
        status: false,
        searchCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default searchCityUser;
