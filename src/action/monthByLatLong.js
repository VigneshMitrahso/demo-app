import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_MONTH_BY_LAT_LON_FAILURE,
  GET_MONTH_BY_LAT_LON_SUCCESS,
  GET_MONTH_BY_LAT_LON_REQUEST,
  RESET_MONTH_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { monthByLatLonUrl } from "../comman/urls";

import { getAccessToken } from "../comman/localStorage";
import { _getStorageValue } from "../comman/localStorage";

const monthByLatLonRequested = () => ({
  type: GET_MONTH_BY_LAT_LON_REQUEST,
});

const monthByLatLonSuccess = (data) => ({
  type: GET_MONTH_BY_LAT_LON_SUCCESS,
  data,
});

const monthByLatLonFailure = (data) => ({
  type: GET_MONTH_BY_LAT_LON_FAILURE,
  data,
});

const monthByLatLonReset = (data) => ({
  type: RESET_MONTH_BY_LAT_LON_SUCCESS,
  data,
});

export const monthByLatLonUser =
  (userId, lat, lon, radius, propertyUrl, urlString = "") =>
  (dispatch) => {
    // var token = getAccessToken();

    dispatch(monthByLatLonRequested());

    const url = monthByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      propertyUrl,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(monthByLatLonSuccess(response));
    };

    const onFailure = (response) => {
      dispatch(monthByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetmonthByLatLonUser = () => (dispatch) => {
  dispatch(monthByLatLonReset());
};
