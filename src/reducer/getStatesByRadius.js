import {
  GET_DATA_BY_RADIUS_FAILURE,
  GET_DATA_BY_RADIUS_SUCCESS,
  GET_DATA_BY_RADIUS_REQUEST,
  RESET_DATA_BY_RADIUS_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingSearchByRadius: false,
  error: false,
  status: "",
  searchByRadiusData: [],
};

const getStateByRadius = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_BY_RADIUS_REQUEST:
      return {
        ...state,
        isFetchingSearchByRadius: true,
      };
    case GET_DATA_BY_RADIUS_FAILURE:
      return {
        ...state,
        isFetchingSearchByRadius: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_DATA_BY_RADIUS_SUCCESS:
      return {
        ...state,
        isFetchingSearchByRadius: false,
        error: false,
        status: action.data.status,
        searchByRadiusData: action.data.data.entries,
        message: "Successfully Logged In",
      };

    case RESET_DATA_BY_RADIUS_SUCCESS:
      return {
        ...state,
        isFetchingSearchByRadius: false,
        error: true,
        status: false,
        searchByRadiusData: [],
      };
    default:
      return state;
  }
};

export default getStateByRadius;
