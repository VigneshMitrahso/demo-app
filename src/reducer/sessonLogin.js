import {
  SESSON_LOGIN_FAILURE,
  SESSON_LOGIN_SUCCESS,
  SESSON_LOGIN_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetchingSesson: false,
  error: false,
  status: "",
};

const sessonLogin = (state = initialState, action) => {
  switch (action.type) {
    case SESSON_LOGIN_REQUEST:
      return {
        ...state,
        isFetchingSesson: true,
      };
    case SESSON_LOGIN_FAILURE:
      return {
        ...state,
        isFetchingSesson: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case SESSON_LOGIN_SUCCESS:
      return {
        ...state,
        isFetchingSesson: false,
        error: false,
        status: action.data.status,
        userId: action.data.data.userId,
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default sessonLogin;
