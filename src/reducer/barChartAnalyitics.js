import {
  GET_BAR_ANALYITICS_FAILURE,
  GET_BAR_ANALYITICS_SUCCESS,
  GET_BAR_ANALYITICS_REQUEST,
  RESET_BAR_ANALYITICS_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBarChart: false,
  error: false,
  status: "",
  barChartData: [],
};

const barAnalyitics = (state = initialState, action) => {
  switch (action.type) {
    case GET_BAR_ANALYITICS_REQUEST:
      return {
        ...state,
        isFetchingBarChart: true,
      };
    case GET_BAR_ANALYITICS_FAILURE:
      return {
        ...state,
        isFetchingBarChart: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BAR_ANALYITICS_SUCCESS:
      return {
        ...state,
        isFetchingBarChart: false,
        error: false,
        status: action.data.status,
        barChartData: action.data.data.data,
        message: "Successfully Logged In",
      };

    case RESET_BAR_ANALYITICS_SUCCESS:
      return {
        ...state,
        isFetchingBarChart: false,
        error: false,
        status: false,
        barChartData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default barAnalyitics;
