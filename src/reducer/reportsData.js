import {
  GET_BRANCH_REPORT_DATA_REQUEST,
  GET_BRANCH_REPORT_DATA_SUCCESS,
  GET_BRANCH_REPORT_DATA_FAILURE,
  GET_AGENCY_REPORT_DATA_REQUEST,
  GET_AGENCY_REPORT_DATA_SUCCESS,
  GET_AGENCY_REPORT_DATA_FAILURE,
  GET_ANALYTICS_DATA_FROM_CITY,
  GET_AGENCY_BRANCH_COUNT,
} from "../action/actionConstants";

let initialState = {
  initialBranchReport: {},
  initialAgencyReport: {},
  cityAnalyticsData: {},
  totalAgencyBranchCount: {},
  isFetching: false,
  error: false,
};

const getReportsData = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_REPORT_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_BRANCH_REPORT_DATA_SUCCESS:
      return {
        ...state,
        initialBranchReport: action.data.data.branch_connect_data,
        isFetching: false,
        message: "Successfully Logged In",
      };
    case GET_BRANCH_REPORT_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        message: "Login Failed",
      };
    case GET_AGENCY_REPORT_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_AGENCY_REPORT_DATA_SUCCESS:
      return {
        ...state,
        initialAgencyReport: action.data.data,
        isFetching: false,
        message: "Successfully Logged In",
      };
    case GET_AGENCY_REPORT_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        message: "Login Failed",
      };
    case GET_ANALYTICS_DATA_FROM_CITY:
      return {
        ...state,
        cityAnalyticsData: action.data.data,
      };
    case GET_AGENCY_BRANCH_COUNT:
      return {
        ...state,
        totalAgencyBranchCount: action.data.data,
      };
    default:
      return state;
  }
};

export default getReportsData;
