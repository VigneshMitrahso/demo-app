import { GET, ACCESS_TOKEN } from "../comman/constants";

import { apiCall } from "../comman/connect";

import {
  GET_BUILDER_BY_LAT_LON_FAILURE,
  GET_BUILDER_BY_LAT_LON_SUCCESS,
  GET_BUILDER_BY_LAT_LON_REQUEST,
  RESET_BUILDER_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { builderByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const builderByLatLonRequested = () => ({
  type: GET_BUILDER_BY_LAT_LON_REQUEST,
});

const builderByLatLonSuccess = (data) => ({
  type: GET_BUILDER_BY_LAT_LON_SUCCESS,
  data,
});

const builderByLatLonFailure = (data) => ({
  type: GET_BUILDER_BY_LAT_LON_FAILURE,
  data,
});

const builderByLatLonReset = (data) => ({
  type: RESET_BUILDER_BY_LAT_LON_SUCCESS,
  data,
});

export const builderByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    propertyUrl,
    successCallBackBuilderByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(builderByLatLonRequested());

    const url = builderByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      propertyUrl,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(builderByLatLonSuccess(response));
      successCallBackBuilderByLatLon();
    };

    const onFailure = (response) => {
      dispatch(builderByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetbuilderByLatLonUser = () => (dispatch) => {
  dispatch(builderByLatLonReset());
};
