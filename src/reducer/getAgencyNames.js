import {
  GET_AGENCY_NAMES_FAILURE,
  GET_AGENCY_NAMES_SUCCESS,
  GET_AGENCY_NAMES_REQUEST,
  RESET_AGENCY_NAMES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyNames: false,
  error: false,
  status: "",
  agencyNamesData: [],
};

const getAgencyNames = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_NAMES_REQUEST:
      return {
        ...state,
        isFetchingAgencyNames: true,
      };
    case GET_AGENCY_NAMES_FAILURE:
      return {
        ...state,
        isFetchingAgencyNames: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_NAMES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyNames: false,
        error: false,
        status: action.data.status,
        agencyNamesData: action.data.data.agency_list,
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_NAMES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyNames: false,
        error: false,
        status: false,
        agencyNamesData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgencyNames;
