import {
  GET_EMPLOYEE_ANALYTIC_REQUEST,
  GET_EMPLOYEE_ANALYTIC_SUCCESS,
  GET_EMPLOYEE_ANALYTIC_FAILURE,
  GET_EMPLOYEE_ANALYTIC_DETAILS_REQUEST,
  GET_EMPLOYEE_ANALYTIC_DETAILS_SUCCESS,
  GET_EMPLOYEE_ANALYTIC_DETAILS_FAILURE,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  employeeAnalytics: [],
  isFetchingEmployeeDetails: false,
};

const employeeAnalytics = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE_ANALYTIC_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case GET_EMPLOYEE_ANALYTIC_SUCCESS:
      return {
        ...state,
        isFetching: false,
        employeeAnalytics: action.data.data,
      };
    case GET_EMPLOYEE_ANALYTIC_FAILURE:
      return {
        ...state,
        isFetching: false,
        employeeAnalytics: [],
      };
    case GET_EMPLOYEE_ANALYTIC_DETAILS_REQUEST:
      return {
        ...state,
        isFetchingEmployeeDetails: true,
      };

    case GET_EMPLOYEE_ANALYTIC_DETAILS_SUCCESS:
      return {
        ...state,
        isFetchingEmployeeDetails: false,
      };
    case GET_EMPLOYEE_ANALYTIC_DETAILS_FAILURE:
      return {
        ...state,
        isFetchingEmployeeDetails: false,
      };

    default:
      return state;
  }
};

export default employeeAnalytics;
