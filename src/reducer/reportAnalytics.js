import {
  GET_REPORT_YEAR_FAILURE,
  GET_REPORT_YEAR_SUCCESS,
  GET_REPORT_YEAR_REQUEST,
  GET_ANALATICS_REPORT_REQUEST,
  GET_ANALATICS_REPORT_SUCCESS,
  GET_ANALATICS_REPORT_FAILURE,
  GET_STATE_BY_CITY_REQUEST,
  GET_STATE_BY_CITY_SUCCESS,
  GET_STATE_BY_CTY_FAILURE,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  isFetchingReport: false,
  fetchingCounterReport: 0,
  years: [],
  analyticsReport: [],
  stateToCityReport: [],
};

const reportAnalytics = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORT_YEAR_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_REPORT_YEAR_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        // years: action.data.data.status,
      };
    case GET_REPORT_YEAR_SUCCESS:
      return {
        ...state,
        isFetching: true,
        years: action.data.data.year,
      };
    case GET_ANALATICS_REPORT_REQUEST:
      return {
        ...state,
        isFetchingReport: true,
        fetchingCounterReport: state.fetchingCounterReport + 1,
      };
    case GET_ANALATICS_REPORT_FAILURE:
      return {
        ...state,
        fetchingCounterReport: state.fetchingCounterReport - 1,
        isFetchingReport: state.fetchingCounterReport - 1 > 0,
      };
    case GET_ANALATICS_REPORT_SUCCESS:
      return {
        ...state,
        analyticsReport: action.data.data,
        fetchingCounterReport: state.fetchingCounterReport - 1,
        isFetchingReport: state.fetchingCounterReport - 1 > 0,
      };
    case GET_STATE_BY_CITY_REQUEST:
      return {
        ...state,
        fetchingCounterReport: state.fetchingCounterReport + 1,
        isFetchingReport: true,
      };
    case GET_STATE_BY_CITY_SUCCESS:
      return {
        ...state,
        fetchingCounterReport: state.fetchingCounterReport - 1,
        isFetchingReport: state.fetchingCounterReport - 1 > 0,
        stateToCityReport: action.data.data,
      };
    case GET_STATE_BY_CTY_FAILURE:
      return {
        ...state,
        fetchingCounterReport: state.fetchingCounterReport - 1,
        isFetchingReport: state.fetchingCounterReport - 1 > 0,
      };
    default:
      return state;
  }
};

export default reportAnalytics;
