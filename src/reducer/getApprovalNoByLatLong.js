import {
  GET_APPROVAL_BY_LAT_LON_FAILURE,
  GET_APPROVAL_BY_LAT_LON_SUCCESS,
  GET_APPROVAL_BY_LAT_LON_REQUEST,
  RESET_APPROVAL_BY_LAT_LON_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingApprovalByLatLon: false,
  error: false,
  status: "",
  approvalByLatLonData: [],
};

const getApprovalNoByLatLong = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPROVAL_BY_LAT_LON_REQUEST:
      return {
        ...state,
        isFetchingApprovalByLatLon: true,
      };
    case GET_APPROVAL_BY_LAT_LON_FAILURE:
      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_APPROVAL_BY_LAT_LON_SUCCESS:
      var dataValue = action.data.data.category_data;

      // var lastremove = dataValue.pop();

      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: false,
        status: action.data.status,
        approvalByLatLonData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_APPROVAL_BY_LAT_LON_SUCCESS:
      return {
        ...state,
        isFetchingApprovalByLatLon: false,
        error: false,
        status: false,
        approvalByLatLonData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getApprovalNoByLatLong;
