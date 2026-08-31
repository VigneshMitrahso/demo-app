import {
  GET_AGENCY_CITIES_FAILURE,
  GET_AGENCY_CITIES_SUCCESS,
  GET_AGENCY_CITIES_REQUEST,
  RESET_AGENCY_CITIES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyCities: false,
  error: false,
  status: "",
  agencyCitiesNameData: [],
};

const getAgencyCities = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_CITIES_REQUEST:
      return {
        ...state,
        isFetchingAgencyCities: true,
      };
    case GET_AGENCY_CITIES_FAILURE:
      return {
        ...state,
        isFetchingAgencyCities: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_CITIES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyCities: false,
        error: false,
        status: action.data.status,
        agencyCitiesNameData: action.data.data.Cities,
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_CITIES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyCities: false,
        error: false,
        status: false,
        agencyCitiesNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgencyCities;
