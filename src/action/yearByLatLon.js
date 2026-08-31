import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_YEAR_BY_LAT_LON_FAILURE,
  GET_YEAR_BY_LAT_LON_SUCCESS,
  GET_YEAR_BY_LAT_LON_REQUEST,
  RESET_YEAR_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { yearByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const yearByLatLonRequested = () => ({
  type: GET_YEAR_BY_LAT_LON_REQUEST,
});

const yearByLatLonSuccess = (data) => ({
  type: GET_YEAR_BY_LAT_LON_SUCCESS,
  data,
});

const yearByLatLonFailure = (data) => ({
  type: GET_YEAR_BY_LAT_LON_FAILURE,
  data,
});

const yearByLatLonReset = (data) => ({
  type: RESET_YEAR_BY_LAT_LON_SUCCESS,
  data,
});

export const yearByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    propertyUrl,
    successCallBackYearByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(yearByLatLonRequested());

    const url = yearByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      propertyUrl,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(yearByLatLonSuccess(response));
      successCallBackYearByLatLon();
    };

    const onFailure = (response) => {
      dispatch(yearByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetyearByLatLonUser = () => (dispatch) => {
  dispatch(yearByLatLonReset());
};
