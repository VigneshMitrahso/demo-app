import {
  CATEGORY_TYPE_FAILURE,
  CATEGORY_TYPE_SUCCESS,
  CATEGORY_TYPE_REQUEST,
  CATEGORY_TYPE_RESET,
} from "../action/actionConstants";

const initialState = {
  isFetchingCategory: false,
  error: false,
  status: "",
  categoryTypeData: [],
};

const categoryType = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_TYPE_REQUEST:
      return {
        ...state,
        isFetchingCategory: true,
      };
    case CATEGORY_TYPE_FAILURE:
      return {
        ...state,
        isFetchingCategory: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case CATEGORY_TYPE_SUCCESS:
      return {
        ...state,
        isFetchingCategory: false,
        error: false,
        status: action.data.status,
        categoryTypeData: action.data.data.category_type,
        message: "Successfully Logged In",
      };
    case CATEGORY_TYPE_RESET:
      return {
        ...state,
        isFetchingCategory: false,
        error: false,
        status: false,
        categoryTypeData: [],
      };
    default:
      return state;
  }
};

export default categoryType;
