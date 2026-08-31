import {
  GET_GRID_FAILURE,
  GET_GRID_SUCCESS,
  GET_GRID_REQUEST,
  RESET_GRID_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingGridStatus: false,
  error: false,
  status: "",
  gridData: [],
};

const getGrid = (state = initialState, action) => {
  switch (action.type) {
    case GET_GRID_REQUEST:
      return {
        ...state,
        isFetchingGridStatus: true,
      };
    case GET_GRID_FAILURE:
      return {
        ...state,
        isFetchingGridStatus: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_GRID_SUCCESS:
      return {
        ...state,
        isFetchingGridStatus: false,
        error: false,
        status: action.data.status,
        gridData: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_GRID_SUCCESS:
      return {
        ...state,
        isFetchingGridStatus: false,
        error: false,
        status: false,
        gridData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getGrid;
