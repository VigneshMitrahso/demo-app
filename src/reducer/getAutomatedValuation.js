import {
  GET_APPROVAL_FAILURE,
  GET_APPROVAL_SUCCESS,
  GET_APPROVAL_REQUEST,
  RESET_APPROVAL_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingApprovalValuation: false,
  error: false,
  status: "",
  approvalValuationData: [],
  approvalAnalyticsData: [],
};

const getApprovalValuation = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPROVAL_REQUEST:
      return {
        ...state,
        isFetchingApprovalValuation: true,
      };
    case GET_APPROVAL_FAILURE:
      return {
        ...state,
        isFetchingApprovalValuation: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_APPROVAL_SUCCESS:
      return {
        ...state,
        isFetchingApprovalValuation: false,
        error: false,
        status: action.data.status,
        approvalValuationData: action.data.data.entries,
        approvalAnalyticsData: action.data.data.analytics,
        message: "Successfully Logged In",
      };

    case RESET_APPROVAL_SUCCESS:
      return {
        ...state,
        isFetchingApprovalValuation: false,
        error: false,
        status: false,
        approvalValuationData: [],
        approvalAnalyticsData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getApprovalValuation;
