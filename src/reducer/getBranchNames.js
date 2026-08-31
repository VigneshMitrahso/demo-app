import {
  GET_BRANCH_NAMES_FAILURE,
  GET_BRANCH_NAMES_SUCCESS,
  GET_BRANCH_NAMES_REQUEST,
  RESET_BRANCH_NAMES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBranchNames: false,
  error: false,
  status: "",
  branchNamesData: [],
};

const getBranchNames = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_NAMES_REQUEST:
      return {
        ...state,
        isFetchingBranchNames: true,
      };
    case GET_BRANCH_NAMES_FAILURE:
      return {
        ...state,
        isFetchingBranchNames: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BRANCH_NAMES_SUCCESS:
      return {
        ...state,
        isFetchingBranchNames: false,
        error: false,
        status: action.data.status,
        branchNamesData: action.data.data.branches,
        message: "Successfully Logged In",
      };

    case RESET_BRANCH_NAMES_SUCCESS:
      return {
        ...state,
        isFetchingBranchNames: false,
        error: false,
        status: false,
        branchNamesData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranchNames;
