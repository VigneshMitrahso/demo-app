import {
  GET_BUILDER_FAILURE,
  GET_BUILDER_SUCCESS,
  GET_BUILDER_REQUEST,
  RESET_BUILDER_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingBuliderByCity: false,
  error: false,
  status: "",
  builderData: [],
};

const getBuilder = (state = initialState, action) => {
  switch (action.type) {
    case GET_BUILDER_REQUEST:
      return {
        ...state,
        isFetchingBuliderByCity: true,
      };
    case GET_BUILDER_FAILURE:
      return {
        ...state,
        isFetchingBuliderByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_BUILDER_SUCCESS:
      var dataValue = action.data.data.category_data;

      return {
        ...state,
        isFetchingBuliderByCity: false,
        error: false,
        status: action.data.status,
        builderData: dataValue,
        message: "Successfully Logged In",
      };

    case RESET_BUILDER_SUCCESS:
      return {
        ...state,
        isFetchingBuliderByCity: false,
        error: false,
        status: false,
        builderData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getBuilder;
