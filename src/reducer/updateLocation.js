import {
  LOCATION_UPDATE_FAILURE,
  LOCATION_UPDATE_SUCCESS,
  LOCATION_UPDATE_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  error: false,
  status: "",
};

const updateLocation = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_UPDATE_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOCATION_UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        status: action.data.status,
      };
    // case LOCATION_UPDATE_SUCCESS:
    //   return {
    //     ...state,
    //     isFetching: false,
    //     error: false,
    //     status: action.status,
    //     message: "Successfully Fetched",
    //   };
    default:
      return state;
  }
};

export default updateLocation;
