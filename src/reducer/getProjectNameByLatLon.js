import {
  GET_PROJECT_NAME_BY_LAT_LON_FAILURE,
  GET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
  GET_PROJECT_NAME_BY_LAT_LON_REQUEST,
  RESET_PROJECT_NAME_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingProjectByLatLon: false,
  error: false,
  status: "",
  projectByLatLonData: [],
};

const getProjectNoByLatLong = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECT_NAME_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingProjectByLatLon: true,
      };
    case GET_PROJECT_NAME_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingProjectByLatLon: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_PROJECT_NAME_BY_LAT_LON_SUCCESS:
      var dataValue = action.data.data.category_data;

      return {
        ...state,
        isFetchingProjectByLatLon: false,
        error: false,
        status: action.data.status,
        projectByLatLonData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_PROJECT_NAME_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingProjectByLatLon: false,
        error: false,
        status: false,
        projectByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getProjectNoByLatLong;
