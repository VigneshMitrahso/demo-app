import {
  GET_COMPLETED_BY_CITY_FAILURE,
  GET_COMPLETED_BY_CITY_SUCCESS,
  GET_COMPLETED_BY_CITY_REQUEST,
  RESET_COMPLETED_BY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
  completedByCityData: [
    {
      max: 0,
      min: 0,
    },
  ],
};

const completedByCityType = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPLETED_BY_CITY_REQUEST:
      return {
        ...state,
        isFetchingUnitType: true,
      };
    case GET_COMPLETED_BY_CITY_FAILURE:
      return {
        ...state,
        isFetchingUnitType: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_COMPLETED_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: action.data.status,
        completedByCityData: action.data.data.completed,
        message: "Successfully Logged In",
      };

    case RESET_COMPLETED_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingUnitType: false,
        error: false,
        status: false,
        completedByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default completedByCityType;
