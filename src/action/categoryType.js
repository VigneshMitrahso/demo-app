import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  CATEGORY_TYPE_FAILURE,
  CATEGORY_TYPE_SUCCESS,
  CATEGORY_TYPE_REQUEST,
  CATEGORY_TYPE_RESET,
} from "./actionConstants";
import { categoryByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const categoryTypeRequested = () => ({
  type: CATEGORY_TYPE_REQUEST,
});

const categoryTypeSuccess = (data) => ({
  type: CATEGORY_TYPE_SUCCESS,
  data,
});

const categoryTypeFailure = (data) => ({
  type: CATEGORY_TYPE_FAILURE,
  data,
});

const categoryTypeReset = () => ({
  type: CATEGORY_TYPE_RESET,
});

export const categoryTypeUser =
  (userId, lat, lon, radius, successCallBackLatCate = () => {}) =>
  (dispatch) => {
    dispatch(categoryTypeRequested());

    const url = categoryByLatLonUrl(userId, lat, lon, radius);

    const onSuccess = (response) => {
      dispatch(categoryTypeSuccess(response));
      successCallBackLatCate();
    };

    const onFailure = (response) => {
      dispatch(categoryTypeFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const categoryTypeResetUser = () => (dispatch) => {
  dispatch(categoryTypeReset([]));
};

export const getCategoryTypeResult =
  (userId, data, successCallBackLatCate = () => {}) =>
  (dispatch) => {
    dispatch(categoryTypeRequested());

    const url = categoryByLatLonUrl(
      userId,
      parseFloat(data.locLat).toFixed(6),
      parseFloat(data.locLong).toFixed(6),
      "0",
      `&south=${parseFloat(data.south).toFixed(6)}&north=${parseFloat(data.north).toFixed(6)}&west=${parseFloat(data.west).toFixed(6)}&east=${parseFloat(data.east).toFixed(6)}&googlesearch=true`,
    );

    const onSuccess = (response) => {
      dispatch(categoryTypeSuccess(response));
      successCallBackLatCate();
    };

    const onFailure = (response) => {
      dispatch(categoryTypeFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
