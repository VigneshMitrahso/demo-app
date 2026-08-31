import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_PROPERTY_BY_LAT_LNG_FAILURE,
  GET_PROPERTY_BY_LAT_LNG_SUCCESS,
  GET_PROPERTY_BY_LAT_LNG_REQUEST,
  RESET_PROPERTY_BY_LAT_LNG_SUCCESS,
} from "./actionConstants";
import { propertyByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const propertyByLatLonRequested = () => ({
  type: GET_PROPERTY_BY_LAT_LNG_REQUEST,
});

const propertyByLatLonSuccess = (data) => ({
  type: GET_PROPERTY_BY_LAT_LNG_SUCCESS,
  data,
});

const propertyByLatLonFailure = (data) => ({
  type: GET_PROPERTY_BY_LAT_LNG_FAILURE,
  data,
});

const propertyByLatLonReset = (data) => ({
  type: RESET_PROPERTY_BY_LAT_LNG_SUCCESS,
  data,
});

export const propertyByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    catagroy,
    successCallBackPropertyByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(propertyByLatLonRequested());

    const url = propertyByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      catagroy,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(propertyByLatLonSuccess(response));
      successCallBackPropertyByLatLon();
    };

    const onFailure = (response) => {
      dispatch(propertyByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetpropertyByLatLonUser = () => (dispatch) => {
  dispatch(propertyByLatLonReset());
};
