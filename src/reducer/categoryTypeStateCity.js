import {
  CATEGORY_TYPE_STATE_CITY_FAILURE,
  CATEGORY_TYPE_STATE_CITY_SUCCESS,
  CATEGORY_TYPE_STATE_CITY_REQUEST,
} from "../action/actionConstants";

const initialState = {
  isFetchingCatestate: false,
  error: false,
  status: "",
  categoryTypeStateCityData: [],
};

const categoryTypeStateCity = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_TYPE_STATE_CITY_REQUEST:
      return {
        ...state,
        isFetchingCatestate: true,
      };
    case CATEGORY_TYPE_STATE_CITY_FAILURE:
      return {
        ...state,
        isFetchingCatestate: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case CATEGORY_TYPE_STATE_CITY_SUCCESS:
      return {
        ...state,
        isFetchingCatestate: false,
        error: false,
        status: action.data.status,
        categoryTypeStateCityData: action.data.data.category_type,
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default categoryTypeStateCity;
