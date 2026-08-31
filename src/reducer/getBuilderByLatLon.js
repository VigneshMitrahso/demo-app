import {
  GET_BUILDER_BY_LAT_LON_FAILURE,
  GET_BUILDER_BY_LAT_LON_SUCCESS,
  GET_BUILDER_BY_LAT_LON_REQUEST,
  RESET_BUILDER_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBuilderByLatLon: false,
  error: false,
  status: "",
  builderByLatLonData: [],
};

const getBuilderByLatLong = (state = initialState, action) => {
  switch (action.type) {
    case GET_BUILDER_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingBuilderByLatLon: true,
      };
    case GET_BUILDER_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingBuilderByLatLon: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BUILDER_BY_LAT_LON_SUCCESS:
      var dataValue = action.data.data.category_data;

      return {
        ...state,
        isFetchingBuilderByLatLon: false,
        error: false,
        status: action.data.status,
        builderByLatLonData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_BUILDER_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingBuilderByLatLon: false,
        error: false,
        status: false,
        builderByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBuilderByLatLong;
