import {
  GET_ANALYTICS_FAILURE,
  GET_ANALYTICS_SUCCESS,
  GET_ANALYTICS_REQUEST,
  RESET_ANALYTICS_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingAnalytics: false,
  error: false,
  status: "",
  landareaRate: [],
};

const getAnalytics = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANALYTICS_REQUEST:
      return {
        ...state,
        isFetchingAnalytics: true,
      };
    case GET_ANALYTICS_FAILURE:
      return {
        ...state,
        isFetchingAnalytics: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_ANALYTICS_SUCCESS:
      return {
        ...state,
        isFetchingAnalytics: false,
        error: false,
        status: action.data.status,
        landareaRate: action.data.data.landarea_rate,
        sellableRate: action.data.data.sellable_rate,
        message: "Successfully Logged In",
      };

    case RESET_ANALYTICS_SUCCESS:
      return {
        ...state,
        isFetchingAnalytics: false,
        error: false,
        status: false,
        landareaRate: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getAnalytics;
