import {
  GET_USER_REPORT_DATA_FAILURE,
  GET_USER_REPORT_DATA_SUCCESS,
  GET_USER_REPORT_DATA_REQUEST,
  RESET_USER_REPORT_DATA_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingLocal: false,
  error: false,
  status: "",
  reportDataValue: [],
};

const reportUserData = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REPORT_DATA_REQUEST:
      return {
        ...state,
        isFetchingLocal: true,
      };
    case GET_USER_REPORT_DATA_FAILURE:
      return {
        ...state,
        isFetchingLocal: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_USER_REPORT_DATA_SUCCESS:
      return {
        ...state,
        isFetchingLocal: false,
        error: false,
        status: action.data.status,
        reportDataValue: action.data.data.report_details,
        message: "Successfully Logged In",
      };

    case RESET_USER_REPORT_DATA_SUCCESS:
      return {
        ...state,
        isFetchingLocal: false,
        error: false,
        status: false,
        reportDataValue: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default reportUserData;
