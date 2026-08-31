import { GET, ACCESS_TOKEN } from "../comman/constants";
import { apiCall } from "../comman/connect";
import {
  GET_UNIT_TYPE_BY_LAT_LON_FAILURE,
  GET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
  GET_UNIT_TYPE_BY_LAT_LON_REQUEST,
  RESET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
} from "./actionConstants";
import { unitTypeByLatLonUrl } from "../comman/urls";
import { _getStorageValue } from "../comman/localStorage";

const unitTypeByLatLonRequested = () => ({
  type: GET_UNIT_TYPE_BY_LAT_LON_REQUEST,
});

const unitTypeByLatLonSuccess = (data) => ({
  type: GET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
  data,
});

const unitTypeByLatLonFailure = (data) => ({
  type: GET_UNIT_TYPE_BY_LAT_LON_FAILURE,
  data,
});

const unitTypeByLatLonReset = (data) => ({
  type: RESET_UNIT_TYPE_BY_LAT_LON_SUCCESS,
  data,
});

export const unitTypeByLatLonUser =
  (
    userId,
    lat,
    lon,
    radius,
    unitType,
    successCallBackUnitTypeByLatLon,
    urlString = "",
  ) =>
  (dispatch) => {
    dispatch(unitTypeByLatLonRequested());

    const url = unitTypeByLatLonUrl(
      userId,
      lat,
      lon,
      radius,
      unitType,
      urlString,
    );

    const onSuccess = (response) => {
      dispatch(unitTypeByLatLonSuccess(response));
      successCallBackUnitTypeByLatLon();
    };

    const onFailure = (response) => {
      dispatch(unitTypeByLatLonFailure(response));
    };

    _getStorageValue(ACCESS_TOKEN).then((token) => {
      if (token !== undefined && token !== null) {
        apiCall(GET, url, "", onSuccess, onFailure, dispatch, token);
      }
    });
  };

export const resetunitTypeByLatLonUser = () => (dispatch) => {
  dispatch(unitTypeByLatLonReset());
};
