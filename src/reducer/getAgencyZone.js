import {
  GET_AGENCY_ZONES_FAILURE,
  GET_AGENCY_ZONES_SUCCESS,
  GET_AGENCY_ZONES_REQUEST,
  RESET_AGENCY_ZONES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyZones: false,
  error: false,
  status: "",
  agencyZoneNameData: [],
};

const getAgencyZone = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_ZONES_REQUEST:
      return {
        ...state,
        isFetchingAgencyZones: true,
      };
    case GET_AGENCY_ZONES_FAILURE:
      return {
        ...state,
        isFetchingAgencyZones: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_ZONES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyZones: false,
        error: false,
        status: action.data.status,
        agencyZoneNameData: action.data.data.zones,
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_ZONES_SUCCESS:
      return {
        ...state,
        isFetchingAgencyZones: false,
        error: false,
        status: false,
        agencyZoneNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgencyZone;
