import {
  GET_BRANCH_AGENCY_DATES_FAILURE,
  GET_BRANCH_AGENCY_DATES_SUCCESS,
  GET_BRANCH_AGENCY_DATES_REQUEST,
  RESET_BRANCH_AGENCY_DATES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBranchAgencyDates: false,
  error: false,
  status: "",
  branchAgencyDates: [],
};

const getBranchAgencyDates = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_AGENCY_DATES_REQUEST:
      return {
        ...state,
        isFetchingBranchAgencyDates: true,
      };
    case GET_BRANCH_AGENCY_DATES_FAILURE:
      return {
        ...state,
        isFetchingBranchAgencyDates: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BRANCH_AGENCY_DATES_SUCCESS:
      return {
        ...state,
        isFetchingBranchAgencyDates: false,
        error: false,
        status: action.data.status,
        branchAgencyDates: action.data.data.Report_dates,
        message: "Successfully Logged In",
      };

    case RESET_BRANCH_AGENCY_DATES_SUCCESS:
      return {
        ...state,
        isFetchingBranchAgencyDates: false,
        error: false,
        status: false,
        branchAgencyDates: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranchAgencyDates;
