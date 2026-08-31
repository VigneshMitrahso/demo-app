import {
  GET_DISABLE_REQ_ID_FAILURE,
  GET_DISABLE_REQ_ID_SUCCESS,
  GET_DISABLE_REQ_ID_REQUEST,
  RESET_DISABLE_REQ_ID_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingDisable: false,
  error: false,
  status: "",
  diableReqIdData: [],
};

const disableReqIdData = (state = initialState, action) => {
  switch (action.type) {
    case GET_DISABLE_REQ_ID_REQUEST:
      return {
        ...state,
        isFetchingDisable: true,
      };
    case GET_DISABLE_REQ_ID_FAILURE:
      return {
        ...state,
        isFetchingDisable: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_DISABLE_REQ_ID_SUCCESS:
      return {
        ...state,
        isFetchingDisable: false,
        error: false,
        status: action.data.status,
        diableReqIdData: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_DISABLE_REQ_ID_SUCCESS:
      return {
        ...state,
        isFetchingDisable: false,
        error: false,
        status: false,
        diableReqIdData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default disableReqIdData;
