import {
  GET_BRANCH_CITIES_FAILURE,
  GET_BRANCH_CITIES_SUCCESS,
  GET_BRANCH_CITIES_REQUEST,
  RESET_BRANCH_CITIES_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBranchCities: false,
  error: false,
  status: "",
  branchCitiesNameData: [],
};

const getBranchCities = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCH_CITIES_REQUEST:
      return {
        ...state,
        isFetchingBranchCities: true,
      };
    case GET_BRANCH_CITIES_FAILURE:
      return {
        ...state,
        isFetchingBranchCities: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BRANCH_CITIES_SUCCESS:
      return {
        ...state,
        isFetchingBranchCities: false,
        error: false,
        status: action.data.status,
        branchCitiesNameData: action.data.data.Cities,
        message: "Successfully Logged In",
      };

    case RESET_BRANCH_CITIES_SUCCESS:
      return {
        ...state,
        isFetchingBranchCities: false,
        error: false,
        status: false,
        branchCitiesNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBranchCities;
