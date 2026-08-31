import {
  GET_STATE_FAILURE,
  GET_STATE_SUCCESS,
  GET_STATE_REQUEST,
  RESET_STATE_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingState: false,
  error: false,
  status: "",
  stateData: [],
};

const getState = (state = initialState, action) => {
  switch (action.type) {
    case GET_STATE_REQUEST:
      return {
        ...state,
        isFetchingState: true,
      };
    case GET_STATE_FAILURE:
      return {
        ...state,
        isFetchingState: false,
        error: true,
        status: [],
        message: "Login Failed",
      };
    case GET_STATE_SUCCESS:
      return {
        ...state,
        isFetchingState: false,
        error: false,
        status: action.data.status,
        stateData: action.data.data.states,
        message: "Successfully Logged In",
      };

    case RESET_STATE_SUCCESS:
      return {
        ...state,
        isFetchingState: false,
        error: false,
        status: false,
        stateData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getState;
