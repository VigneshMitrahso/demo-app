import {
  GET_SEARCH_BY_REGION_FAILURE,
  GET_SEARCH_BY_REGION_SUCCESS,
  GET_SEARCH_BY_REGION_REQUEST,
  RESET_SEARCH_BY_REGION_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingSearchByRegion: false,
  error: false,
  status: "",
  searchByRegionData: [],
};

const getStateByRegion = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCH_BY_REGION_REQUEST:
      return {
        ...state,
        isFetchingSearchByRegion: true,
      };
    case GET_SEARCH_BY_REGION_FAILURE:
      return {
        ...state,
        isFetchingSearchByRegion: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_SEARCH_BY_REGION_SUCCESS:
      return {
        ...state,
        isFetchingSearchByRegion: false,
        error: false,
        status: action.data.status,
        searchByRegionData: action.data.data.entries,
        message: "Successfully Logged In",
      };

    case RESET_SEARCH_BY_REGION_SUCCESS:
      return {
        ...state,
        isFetchingSearchByRegion: false,
        error: true,
        status: false,
        searchByRegionData: [],
      };
    default:
      return state;
  }
};

export default getStateByRegion;
