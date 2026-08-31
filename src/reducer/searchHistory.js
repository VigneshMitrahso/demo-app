import {
  GET_SEARCH_HISTORY_FAILURE,
  GET_SEARCH_HISTORY_SUCCESS,
  GET_SEARCH_HISTORY_REQUEST,
  RESET_SEARCH_HISTORY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingHistory: false,
  error: false,
  status: "",
  reportDataValue: [],
};

const searchHistoryUserData = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCH_HISTORY_REQUEST:
      return {
        ...state,
        isFetchingHistory: true,
      };
    case GET_SEARCH_HISTORY_FAILURE:
      return {
        ...state,
        isFetchingHistory: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_SEARCH_HISTORY_SUCCESS:
      return {
        ...state,
        isFetchingHistory: false,
        error: false,
        status: action.data.status,
        historyDataValue: action.data.data.status_details,
        message: "Successfully Logged In",
      };

    case RESET_SEARCH_HISTORY_SUCCESS:
      return {
        ...state,
        isFetchingHistory: false,
        error: false,
        status: false,
        reportDataValue: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default searchHistoryUserData;
