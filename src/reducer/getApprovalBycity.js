import {
  GET_APPROVAL_BY_CITY_FAILURE,
  GET_APPROVAL_BY_CITY_SUCCESS,
  GET_APPROVAL_BY_CITY_REQUEST,
  RESET_APPROVAL_BY_CITY_SUCCESS,
} from "../action/actionConstants";

const initialState = {
  isFetchingApprovalByCity: false,
  error: false,
  status: "",
  approvalByCityData: [],
};

const getApprovalNoByCity = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPROVAL_BY_CITY_REQUEST:
      return {
        ...state,
        isFetchingApprovalByCity: true,
      };
    case GET_APPROVAL_BY_CITY_FAILURE:
      return {
        ...state,
        isFetchingApprovalByCity: false,
        error: true,
        status: action.data.status,
        message: "Login Failed",
      };
    case GET_APPROVAL_BY_CITY_SUCCESS:
      var data = action.data.data.category_data;

      return {
        ...state,
        isFetchingApprovalByCity: false,
        error: false,
        status: action.data.status,
        approvalByCityData: data,
        message: "Successfully Logged In",
      };

    case RESET_APPROVAL_BY_CITY_SUCCESS:
      return {
        ...state,
        isFetchingApprovalByCity: false,
        error: false,
        status: false,
        approvalByCityData: [],
        message: "Successfully Logged In",
      };
    default:
      return state;
  }
};

export default getApprovalNoByCity;
