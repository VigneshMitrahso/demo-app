import {
  GET_RECALL_REPORT_FAILURE,
  GET_RECALL_REPORT_SUCCESS,
  GET_RECALL_REPORT_REQUEST,
  RESET_RECALL_REPORT_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingRecall: false,
  error: false,
  status: "",
  reCallReportValue: [],
};

const reCallReportData = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECALL_REPORT_REQUEST:
      return {
        ...state,
        isFetchingRecall: true,
      };
    case GET_RECALL_REPORT_FAILURE:
      return {
        ...state,
        isFetchingRecall: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_RECALL_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingRecall: false,
        error: false,
        status: action.data.status,
        reCallReportValue: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_RECALL_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingRecall: false,
        error: false,
        status: false,
        reCallReportValue: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default reCallReportData;
