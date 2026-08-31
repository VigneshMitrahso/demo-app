import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_COMPLETED_BY_LAT_LON_FAILURE,
  GET_COMPLETED_BY_LAT_LON_SUCCESS,
  GET_COMPLETED_BY_LAT_LON_REQUEST,
  RESET_COMPLETED_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { completedByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const completedByLatLonRequested = () => ({
  type: GET_COMPLETED_BY_LAT_LON_REQUEST,
});

const completedByLatLonSuccess = (data) => ({
  type: GET_COMPLETED_BY_LAT_LON_SUCCESS,
  data,
});

const completedByLatLonFailure = (data) => ({
  type: GET_COMPLETED_BY_LAT_LON_FAILURE,
  data,
});

const completedByLatLonReset = (data) => ({
  type: RESET_COMPLETED_BY_LAT_LON_SUCCESS,
  data,
});

export const completedByLatLonUser =
  (userId, lat, lon, radius) => (dispatch) => {
    dispatch(completedByLatLonRequested());

    const url = completedByLatLonUrl(userId, lat, lon, radius);

    const onSuccess = (response) => {
      dispatch(completedByLatLonSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(completedByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetcompletedByLatLonUser = () => (dispatch) => {
  dispatch(completedByLatLonReset());
};
