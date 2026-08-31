import {
  GET_REMOVE_IMAGE_FAILURE,
  GET_REMOVE_IMAGE_SUCCESS,
  GET_REMOVE_IMAGE_REQUEST,
  RESET_REMOVE_IMAGE_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingRemoveImage: false,
  error: false,
  status: "",
  removeImageData: [],
};

const removeImageUser = (state = initialState, action) => {
  switch (action.type) {
    case GET_REMOVE_IMAGE_REQUEST:
      return {
        ...state,
        isFetchingRemoveImage: true,
      };
    case GET_REMOVE_IMAGE_FAILURE:
      return {
        ...state,
        isFetchingRemoveImage: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };

    case GET_REMOVE_IMAGE_SUCCESS:
      return {
        ...state,
        isFetchingRemoveImage: false,
        error: false,
        status: action.data.status,
        removeImageData: action.data.data,
        message: "Successfully Logged In",
      };

    case RESET_REMOVE_IMAGE_SUCCESS:
      return {
        ...state,
        isFetchingRemoveImage: false,
        error: false,
        status: false,
        removeImageData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default removeImageUser;
