import {
  GET_BUILDING_NAME_FAILURE,
  GET_BUILDING_NAME_SUCCESS,
  GET_BUILDING_NAME_REQUEST,
  RESET_BUILDING_NAME_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBuildingName: false,
  error: false,
  status: "",
  buildingNameData: [],
};

const getBuildingName = (state = initialState, action) => {
  switch (action.type) {
    case GET_BUILDING_NAME_REQUEST:
      return {
        ...state,
        isFetchingBuildingName: true,
      };
    case GET_BUILDING_NAME_FAILURE:
      return {
        ...state,
        isFetchingBuildingName: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BUILDING_NAME_SUCCESS:
      return {
        ...state,
        isFetchingBuildingName: false,
        error: false,
        status: action.data.status,
        buildingNameData: action.data.building_name,
        message: "Successfully Logged In",
      };

    case RESET_BUILDING_NAME_SUCCESS:
      return {
        ...state,
        isFetchingBuildingName: false,
        error: false,
        status: false,
        buildingNameData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBuildingName;
