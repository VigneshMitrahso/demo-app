import {
  GET_BRANCH_STATES_FAILURE,
  GET_BRANCH_STATES_SUCCESS,
  GET_BRANCH_STATES_REQUEST,
  RESET_BRANCH_STATES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBranchStates: false,
  error: false,
  status: "",
  branchStatesNameData: [],
};

const getBranchStates = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_STATES_REQUEST:
      return {
        ...state,
        isFetchingBranchStates: true,
      };
    case GET_BRANCH_STATES_FAILURE:
      return {
        ...state,
        isFetchingBranchStates: false,
        error: true,
        status: action.data?.status,
        message: "Login Failed",
      };
    case GET_BRANCH_STATES_SUCCESS:
      return {
        ...state,
        isFetchingBranchStates: false,
        error: false,
        status: action.data?.status,
        branchStatesNameData: action.data?.data?.states,
        message: "Successfully Logged In",
      };
    case RESET_BRANCH_STATES_SUCCESS:
      return {
        ...state,
        isFetchingBranchStates: false,
        error: false,
        status: false,
        branchStatesNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranchStates;
