import {
  GET_BRANCH_REPORT_FAILURE,
  GET_BRANCH_REPORT_SUCCESS,
  GET_BRANCH_REPORT_REQUEST,
  RESET_BRANCH_REPORT_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBranchReport: false,
  error: false,
  status: "",
  branchReportData: {},
};

const getBranchReport = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_REPORT_REQUEST:
      return {
        ...state,
        isFetchingBranchReport: true,
      };
    case GET_BRANCH_REPORT_FAILURE:
      return {
        ...state,
        isFetchingBranchReport: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BRANCH_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingBranchReport: false,
        error: false,
        status: action.data.status,
        branchReportData: action.data.data.branch_connect_data?.[0] ?? {},
        message: "Successfully Logged In",
      };

    case RESET_BRANCH_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingBranchNames: false,
        error: false,
        status: false,
        branchReportData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranchReport;
