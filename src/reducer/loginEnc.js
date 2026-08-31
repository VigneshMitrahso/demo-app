import {
  GET_LOGIN_ENC_FAILURE,
  GET_LOGIN_ENC_SUCCESS,
  GET_LOGIN_ENC_REQUEST,
  RESET_LOGIN_ENC_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingLogEnc: false,
  error: false,
  status: "",
  stateData: [],
};

const getLoginEnc = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGIN_ENC_REQUEST:
      return {
        ...state,
        isFetchingLogEnc: true,
      };
    case GET_LOGIN_ENC_FAILURE:
      return {
        ...state,
        isFetchingLogEnc: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_LOGIN_ENC_SUCCESS:
      return {
        ...state,
        isFetchingLogEnc: false,
        error: false,
        status: action.data.status,
        message: "Successfully Logged In",
      };

    case RESET_LOGIN_ENC_SUCCESS:
      return {
        ...state,
        isFetchingLogEnc: false,
        error: false,
        status: false,
        stateData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getLoginEnc;
