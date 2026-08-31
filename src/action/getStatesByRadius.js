import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_DATA_BY_RADIUS_FAILURE,
  GET_DATA_BY_RADIUS_SUCCESS,
  GET_DATA_BY_RADIUS_REQUEST,
  RESET_DATA_BY_RADIUS_SUCCESS,
} from "./actionConstants";
import { searchRadiusUrl, searchPropertyUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const stateByRadiusRequested = () => ({
  type: GET_DATA_BY_RADIUS_REQUEST,
});

const stateByRadiusSuccess = (data) => ({
  type: GET_DATA_BY_RADIUS_SUCCESS,
  data,
});

const stateByRadiusFailure = (data) => ({
  type: GET_DATA_BY_RADIUS_FAILURE,
  data,
});

const stateByRadiusReset = (data) => ({
  type: RESET_DATA_BY_RADIUS_SUCCESS,
  data,
});

export const getStateByRadiusUser =
  (
    userId,
    lat,
    lon,
    radius,
    urls,
    onSuccessCallBack,
    onFailureCallBack,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(stateByRadiusRequested());

    const url = searchRadiusUrl(userId, lat, lon, radius, urls, urlString);

    const onSuccess = (response) => {
      dispatch(stateByRadiusSuccess(response));
      onSuccessCallBack(response);
    };

    const onFailure = (response) => {
      dispatch(stateByRadiusFailure(response));
      onFailureCallBack(response);
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetStateByRadiusUSer = () => (dispatch) => {
  dispatch(stateByRadiusRequested());
  dispatch(stateByRadiusReset());
};

export const getLocationByProperty =
  (userId, data, onSuccessCallBack, onFailureCallBack = () => {}) =>
  (dispatch) => {
    dispatch(stateByRadiusRequested());

    const url = searchRadiusUrl(
      userId,
      parseFloat(data.locLat).toFixed(6),
      parseFloat(data.locLong).toFixed(6),
      "0",
      "",
      `?south=${parseFloat(data.south).toFixed(6)}&north=${parseFloat(data.north).toFixed(6)}&west=${parseFloat(data.west).toFixed(6)}&east=${parseFloat(data.east).toFixed(6)}&googlesearch=true`,
    );

    const onSuccess = (response) => {
      dispatch(stateByRadiusSuccess(response));
      onSuccessCallBack();
    };

    const onFailure = (response) => {
      dispatch(stateByRadiusFailure(response));
      onFailureCallBack();
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };
