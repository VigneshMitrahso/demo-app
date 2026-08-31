import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetchingLogin: false,
  error: false,
  status: "",
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetchingLogin: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetchingLogin: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetchingLogin: false,
        error: false,
        status: action.data.status,
        admin: action.data.admin,
        userId: action.data.data.userId,
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default login;
