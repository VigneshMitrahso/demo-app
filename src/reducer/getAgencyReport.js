import {
  GET_AGENCY_REPORT_FAILURE,
  GET_AGENCY_REPORT_SUCCESS,
  GET_AGENCY_REPORT_REQUEST,
  RESET_AGENCY_REPORT_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAgencyReport: false,
  error: false,
  status: "",
  agencyReportData: {},
};

const getAgencyReport = (state = initialState, action) => {
  switch (action.type) {
    case GET_AGENCY_REPORT_REQUEST:
      return {
        ...state,
        isFetchingAgencyReport: true,
      };
    case GET_AGENCY_REPORT_FAILURE:
      return {
        ...state,
        isFetchingAgencyReport: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_AGENCY_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingAgencyReport: false,
        error: false,
        status: action.data.status,
        agencyReportData: action.data.data.agency_connect_data?.[0] ?? {},
        message: "Successfully Logged In",
      };

    case RESET_AGENCY_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingAgencyReport: false,
        error: false,
        status: false,
        agencyReportData: {},
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAgencyReport;
