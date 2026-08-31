import {
  GET_BRANCH_FAILURE,
  GET_BRANCH_SUCCESS,
  GET_BRANCH_REQUEST,
  RESET_BRANCH_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  branchData: [],
};

const getBranch = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_REQUEST:
      return {
        ...state,
        isFetchingBranch: true,
      };
    case GET_BRANCH_FAILURE:
      return {
        ...state,
        isFetchingBranch: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BRANCH_SUCCESS:
      return {
        ...state,
        isFetchingBranch: false,
        error: false,
        status: action.data.status,
        branchData: action.data.data.branch_details,
        message: "Successfully Logged In",
      };

    case RESET_BRANCH_SUCCESS:
      return {
        ...state,
        isFetchingBranch: false,
        error: false,
        status: false,
        branchData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranch;
