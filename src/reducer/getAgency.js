import {
  GET_AGENCY_FAILURE,
  GET_AGENCY_SUCCESS,
  GET_AGENCY_REQUEST,
  RESET_AGENCY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyBranch: false,
  error: false,
  status: "",
  agencyData: [],
  branchData: [],
};

const getAgency = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_REQUEST:
      return {
        ...state,
        isFetchingAgencyBranch: true,
      };
    case GET_AGENCY_FAILURE:
      return {
        ...state,
        isFetchingAgencyBranch: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_SUCCESS:
      return {
        ...state,
        isFetchingAgencyBranch: false,
        error: false,
        status: action.data.status,
        agencyData: action.data.data.agency,
        branchData: action.data.data.branch,
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_SUCCESS:
      return {
        ...state,
        isFetchingAgencyBranch: false,
        error: false,
        status: false,
        agencyData: [],
        branchData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgency;
