import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_SEARCH_KEY_FAILURE,
  GET_SEARCH_KEY_SUCCESS,
  GET_SEARCH_KEY_REQUEST,
  RESET_SEARCH_KEY_SUCCESS,
} from "./actionConstants";
import { searchCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const searchCityUserRequested = () => ({
  type: GET_SEARCH_KEY_REQUEST,
});

const searchCityUserSuccess = (data) => ({
  type: GET_SEARCH_KEY_SUCCESS,
  data,
});

const searchCityUserFailure = (data) => ({
  type: GET_SEARCH_KEY_FAILURE,
  data,
});

const searchCityUserReset = () => ({
  type: RESET_SEARCH_KEY_SUCCESS,
});

export const searchCityUserAction = (userId, key) => (dispatch) => {
  dispatch(searchCityUserRequested());

  const url = searchCityUrl(userId, key);

  const onSuccess = (response) => {
    dispatch(searchCityUserSuccess(response));
  };

  const onFailure = (response) => {
    dispatch(searchCityUserFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetsearchCityUserUser = () => (dispatch) => {
  dispatch(searchCityUserReset());
};
