import {
  REQUEST_GET_GEO_LOCATIONS,
  SUCCESS_GET_GEO_LOCATIONS,
  FAILED_GET_GEO_LOCATIONS,
  REQUEST_GET_AGENT_DATA,
  SUCCESS_GET_AGENT_DATA,
  FAILED_GET_AGENT_DATA,
  SET_EMPTY_LOCATION,
} from "../action/actionConstants";

const initialState = {
  records: [],
  agentRecords: [],
  status: "",
  error: false,
  isFetching: false,
};

const geoTracking = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_GET_GEO_LOCATIONS:
      return {
        ...state,
        isFetching: true,
        records: [],
      };
    case SUCCESS_GET_GEO_LOCATIONS:
      return {
        ...state,
        records: action.record.data,
        status: action.record.data.status,
        error: false,
        isFetching: false,
      };
    case FAILED_GET_GEO_LOCATIONS:
      return {
        ...state,
        error: true,
        isFetching: false,
        records: [],
      };
    case REQUEST_GET_AGENT_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case SUCCESS_GET_AGENT_DATA:
      return {
        ...state,
        agentRecords: action.record.data,
        status: action.record.data.status,
        error: false,
        isFetching: false,
      };
    case FAILED_GET_AGENT_DATA:
      return {
        ...state,
        error: true,
        isFetching: false,
      };
    case SET_EMPTY_LOCATION:
      return {
        ...state,
        isFetching: true,
        records: [],
      };
    default:
      return state;
  }
};

export default geoTracking;
