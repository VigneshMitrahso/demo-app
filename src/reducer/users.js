import {
  INSERT_USER_REQUEST,
  INSERT_USER_SUCCESS,
  INSERT_USER_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "../action/actionConstants";

const initialState = {
  isFetching: false,
  usersData: [],
  userData: {},
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case INSERT_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case INSERT_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        //   serveyReport: action.data.data,
      };
    case INSERT_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case GET_USERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case GET_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        usersData: action.data.data,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        isFetchingReport: false,
      };

    case GET_USER_REQUEST:
      return {
        ...state,
        userData: {},
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        userData: action.data.data[0],
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        isFetchingReport: false,
        userData: {},
      };
    default:
      return state;
  }
};

export default users;
