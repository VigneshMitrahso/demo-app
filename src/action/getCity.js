import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_CITY_FAILURE,
  GET_CITY_SUCCESS,
  GET_CITY_REQUEST,
  RESET_CITY_SUCCESS,
} from "./actionConstants";
import { cityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const cityRequested = () => ({
  type: GET_CITY_REQUEST,
});

const citySuccess = (data) => ({
  type: GET_CITY_SUCCESS,
  data,
});

const cityFailure = (data) => ({
  type: GET_CITY_FAILURE,
  data,
});

const cityReset = (data) => ({
  type: RESET_CITY_SUCCESS,
  data,
});

export const cityUser = (cityURl) => (dispatch) => {
  dispatch(cityRequested());

  const url = cityUrl(cityURl);

  const onSuccess = (response) => {
    dispatch(citySuccess(response));
  };

  const onFailure = (response) => {
    dispatch(cityFailure(response));
  };

  _getStorageValue(ACCESS_TOKEN).then((token) => {
    if (token !== undefined && token !== null) {
      apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
    }
  });
};

export const resetcityUser = () => (dispatch) => {
  dispatch(cityReset());
};
