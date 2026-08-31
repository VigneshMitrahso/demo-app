import {
  GET_VALUE_STATE_FAILURE,
  GET_VALUE_STATE_SUCCESS,
  GET_VALUE_STATE_REQUEST,
  RESET_VALUE_STATE_SUCCESS,
  GET_AVMDATA_TST_REQUEST_SUCCESS,
  GET_AVMDATA_MARKET_REQUEST_SUCCESS,
  GET_AVMDATA_ICICI_REQUEST_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingState: false,
  isIciciLoading: false,
  isTstLoading: false,
  isMarketLoading: false,
  error: false,
  status: "",
  stateData: [],
};

const stateRequested = (state = initialState, action) => {
  switch (action.type) {
    case GET_VALUE_STATE_REQUEST:
      return {
        ...state,
        isFetchingState: true,
      };
    case GET_AVMDATA_ICICI_REQUEST_SUCCESS:
      return {
        ...state,
        isMarketLoading: action.data,
      };
    case GET_AVMDATA_MARKET_REQUEST_SUCCESS:
      return {
        ...state,
        isFetchingState: action.data,
      };
    case GET_AVMDATA_TST_REQUEST_SUCCESS:
      return {
        ...state,
        isTstLoading: action.data,
      };
    case GET_VALUE_STATE_FAILURE:
      return {
        ...state,
        isFetchingState: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_VALUE_STATE_SUCCESS:
      return {
        ...state,
        isFetchingState: false,
        error: false,
        status: action.data.status,
        stateData: action.data.data.state,
        message: "Successfully Logged In",
      };

    case RESET_VALUE_STATE_SUCCESS:
      return {
        ...state,
        isFetchingState: false,
        error: false,
        status: false,
        stateData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default stateRequested;
