import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_VALUE_CITY_FAILURE,
  GET_VALUE_CITY_SUCCESS,
  GET_VALUE_CITY_REQUEST,
  RESET_VALUE_CITY_SUCCESS,
} from "./actionConstants";
import { automatedValuationCityUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const cityRequested = () => ({
  type: GET_VALUE_CITY_REQUEST,
});

const citySuccess = (data) => ({
  type: GET_VALUE_CITY_SUCCESS,
  data,
});

const cityFailure = (data) => ({
  type: GET_VALUE_CITY_FAILURE,
  data,
});

export const cityReset = (data) => ({
  type: RESET_VALUE_CITY_SUCCESS,
  data,
});

export const valuationCityUser =
  (userId, state_name, successCallBack, failureCallBack) => (dispatch) => {
    dispatch(cityRequested());

    const url = automatedValuationCityUrl(userId, state_name);

    const onSuccess = (response) => {
      dispatch(citySuccess(response));
      successCallBack(response);
    };

    const onFailure = (response) => {
      dispatch(cityFailure(response));
      failureCallBack(response);
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
