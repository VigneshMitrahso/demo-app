import {
  GET_POLYGON_FAILURE,
  GET_POLYGON_SUCCESS,
  GET_POLYGON_REQUEST,
  RESET_POLYGON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  polygonAreaData: [],
};

const getPolygonArea = (state = initialState, action) => {
  switch (action.type) {
    case GET_POLYGON_REQUEST:
      return {
        ...state,
        isFetchingApprovalByLatLon: true,
      };
    case GET_POLYGON_FAILURE:
      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_POLYGON_SUCCESS:
      var polyarr = action.data.data[0];

      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: false,
        status: action.data.status,
        polygonAreaData: polyarr,
        message: "Successfully Logged In",
      };

    case RESET_POLYGON_SUCCESS:
      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: false,
        status: false,
        polygonAreaData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getPolygonArea;
