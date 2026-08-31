import {
  GET_AGENCY_STATES_FAILURE,
  GET_AGENCY_STATES_SUCCESS,
  GET_AGENCY_STATES_REQUEST,
  RESET_AGENCY_STATES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyStates: false,
  error: false,
  status: "",
  agencyStatesNameData: [],
};

const getAgencyStates = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_STATES_REQUEST:
      return {
        ...state,
        isFetchingAgencyStates: true,
      };
    case GET_AGENCY_STATES_FAILURE:
      return {
        ...state,
        isFetchingAgencyStates: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_STATES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyStates: false,
        error: false,
        status: action.data.status,
        agencyStatesNameData: action.data.data.states,
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_STATES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyStates: false,
        error: false,
        status: false,
        agencyStatesNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgencyStates;
