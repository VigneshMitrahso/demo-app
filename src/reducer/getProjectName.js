import {
  GET_PROJECT_NAME_FAILURE,
  GET_PROJECT_NAME_SUCCESS,
  GET_PROJECT_NAME_REQUEST,
  RESET_PROJECT_NAME_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingProjectNameByCity: false,
  error: false,
  status: "",
  projectNameData: [],
};

const getProjectName = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECT_NAME_REQUEST:
      return {
        ...state,
        isFetchingProjectNameByCity: true,
      };
    case GET_PROJECT_NAME_FAILURE:
      return {
        ...state,
        isFetchingProjectNameByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_PROJECT_NAME_SUCCESS:
      var dataValue = action.data.data.category_data;

      return {
        ...state,
        isFetchingProjectNameByCity: false,
        error: false,
        status: action.data.status,
        projectNameData: dataValue,
        message: "Successfully Logged In",
      };
    case RESET_PROJECT_NAME_SUCCESS:
      return {
        ...state,
        isFetchingProjectNameByCity: false,
        error: false,
        status: false,
        projectNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getProjectName;
