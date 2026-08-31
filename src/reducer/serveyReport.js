import {
  GET_SERVEY_REQUEST,
  GET_SERVEY_SUCCESS,
  GET_SERVEY_FAILURE,
  GET_SERVEY_REPORT_FAILURE,
  GET_SERVEY_REPORT_SUCCESS,
  GET_SERVEY_REPORT_REQUEST,
  GET_SERVEY_REPORTS_FAILURE,
  GET_SERVEY_REPORTS_SUCCESS,
  GET_SERVEY_REPORTS_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  serveyReport: [],
  serveyReportData: "",
};

const serveyReport = (state = initialState, action) => {
  switch (action.type) {
    case GET_SERVEY_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case GET_SERVEY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serveyReport: action.data.data,
      };
    case GET_SERVEY_FAILURE:
      return {
        ...state,
        isFetchingReport: false,
        serveyReport: [],
      };

    case GET_SERVEY_REPORT_REQUEST:
      return {
        ...state,
        isFetching: true,
        serveyReportData: "",
      };

    case GET_SERVEY_REPORT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serveyReportData: action.data.data,
      };
    case GET_SERVEY_REPORT_FAILURE:
      return {
        ...state,
        isFetchingReport: false,
        serveyReportData: "",
      };

    case GET_SERVEY_REPORTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case GET_SERVEY_REPORTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case GET_SERVEY_REPORTS_FAILURE:
      return {
        ...state,
        isFetchingReport: false,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default serveyReport;
