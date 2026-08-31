import {
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetchingLogOut: false,
  error: false,
  status: "",
};

const logout = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {
        ...state,
        isFetchingLogOut: true,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isFetchingLogOut: false,
        error: true,
        status: action.data.status,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isFetchingLogOut: false,
        error: false,
        status: action.data.status,
      };
    default:
      return state;
  }
};

export default logout;
