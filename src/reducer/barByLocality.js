import {
  GET_BAR_LOCALITY_FAILURE,
  GET_BAR_LOCALITY_SUCCESS,
  GET_BAR_LOCALITY_REQUEST,
  RESET_BAR_LOCALITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingLocal: false,
  error: false,
  status: "",
  barData: [],
};

const barByLocality = (state = initialState, action) => {
  switch (action.type) {
    case GET_BAR_LOCALITY_REQUEST:
      return {
        ...state,
        isFetchingLocal: true,
      };
    case GET_BAR_LOCALITY_FAILURE:
      return {
        ...state,
        isFetchingLocal: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_BAR_LOCALITY_SUCCESS:
      return {
        ...state,
        isFetchingLocal: false,
        error: false,
        status: action.data.status,
        barData: action.data.data.category_data,
        message: "Successfully Logged In",
      };

    case RESET_BAR_LOCALITY_SUCCESS:
      return {
        ...state,
        isFetchingLocal: false,
        error: false,
        status: false,
        barData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default barByLocality;
