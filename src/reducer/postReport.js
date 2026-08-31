import {
  GET_POST_REPORT_FAILURE,
  GET_POST_REPORT_SUCCESS,
  GET_POST_REPORT_REQUEST,
  RESET_POST_REPORT_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAddImage: false,
  error: false,
  status: "",
  reportImageValue: [],
};

const reportImageData = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST_REPORT_REQUEST:
      return {
        ...state,
        isFetchingAddImage: true,
      };
    case GET_POST_REPORT_FAILURE:
      return {
        ...state,
        isFetchingAddImage: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_POST_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingAddImage: false,
        error: false,
        status: action.data.status,
        reportImageValue: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_POST_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingAddImage: false,
        error: false,
        status: false,
        reportImageValue: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default reportImageData;
